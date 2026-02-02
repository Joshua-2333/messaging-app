// server/db/pool.js
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || "josh2333",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "messaging_app",
  password: process.env.DB_PASSWORD || "yourpassword",
  port: process.env.DB_PORT || 5432,
});

export default pool;
