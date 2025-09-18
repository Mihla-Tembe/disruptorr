import type { TermsSection } from "@/types";
export { relatedBlogs } from "@/data/blogs";

export const TERMS_UPDATED_AT = "September 18, 2025";

export const termsSections: TermsSection[] = [
  {
    heading: "Please read this thoroughly",
    paragraphs: [
      "These Terms & Conditions outline the rules and expectations that keep Disruptor secure, reliable, and aligned with our shared goals.",
      "By accessing the platform or any of the insights provided, you agree to honor these guidelines for the benefit of the entire community.",
    ],
  },
  {
    heading: "Disclaimer",
    paragraphs: [
      "We work hard to surface the most accurate intelligence possible. Still, business environments shift quickly, so you should validate major decisions with your internal teams.",
    ],
    bullets: [
      "Disruptor delivers directional recommendations—not absolute guarantees.",
      "You are accountable for how you act on the insights and summaries generated across dashboards, chat, and reports.",
      "All data visualisations remain subject to change as new signals or methodology updates arrive.",
    ],
  },
  {
    heading: "Use of the platform",
    paragraphs: [
      "You are responsible for safeguarding your credentials, respecting data governance policies, and using the dashboards in accordance with your organisation's agreements.",
    ],
    orderedList: [
      "Keep access personalised: do not share your login with unauthorised teammates.",
      "Limit downloads and exports to business-critical use cases.",
      "Avoid uploading content that violates privacy, intellectual property, or compliance obligations.",
    ],
  },
  {
    heading: "Data stewardship",
    paragraphs: [
      "Every dataset, benchmark, and conversational response is curated to empower smarter decision-making.",
      "Help us maintain that standard by reporting anomalies, misclassifications, or suspicious activity to the Disruptor support channel.",
    ],
  },
  {
    heading: "Updates and notifications",
    paragraphs: [
      "We refresh these terms whenever a new capability, partnership, or compliance obligation is introduced.",
      "If an update materially changes how we process or share information, we will notify you through the in-app announcements.",
    ],
  },
  {
    heading: "Need some help?",
    paragraphs: [
      "Reach out to your Disruptor success partner or email support@disruptor.app so we can jump in quickly.",
      "For urgent platform access issues, please use the Ask Anything assistant to escalate in real time while we follow up via email.",
    ],
  },
];
