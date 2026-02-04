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

dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // frontend origin
    credentials: true, // allow cookies to be sent
  })
);

app.use(express.json());
app.use(cookieParser());

// Root
app.get("/", (req, res) => {
  res.send("🟢 Messaging App API is running");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/users", usersRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

// =============================
// Demo: Set Alice & Dan online
// =============================
async function setDemoUsersOnline() {
  try {
    await pool.query(
      `UPDATE users
       SET is_online = TRUE
       WHERE username IN ('Alice', 'Dan')`
    );
    console.log("✅ Demo users Alice & Dan set online");
  } catch (err) {
    console.error("Failed to set demo users online:", err);
  }
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await setDemoUsersOnline();
});
