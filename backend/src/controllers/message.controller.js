import cloudinary from "../lib/cloudinary.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";

// ==========================
// GET USERS FOR SIDEBAR
// ==========================
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error(
      "Error in getUsersForSidebar:",
      error.message
    );

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// ==========================
// GET MESSAGES
// ==========================
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    if (!mongoose.isValidObjectId(userToChatId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          receiverId: userToChatId,
        },
        {
          senderId: userToChatId,
          receiverId: myId,
        },
      ],
    }).sort({ createdAt: 1 });
  

    res.status(200).json(messages);
  } catch (error) {
    console.error(
      "Error in getMessages controller:",
      error.message
    );

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// ==========================
// SEND MESSAGE
// ==========================
export const sendMessage = async (req, res) => {
  try {
    const text = req.body.text?.trim() || "";
    const { image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!mongoose.isValidObjectId(receiverId)) {
      return res.status(400).json({ error: "Invalid receiver id" });
    }

    if (!text && !image) {
      return res.status(400).json({ error: "A message must include text or an image" });
    }

    if (senderId.toString() === receiverId) {
      return res.status(400).json({ error: "You cannot message yourself" });
    }

    // Resolve the target once so the saved receiver id and Socket.IO room use
    // the exact same canonical MongoDB id string.
    const receiver = await User.findById(receiverId).select("_id");

    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    const receiverRoomId = receiver._id.toString();

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId: receiver._id,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Send message to receiver in real-time
    const io = req.app.get("io");

    if (io) {
      // Send a plain payload with string ids. This keeps the Zustand
      // conversation comparison independent of Mongoose/ObjectId serialization.
      const messageForClient = newMessage.toObject();
      messageForClient.senderId = messageForClient.senderId.toString();
      messageForClient.receiverId = messageForClient.receiverId.toString();

      io.to(receiverRoomId).emit("newMessage", messageForClient);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(
      "Error in sendMessage controller:",
      error.message
    );

    res.status(500).json({
      error: "Internal server error",
    });
  }
};
