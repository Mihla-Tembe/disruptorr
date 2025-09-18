"use client"

import * as React from "react"
import { ToastProvider as RadixToastProvider } from "@radix-ui/react-toast"
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription } from "./toast"
import { useToast } from "./use-toast"

function ToastItems() {
  const { toasts, dismiss } = useToast()
  return (
    <>
      {toasts.map((t) => {
        const variant = t.variant ?? "default"
        const gradient =
          variant === "error"
            ? "bg-gradient-to-br from-[#FF4800] via-[#e64200] to-[#c93900] text-white border-0"
            : "bg-[#E0B5FF] text-[#1f0f3d] border-0"
        return (
        <Toast key={t.id} onOpenChange={(o) => !o && dismiss(t.id)} className={gradient}>
          {t.title ? <ToastTitle>{t.title}</ToastTitle> : null}
          {t.description ? <ToastDescription>{t.description}</ToastDescription> : null}
        </Toast>
        )
      })}
    </>
  )
}

export function Toaster() {
  return (
    <RadixToastProvider swipeDirection="right">
      <ToastProvider>
        <ToastItems />
        <ToastViewport />
      </ToastProvider>
    </RadixToastProvider>
  )
}
