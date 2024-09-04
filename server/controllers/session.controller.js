import pool from "../db.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const currentDir = dirname(fileURLToPath(import.meta.url));

export const signUp = async (req, res) => {
  const { username, email, password } = JSON.parse(req.body.userData);

  const fileUrl = req.file
    ? `http://localhost:3000/${req.file.filename}`
    : null;

  const [response] = await pool.query(
    "insert into users (username, email, password, img_url) values (?,?,?,?)",
    [username, email, password, fileUrl]
  );

  if (response.affectedRows <= 0) return res.sendStatus(400);

  res.sendStatus(201);
};

export const createToken = async (req, res) => {
  const { email, password } = req.body;

  const [response] = await pool.query("select * from users where email = ?", [
    email,
  ]);

  if (response.length <= 0)
    return res.status(404).json({ message: "This user doesn't exist." });

  if (response.length > 1)
    return res.status(500).json({
      message: "there is more than one email that matches the one entered.",
    });

  if (response[0].password !== password)
    return res.status(401).json({ message: "Password is invalid." });

  const token = jwt.sign(
    {
      id: response[0].id,
      username: response[0].username,
      email,
      imgUrl: response[0].img_url,
    },
    "secreT-keY_tokeN-tO_senT-likE_A-cookiE",
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV !== "development",
  });
  res.sendStatus(201);
};

export const getToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.json(false);

  try {
    const tokenV = jwt.verify(token, "secreT-keY_tokeN-tO_senT-likE_A-cookiE");

    return res.json(tokenV);
  } catch (error) {
    return console.log(error);
  }
};

export const logOut = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(403).json({ message: "Token not provided." });

  try {
    jwt.verify(token, "secreT-keY_tokeN-tO_senT-likE_A-cookiE");

    res.cookie("token", null, {
      maxAge: 0,
    });
    return res.sendStatus(204);
  } catch (error) {
    return res.json(error);
  }
};

export const deleteImgFromServer = async (req, res) => {
  const { id } = req.params;

  const [url] = await pool.query(
    `select img_url from users
      where id = ?`,
    [id]
  );

  if (url.length <= 0)
    return res
      .status(404)
      .json("Error in 'deleteImgFromServer - select * from users'.");

  const fileName = url[0].img_url.split("3000/")[1];

  try {
    fs.unlinkSync(join(currentDir, "../public/", fileName));
  } catch (error) {
    return res.json(error);
  }

  res.sendStatus(200);
};

export const changePhoto = async (req, res) => {
  const { userId } = req.body;
  const { token } = req.cookies;

  if (!req.file.filename) return res.json(false);

  const imageUrl = `http://localhost:3000/${req.file.filename}`;

  const [response] = await pool.query(
    `update users set img_url = ?
    where id = ?`,
    [imageUrl, userId]
  );

  if (response.affectedRows <= 0)
    return res
      .status(400)
      .json({ message: "Error in `update users set img_url`" });

  if (!token) return res.status(403).json({ message: "Token not provided." });

  let oldToken = jwt.verify(token, "secreT-keY_tokeN-tO_senT-likE_A-cookiE");

  oldToken.imgUrl = imageUrl;

  const newToken = jwt.sign(oldToken, "secreT-keY_tokeN-tO_senT-likE_A-cookiE");

  res.cookie("token", newToken);

  res.sendStatus(200);
};
