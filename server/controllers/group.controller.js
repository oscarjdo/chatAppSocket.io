import pool from "../db.js";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const currentDir = dirname(fileURLToPath(import.meta.url));

export const createGroup = async (req, res) => {
  const { data } = req.body;

  const { members, info, groupCreator } = JSON.parse(data);

  const fileUrl = req.file
    ? `http://localhost:3000/${req.file.filename}`
    : null;

  const [groupCreated] = await pool.query(
    `
      insert into conversation (isGroup, img_url, group_name, group_description) values (true,?,?,?)
    `,
    [fileUrl, info.name, info.description]
  );

  const groupId = groupCreated.insertId;

  if (groupId <= 0)
    return res
      .status(400)
      .json({ message: "error in group.controller.js at line 24." });

  const query = `
    insert into conversation_members (user_id, conversation_id, is_leader)
    values (${groupCreator}, ${groupId}, true), ${`(?, ${groupId}, false), `.repeat(
    members.length - 1
  )}(?, ${groupId}, false);
    `;

  const [memberGroupAdded] = await pool.query(query, members);

  if (memberGroupAdded.affectedRows <= 0)
    return res
      .status(400)
      .json({ message: "error in group.controller.js at line 36." });

  res.sendStatus(201);
};

export const leaveGroup = async (req, res) => {
  const { userId, conversationId, eventMssg } = req.body;

  const content = { text: eventMssg };

  const [sendEvent] = await pool.query(
    `
    insert into messages (conversation_id, content, sent_date, event)
      values (?,?,?,?)
  `,
    [conversationId, JSON.stringify(content), new Date(), true]
  );

  if (!sendEvent.insertId)
    return res
      .status(400)
      .json({ error: "Error in leaveGroup in sendEvent query." });

  const [response] = await pool.query(
    `
    update conversation_members set left_group_at = ? where user_id = ? and conversation_id = ?;
  `,
    [new Date(new Date().getTime() + 1000), userId, conversationId]
  );

  if (response.affectedRows <= 0)
    return res.status(400).json({ error: "error at leaveGroup." });

  res.sendStatus(200);
};

export const updateGroupData = async (req, res) => {
  const { conversationId, updater, type, text } = req.body;

  const [updatedData] = await pool.query(
    `
    update conversation set group_${type} = ?
      where conversation_id = ?;
  `,
    [text, conversationId]
  );

  if (updatedData.affectedRows <= 0)
    return res
      .status(400)
      .json({ error: "Error in updateGroupData in updateData query." });

  const eventContent = {
    text: `${updater} has changed the group ${type}${
      type == "name" ? ` to ${text}` : ""
    }`,
  };

  const [sendEvent] = await pool.query(
    `
        insert into messages (conversation_id, content, sent_date, event)
        values (?,?,?,?)
        `,
    [conversationId, JSON.stringify(eventContent), new Date(), true]
  );

  if (!sendEvent.insertId)
    return res
      .status(400)
      .json({ error: "Error in updateGroupData in sendEvent query." });

  const [lastInteraction] = await pool.query(
    `
    update conversation set last_interaction = ? 
      where conversation_id = ?
  `,
    [new Date(), conversationId]
  );

  if (lastInteraction.affectedRows <= 0)
    return res
      .status(400)
      .json({ error: "Error in updateGroupData in lastInteraction query." });

  res.sendStatus(200);
};

export const changeGroupPhoto = async (req, res) => {
  const { conversationId, username } = req.body;

  const fileUrl = req.file
    ? `http://localhost:3000/${req.file.filename}`
    : null;

  const [oldFileUrl] = await pool.query(
    `
    select img_url from conversation 
      where conversation_id = ?
  `,
    [conversationId]
  );

  const [response] = await pool.query(
    `
    update conversation set img_url = ?
      where conversation_id = ?
  `,
    [fileUrl, conversationId]
  );

  if (response.affectedRows <= 0)
    return res
      .status(400)
      .json({ error: "Error in changeGroupPhoto function." });

  const content = {
    username: username,
    oldPhoto: oldFileUrl[0].img_url || null,
    newPhoto: fileUrl,
  };

  const [eventCreated] = await pool.query(
    `
    insert into messages (conversation_id, content, sent_date, event)
      values
      (?,?,?,?);
    `,
    [conversationId, JSON.stringify(content), new Date(), true]
  );

  if (eventCreated.insertId <= 0)
    return res.status(400).json({ message: "There was an error." });

  const [lastInteraction] = await pool.query(
    `
    update conversation set last_interaction = ? 
      where conversation_id = ?
  `,
    [new Date(), conversationId]
  );

  if (lastInteraction.affectedRows <= 0)
    return res
      .status(400)
      .json({ error: "Error in changeGroupPhoto in lastInteraction query." });

  res.sendStatus(200);
};
