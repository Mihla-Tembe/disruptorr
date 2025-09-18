import type { BlogArticle, RelatedBlog } from "@/types";

export const blogArticles: BlogArticle[] = [
   {
      id: "five-signals-reshaping-2026-media-mix",
      slug: "five-signals-reshaping-2026-media-mix",
      category: "Market Insights",
      title: "Five signals reshaping your 2026 media mix",
      author: "Aisha Laurent",
      authorAttribution: "Director of Media Intelligence, Disruptor",
      publishedOn: "Feb 12, 2026",
      readTime: "4 minute read",
      heroImage: "/blog2.jpg",
      pullQuote:
         "Teams that monitor creative saturation in real time are reallocating 18% of spend before inefficiency sets in.",
      body: [
         "The 2026 planning cycle is already being shaped by signal volume that would have been considered overwhelming just a few years ago. Disruptor processed more than 2.4 billion ad exposures across the category this quarter, revealing a handful of consistent patterns that high-performing teams are acting on now.",
         "First, linear TV erosion is accelerating unevenly. Local markets that over-index on live sports still defend CPMs, but peripheral placements are bleeding share to curated CTV bundles with dynamic creative swap-in. Your mix model needs to treat these as distinct entities, not as interchangeable video inventory.",
         "Second, the customer journey is no longer linear. Our path analysis highlights that audiences often bounce between influencer-led product drops and owned community forums before converting. Investing in conversational surfaces—especially those you can moderate—keeps the brand voice consistent while the channel mix shifts.",
         "Third, surplus frequency is creeping back. Creative fatigue shows up within 48 hours on high-intent segments, particularly when copy isn’t localised. Teams that pre-author variants with modular messaging are reallocating spend up to nine days faster than peers.",
         "Finally, the notion of a ‘national media plan’ is dissolving. Regional partners want proof that you can react to their micro-signals on demand. Building a playbook that encodes how you will shift budget when given new intelligence will help you close those contracts sooner.",
      ],
   },
   {
      id: "predictive-spend-models-outperform-plan",
      slug: "predictive-spend-models-outperform-plan",
      category: "AI Trends",
      title: "When predictive spend models outperform the plan",
      author: "Miguel Tan",
      authorAttribution: "Lead Data Scientist, Disruptor",
      publishedOn: "Jan 28, 2026",
      readTime: "6 minute read",
      heroImage: "/blog3.jpg",
      pullQuote:
         "Teams that unify planning and activation data into a single reinforcement loop release 27% more working budget in-quarter.",
      body: [
         "For years, predictive budget models were treated as directional inputs—nice to have posture checks that rarely moved the approved plan. That is changing fast. Reinforcement learning now tracks market shocks, supply signals, and creative performance in near real time, giving finance leaders enough confidence to unlock incremental dollars mid-flight.",
         "A key unlock is the ability to watch weighted opportunity scores evolve alongside your confidence interval. When a placement’s projected return surges, the model now flags which KPIs to monitor before shifting funds. This takes the conversation from ‘trust the black box’ to ‘trust these three metrics, week by week.’",
         "Another shift: clean room pipelines. By streaming first-party conversion data into the same loop that ingests audience quality metrics, we reduce the guesswork around causality. The model can tell you when performance is truly improving versus when you are simply drafting off a seasonal lift.",
         "Finally, predictive models are becoming collaborative. Planners can ask natural-language questions inside Disruptor—‘how much headroom is left on premium video for the growth segment?’—and get prescriptive direction that synchronises with trafficking teams. It’s not about removing the human; it’s about removing the copy/paste lag that used to make optimisation stale.",
         "The takeaway: treat your predictive model like a living playbook. Feed it signals, interrogate its assumptions, and loop the results back into creative and audience development. The teams doing this are the ones showing up to QBRs with both agility and precision already proven.",
      ],
   },
   {
      id: "customer-dna-next-activation",
      slug: "customer-dna-next-activation",
      category: "Technology",
      title: "How customer DNA shapes your next activation",
      author: "Pooja Desai",
      authorAttribution: "Head of Customer Science, Disruptor",
      publishedOn: "Dec 9, 2025",
      readTime: "5 minute read",
      heroImage: "/blog5.jpg",
      pullQuote:
         "True customer DNA blends declared intent with inferred behaviour—anything less leaves segments brittle the moment culture shifts.",
      body: [
         "Customer DNA is more than a lookalike seed. It is a living representation of how people explore, evaluate, and advocate. The organisations that activate it well understand that behavioural nuance can’t be captured in a single score or static persona.",
         "To map DNA effectively, combine panel-level curiosity data with observed interactions inside your owned surfaces. This dual view reveals where your audience still needs education and where they are already primed to evangelise.",
         "The next step is orchestration. When Disruptor spots a surge in curiosity around a new product attribute, we notify lifecycle teams and recommend the messaging sequences that have converted adjacent cohorts. That keeps product marketing, CRM, and media teams aligned without weekly war rooms.",
         "Remember that DNA evolves. Bring in qualitative insight by looping customer success notes and conversational intelligence into the profile. This provides context for outlier behaviour and ensures AI-generated segments respect cultural nuance.",
         "When you treat customer DNA as a shared asset—not just a media input—you unlock activations that feel personal without being invasive. The brands who master this are the ones audiences invite into their inbox, their playlists, and ultimately their lives.",
      ],
   },
];

export const relatedBlogs: RelatedBlog[] = blogArticles.map(
   ({ slug, category, title, publishedOn, readTime, heroImage }) => ({
      slug: `/news/${slug}`,
      category,
      title,
      publishedOn,
      readTime,
      image: heroImage,
   })
);

export function getArticleBySlug(slug: string) {
   return blogArticles.find((article) => article.slug === slug);
}
