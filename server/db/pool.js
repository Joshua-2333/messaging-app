// server/db/pool.js
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || "josh2333"}:${process.env.DB_PASSWORD || "yourpassword"}@${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || "messaging_app"}`,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false, // SSL only for Render
});

pool.on("connect", () => {
  console.log("✅ Connected to the database");
});

export default pool;
