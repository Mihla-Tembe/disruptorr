"use client";

import * as React from "react";
import { sampleThreads } from "@/lib/chat-samples";
import type { ChatThread, ChatMessage, ChatMessageMeta } from "@/types";

const STORAGE_KEY = "disruptor.chat.threads.v1";

function readThreads(): ChatThread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatThread[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeThreads(threads: ChatThread[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
}

export function createThread(title = "New Chat"): ChatThread {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function appendMessage(
  threads: ChatThread[],
  threadId: string,
  msg: Omit<ChatMessage, "id" | "createdAt">
): ChatThread[] {
  const next = threads.map((t) => {
    if (t.id !== threadId) return t;
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      role: msg.role,
      content: msg.content,
      createdAt: new Date().toISOString(),
      meta: msg.meta ?? {},
    };
    const title =
      t.messages.length === 0 ? truncateTitle(msg.content) : t.title;
    return {
      ...t,
      title,
      messages: [...t.messages, message],
      updatedAt: message.createdAt,
    };
  });
  return next;
}

export function updateMessageMeta(
  threads: ChatThread[],
  threadId: string,
  messageId: string,
  meta: ChatMessageMeta
): ChatThread[] {
  return threads.map((t) => {
    if (t.id !== threadId) return t;
    const messages = t.messages.map((m) =>
      m.id === messageId ? { ...m, meta: { ...m.meta, ...meta } } : m
    );
    return { ...t, messages, updatedAt: new Date().toISOString() };
  });
}

function truncateTitle(s: string, n = 42) {
  const t = s.trim().replace(/\s+/g, " ");
  return t.length > n ? `${t.slice(0, n - 1)}…` : t || "New Chat";
}

export function useThreads() {
  const [threads, setThreads] = React.useState<ChatThread[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const fromStorage = readThreads();
    if (fromStorage.length === 0) {
      // Seed with samples on first use
      writeThreads(sampleThreads);
      setThreads(sampleThreads);
    } else {
      setThreads(fromStorage);
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (hydrated) writeThreads(threads);
  }, [threads, hydrated]);

  const ensureThread = React.useCallback(
    (id?: string): ChatThread | null => {
      if (!hydrated) return null;
      if (threads.length === 0) {
        const t = createThread();
        setThreads([t]);
        return t;
      }
      if (id) {
        const found = threads.find((t) => t.id === id);
        return found ?? threads[0];
      }
      return threads
        .slice()
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
    },
    [threads, hydrated]
  );

  const update = React.useCallback(
    (mutator: (prev: ChatThread[]) => ChatThread[]) => {
      setThreads((prev) => mutator(prev));
    },
    [setThreads]
  );

  const removeThread = React.useCallback((id: string) => {
    setThreads((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const newThread = React.useCallback(() => {
    const t = createThread();
    setThreads((prev) => [t, ...prev]);
    return t;
  }, []);

  return { hydrated, threads, setThreads, update, ensureThread, removeThread, newThread };
}

/**
 * Real assistant reply via your backend
 */
export async function fetchBotReply(userText: string): Promise<string> {
  try {
    const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
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
