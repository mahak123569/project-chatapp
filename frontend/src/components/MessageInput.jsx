import { useRef, useState } from "react";
import { Send, Smile, Paperclip } from "lucide-react";
import { useChatStore } from "../Pages/store/useChatStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  const { sendMessage } = useChatStore();

  const handleSend = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    await sendMessage({
      text: text.trim(),
    });

    setText("");

    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    // Enter = send
    // Shift + Enter = new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <form
      onSubmit={handleSend}
      className="p-4 bg-base-100"
    >
      <div
        className="
          flex
          items-center
          gap-2
          p-2
          rounded-2xl
          bg-base-200
          border
          border-base-300
          focus-within:border-primary/40
          focus-within:ring-2
          focus-within:ring-primary/10
          transition-all
        "
      >
        {/* Emoji button */}

        <button
          type="button"
          className="
            w-10
            h-10
            flex
            items-center
            justify-center
            rounded-xl
            text-base-content/40
            hover:text-primary
            hover:bg-base-300
            transition
          "
          title="Emoji"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Message input */}

        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="
            flex-1
            bg-transparent
            border-none
            outline-none
            text-sm
            px-2
            placeholder:text-base-content/35
          "
        />

        {/* Attachment button */}

        <button
          type="button"
          className="
            w-10
            h-10
            flex
            items-center
            justify-center
            rounded-xl
            text-base-content/40
            hover:text-primary
            hover:bg-base-300
            transition
          "
          title="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Send button */}

        <button
          type="submit"
          disabled={!text.trim()}
          className="
            w-10
            h-10
            flex
            items-center
            justify-center
            rounded-xl
            bg-primary
            text-primary-content
            hover:opacity-90
            active:scale-95
            disabled:opacity-30
            disabled:cursor-not-allowed
            transition-all
          "
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Small hint */}

      <p className="text-[10px] text-base-content/30 text-center mt-2">
        Press Enter to send • Shift + Enter for a new line
      </p>
    </form>
  );
};

export default MessageInput;