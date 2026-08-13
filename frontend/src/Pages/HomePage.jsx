import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Chatcontainer from "../components/Chatcontainer";
import { useChatStore } from "./store/useChatStore";
import { useAuthStore } from "./store/useAuthStore";

const HomePage = () => {
  const { authUser } = useAuthStore();

  const {
    connectSocket,
    disconnectSocket,
  } = useChatStore();

  useEffect(() => {
    if (authUser?._id) {
      connectSocket(authUser._id);
    }

    return () => {
      disconnectSocket();
    };
  }, [authUser, connectSocket, disconnectSocket]);

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">

            <Sidebar />

            <Chatcontainer />

          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;