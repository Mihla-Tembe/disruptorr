import Link from "next/link";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CTA_GET_INSIGHTS } from "@/constants";
import type { Feature } from "@/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ReadMoreIcon from "@/public/icons/right-read-more-icon.svg";

export function FeatureCard({ feature }: { feature: Feature }) {
   const isAiVariant = feature.variant === "ai";
   const ctaLabel = feature.ctaLabel ?? CTA_GET_INSIGHTS;

   return (
      <Card
         className={cn(
            "flex h-full flex-col border-0 border-r border-r-zinc-400 bg-transparent text-black shadow-none last:border-0 animate-chat-in-left !rounded-none",
            isAiVariant &&
               "relative overflow-hidden border border-white/10 bg-gradient-to-br from-[#100926] via-[#2d1662] to-[#020617] text-white shadow-[0_25px_70px_-35px_rgba(124,58,237,0.85)] !rounded-none"
         )}>
         {isAiVariant ? (
            <>
               <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.25),transparent_55%)]" />
               <div className="pointer-events-none absolute -top-24 right-[-20%] h-72 w-72 rounded-full bg-emerald-400/40 blur-3xl" />
            </>
         ) : null}

         <CardHeader
            className={cn(
               "px-0 pr-4 pb-3 pt-0",
               isAiVariant && "relative z-10 px-6 pb-5 pt-7"
            )}>
            {feature.badge ? (
               <span
                  className={cn(
                     "mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em]",
                     isAiVariant
                        ? "border-white/30 bg-white/10 text-white"
                        : "border-emerald-700/40 bg-emerald-100 text-emerald-800"
                  )}>
                  {feature.badge}
               </span>
            ) : null}
            <CardTitle
               className={cn(
                  "pb-4 text-black dark:text-emerald-100",
                  isAiVariant &&
                     "pb-3 font-semibold text-white sm:text-3xl text-2xl space-grotesk"
               )}>
               {feature.title}
            </CardTitle>
            <CardDescription
               className={cn(
                  "text-black dark:text-emerald-200",
                  isAiVariant && "text-white/80"
               )}>
               {feature.description}
            </CardDescription>
         </CardHeader>
         <CardContent
            className={cn(
               "mt-auto px-0 pb-0 pt-0",
               isAiVariant && "relative z-10 px-6 pb-6"
            )}>
            <Button
               asChild
               variant="link"
               className={cn(
                  "px-0 font-bold text-emerald-800 dark:text-emerald-400",
                  isAiVariant &&
                     "mt-6 w-full justify-center border border-white/20 bg-white text-slate-900 hover:bg-white/90 !rounded-full !px-6 !py-3 no-underline"
               )}>
               <Link
                  href={feature.href}
                  className={cn(
                     "!px-0",
                     isAiVariant &&
                        "flex w-full items-center justify-center gap-2 text-sm font-semibold !text-slate-900"
                  )}>
                  {ctaLabel}
                  <Image
                     src={ReadMoreIcon}
                     alt=""
                     width={18}
                     height={18}
                     className="h-[18px] w-[18px]"
                     aria-hidden={true}
                  />
               </Link>
            </Button>
         </CardContent>
      </Card>
   );
}
