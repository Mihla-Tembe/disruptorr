import Link from "next/link";
import Image from "next/image";
import BackHomeIcon from "@/public/icons/back-home-icon.svg";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { TermsHero } from "@/components/terms/terms-hero";
import { TermsSectionList } from "@/components/terms/terms-section-list";
import { RelatedBlogsCard } from "@/components/terms/related-blogs-card";
import { SupportCard } from "@/components/terms/support-card";
import heroImage from "@/public/terms-and-condition-bg.jpg";
import { LINK_BACK_TO_HOME } from "@/constants";
import { TERMS_UPDATED_AT, relatedBlogs, termsSections } from "@/data/terms";

export default function TermsPage() {
  return (
    <DashboardLayout fullWidth contentClassName="w-full space-y-10 pb-24 pt-8">
      <div className="px-6 sm:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <Button
            variant="ghost"
            size="sm"
            className="group h-auto px-0 text-base font-semibold text-emerald-700 transition-colors hover:text-emerald-900 dark:text-[#66ffa3] dark:hover:text-[#53e590]"
            asChild
          >
            <Link href="/dashboard" className="inline-flex items-center gap-2">
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
      </div>

      <TermsHero
        image={heroImage}
        alt="Terms and conditions background"
        variant="plain"
      />

      <div className="px-6 sm:px-10">
        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section aria-labelledby="terms-heading" className="space-y-8">
            <header className="space-y-3">
              <div className="inline-flex items-center gap-3 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:bg-[#04271f] dark:text-[#66ffa3]">
                <span>Please read this thoroughly</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 dark:bg-[#66ffa3]" aria-hidden />
                <span className="dark:text-[#66ffa3]">Updated {TERMS_UPDATED_AT}</span>
              </div>
              <h1
                id="terms-heading"
                className="text-3xl font-semibold text-slate-900 md:text-4xl dark:text-[#66ffa3]"
              >
                Terms & Conditions
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-[#9ef0c3]">
                These guidelines protect your team, data, and the momentum you build with Disruptor. Keep them handy and share them with anyone who needs platform access.
              </p>
            </header>

            <Separator className="bg-emerald-100 dark:bg-[#66ffa3]/20" />

            <TermsSectionList sections={termsSections} />
          </section>

          <aside className="space-y-6">
            <RelatedBlogsCard blogs={relatedBlogs} />

            <SupportCard />
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
