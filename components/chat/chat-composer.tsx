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

  function handleSend() {
    const value = text.trim();
    if (!value) return;
    onSend(value);
    setText("");
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
      />
      <Button variant="ghost" size="icon" aria-label="Voice input">
        <Image
          src={microphoneIcon}
          alt=""
          width={20}
          height={20}
          className="h-5 w-5"
          aria-hidden={true}
        />
      </Button>
      <Button onClick={handleSend} size="icon" aria-label="Send message">
        <Send className="size-5" />
      </Button>
    </div>
  );
}
