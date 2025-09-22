import React, { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import "./bot.css";

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  text: string;
  time: number;
}

interface ChatbotProps {
  title?: string;
  placeholder?: string;
  welcome?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({
  title = "Assistant",
  placeholder = "Type a message…",
  welcome = "Hi! Ask me anything.",
}) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const cached = sessionStorage.getItem("chatbot_messages");
      return cached ? (JSON.parse(cached) as Message[]) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    sessionStorage.setItem("chatbot_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, isTyping]);

  // 🔮 Call Firebase Function / backend API
  async function fetchBotReply(userText: string): Promise<string> {
    try {
      const origin = window.location.origin;
      const endpoint = origin.includes("localhost")
        ? "http://localhost:5173/vdc200007-dp-prod/us-central1/chat"
        : "https://us-central1-vdc200007-dp-prod.cloudfunctions.net/chat";
  
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userText }),
      });
  
      const text = await res.text(); // get raw body
      console.log("Raw response:", text);
  
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server did not return valid JSON");
      }
  
      return data.reply || "Sorry, no reply received.";
    } catch (err) {
      console.error("Fetch error:", err);
      return "Error contacting the assistant.";
    }
  }
  

  function pushMessage(role: Role, text: string) {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role, text: text.trim(), time: Date.now() },
    ]);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    pushMessage("user", text);
    setInput("");

    setIsTyping(true);
    const reply = await fetchBotReply(text);
    pushMessage("assistant", reply);
    setIsTyping(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  }

  return (
    <div className="cb-container" role="region" aria-label={`${title} chat`}>
      <header className="cb-header">
        <div className="cb-header-dot" aria-hidden />
        <h2 className="cb-title">{title}</h2>
      </header>

      {messages.length === 0 && (
        <div className="cb-hero">
          <div className="cb-hero-badge">{title}</div>
          <p className="cb-hero-text">{welcome}</p>
        </div>
      )}

      <div className="cb-list" ref={listRef}>
        {messages.map((m) => (
          <MessageItem key={m.id} role={m.role} text={m.text} time={m.time} />
        ))}
        {isTyping && (
          <div className="cb-row cb-row-assistant" aria-live="polite">
            <div className="cb-avatar" aria-hidden>
              🤖
            </div>
            <div className="cb-bubble">
              <span className="cb-dots" />
            </div>
          </div>
        )}
      </div>

      <form className="cb-inputbar" onSubmit={handleSubmit}>
        <textarea
          className="cb-input"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          aria-label="Message input"
        />
        <button className="cb-send" type="submit" aria-label="Send message">
          ➤
        </button>
      </form>
    </div>
  );
};

interface MessageItemProps {
  role: Role;
  text: string;
  time: number;
}

const MessageItem: React.FC<MessageItemProps> = ({ role, text, time }) => {
  const isUser = role === "user";
  const date = new Date(time);
  const timestamp = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`cb-row ${isUser ? "cb-row-user" : "cb-row-assistant"}`}>
      <div className="cb-avatar" aria-hidden>
        {isUser ? "🧑" : "🤖"}
      </div>
      <div className="cb-bubble">
        <div className="cb-text">{text}</div>
        <div className="cb-meta" role="note">
          {timestamp}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
