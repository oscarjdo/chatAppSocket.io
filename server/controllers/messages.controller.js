import pool from "../db.js";

export const sendMessage = async (req, res) => {
  const { mssgData } = req.body;

  const { userId, mssg, conversationId } = JSON.parse(mssgData);

  const fileUrl = req.file
    ? `http://localhost:3000/${req.file.filename}`
    : null;

  let mimetype = req.file ? req.file.mimetype.split("/")[0] : null;
  mimetype =
    mimetype == "application" || mimetype == "text" ? "document" : mimetype;

  const [response] = await pool.query(
    `
  insert into messages (conversation_id, user_id, content, sent_date, mimetype, file_url)
    values
    (?,?,?,now(),?,?);
  `,
    [conversationId, userId, mssg, mimetype, fileUrl]
  );

  if (response.insertId <= 0)
    return res.status(400).json({ message: "There was an error." });

  res.sendStatus(201);
};

export const getOutOfChat = async (req, res) => {
  const { userId, conversationId } = req.body;

  const [memberId] = await pool.query(
    `select cm.member_id from conversation c
    left join conversation_members cm on cm.conversation_id = c.conversation_id
    where c.conversation_id = ? and cm.user_id = ?`,
    [conversationId, userId]
  );

  if (memberId.length <= 0)
    return res
      .status(400)
      .json({ messgae: "Error in 'select cm.member_id from conversation c'" });

  const [userExit] = await pool.query(
    `update conversation_members set isInside = false where member_id = ?`,
    [memberId[0].member_id]
  );

  if (userExit.affectedRows <= 0)
    return res
      .status(400)
      .json({ messgae: "Error in 'delete from conversation_members'" });

  const [allUsers] = await pool.query(
    `select cm.member_id, cm.isInside from conversation c
      left join conversation_members cm on cm.conversation_id = c.conversation_id
      where c.conversation_id = ?;`,
    [conversationId]
  );

  const usersInsideCount = allUsers.filter((item) => item.isInside);
  const allMembers = allUsers.map((item) => item.member_id);

  if (usersInsideCount.length <= 0) {
    await pool.query(`delete from messages where conversation_id = ?`, [
      conversationId,
    ]);

    const [membersDeleted] = await pool.query(
      `delete from conversation_members where member_id = ?${" or member_id = ?".repeat(
        allMembers.length - 1
      )}`,
      allMembers
    );

    const [toDeleteOne] = await pool.query(
      `delete from conversation where conversation_id = ?`,
      [conversationId]
    );

    if (membersDeleted.affectedRows <= 0)
      return res
        .sendStatus(400)
        .json({ messgae: "Error in 'delete from conversation_members'" });

    if (toDeleteOne.affectedRows <= 0)
      return res
        .sendStatus(400)
        .json({ messgae: "Error in 'delete from conversation'" });
  }

  res.sendStatus(200);
};
