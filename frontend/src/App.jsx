import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader } from "lucide-react";

import Navbar from "./components/Navbar";
import HomePage from "./Pages/HomePage";
import SignupPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";
import SettingsPage from "./Pages/SettingsPage";
import ProfilePage from "./Pages/ProfilePage";
import { useAuthStore } from "./Pages/store/useAuthStore";
import { useChatStore } from "./Pages/store/useChatStore";

const App = () => {
  const {
    authUser,
    checkAuth,
    isCheckingAuth,
  } = useAuthStore();
  const { connectSocket, disconnectSocket } = useChatStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Keep one socket alive for the authenticated session, including when navigating
  // away from the home page. No cleanup here prevents Strict Mode from creating a
  // connect/disconnect cycle; logout is handled when authUser becomes null.
  useEffect(() => {
    if (authUser?._id) {
      connectSocket();
    } else {
      disconnectSocket();
    }
  }, [authUser?._id, connectSocket, disconnectSocket]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <HomePage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/signup"
          element={
            authUser ? (
              <Navigate to="/" replace />
            ) : (
              <SignupPage />
            )
          }
        />

        <Route
          path="/login"
          element={
            authUser ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage />
            )
          }
        />

        <Route
          path="/settings"
          element={
            authUser ? (
              <SettingsPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/profile"
          element={
            authUser ? (
              <ProfilePage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </>
  );
};

export default App;
