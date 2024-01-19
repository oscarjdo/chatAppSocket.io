import pool from "../db.js";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

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
