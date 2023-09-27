import { createPool } from "mysql2/promise";

const env = process.env;

const pool = createPool({
  host: env.HOST,
  user: "root",
  port: env.DB_PORT,
  password: "123456789",
  database: "chatApp",
});

export default pool;
