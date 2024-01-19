import pool from "../db.js";

export const sendFriendRequest = async (req, res) => {
  const { sender, reciever } = req.body;

  const [response] = await pool.query(
    `
    select * from friend_request where request_sender_id = ? and request_reciever_id = ?;
  `,
    [reciever, sender]
  );

  if (response.length >= 1)
    return res.json({ result: true, reciever: sender, sender: reciever });

  await pool.query(
    `insert into friend_request (request_sender_id, request_reciever_id) values (?,?)`,
    [sender, reciever]
  );

  res.sendStatus(204);
};

export const cancelFriendRequest = async (req, res) => {
  const { sender, reciever } = req.body;

  const [response] = await pool.query(
    "select * from friend_request where request_sender_id = ? and request_reciever_id = ?",
    [sender, reciever]
  );

  if (response.length <= 0)
    return res.status(404).json({ message: "Friend request not found." });

  await pool.query(`delete from friend_request where request_id = ?`, [
    response[0].request_id,
  ]);

  res.sendStatus(200);
};

export const getFriendRequest = async (req, res) => {
  const { id } = req.params;

  const [requests] = await pool.query(
    `select r.request_id, r.request_sender_id, u.username, u.img_url
      from friend_request r
      left join users u on u.id = r.request_sender_id
      where request_reciever_id = ?`,
    [id]
  );

  res.json(requests);
};

export const acceptFriendRequest = async (req, res) => {
  const { sender, reciever } = req.body;

  const [thereIsAConversation] = await pool.query(
    `select c.conversation_id as conversation, u1.id as u1Id, cm1.isInside as u1IsInside, u2.id as u2Id, cm2.isInside as u2IsInside
      from conversation c
      left join conversation_members cm1 on cm1.conversation_id = c.conversation_id
      left join conversation_members cm2 on cm2.conversation_id = c.conversation_id
      left join users u1 on u1.id = cm1.user_id
      left join users u2 on u2.id = cm2.user_id
      where u1.id = ? and u2.id = ? and c.isGroup = false;`,
    [sender, reciever]
  );

  const [deleteRequest] = await pool.query(
    "delete from friend_request where request_sender_id = ? and request_reciever_id = ?",
    [sender, reciever]
  );

  if (deleteRequest.affectedRows <= 0)
    return res.status(404).json({ message: "Friend request not found." });

  const [friendList] = await pool.query(
    `insert into friend_list (user_id, friend_id)
  values (?,?), (?,?)`,
    [sender, reciever, reciever, sender]
  );

  if (friendList.affectedRows < 2)
    return res
      .status(400)
      .json({ message: "Error at 'insert into friend_list'" });

  if (thereIsAConversation.length <= 0) {
    const [conversation] = await pool.query(
      `insert into conversation () values ()`
    );

    if (!conversation.insertId)
      return res
        .json(400)
        .json({ message: "Error at 'insert into conversation'" });

    const convId = conversation.insertId;

    const [convMembers] = await pool.query(
      `insert into conversation_members (conversation_id, user_id)
      values (?,?),(?,?)`,
      [convId, sender, convId, reciever]
    );

    if (convMembers.affectedRows < 2)
      return res
        .status(400)
        .json({ message: "Error at 'insert into conversation_members'" });
  } else {
    let userIsNotInside;

    if (!thereIsAConversation[0].u1IsInside)
      userIsNotInside = thereIsAConversation[0].u1Id;
    if (!thereIsAConversation[0].u2IsInside)
      userIsNotInside = thereIsAConversation[0].u2Id;

    if (userIsNotInside) {
      const [memberId] = await pool.query(
        `select cm.member_id from conversation_members cm
          where cm.conversation_id = ? and cm.user_id = ?`,
        [thereIsAConversation[0].conversation, userIsNotInside]
      );

      if (memberId.length <= 0)
        return res.status(400).json({
          message:
            "Error in 'select cm.member_id from conversation_members cm'",
        });

      const [userInserted] = await pool.query(
        `update conversation_members set isInside = true where member_id = ?`,
        [memberId[0].member_id]
      );

      if (userInserted.affectedRows <= 0)
        return res.status(400).json({
          message: "Error in 'update conversation_members set isInside = true'",
        });
    }
  }

  res
    .status(200)
    .json({ chatAgain: thereIsAConversation.length <= 0 ? false : true });
};

export const deleteOfFriendList = async (req, res) => {
  const { userId, friendId } = req.body;

  const [friendDeleted] = await pool.query(
    `delete from friend_list where user_id = ? and friend_id = ? or user_id = ? and friend_id = ?`,
    [userId, friendId, friendId, userId]
  );

  if (friendDeleted.affectedRows <= 0)
    return res
      .status(400)
      .json({ message: "Error in 'delete from friend_list'" });

  res.sendStatus(200);
};
