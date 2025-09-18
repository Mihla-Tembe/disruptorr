import type { ChatThread } from "@/types"

export const sampleThreads: ChatThread[] = [
  {
    id: "sample-1",
    title: "Ancient Civilisations Overview",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    messages: [
      {
        id: "m1",
        role: "user",
        content: "Give me a quick overview of ancient civilisations",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: "m2",
        role: "assistant",
        content: "Here’s a concise overview covering Mesopotamia, Egypt, the Indus Valley, and ancient China…",
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
    ],
  },
  {
    id: "sample-2",
    title: "Media spend by channel",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    messages: [
      {
        id: "m3",
        role: "user",
        content: "Summarise spend by channel for Q2",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      },
      {
        id: "m4",
        role: "assistant",
        content: "Search ads rose 12%, social 9%, TV down 4%. Outdoor showed the strongest recovery at +15%.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ],
  },
]
