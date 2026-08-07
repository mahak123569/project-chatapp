import { useState } from "react";
import { useChatStore } from "../Pages/store/useChatStore";

const MessageInput = () => {
  const [text, setText] = useState("");

  const { sendMessage } = useChatStore();

  const handleSend = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    await sendMessage({
      text,
    });

    setText("");
  };

  return (
    <form
      onSubmit={handleSend}
      className="p-4 border-t border-base-300 flex gap-2"
    >
      <input
        type="text"
        placeholder="Type a message..."
        className="input input-bordered flex-1"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        type="submit"
        className="btn btn-primary"
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;