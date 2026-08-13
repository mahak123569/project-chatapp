import { create } from "zustand";
import { axiosInstance } from "../../components/lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3002";

export const useChatStore = create((set, get) => ({
  // ==========================
  // STATES
  // ==========================
  messages: [],
  users: [],
  selectedUser: null,

  isUsersLoading: false,
  isMessagesLoading: false,

  socket: null,

  // ==========================
  // GET USERS
  // ==========================
  getUsers: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/messages/users");

      set({
        users: res.data,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load users"
      );
    } finally {
      set({
        isUsersLoading: false,
      });
    }
  },

  // ==========================
  // GET MESSAGES
  // ==========================
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/${userId}`);

      set({
        messages: res.data,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load messages"
      );
    } finally {
      set({
        isMessagesLoading: false,
      });
    }
  },

  // ==========================
  // SEND MESSAGE
  // ==========================
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    if (!selectedUser) return;

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      set({
        messages: [...messages, res.data],
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send message"
      );
    }
  },

  // ==========================
  // CONNECT SOCKET
  // ==========================
  connectSocket: (userId) => {
    const { socket } = get();

    if (socket?.connected) return;

    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
    });

    // Socket connected
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);

      // Join user's own room
      newSocket.emit("joinUser", userId);

      console.log("Joined room:", userId);
    });

    // Receive new message
    newSocket.on("newMessage", (newMessage) => {
      console.log("New message received:", newMessage);

      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    });

    // Socket disconnected
    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    set({
      socket: newSocket,
    });
  },

  // ==========================
  // DISCONNECT SOCKET
  // ==========================
  disconnectSocket: () => {
    const { socket } = get();

    if (socket) {
      socket.disconnect();

      set({
        socket: null,
      });
    }
  },

  // ==========================
  // SELECT USER
  // ==========================
  setSelectedUser: (selectedUser) =>
    set({
      selectedUser,
      messages: [],
    }),
}));