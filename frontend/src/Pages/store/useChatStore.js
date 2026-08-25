import { create } from "zustand";
import { io } from "socket.io-client";
import { axiosInstance } from "../../components/lib/axios";
import { useAuthStore } from "./useAuthStore";

const SOCKET_URL = "http://localhost:3002";

const asId = (value) => (value == null ? null : String(value));

const mergeMessages = (...messageLists) => {
  const uniqueMessages = new Map();

  messageLists.flat().forEach((message) => {
    if (message?._id) {
      uniqueMessages.set(asId(message._id), message);
    }
  });

  return [...uniqueMessages.values()].sort(
    (first, second) =>
      new Date(first.createdAt) - new Date(second.createdAt)
  );
};

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

      set((state) => {
        if (asId(state.selectedUser?._id) !== asId(userId)) {
          return state;
        }

        return {
          messages: mergeMessages(res.data, state.messages),
        };
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

    const receiverId = selectedUser._id;

    try {
      const res = await axiosInstance.post(
        `/messages/send/${receiverId}`,
        messageData
      );

      set((state) => {
        if (
          asId(state.selectedUser?._id) !==
          asId(receiverId)
        ) {
          return state;
        }

        return {
          messages: mergeMessages(
            state.messages,
            [res.data]
          ),
        };
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

    if (!authUser?._id) {
      console.log("Socket not connected: user not authenticated");
      return;
    }

    const authenticatedUserId = asId(authUser._id);

    // Don't create another socket for the same user
    if (
      socket?.connected &&
      asId(socketUserId) === authenticatedUserId
    ) {
      return;
    }

    // Disconnect old socket
    if (socket) {
      socket.disconnect();
    }

    console.log(
      "Connecting socket for user:",
      authenticatedUserId
    );

    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    // =========================
    // SOCKET CONNECTED
    // =========================

    newSocket.on("connect", () => {
      console.log(
        "Socket connected:",
        newSocket.id
      );

      console.log(
        "Socket user:",
        authenticatedUserId
      );
    });

    // =========================
    // RECEIVE NEW MESSAGE
    // =========================

    newSocket.on("newMessage", (newMessage) => {
      console.log(
        "🔥 NEW MESSAGE RECEIVED:",
        newMessage
      );

      const { authUser: currentUser } =
        useAuthStore.getState();

      set((state) => {
        const selectedUserId = asId(
          state.selectedUser?._id
        );

        const currentUserId = asId(
          currentUser?._id
        );

        const senderId = asId(
          newMessage.senderId
        );

        const receiverId = asId(
          newMessage.receiverId
        );

        console.log("Message check:", {
          selectedUserId,
          currentUserId,
          senderId,
          receiverId,
        });

        // Message must be:
        // sender = currently selected user
        // receiver = logged-in user

        const isCurrentConversation =
          selectedUserId === senderId &&
          currentUserId === receiverId;

        console.log(
          "Is current conversation:",
          isCurrentConversation
        );

        const alreadyExists =
          state.messages.some(
            (message) =>
              asId(message._id) ===
              asId(newMessage._id)
          );

        if (
          !isCurrentConversation ||
          alreadyExists
        ) {
          return state;
        }

        return {
          messages: mergeMessages(
            state.messages,
            [newMessage]
          ),
        };
      });
    });

    // =========================
    // SOCKET DISCONNECTED
    // =========================

    newSocket.on("disconnect", (reason) => {
      console.log(
        "Socket disconnected:",
        reason
      );
    });

    // =========================
    // SOCKET ERROR
    // =========================

    newSocket.on("connect_error", (error) => {
      console.error(
        "Socket connection error:",
        error.message
      );
    });

    set({
      socket: newSocket,
      socketUserId: authenticatedUserId,
    });
  },

  // =========================
  // DISCONNECT SOCKET
  // =========================

  disconnectSocket: () => {
    const { socket } = get();

    if (socket) {
      socket.disconnect();
    }

    set({
      socket: null,
      socketUserId: null,
      selectedUser: null,
      messages: [],
      users: [],
    });
  },
}));