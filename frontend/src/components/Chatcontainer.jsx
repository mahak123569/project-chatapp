const ChatContainer = () => {
  return (
    <div className="flex-1 flex flex-col">

      <div className="border-b p-4 font-bold">
        Select a chat
      </div>

      <div className="flex-1 flex items-center justify-center">
        Messages will appear here
      </div>

      <div className="border-t p-4">
        Message Input
      </div>

    </div>
  );
};

export default ChatContainer;