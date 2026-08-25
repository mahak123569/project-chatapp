import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import { createServer } from "http";
import { Server } from "socket.io";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import User from "./models/user.model.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Create HTTP server
const server = createServer(app);

const CLIENT_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"];

const corsOptions = {
  origin: CLIENT_ORIGINS,
  credentials: true,
};

const getJwtFromCookieHeader = (cookieHeader = "") => {
  const jwtCookie = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("jwt="));

  return jwtCookie ? decodeURIComponent(jwtCookie.slice(4)) : null;
};

// Socket.IO setup
const io = new Server(server, {
  cors: corsOptions,
});

// Make io available in controllers
app.set("io", io);

// Middleware
app.use(
  cors(corsOptions)
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Authenticate the handshake from the same httpOnly JWT cookie used by the API.
// Joining the user room on the server avoids a race with a client-side joinRoom event.
io.use(async (socket, next) => {
  try {
    const token = getJwtFromCookieHeader(socket.handshake.headers.cookie);

    if (!token) {
      return next(new Error("Unauthorized socket connection"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("_id");

    if (!user) {
      return next(new Error("Unauthorized socket connection"));
    }

    // Store only the server-verified MongoDB id on the socket. This is the
    // exact room id used by sendMessage for the receiver.
    socket.data.userId = user._id.toString();
    return next();
  } catch (error) {
    next(new Error("Unauthorized socket connection"));
  }
});

// Each authenticated connection joins its own stable MongoDB user-id room.
io.on("connection", (socket) => {
  const userId = socket.data.userId;

  if (!userId) {
    socket.disconnect(true);
    return;
  }

  socket.join(userId.toString());
});

 // Start server

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
