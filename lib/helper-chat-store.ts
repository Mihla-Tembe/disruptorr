"use client";

import * as React from "react";

export type HelperMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

const STORAGE_KEY = "disruptor.helper.chat.v1";

function readMessages(): HelperMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeMessages(msgs: HelperMessage[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
}

export function useHelperChat() {
  const [messages, setMessages] = React.useState<HelperMessage[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setMessages(readMessages());
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (hydrated) writeMessages(messages);
  }, [messages, hydrated]);

  function append(role: HelperMessage["role"], content: string) {
    const m: HelperMessage = {
      id: crypto.randomUUID(),
      role,
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, m]);
  }

  function clear() {
    setMessages([]);
  }

  return { hydrated, messages, append, clear, setMessages };
}

export function helperAssistantReply(userInput: string): string {
  const help: Record<string, string> = {
    navigation:
      "Use the left sidebar to explore Media Ecosystem, Benchmarks, Investment, and Consumer insights. The Account group contains your Profile.",
    chat: "For full conversation threads, click ‘Ask Anything’ in the main menu to open the full chat.",
    profile:
      "Update your name, email, avatar, and password under Account → Profile. The image is saved locally.",
    auth: "Sign in or out via the user menu (top-right). Sessions last 7 days in this demo.",
  };
  const lower = userInput.toLowerCase();
  if (lower.includes("profile")) return help.profile;
  if (
    lower.includes("sign") ||
    lower.includes("auth") ||
    lower.includes("login")
  )
    return help.auth;
  if (lower.includes("chat") || lower.includes("ask")) return help.chat;
  if (
    lower.includes("nav") ||
    lower.includes("menu") ||
    lower.includes("where")
  )
    return help.navigation;
  return `Here to help with Disruptor. ${help.navigation} ${help.chat}`;
}
