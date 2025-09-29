"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import microphoneIcon from "@/public/icons/microphone.svg";

export function ChatComposer({
  onSend,
  placeholder = "Ask boldly. Discover deeply.",
}: {
  onSend: (text: string) => void;
  placeholder?: string;
}) {
  const [text, setText] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);

  async function handleSend() {
    const userText = text.trim();
    if (!userText || isSending) return;

    setIsSending(true);
    setText("");

    try {
      const botReply = await fetchBotReply(userText);
      onSend(userText);   // send user message
      // If you want bot messages too:
      // onSend(botReply);
    } catch (err) {
      console.error("Error handling send:", err);
      onSend("Error contacting assistant.");
    } finally {
      setIsSending(false);
    }
  }

  async function fetchBotReply(userText: string): Promise<string> {
    try {
      const isLocal = window.location.hostname === "localhost";
      const endpoint = isLocal
        ? "http://localhost:3000/vdc200007-disruptor-prod/chat"
        : "https://us-central1-vdc200007-disruptor-prod.cloudfunctions.net/chat2";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userText }),
      });

      const text = await res.text();
      console.log("Raw response:", text);

      const data = JSON.parse(text);
      return data.reply || "Sorry, no reply received.";
    } catch (err) {
      console.error("Fetch error:", err);
      return "Error contacting the assistant.";
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="sticky bottom-0 mt-4 flex items-center gap-2 border bg-[#D7DEDD] p-2 shadow-sm justify-center border-emerald-600/50">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="flex-1 border-0 bg-transparent focus-visible:ring-0 shadow-none placeholder:font-semibold py-4"
        aria-label="Message"
        disabled={isSending}
      />
      <Button variant="ghost" size="icon" aria-label="Voice input">
        <Image
          src={microphoneIcon}
          alt=""
          width={20}
          height={20}
          className="h-5 w-5"
          aria-hidden="true"
        />
      </Button>
      <Button
        onClick={handleSend}
        size="icon"
        aria-label="Send message"
        disabled={isSending}
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
}
