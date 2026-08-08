import MessageInput from "./MessageInput";
import { useChatStore } from "../Pages/store/useChatStore";

const ChatContainer = () => {
  const { selectedUser, messages } = useChatStore();

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <h2 className="text-xl font-semibold">
          Select a chat
        </h2>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">

      {/* Chat Header */}
      <div className="border-b border-base-300 p-4">
        <h2 className="text-lg font-bold">
          {selectedUser.fullName}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400">
            No messages yet
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className="mb-2 p-3 rounded-lg bg-base-200"
            >
              {message.text}
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;