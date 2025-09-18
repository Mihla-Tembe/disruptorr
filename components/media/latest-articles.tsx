"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import LeftIcon from "@/public/icons/left.svg";
import RightIcon from "@/public/icons/right.svg";
import RightReadMoreIcon from "@/public/icons/right-read-more-icon.svg";

import { blogArticles } from "@/data/blogs";
import type { BlogArticle } from "@/types";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
   Card,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";

function getPublishedTime(publishedOn: string) {
   const parsed = new Date(publishedOn);
   return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

type LatestArticlesProps = {
   headingTitle?: string;
};

export function LatestArticles({ headingTitle = "Latest Articles" }: LatestArticlesProps) {
   const categories = React.useMemo(() => {
      const unique = new Set(blogArticles.map((article) => article.category));
      return ["All", ...unique];
   }, []);

   const [activeCategory, setActiveCategory] = React.useState<string>("All");
   const [heroIndex, setHeroIndex] = React.useState<number>(0);
   const [outgoingArticle, setOutgoingArticle] =
      React.useState<BlogArticle | null>(null);

   const heroArticles = React.useMemo(() => {
      return [...blogArticles].sort(
         (a, b) =>
            getPublishedTime(b.publishedOn) - getPublishedTime(a.publishedOn)
      );
   }, []);

   const filteredArticles = React.useMemo(() => {
      const withinCategory =
         activeCategory === "All"
            ? blogArticles
            : blogArticles.filter(
                 (article) => article.category === activeCategory
              );
      return [...withinCategory].sort(
         (a, b) =>
            getPublishedTime(b.publishedOn) - getPublishedTime(a.publishedOn)
      );
   }, [activeCategory]);

   React.useEffect(() => {
      if (!heroArticles.length) {
         setOutgoingArticle(null);
         return;
      }

      if (heroIndex > heroArticles.length - 1) {
         setHeroIndex(0);
         setOutgoingArticle(null);
      }
   }, [heroArticles.length, heroIndex]);

   React.useEffect(() => {
      if (!outgoingArticle) return;
      const timeoutId = window.setTimeout(() => {
         setOutgoingArticle(null);
      }, 650);

      return () => window.clearTimeout(timeoutId);
   }, [outgoingArticle]);

   const heroArticle = heroArticles[heroIndex] ?? null;

   React.useEffect(() => {
      if (!heroArticle) {
         setOutgoingArticle(null);
      }
   }, [heroArticle]);

   const gridArticles = filteredArticles;

   const showEmptyState = filteredArticles.length === 0;

   const goPrevious = React.useCallback(() => {
      if (heroArticles.length <= 1 || !heroArticle) return;
      setOutgoingArticle(heroArticle);

      const previousIndex =
         heroIndex === 0 ? heroArticles.length - 1 : heroIndex - 1;
      setHeroIndex(previousIndex);
   }, [heroArticles.length, heroArticle, heroIndex]);

   const goNext = React.useCallback(() => {
      if (heroArticles.length <= 1 || !heroArticle) return;
      setOutgoingArticle(heroArticle);

      const nextIndex = (heroIndex + 1) % heroArticles.length;
      setHeroIndex(nextIndex);
   }, [heroArticles.length, heroArticle, heroIndex]);

   return (
      <div className="space-y-8">
         <section className="relative overflow-hidden bg-slate-900 text-white">
            <div className="relative h-[520px] w-full overflow-hidden md:h-[500px]">
               {heroArticle ? (
                  <>
                     {outgoingArticle ? (
                        <HeroSlide
                           key={`outgoing-${outgoingArticle.id}`}
                           article={outgoingArticle}
                           variant="exit"
                        />
                     ) : null}
                     <HeroSlide
                        key={`active-${heroArticle.id}`}
                        article={heroArticle}
                        variant="enter"
                     />

                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={goPrevious}
                        className="absolute left-6 top-1/2 z-20 -translate-y-1/2 rounded-none bg-white/20 text-white transition hover:bg-white/30">
                        <Image
                           src={LeftIcon}
                           alt=""
                           width={20}
                           height={20}
                           className="h-5 w-5"
                           aria-hidden={true}
                        />
                        <span className="sr-only">Previous article</span>
                     </Button>
                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={goNext}
                        className="absolute right-6 top-1/2 z-20 -translate-y-1/2 rounded-none bg-white/20 text-white transition hover:bg-white/30">
                        <Image
                           src={RightIcon}
                           alt=""
                           width={20}
                           height={20}
                           className="h-5 w-5"
                           aria-hidden={true}
                        />
                        <span className="sr-only">Next article</span>
                     </Button>
                  </>
               ) : (
                  <div className="flex h-full items-center justify-center px-6 text-sm text-white/80">
                     No articles available yet. Try selecting another filter.
                  </div>
               )}
            </div>
         </section>

         <section className="space-y-6 px-6 sm:px-10">
            <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6">
               <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-200">
                     {headingTitle}
                  </p>
               </div>
               <div className="flex flex-wrap items-center gap-2">
                  {categories.map((category) => {
                     const isActive = activeCategory === category;
                     return (
                        <button
                           key={category}
                           type="button"
                           onClick={() => {
                              setActiveCategory(category);
                              setOutgoingArticle(null);
                           }}
                           className={cn(
                              buttonVariants({
                                 variant: isActive ? "default" : "ghost",
                                 size: "sm",
                              }),
                              "border border-slate-200 px-4 transition-colors duration-200 hover:bg-[#E0B5FF] dark:border-emerald-500/40",
                              isActive
                                 ? "text-white hover:text-white"
                                 : "text-emerald-700 hover:text-[#0B3F37] dark:text-emerald-200 dark:hover:text-[#0B3F37]"
                           )}>
                           {category}
                        </button>
                     );
                  })}
               </div>
            </div>

            <div className="mx-auto w-full max-w-6xl">
               {showEmptyState ? (
                  <Card className="border-dashed border-emerald-200 bg-emerald-50/80 text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-100">
                     <CardHeader>
                        <CardTitle>No articles found</CardTitle>
                        <CardDescription>
                           Adjust your filters to explore more insights from the
                           Disruptor team.
                        </CardDescription>
                     </CardHeader>
                  </Card>
               ) : (
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                     {gridArticles.map((article, index) => (
                        <Card
                           key={`${article.id}-${index}`}
                           className="group flex h-full flex-col overflow-hidden rounded-none border-slate-200 bg-white/95 shadow-sm transition hover:-translate-y-1 dark:border-emerald-500/20 dark:bg-slate-950/50 dark:shadow-[0_12px_40px_-20px_rgba(16,185,129,0.35)]">
                           <div className="relative aspect-[16/11] w-full overflow-hidden">
                              <Image
                                 src={article.heroImage}
                                 alt={article.title}
                                 fill
                                 className="object-cover transition duration-500 group-hover:scale-105"
                              />
                           </div>
                           <CardHeader className="flex flex-1 flex-col gap-3 p-6 pb-4">
                              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-200">
                                 {article.category}
                              </span>
                              <CardTitle className="space-grotesk text-xl font-semibold text-slate-900 dark:text-emerald-100">
                                 {article.title}
                              </CardTitle>
                              <CardDescription className="text-sm text-slate-600 dark:text-emerald-200">
                                 {article.pullQuote}
                              </CardDescription>
                           </CardHeader>
                           <CardFooter className="mt-auto border-t border-slate-100 px-6 py-4 dark:border-emerald-500/20">
                              <Link
                                 href={`/news/${article.slug}`}
                                 className="flex w-full items-center justify-between text-sm font-semibold text-emerald-700 transition hover:text-emerald-900 dark:text-emerald-200 dark:hover:text-emerald-100">
                                 <span>Read more</span>
                                 <Image
                                    src={RightIcon}
                                    alt=""
                                    width={16}
                                    height={16}
                                    className="h-4 w-4"
                                    aria-hidden={true}
                                 />
                              </Link>
                           </CardFooter>
                        </Card>
                     ))}
                  </div>
               )}
            </div>
         </section>
      </div>
   );
}

type HeroSlideVariant = "enter" | "exit";

function HeroSlide({
   article,
   variant,
}: {
   article: BlogArticle;
   variant: HeroSlideVariant;
}) {
   return (
      <div
         aria-hidden={variant === "exit"}
         className={cn(
            "absolute inset-0 will-change-transform",
            variant === "enter"
               ? "z-10 pointer-events-auto animate-hero-slide-in"
               : "z-0 pointer-events-none animate-hero-slide-out"
         )}>
         <Image
            src={article.heroImage}
            alt={article.title}
            fill
            priority={variant === "enter"}
            className="object-cover"
         />
         <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
         <div
            className={cn(
               "absolute left-1/2 top-1/2 z-10 w-full max-w-[65%] -translate-x-1/2 -translate-y-1/2 space-y-6 p-8 text-center will-change-transform md:p-12",
               variant === "enter"
                  ? "animate-hero-content-in"
                  : "animate-hero-content-out"
            )}>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80 dark:text-emerald-200">
               {article.category}
            </div>
            <div className="space-y-3">
               <h1 className="space-grotesk text-3xl font-semibold leading-tight text-white dark:text-emerald-100 md:text-5xl">
                  {article.title}
               </h1>
               <p className="text-sm text-white/80 dark:text-emerald-200 md:text-base">
                  {article.pullQuote}
               </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-white/70 dark:text-emerald-200/70">
               <span className="inline-flex items-center gap-2">
                  {article.publishedOn}
               </span>
               <span className="inline-flex items-center gap-2">
                  {article.readTime}
               </span>
            </div>
            <Button
               asChild
               className="mx-auto bg-white text-slate-900 hover:bg-white/90"
               tabIndex={variant === "exit" ? -1 : undefined}>
               <Link href={`/news/${article.slug}`}>
                  Read article
                  <Image
                     src={RightReadMoreIcon}
                     alt=""
                     width={16}
                     height={16}
                     className="ml-2 h-4 w-4"
                     aria-hidden={true}
                  />
               </Link>
            </Button>
         </div>
      </div>
   );
}
