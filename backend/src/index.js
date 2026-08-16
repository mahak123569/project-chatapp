import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Create HTTP server
const server = createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Make io available in controllers
app.set("io", io);

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // User ko apne room mein join karvao
  socket.on("joinRoom", (userId) => {
    socket.join(userId);

    console.log(`User ${userId} joined room`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start server
//run port
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});