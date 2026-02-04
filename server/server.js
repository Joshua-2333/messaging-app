// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import pool from "./db/pool.js";

import authRoutes from "./routes/authRoutes.js";
import groupsRoutes from "./routes/groupsRoutes.js";
import messagesRoutes from "./routes/messagesRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";

// Fix __dirname in ESM
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

/*CORS CONFIG (FIXED)*/
const allowedOrigins = [
  "http://localhost:3000",
  "https://messaging-app-frontend-k9y4.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server requests (Postman, Render health checks)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("❌ CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

/*Root*/
app.get("/", (req, res) => {
  res.send("🟢 Messaging App API is running");
});

/*API Routes*/
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/users", usersRoutes);

/*404 Handler*/
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/*Global Error Handler*/
app.use((err, req, res, next) => {
  console.error("🔥 Server error:", err.message);
  res.status(500).json({ message: err.message || "Server error" });
});

/*Demo: Set Alice & Dan online*/
async function setDemoUsersOnline() {
  try {
    const result = await pool.query(`
      UPDATE users
      SET is_online = TRUE
      WHERE username IN ('Alice', 'Dan')
      RETURNING username
    `);

    if (result.rowCount > 0) {
      console.log(
        `✅ Demo users set online: ${result.rows
          .map(r => r.username)
          .join(", ")}`
      );
    } else {
      console.log("ℹ️ No demo users found to set online");
    }
  } catch (err) {
    console.error("Failed to set demo users online:", err);
  }
}

/* Start Server (DB-safe)*/
async function startServer() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database connection successful");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, async () => {
      console.log(`🚀 Server running on port ${PORT}`);
      await setDemoUsersOnline();
    });
  } catch (err) {
    console.error("❌ Failed to connect to the database:", err);
    process.exit(1);
  }
}

startServer();
