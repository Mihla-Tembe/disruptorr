import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BackHomeIcon from "@/public/icons/back-home-icon.svg";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { RelatedBlogsCard } from "@/components/terms/related-blogs-card";
import { SupportCard } from "@/components/terms/support-card";
import { TermsHero } from "@/components/terms/terms-hero";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { blogArticles, getArticleBySlug, relatedBlogs } from "@/data/blogs";
import { LINK_BACK_TO_HOME } from "@/constants";

interface ArticlePageProps {
   params: { slug: string };
}

export function generateStaticParams() {
   return blogArticles.map(({ slug }) => ({ slug }));
}

export function generateMetadata({ params }: ArticlePageProps): Metadata {
   const article = getArticleBySlug(params.slug);
   if (!article) {
      return { title: "Article not found" };
   }

   return {
      title: `${article.title} | Disruptor Insights`,
      description: article.pullQuote,
   };
}

export default function ArticlePage({ params }: ArticlePageProps) {
   const article = getArticleBySlug(params.slug);

   if (!article) {
      notFound();
   }

   const articleSlugPath = `/news/${article.slug}`;
   const relatedArticles = relatedBlogs.filter(
      (blog) => blog.slug !== articleSlugPath
   );

   return (
      <DashboardLayout fullWidth contentClassName="w-full space-y-6 pb-24 pt-8">
         <div className="px-6 sm:px-10">
            <Button
               variant="ghost"
               size="sm"
               className="group h-auto px-0 text-base font-semibold text-emerald-700 transition-colors hover:text-emerald-900 dark:text-emerald-200 dark:hover:text-emerald-100"
               asChild>
               <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2">
                  <Image
                     src={BackHomeIcon}
                     alt=""
                     width={24}
                     height={20}
                     className="h-5 w-6 transition-transform duration-150 group-hover:-translate-x-0.5"
                     aria-hidden={true}
                  />
                  {LINK_BACK_TO_HOME}
               </Link>
            </Button>
         </div>

         <div>
            <TermsHero
               image={article.heroImage}
               alt={article.title}
               variant="plain"
            />
         </div>

         <div className="px-6 sm:px-10">
            <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
               <article className="space-y-10">
                  <header className="space-y-6">
                     <div className="inline-flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                        <span>{article.category}</span>
                        <span
                           className="h-2 w-2 rounded-full bg-emerald-400"
                           aria-hidden
                        />
                        <span className="inline-flex items-center gap-1 text-emerald-600/80 dark:text-emerald-200/80">
                           {article.publishedOn}
                        </span>
                        <span className="inline-flex items-center gap-1 text-emerald-600/80 dark:text-emerald-200/80">
                           {article.readTime}
                        </span>
                     </div>
                     <h1 className="text-3xl font-semibold text-slate-900 dark:text-emerald-100 md:text-4xl">
                        {article.title}
                     </h1>
                  </header>

                  <blockquote className="border-l-4 border-emerald-500 pl-5 text-lg font-medium text-slate-800 dark:text-emerald-100">
                     {article.pullQuote}
                  </blockquote>

                  <Separator className="bg-emerald-100" />

                  <div className="space-y-6 text-base leading-relaxed text-slate-700 dark:text-emerald-200">
                     {article.body.map((paragraph) => (
                        <p key={paragraph.substring(0, 32)}>{paragraph}</p>
                     ))}
                  </div>
               </article>

               <aside className="space-y-6">
                  {relatedArticles.length ? (
                     <RelatedBlogsCard blogs={relatedArticles} />
                  ) : null}
                  <SupportCard />
               </aside>
            </div>
         </div>
      </DashboardLayout>
   );
}
