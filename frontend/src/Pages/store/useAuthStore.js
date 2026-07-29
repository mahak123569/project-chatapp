import { create } from "zustand";
import { axiosInstance } from "../../components/lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  // User data
  authUser: null,

  // Loading states
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  // =========================
  // CHECK AUTHENTICATION
  // =========================
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({
        authUser: res.data,
      });
    } catch (error) {
      console.log("Error in checkAuth:", error);

      set({
        authUser: null,
      });
    } finally {
      set({
        isCheckingAuth: false,
      });
    }
  },

  // =========================
  // SIGNUP
  // =========================
  signUp: async (data) => {
    set({
      isSigningUp: true,
    });

    try {
      const res = await axiosInstance.post(
        "/auth/signup",
        data
      );

      set({
        authUser: res.data,
      });

      toast.success("Account created successfully!");
    } catch (error) {
      console.log("Error in signup:", error);

      toast.error(
        error.response?.data?.message ||
          "Signup failed"
      );
    } finally {
      set({
        isSigningUp: false,
      });
    }
  },

  // =========================
  // LOGIN
  // =========================
  login: async (data) => {
    set({
      isLoggingIn: true,
    });

    try {
      const res = await axiosInstance.post(
        "/auth/login",
        data
      );

      set({
        authUser: res.data,
      });

      toast.success("Logged in successfully!");
    } catch (error) {
      console.log("Error in login:", error);

      toast.error(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      set({
        isLoggingIn: false,
      });
    }
  },

  // =========================
  // LOGOUT
  // =========================
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");

      set({
        authUser: null,
      });

      toast.success("Logged out successfully!");
    } catch (error) {
      console.log("Error in logout:", error);

      toast.error("Logout failed");
    }
  },
}));