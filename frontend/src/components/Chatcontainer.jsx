import { MessageCircle, MoreVertical, Phone, Video } from "lucide-react";
import MessageInput from "./MessageInput";
import { useChatStore } from "../Pages/store/useChatStore";
import { useAuthStore } from "../Pages/store/useAuthStore";

const ChatContainer = () => {
  const { selectedUser, messages } = useChatStore();
  const { authUser } = useAuthStore();

  // =========================
  // NO CHAT SELECTED
  // =========================

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-base-100">
        <div className="text-center max-w-sm px-6">

          <div className="mx-auto w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-5">
            <MessageCircle className="w-10 h-10 text-primary" />
          </div>

          <h2 className="text-2xl font-bold mb-2">
            Welcome to Chat App
          </h2>

          <p className="text-sm text-base-content/50">
            Select a conversation from the sidebar
            to start chatting.
          </p>

        </div>
      </div>
    );
  }

  // =========================
  // AVATAR
  // =========================

  const selectedUserInitial =
    selectedUser.fullName?.charAt(0)?.toUpperCase() || "?";

  // =========================
  // CHECK MESSAGE SENDER
  // =========================

  const isMyMessage = (message) => {
    return String(message.senderId) === String(authUser?._id);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-base-100">

      {/* =========================
          CHAT HEADER
      ========================= */}

      <div className="h-[76px] px-5 flex items-center justify-between border-b border-base-300 bg-base-100">

        {/* User Info */}

        <div className="flex items-center gap-3 min-w-0">

          {/* Avatar */}

          <div className="relative flex-shrink-0">

            {selectedUser.profilePic ? (
              <img
                src={selectedUser.profilePic}
                alt={selectedUser.fullName}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-base-200"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-lg">
                {selectedUserInitial}
              </div>
            )}

            {/* Online indicator */}

            <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-base-100" />

          </div>

          {/* Name */}

          <div className="min-w-0">

            <h2 className="font-bold text-sm truncate">
              {selectedUser.fullName}
            </h2>

            <div className="flex items-center gap-1.5 mt-0.5">

              <span className="w-1.5 h-1.5 rounded-full bg-success" />

              <span className="text-xs text-base-content/50">
                Online
              </span>

            </div>

          </div>

        </div>

        {/* Header Actions */}

        <div className="flex items-center gap-1">

          <button
            className="
              w-9
              h-9
              rounded-xl
              flex
              items-center
              justify-center
              text-base-content/50
              hover:text-primary
              hover:bg-base-200
              transition
            "
            title="Call"
          >
            <Phone className="w-4 h-4" />
          </button>

          <button
            className="
              w-9
              h-9
              rounded-xl
              flex
              items-center
              justify-center
              text-base-content/50
              hover:text-primary
              hover:bg-base-200
              transition
            "
            title="Video call"
          >
            <Video className="w-4 h-4" />
          </button>

          <button
            className="
              w-9
              h-9
              rounded-xl
              flex
              items-center
              justify-center
              text-base-content/50
              hover:text-primary
              hover:bg-base-200
              transition
            "
            title="More"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* =========================
          MESSAGES
      ========================= */}

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-3">

        {messages.length === 0 ? (

          <div className="h-full flex flex-col items-center justify-center text-center">

            <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center mb-4">
              <MessageCircle className="w-7 h-7 text-base-content/30" />
            </div>

            <h3 className="font-semibold text-base-content/70">
              No messages yet
            </h3>

            <p className="text-xs text-base-content/40 mt-1">
              Send a message to start the conversation
            </p>

          </div>

        ) : (

          messages.map((message) => {

            const mine = isMyMessage(message);

            return (
              <div
                key={message._id}
                className={`flex ${
                  mine ? "justify-end" : "justify-start"
                }`}
              >

                <div
                  className={`
                    max-w-[75%]
                    sm:max-w-[65%]
                    px-4
                    py-2.5
                    rounded-2xl
                    shadow-sm
                    ${
                      mine
                        ? "bg-primary text-primary-content rounded-br-md"
                        : "bg-base-200 text-base-content rounded-bl-md"
                    }
                  `}
                >

                  {/* Image */}

                  {message.image && (
                    <img
                      src={message.image}
                      alt="message"
                      className="rounded-xl max-w-full mb-2"
                    />
                  )}

                  {/* Text */}

                  {message.text && (
                    <p className="text-sm leading-relaxed break-words">
                      {message.text}
                    </p>
                  )}

                  {/* Time */}

                  <div
                    className={`
                      text-[10px]
                      mt-1
                      text-right
                      ${
                        mine
                          ? "text-primary-content/60"
                          : "text-base-content/40"
                      }
                    `}
                  >
                    {message.createdAt
                      ? new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </div>

                </div>

              </div>
            );
          })

        )}

      </div>

      {/* =========================
          MESSAGE INPUT
      ========================= */}

      <div className="border-t border-base-300 bg-base-100">
        <MessageInput />
      </div>

    </div>
  );
};

export default ChatContainer;