import type { Feature, NavGroup } from "@/types";

export const features: Feature[] = [
  {
    title: "Media Universe",
    description:
      "A dynamic view into the media universe—go beyond surface-level trends to uncover actionable insights and build smarter pipelines for new business  ",
    href: "/dashboard/media-universe",
  },
  {
    title: "Performance Baselines",
    description:
      "A comprehensive view of media performance—use these insights to align your proposals with the right metrics and pricing, making them clear, competitive, and compelling.",
    href: "/dashboard/channel-flow",
  },
  {
    title: "Impact Intelligence hub",
    description:
      "A deep dive into client trends—helping you quickly identify high- and low-performing clients, year-on-year shifts, and focus sales efforts where they’ll drive the most growth.",
    href: "/dashboard/category-signals",
  },
  {
    title: "Audience Discovery",
    description:
      "Strategic audience insights designed to mirror how Dentsu builds media strategies—helping you to improve proposal conversion.",
    href: "/dashboard/client-pulse",
  },
];

export const navGroups: NavGroup[] = [
   {
      id: "start",
      label: "Start",
      href: "/dashboard",
   },
   {
      id: "media-universe",
      label: "Media Universe",
      items: [
             {
                label: "Channel Flow",
                href: "/dashboard/channel-flow",
             },
             {
               label: "Category Signals",
               href: "/dashboard/category-signals",
            },
             {
                label: "Client Pulse",
                href: "/dashboard/client-pulse",
             },
          ],
   },
   // {
   //    id: "channel-flow",
   //    label: "Channel Flow",
   //    href: "/dashboard/channel-flow",
   // },
   // {
   //    id: "category-signals",
   //    label: "Category Signals",
   //    href: "/dashboard/category-signals",
   // },
   // {
   //    id: "client-pulse",
   //    label: "Client Pulse",
   //    href: "/dashboard/client-pulse",
   // },
   {
      id: "performance-baselines",
      label: "Performance Baselines",
      href: "/dashboard/performance-baselines",
      
   },
   {
      id: "impact-intelligence-hub",
      label: "Impact Intelligence Hub",
      href: "/dashboard/impact-intelligence-hub",
   },
   // {
   //    id: "audience-discovery",
   //    label: "Audience Discovery",
   //    href: "/dashboard/audience-discovery",
   // },
   {
      id: "insight-stream",
      label: "Articles",
      href: "/dashboard/insight-stream",
   },
   {
      id: "ask-anything",
      label: "Ask Anything",
      href: "/dashboard/chat",
   },
];

// Convenience re-exports for constants defined in other modules
export { sampleThreads } from "@/lib/chat-samples";

// Shared UI strings
export const HERO_TITLE = "Pioneering Disruption";
export const HERO_SUBTITLE =
  "Your gateway to dynamic visualisations, powered by embedded AI that delivers the insight, precision, and agility needed to drive smarter decisions and sustainable growth across the media ecosystem";

export const CTA_GET_INSIGHTS = "Launch Insights";

export const LABEL_MAIN_MENU = "Navigator";
export const LABEL_COMING_SOON = "Coming soon";
export const LABEL_CHAT_HISTORY = "Chat History";
export const LABEL_NO_CHATS_YET = "No chats yet";
export const BTN_UNDO = "Undo";
export const BTN_NEW_CHAT = "New chat";
export const LINK_BACK_TO_HOME = "Back to Home";
export const ASK_ANYTHING_LABEL = "Ask Anything";
export const CHAT_EMPTY_PROMPT = `Where questions spark 
clarity—and exploration
powers impac`;

export const PLACEHOLDER_SEARCH = "Search";

export const QUICK_PROMPTS = {
  base: ["What can I explore on this page?"],
  profile: ["How do I update my profile?", "How do I change my password?"],
  mediaUniverse: [
    "Summarise the latest Media Universe insights.",
    "Where are we seeing the biggest channel swings?",
  ],
  channelFlow: [
    "Highlight channels with accelerated spend.",
    "Which channels are underperforming week over week?",
  ],
  categorySignals: [
    "Show emerging trends across categories.",
    "Which categories need attention right now?",
  ],
  clientPulse: [
    "Identify clients with the strongest growth.",
    "Who needs a retention intervention?",
  ],
  performanceBaselines: [
    "Pull the latest performance baselines.",
    "How do this month's results compare to baseline?",
  ],
  impactIntelligenceHub: [
    "What stories stand out in Impact Intelligence?",
    "Surface notable shifts across the hub dashboards.",
  ],
  audienceDiscovery: [
    "Which audiences expanded most recently?",
    "Show fresh audience discoveries worth sharing.",
  ],
  insightStream: [
    "What are the newest articles in Insight Stream?",
    "Summarise the headline insights from Insight Stream.",
  ],
} as const;
export const ARIA_SEARCH_NAV = "Search navigation";
export const ARIA_SEARCH_CHATS = "Search chats";
