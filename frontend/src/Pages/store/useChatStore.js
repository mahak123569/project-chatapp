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
      const res = await axiosInstance.get("/messages/user");

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
  connectSocket: () => {
    const { socket } = get();

    if (socket?.connected) return;

    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

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