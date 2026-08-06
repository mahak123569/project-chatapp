import { create } from "zustand";
import { axiosInstance } from "../../components/lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set) => ({
  // ==========================
  // STATES
  // ==========================
  messages: [],
  users: [],
  selectedUser: null,

  isUsersLoading: false,
  isMessagesLoading: false,

  // ==========================
  // GET USERS FOR SIDEBAR
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
  // SELECT USER
  // ==========================
  setSelectedUser: (selectedUser) =>
    set({
      selectedUser,
    }),
}));