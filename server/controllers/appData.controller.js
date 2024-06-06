import pool from "../db.js";
import { fileURLToPath } from "url";

const currentPath = fileURLToPath(import.meta.url);

export const getFriendList = async (req, res) => {
  const { id } = req.params;

  const [conversations] = await pool.query(
    `select c.conversation_id as conversationId, c.isGroup, c.img_url as groupImg, c.group_name as groupName, c.group_description as groupDescription, c.last_interaction as lastInteraction
        from conversation c
          left join conversation_members cm on cm.conversation_id = c.conversation_id
          where cm.user_id = ? and cm.isInside = true;`,
    [id]
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
    const [data] = await pool.query(
      `
      select cm.member_id memberId, cm.conversation_id conversationId, cm.user_id userId, u.username, u.img_url imgUrl, cm.isInside, cm.is_leader isLeader, cm.left_group_at leftGroupAt
          from conversation_members cm
          left join users u on u.id = cm.user_id
            where cm.conversation_id = ? and cm.user_id != ?;
    `,
      [response[i].conversationId, id]
    );

    response[i] = {
      ...response[i],
      members: !response[i].isGroup ? data[0] : data,
    };

    friendList.map((item) => {
      if (!response[i].isGroup && response[i].members.userId == item.friend_id)
        response[i] = { ...response[i], areFriends: true };
    });

    const [user] = await pool.query(
      `
      select cm.left_group_at as leftGroupAt from conversation c
        left join conversation_members cm on cm.conversation_id = c.conversation_id
        where c.conversation_id = ? and cm.user_id = ?`,
      [response[i].conversationId, id]
    );

    const [lastMessage] = await pool.query(
      `select m.user_id sender, m.content, m.sent_date sentDate, m.event as isEvent, m.mimetype, m.message_read messageRead from conversation c 
	      left join messages m on m.conversation_id = c.conversation_id
	      where c.conversation_id = ? and m.sent_date < ?
        order by m.sent_date desc
        limit 1;`,
      [conversations[i].conversationId, user[0].leftGroupAt || new Date()]
    );

    response[i] = {
      ...response[i],
      lastMessage: lastMessage[0] || { sentDate: new Date(0) },
    };
  }

  if (response.length >= 2) {
    response.sort((a, b) => b.lastInteraction - a.lastInteraction);
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
      `select username as friend, id, img_url as imgUrl from users where id != ?`,
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

  const userId = ids[0];
  const conversationId = ids[1];

  if (userId === "undefined") return res.json([]);
  if (conversationId === "undefined") return res.json([]);

  const [friend] = await pool.query(
    `
    select u.username, u.email, u.id, u.img_url imgUrl, cm.is_leader isLeader, cm.left_group_at leftGroupAt from conversation c
      left join conversation_members cm on cm.conversation_id = c.conversation_id
      left join users u on u.id = cm.user_id
      where c.conversation_id = ? and cm.user_id != ?`,
    [conversationId, userId]
  );

  for (let i = 0; i < friend.length; i++) {
    const [friendVerification] = await pool.query(
      `select c.conversation_id, cm1.user_id, u1.username, cm2.user_id, u2.username from conversation c 
      left join conversation_members cm1 on cm1.conversation_id = c.conversation_id
        left join conversation_members cm2 on cm2.conversation_id = c.conversation_id
        left join users u1 on u1.id = cm1.user_id
      left join friend_list fl on fl.user_id = u1.id
        left join users u2 on u2.id = fl.friend_id and u2.id = cm2.user_id
        where cm1.user_id = ? and u2.id = ? and c.isGroup = false;`,
      [userId, friend[i].id, conversationId]
    );

    friend[i] = {
      ...friend[i],
      areFriends: friendVerification.length > 0 ? true : false,
      conversationId:
        friendVerification.length > 0
          ? friendVerification[0].conversation_id
          : null,
    };

    const [friendRequest] = await pool.query(
      `
      select * from friend_request
        where request_sender_id = ? and request_reciever_id = ?;
    `,
      [userId, friend[i].id]
    );

    friend[i] = {
      ...friend[i],
      pendingFriendRequest: friendRequest.length > 0 ? true : false,
    };
  }

  const [user] = await pool.query(
    `
    select u.id, u.img_url imgUrl, cm.is_leader isLeader, cm.left_group_at as leftGroupAt, cm.conversation_id from conversation c
      left join conversation_members cm on cm.conversation_id = c.conversation_id
      left join users u on u.id = cm.user_id
      where c.conversation_id = ? and cm.user_id = ?`,
    [conversationId, userId]
  );

  const [groupData] = await pool.query(
    `
  select * from conversation where conversation_id = ?
  `,
    [conversationId]
  );

  const [messages] = await pool.query(
    `
    SELECT c.conversation_id, m.message_id, m.user_id sender, u.username, u.img_url imgUrl, m.content, m.sent_date date, m.message_read, m.mimetype, nsm.is_show, nsm.deleted, m.file_url, m.answeredMessage
	    FROM conversation c
	    LEFT JOIN conversation_members cm ON cm.conversation_id = c.conversation_id
      LEFT JOIN users u ON u.id = cm.user_id
	    LEFT JOIN messages m ON m.conversation_id = c.conversation_id and m.user_id = u.id
	    LEFT JOIN not_show_messages nsm ON nsm.user_id = ? and nsm.message_id = m.message_id
	    WHERE m.conversation_id = ? and m.sent_date < ?
	    ORDER BY m.sent_date;`,
    [userId, conversationId, user[0].leftGroupAt || new Date()]
  );

  const [featuredMessages] = await pool.query(
    `
    select * from featured_messages
      where conversation_id = ? and user_id = ?;
  `,
    [conversationId, userId]
  );

  const [events] = await pool.query(
    `
    select content, sent_date date, event from messages 
      where conversation_id = ? and sent_date < ? and event = ?;
    `,
    [conversationId, user[0].leftGroupAt || new Date(), true]
  );

  let allMessages = [messages, events].flat().sort((a, b) => a.date - b.date);
  allMessages = allMessages.map((message) => {
    const index = featuredMessages.find(
      (item) => item.message_id == message.message_id
    );

    return { ...message, featured: Boolean(index) };
  });

  res.json({
    user: user[0],
    friend: groupData[0].isGroup ? friend : friend[0],
    messages: allMessages,
    groupData: groupData[0],
    conversationId,
  });
};

export const getFeaturedMessages = async (req, res) => {
  const { id: userId } = req.params;

  if (!userId)
    return res.status(400).json({
      Error: `Error at ${currentPath} at Function getFeaturedMessages: Necessary data is missing.`,
    });

  const [response] = await pool.query(
    `
    select fm.message_id, fm.conversation_id, m.content, m.user_id as senderId, us.username as senderUsername, c.isGroup, c.group_name, c.img_url as img_url_group, ui.username, ui.img_url from featured_messages fm
	    left join messages m on m.message_id = fm.message_id
      left join conversation c on c.conversation_id = fm.conversation_id
      left join conversation_members cm on cm.conversation_id = fm.conversation_id and c.isGroup = false
      left join users ui on ui.id = cm.user_id
      left join users us on  us.id = m.user_id
	    where fm.user_id = ? and cm.user_id != ? or cm.user_id is null;`,
    [userId, userId]
  );

  res.json(response);
};
