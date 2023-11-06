import pool from "../db.js";

export const getFriendList = async (req, res) => {
  const { id } = req.params;

  const [conversations] = await pool.query(
    `select u2.id as friend_id, u2.username as friend, u2.img_url as imgUrl from conversation c
      left join conversation_members cm1 on cm1.conversation_id = c.conversation_id
      left join conversation_members cm2 on cm2.conversation_id = c.conversation_id
      left join users u1 on u1.id = cm1.user_id
      left join users u2 on u2.id = cm2.user_id
      where u1.id = ? and u2.id != ? and cm1.isInside = true;`,
    [id, id]
  );

  if (conversations.length <= 0) return res.json([]);

  const [friendList] = await pool.query(
    `select uf.id as friend_id from users as u
    left join friend_list as fl on fl.user_id = u.id
      left join users as uf on fl.friend_id = uf.id 
      where u.id = ?;`,
    [id]
  );

  let response = [...conversations];

  for (let i = 0; i < conversations.length; i++) {
    friendList.map((item) => {
      if (response[i].friend_id == item.friend_id)
        response[i] = { ...response[i], areFriends: true };
    });

    const [data] = await pool.query(
      `select um.id sender, m.content, m.sent_date, m.message_read from conversation c
      left join conversation_members cm1 on cm1.conversation_id = c.conversation_id
        left join conversation_members cm2 on cm2.conversation_id = c.conversation_id
        left join users u1 on u1.id = cm1.user_id
        left join users u2 on u2.id = cm2.user_id
        left join messages m on m.conversation_id = cm1.conversation_id
        left join users um on um.id = m.user_id
        where u1.id = ? and u2.id = ? 
        order by m.sent_date desc
        limit 1;`,
      [id, conversations[i].friend_id]
    );

    response[i] = { ...response[i], lastMessage: data[0] };
  }

  if (response.length >= 2) {
    response.sort((a, b) =>
      b.lastMessage ? b.lastMessage.sent_date - a.lastMessage.sent_date : a
    );
  }

  res.json(response);
};

export const getUserList = async (req, res) => {
  const { id } = req.params;

  const [response] = await pool.query(
    `select uf.id from users u
      left join friend_list as fl on fl.user_id = u.id
      left join users as uf on uf.id = fl.friend_id
      where u.id = ?`,
    [id]
  );

  let userList;

  if (!response[0].id) {
    [userList] = await pool.query(
      `select username as friend, id from users where id != ?`,
      [id]
    );
  } else {
    const friendListId = response.map((item) => (item.id ? item.id : null));
    const conditionText = " and id != ?";

    const query = `select username as friend, id, img_url as imgUrl from users where id != ?${
      friendListId.length > 0 ? conditionText.repeat(friendListId.length) : ""
    }`;

    friendListId.unshift(parseInt(id));

    [userList] = await pool.query(query, friendListId);
  }

  const userListId = userList.map((item) => (item.id ? item.id : null));

  for (let i = 0; i < userListId.length; i++) {
    const [item] = await pool.query(
      `select * from friend_request
    where request_sender_id = ? and request_reciever_id = ?`,
      [id, userListId[i]]
    );
    userList[i] = { ...userList[i], sentRequest: item[0] ? true : false };
  }

  res.json(userList);
};

export const getFriendData = async (req, res) => {
  const { id } = req.params;
  const ids = id.split("&");

  if (ids[1] === "undefined") return res.json([]);

  const [friend] = await pool.query(
    `select u.username, u.email, u.id, u.img_url as imgUrl from users u where id = ?`,
    [ids[1]]
  );

  const [friendVerification] = await pool.query(
    `select u.id, uf.id as friendId from users u
      left join friend_list fl on fl.user_id = u.id
      left join users uf on uf.id = fl.friend_id
      where u.id = ? and uf.id = ?`,
    [ids[0], ids[1]]
  );

  const [messages] = await pool.query(
    `SELECT m.message_id, m.user_id AS sender, m.content, m.sent_date AS date, m.message_read, m.mimetype, nsm.is_show, nsm.deleted, m.file_url
      FROM conversation c
      LEFT JOIN conversation_members cm1 ON c.conversation_id = cm1.conversation_id
      LEFT JOIN conversation_members cm2 ON c.conversation_id = cm2.conversation_id
      LEFT JOIN users u1 ON u1.id = cm1.user_id
      LEFT JOIN users u2 ON u2.id = cm2.user_id
      LEFT JOIN messages m ON m.conversation_id = c.conversation_id  -- Cambio la unión a c.conversation_id
      LEFT JOIN not_show_messages nsm ON nsm.message_id = m.message_id and nsm.user_id = u1.id
      LEFT JOIN users us ON us.id = m.user_id
      WHERE u1.id = ? AND u2.id = ?
      ORDER BY m.sent_date;`,
    [ids[0], ids[1]]
  );

  const [conversationData] = await pool.query(
    `
    select c.conversation_id, cm1.isInside 
      from conversation c
      left join conversation_members cm1 on cm1.conversation_id = c.conversation_id
      left join conversation_members cm2 on cm2.conversation_id = c.conversation_id
      left join users u1 on u1.id = cm1.user_id
      left join users u2 on u2.id = cm2.user_id
      where u1.id = ? and u2.id = ?`,
    [ids[0], ids[1]]
  );

  if (friend.length <= 0 || conversationData.length <= 0)
    return res.status(404).json([]);

  res.json({
    friend: friend[0],
    messages,
    conversationId: conversationData[0].conversation_id,
    areFriends: friendVerification.length > 0 ? true : false,
  });
};
