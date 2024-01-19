import pool from "../db.js";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const currentDir = dirname(fileURLToPath(import.meta.url));

export const sendMessage = async (req, res) => {
  const { mssgData } = req.body;

  const { userId, members, mssg, conversationId, answeredMssgId } =
    JSON.parse(mssgData);

  const fileUrl = req.file
    ? `http://localhost:3000/${req.file.filename}`
    : null;

  let mimetype = req.file ? req.file.mimetype.split("/")[0] : null;
  mimetype =
    mimetype == "application" || mimetype == "text" ? "document" : mimetype;

  const [messageCreated] = await pool.query(
    `
    insert into messages (conversation_id, user_id, content, sent_date, mimetype, file_url, answeredMessage)
      values
      (?,?,?,now(),?,?,?);
    `,
    [conversationId, userId, mssg, mimetype, fileUrl, answeredMssgId]
  );

  if (messageCreated.insertId <= 0)
    return res.status(400).json({ message: "There was an error." });

  const showMessageQuery = `
  insert into not_show_messages (user_id, message_id, conversation_id)
    values (?,?,?)${", (?,?,?)".repeat(members.length)};`;

  const arrData = [userId, messageCreated.insertId, conversationId];
  arrData.push(
    members.map((item) => [item, messageCreated.insertId, conversationId])
  );

  const [showMessage] = await pool.query(showMessageQuery, arrData.flat(2));

  if (showMessage.insertId <= 0)
    return res.status(400).json({ message: "There was an error." });

  res.sendStatus(201);
};

export const deleteMessagesForAll = async (req, res) => {
  const keys = Object.keys(req.body);
  const values = Object.values(req.body);

  values.map((item) => {
    if (item[0]) {
      const name = item[0].split("3000/").at(-1);

      try {
        fs.unlinkSync(join(currentDir, "../public", name));
      } catch (error) {
        console.log(error);
        return res.json(error);
      }
    }
  });

  const query = `update not_show_messages set is_show = false where message_id = ?${" or message_id = ?".repeat(
    keys.length - 1
  )}`;

  const [response] = await pool.query(query, keys);

  if (response.affectedRows <= 0)
    return res.json({
      message: `Error on ${currentDir} functions deleteMessagesForAll.`,
    });

  res.sendStatus(200);
};

export const deleteMessagesForMe = async (req, res) => {
  const { messages, userId } = req.body;
  const keys = Object.keys(messages);

  const UpdateQuery = `update not_show_messages set deleted = true
    where user_id = ${userId}
    and message_id = ?${` or user_id = ${userId} and message_id = ?`.repeat(
      keys.length - 1
    )}`;

  const [response] = await pool.query(UpdateQuery, keys);

  if (response.affectedRows <= 0)
    return res.json({
      message: `Error on ${currentDir} functions deleteMessagesForAll.`,
    });

  const selectQuery = `SELECT nsm.message_id, MIN(nsm.deleted) as deleted, m.file_url
    FROM not_show_messages nsm
    LEFT JOIN messages m on nsm.message_id = m.message_id
    where nsm.message_id = ?${" or nsm.message_id = ?".repeat(keys.length - 1)}
  GROUP BY nsm.message_id`;

  const [validationRes] = await pool.query(selectQuery, keys);

  const messagesToDelete = validationRes.filter((item) => item.deleted);

  for (let i = 0; i < messagesToDelete.length; i++) {
    const id = messagesToDelete[i].message_id;
    const url = messagesToDelete[i].file_url;

    if (url) {
      const name = url.split("3000/").at(-1);

      try {
        fs.unlinkSync(join(currentDir, "../public", name));
      } catch (error) {
        console.log(error);
        return res.json(error);
      }
    }

    try {
      await pool.query("delete from not_show_messages where message_id = ?", [
        id,
      ]);
      await pool.query("delete from messages where message_id = ?", [id]);
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  }

  res.sendStatus(200);
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
    // ------------------------------------------------------------
    const [allImages] = await pool.query(
      `select file_url from messages where conversation_id = ? and !file_url;`,
      [conversationId]
    );

    if (allImages.lenght > 0) {
      allImages.map((item) => {
        const name = item.file_url.split("3000/").at(-1);

        try {
          fs.unlinkSync(join(currentDir, "../public", name));
        } catch (error) {
          console.log(error);
          return res.json(error);
        }
      });
    }
    // ------------------------------------------------------------

    await pool.query(
      `delete from not_show_messages where conversation_id = ?`,
      [conversationId]
    );

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
