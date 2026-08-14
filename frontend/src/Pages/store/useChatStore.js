import { create } from "zustand";
import { io } from "socket.io-client";
import { axiosInstance } from "../../components/lib/axios";
import { useAuthStore } from "./useAuthStore";

const SOCKET_URL = "http://localhost:3002";

export const useChatStore = create((set, get) => ({
  // =========================
  // STATE
  // =========================

  messages: [],
  users: [],
  selectedUser: null,

  isUsersLoading: false,
  isMessagesLoading: false,

  socket: null,

  // =========================
  // GET USERS
  // =========================

  getUsers: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/messages/users");

      set({
        users: res.data,
      });
    } catch (error) {
      console.log(
        "Error getting users:",
        error.response?.data?.message || error.message
      );
    } finally {
      set({
        isUsersLoading: false,
      });
    }
  },

  // =========================
  // GET MESSAGES
  // =========================

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/${userId}`);

      set({
        messages: res.data,
      });
    } catch (error) {
      console.log(
        "Error getting messages:",
        error.response?.data?.message || error.message
      );
    } finally {
      set({
        isMessagesLoading: false,
      });
    }
  },

  // =========================
  // SELECT USER
  // =========================

  setSelectedUser: (selectedUser) => {
    set({
      selectedUser,
      messages: [],
    });

    if (selectedUser?._id) {
      get().getMessages(selectedUser._id);
    }
  },

  // =========================
  // SEND MESSAGE
  // =========================

  sendMessage: async (messageData) => {
    const { selectedUser } = get();

    if (!selectedUser?._id) {
      console.log("No user selected");
      return;
    }

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      // Sender ko message immediately show karna
      set((state) => ({
        messages: [...state.messages, res.data],
      }));
    } catch (error) {
      console.log(
        "Error sending message:",
        error.response?.data?.message || error.message
      );
    }
  },

  // =========================
  // CONNECT SOCKET
  // =========================

  connectSocket: () => {
    const { socket } = get();
    const { authUser } = useAuthStore.getState();

    if (!authUser) return;

    if (socket?.connected) return;

    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);

      // Logged-in user ko uske room mein join karvao
      newSocket.emit("joinRoom", authUser._id);
    });

    // Receive real-time messages
    newSocket.on("newMessage", (newMessage) => {
      const { messages } = get();

      set({
        messages: [...messages, newMessage],
      });
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    set({
      socket: newSocket,
    });
  },

  // =========================
  // DISCONNECT SOCKET
  // =========================

  disconnectSocket: () => {
    const { socket } = get();

    if (socket?.connected) {
      socket.disconnect();
    }

    set({
      socket: null,
    });
  },
}));