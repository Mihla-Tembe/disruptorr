"use client"

import React, {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePathname } from "next/navigation"
import { Trash2 } from "lucide-react"
import AI from "@/public/ai-logo.svg"
import ParternBg from "@/public/pattern-bg.png"
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import Image from "next/image"
import CloseIcon from "@/public/icons/close.svg"
import { Card, CardContent } from "@/components/ui/card"
import { QUICK_PROMPTS } from "@/constants"

type Role = "user" | "assistant"

interface Message {
  id: string
  role: Role
  text: string
  time: number
}

function Bubble({ message }: { message: Message }) {
  const isUser = message.role === "user"
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`${
          isUser
            ? "bg-[#D7DEDD] animate-chat-in-right"
            : "bg-card animate-chat-in-left"
        } max-w-[75%] rounded-sm px-4 py-3 text-sm`}
      >
        {message.text}
      </div>
    </div>
  )
}

export function HelperChat() {
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [input, setInput] = useState("")
  const [unread, setUnread] = useState(0)
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const cached = sessionStorage.getItem("chatbot_messages")
      return cached ? (JSON.parse(cached) as Message[]) : []
    } catch {
      return []
    }
  })
  const [isTyping, setIsTyping] = useState(false)

  const pathname = usePathname()
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const prevPath = useRef<string | null>(null)

  // --- endpoint fetch ---
  async function fetchBotReply(userText: string): Promise<string> {
    try {
      const origin = window.location.origin
      const endpoint = origin.includes("localhost")
        ? "http://us-central1-localhost:3000/vdc200007-disruptor-prod/chat"
        : "https://us-central1-vdc200007-disruptor-prod.cloudfunctions.net/chat"

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userText }),
      })

      const text = await res.text()
      console.log("Raw response:", text)

      let data
      try {
        data = JSON.parse(text)
      } catch {
        throw new Error("Server did not return valid JSON")
      }

      return data.reply || "Sorry, no reply received."
    } catch (err) {
      console.error("Fetch error:", err)
      return "Error contacting the assistant."
    }
  }

  // --- persist messages ---
  useEffect(() => {
    sessionStorage.setItem("chatbot_messages", JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, isTyping])

  function pushMessage(role: Role, text: string) {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role, text: text.trim(), time: Date.now() },
    ])
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return

    pushMessage("user", text)
    setInput("")
    setIsTyping(true)

    const reply = await fetchBotReply(text)
    pushMessage("assistant", reply)
    setIsTyping(false)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as FormEvent)
    }
  }

  function openPanel() {
    setOpen(true)
    setShow(true)
  }

  function closePanel(immediate = false) {
    setOpen(false)
    if (immediate) setShow(false)
    else setTimeout(() => setShow(false), 260)
  }

  // --- UI render ---
  return (
    <>
      {/* Toggle button */}
      {!pathname?.startsWith("/dashboard/chat") && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                aria-label="Open helper chat"
                onClick={() => openPanel()}
                className="fixed bottom-6 right-6 z-40 rounded-full bg-[#E0B5FF] hover:bg-[#C380FF] p-4 shadow-lg transition-transform active:scale-95 hover:scale-[1.03]"
              >
                <Image src={AI.src} alt="AI" width={22} height={22} />
                {unread > 0 ? (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center">
                    {unread}
                  </span>
                ) : null}
              </button>
            </TooltipTrigger>
            <TooltipContent>Helper chat — press ? to open</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Slide-over panel */}
      {show && (
        <div className="fixed inset-0 z-50">
          <div
            className={`absolute inset-0 bg-black/30 ${
              open ? "animate-overlay-fade-in" : "animate-overlay-fade-out"
            }`}
            onClick={() => closePanel()}
            aria-hidden
          />
          <aside
            className={`absolute bottom-6 right-6 h-[70vh] w-[92vw] sm:w-[420px] bg-white text-black shadow-2xl flex flex-col ${
              open
                ? "animate-helper-slide-in"
                : "animate-helper-slide-out"
            } rounded-2xl overflow-hidden`}
          >
            <div className="absolute inset-0 pointer-events-none opacity-80">
              <Image src={ParternBg.src} alt="" fill className="object-cover" />
            </div>

            {/* header */}
            <header className="relative flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
              <div className="flex items-center gap-2">
                <Image src={AI.src} alt="AI" width={18} height={18} />
                <span className="font-semibold">Assistant</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Clear"
                  onClick={() => setMessages([])}
                >
                  <Trash2 className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Close"
                  onClick={() => closePanel()}
                >
                  <Image
                    src={CloseIcon}
                    alt=""
                    width={16}
                    height={16}
                    className="h-4 w-4"
                    aria-hidden={true}
                  />
                </Button>
              </div>
            </header>

            {/* messages */}
            <div className="relative flex-1 min-h-0">
              <ScrollArea className="h-full flex-1">
                <div
                  ref={viewportRef}
                  className="relative z-10 flex flex-col gap-4 p-4"
                >
                  <Suggestions onPick={(t) => setInput(t)} />
                  {messages.map((m) => (
                    <Bubble key={m.id} message={m} />
                  ))}
                  {isTyping && (
                    <div className="text-xs text-gray-500">Assistant is typing…</div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* input */}
            <form
              onSubmit={handleSubmit}
              className="relative z-10 border-t p-2 flex items-center gap-2 bg-white/70 backdrop-blur-sm"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask a quick question…"
                className="flex-1"
                autoFocus
              />
              <Button type="submit" aria-label="Send">
                Send
              </Button>
            </form>

            <p className="relative z-10 px-4 pb-4 text-center text-[11px] text-black/70">
              AI generated content may be incorrect.
            </p>
          </aside>
        </div>
      )}
    </>
  )
}

function Suggestions({ onPick }: { onPick: (text: string) => void }) {
  const pathname = usePathname()
  let items: string[] = [...QUICK_PROMPTS.base]
  if (pathname?.startsWith("/dashboard/profile"))
    items = [...QUICK_PROMPTS.profile, ...items]

  return (
    <div className="mb-2">
      <div className="text-xs uppercase tracking-wide text-emerald-900/80 mb-3 font-semibold">
        Quick prompts
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((text, i) => (
          <Card
            key={i}
            className="border-emerald-600/20 hover:border-emerald-600/40 transition-colors bg-white/90 rounded-none"
          >
            <button
              className="w-full text-left"
              onClick={() => onPick(text)}
              type="button"
            >
              <CardContent className="py-2 px-3 text-[13px] leading-snug rounded-none">
                {text}
              </CardContent>
            </button>
          </Card>
        ))}
      </div>
    </div>
  )
}
