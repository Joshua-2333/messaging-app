// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/usersRoutes.js";
import tokenRoutes from "./routes/tokenRoutes.js";
import conversationsRoutes from "./routes/conversationsRoutes.js";
import messagesRoutes from "./routes/messagesRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3001", // frontend
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/token", tokenRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationsRoutes);
app.use("/api/messages", messagesRoutes);

app.get("/", (req, res) => {
  res.send("Messaging API running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
