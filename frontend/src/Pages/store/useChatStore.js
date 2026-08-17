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
  socketUserId: null,

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

      // Ignore a late response after the user has switched to another chat.
      if (get().selectedUser?._id === userId) {
        set({ messages: res.data });
      }
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

      // The sender receives the HTTP response; the socket event is receiver-only.
      set((state) => {
        if (state.messages.some((message) => message._id === res.data._id)) {
          return state;
        }

        return { messages: [...state.messages, res.data] };
      });
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
    const { socket, socketUserId } = get();
    const { authUser } = useAuthStore.getState();

    if (!authUser) return;

    if (socket && socketUserId === authUser._id) return;

    socket?.disconnect();

    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    // Receive real-time messages
    newSocket.on("newMessage", (newMessage) => {
      const { authUser: currentUser } = useAuthStore.getState();

      set((state) => {
        const isCurrentConversation =
          state.selectedUser?._id === newMessage.senderId?.toString() &&
          newMessage.receiverId?.toString() === currentUser?._id;
        const alreadyExists = state.messages.some(
          (message) => message._id === newMessage._id
        );

        if (!isCurrentConversation || alreadyExists) return state;

        return { messages: [...state.messages, newMessage] };
      });
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    set({
      socket: newSocket,
      socketUserId: authUser._id,
    });
  },

  // =========================
  // DISCONNECT SOCKET
  // =========================

  disconnectSocket: () => {
    const { socket } = get();

    socket?.disconnect();

    set({
      socket: null,
      socketUserId: null,
    });
  },
}));
