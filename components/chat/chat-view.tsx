"use client";

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatBubble } from "./chat-message";
import { ChatComposer } from "./chat-composer";
import Link from "next/link";
import {
   useThreads,
   appendMessage,
   fetchBotReply,
} from "@/lib/chat-store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LINK_BACK_TO_HOME, BTN_NEW_CHAT } from "@/constants";
import Image from "next/image";
import BackHomeIcon from "@/public/icons/back-home-icon.svg";
import CreateIcon from "@/public/icons/create.svg";

export function ChatView({ threadId }: { threadId: string }) {
   const { threads, update, newThread } = useThreads();
   const router = useRouter();
   const thread = React.useMemo(
      () => threads.find((t) => t.id === threadId),
      [threads, threadId]
   );
   const viewportRef = React.useRef<HTMLDivElement>(null);

   React.useEffect(() => {
      // scroll to bottom on thread change
      viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight });
   }, [threadId]);

   React.useEffect(() => {
      // autoscroll as messages arrive
      const id = setTimeout(() => {
         viewportRef.current?.scrollTo({
            top: viewportRef.current.scrollHeight,
            behavior: "smooth",
         });
      }, 0);
      return () => clearTimeout(id);
   }, [thread?.messages.length]);

   const [isTyping, setIsTyping] = React.useState(false)

   async function handleSend(text: string) {
      // append user message immediately
      update((prev) =>
        appendMessage(prev, threadId, { role: "user", content: text })
      );
      setIsTyping(true)
      // fetch assistant reply
      const reply = await fetchBotReply(text);
    
      // append assistant reply once ready
      update((prev) =>
        appendMessage(prev, threadId, {
          role: "assistant",
          content: reply,
        })
      );

      setIsTyping(false)
    }

   if (!thread) return null;

   return (
      <div className="mx-auto w-full">
         <div className="sticky top-0 z-10 -mt-2 mb-2 flex items-center gap-6 rounded-b-xl pb-6">
           <Link
               href="/dashboard"
               className="inline-flex items-center gap-2 text-xl font-bold text-emerald-900">
               <Image
                  src={BackHomeIcon}
                  alt=""
                  width={20}
                  height={20}
                  className="h-5 w-6"
                  aria-hidden={true}
               />
               {LINK_BACK_TO_HOME}
           </Link>
           <Button
              variant="secondary"
              onClick={() => {
                 const t = newThread();
                 router.push(`/dashboard/chat/${t.id}`);
              }}
              className="rounded-none bg-primary hover:bg-primary/90 transition-colors text-white px-8 py-4">
               <Image
                  src={CreateIcon}
                  alt=""
                  width={16}
                  height={16}
                  className="mr-1 h-4 w-4"
                  aria-hidden={true}
               />
               {BTN_NEW_CHAT}
           </Button>
         </div>
         <div
            className={`rounded-2xl ${
               thread.messages.length === 0
                  ? "flex flex-col justify-end h-[60vh] max-w-3xl mx-auto"
                  : "h-[75vh]"
            }`}>
            <ScrollArea
               className={`pb-6 ${
                  thread.messages.length === 0 ? "" : "h-[70vh]"
               }`}>
               <div ref={viewportRef} className="flex flex-col gap-6 p-2">
                  {thread.messages.length === 0 ? (
                     <div className="flex flex-col">
                        <h1 className="space-grotesk text-6xl leading-18 mb-2">
                           Where questions spark clarity and exploration powers
                           impact
                        </h1>
                     </div>
                  ) : (
                     thread.messages.map((m) => (
                        <ChatBubble
                           key={m.id}
                           message={m}
                           threadId={threadId}
                        />
                     ))
                  )}

                  {/* ✅ AI is typing indicator */}
                  {isTyping && (
                     <div className="text-x text-gray-500 px-2">
                        Responding…
                     </div>
                  )}
               </div>
            </ScrollArea>
            <ChatComposer onSend={handleSend} />
            <p className="mt-3 text-center text-xs text-muted-foreground">
               AI generated content may be incorrect.
            </p>
         </div>
      </div>
   );
}
