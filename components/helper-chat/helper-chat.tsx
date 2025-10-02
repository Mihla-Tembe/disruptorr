"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import { Trash2 } from "lucide-react";
import {
  useHelperChat,
  helperAssistantReply,
  type HelperMessage,
} from "@/lib/helper-chat-store";
import AI from "@/public/ai-logo.svg";
import ParternBg from "@/public/pattern-bg.png";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import Image from "next/image";
import CloseIcon from "@/public/icons/close.svg";

function Bubble({ message }: { message: HelperMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`${isUser ? "bg-[#D7DEDD] animate-chat-in-right" : "bg-card animate-chat-in-left"} max-w-[75%] rounded-sm px-4 py-3 text-sm`}
      >
        {message.content}
      </div>
    </div>
  );
}

export function HelperChat() {
  const { messages, append, clear } = useHelperChat();
  const [open, setOpen] = React.useState(false); // logical open/closed
  const [show, setShow] = React.useState(false); // mounted for exit animation
  const [text, setText] = React.useState("");
  const [unread, setUnread] = React.useState(0);
  const pathname = usePathname();
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const prevPath = React.useRef<string | null>(null);

  React.useEffect(() => {
    // Hide immediately on full chat pages
    if (pathname?.startsWith("/dashboard/chat")) {
      setOpen(false);
      setShow(false);
    }
    // On any route change within the dashboard, close with animation if open
    else if (
      prevPath.current !== null &&
      pathname !== prevPath.current &&
      open
    ) {
      setOpen(false);
      setTimeout(() => setShow(false), 260);
    }
    prevPath.current = pathname ?? null;
  }, [pathname, open]);

  React.useEffect(() => {
    // Load persisted open preference
    try {
      const saved = localStorage.getItem("disruptor.helper.open.v1");
      if (saved !== null) setOpen(saved === "1");
    } catch {}
  }, []);

  React.useEffect(() => {
    // Keyboard shortcuts: ? to open, Esc to close (avoid when typing in inputs)
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const typing =
        tag === "input" ||
        tag === "textarea" ||
        (e.target as HTMLElement)?.isContentEditable;
      if (!typing && (e.key === "?" || (e.key === "/" && e.shiftKey))) {
        setOpen(true);
      }
      if (open && e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  React.useEffect(() => {
    // Reset unread when opening and scroll to bottom
    if (open) {
      setUnread(0);
      setTimeout(() => {
        viewportRef.current?.scrollTo({
          top: viewportRef.current.scrollHeight,
        });
      }, 0);
    }
    try {
      localStorage.setItem("disruptor.helper.open.v1", open ? "1" : "0");
    } catch {}
  }, [open]);

  function send(forceText?: string) {
    const value = (forceText ?? text).trim();
    if (!value) return;
    append("user", value);
    setText("");
    setTimeout(() => {
      append("assistant", helperAssistantReply(value));
      if (!open) setUnread((n) => n + 1);
    }, 250);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function openPanel() {
    setOpen(true);
    setShow(true);
  }

  function closePanel(immediate = false) {
    setOpen(false);
    if (immediate) setShow(false);
    else setTimeout(() => setShow(false), 260);
  }

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
            className={`absolute inset-0 bg-black/30 ${open ? "animate-overlay-fade-in" : "animate-overlay-fade-out"}`}
            onClick={() => closePanel()}
            aria-hidden
          />
          <aside
            className={`absolute bottom-6 right-6 h-[70vh] w-[92vw] sm:w-[420px] bg-white text-black shadow-2xl flex flex-col ${open ? "animate-helper-slide-in" : "animate-helper-slide-out"} rounded-2xl overflow-hidden`}
          >
            <div className="absolute inset-0 pointer-events-none opacity-80">
              <Image src={ParternBg.src} alt="" fill className="object-cover" />
            </div>
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
                  onClick={() => clear()}
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
            <div className="relative flex-1 min-h-0">
              <ScrollArea className="h-full flex-1">
                <div
                  ref={viewportRef}
                  className="relative z-10 flex flex-col gap-4 p-4"
                >
                  <Suggestions onPick={(t) => send(t)} />
                  {messages.map((m) => (
                    <Bubble key={m.id} message={m} />
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="relative z-10 border-t p-2 flex items-center gap-2 bg-white/70 backdrop-blur-sm">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask a quick question…"
                className="flex-1"
                autoFocus
              />
              <Button onClick={() => send()} aria-label="Send">
                Send
              </Button>
            </div>
            <p className="relative z-10 px-4 pb-4 text-center text-[11px] text-black/70">
              AI generated content may be incorrect.
            </p>
          </aside>
        </div>
      )}
    </>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { QUICK_PROMPTS } from "@/constants";

function Suggestions({ onPick }: { onPick: (text: string) => void }) {
  const pathname = usePathname();
  const base = QUICK_PROMPTS.base;
  const profile = QUICK_PROMPTS.profile;
  const mediaUniverse = QUICK_PROMPTS.mediaUniverse;
  const channelFlow = QUICK_PROMPTS.channelFlow;
  const categorySignals = QUICK_PROMPTS.categorySignals;
  const clientPulse = QUICK_PROMPTS.clientPulse;
  const performanceBaselines = QUICK_PROMPTS.performanceBaselines;
  const impactIntelligenceHub = QUICK_PROMPTS.impactIntelligenceHub;
  const audienceDiscovery = QUICK_PROMPTS.audienceDiscovery;
  const insightStream = QUICK_PROMPTS.insightStream;

  let items: string[] = [...base];
  if (pathname?.startsWith("/dashboard/profile")) items = [...profile, ...base];
  else if (pathname?.startsWith("/dashboard/media-universe"))
    items = [...mediaUniverse, ...base];
  else if (pathname?.startsWith("/dashboard/channel-flow"))
    items = [...channelFlow, ...base];
  else if (pathname?.startsWith("/dashboard/category-signals"))
    items = [...categorySignals, ...base];
  else if (pathname?.startsWith("/dashboard/client-pulse"))
    items = [...clientPulse, ...base];
  else if (pathname?.startsWith("/dashboard/performance-baselines"))
    items = [...performanceBaselines, ...base];
  else if (pathname?.startsWith("/dashboard/impact-intelligence-hub"))
    items = [...impactIntelligenceHub, ...base];
  else if (pathname?.startsWith("/dashboard/audience-discovery"))
    items = [...audienceDiscovery, ...base];
  else if (pathname?.startsWith("/dashboard/insight-stream"))
    items = [...insightStream, ...base];
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
            <button className="w-full text-left" onClick={() => onPick(text)}>
              <CardContent className="py-2 px-3 text-[13px] leading-snug rounded-none">
                {text}
              </CardContent>
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
