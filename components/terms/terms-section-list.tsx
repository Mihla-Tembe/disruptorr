import type { TermsSection } from "@/types";
import { Separator } from "@/components/ui/separator";

interface TermsSectionListProps {
  sections: TermsSection[];
}

export function TermsSectionList({ sections }: TermsSectionListProps) {
  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <article key={section.heading} className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-emerald-900 dark:text-[#66ffa3]">
              {section.heading}
            </h2>
            {section.paragraphs?.map((paragraph, index) => (
              <p
                key={`${section.heading}-p-${index}`}
                className="text-sm leading-relaxed text-slate-600 dark:text-[#9ef0c3]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {section.bullets ? (
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600 dark:text-[#9ef0c3]">
              {section.bullets.map((item, index) => (
                <li key={`${section.heading}-b-${index}`}>{item}</li>
              ))}
            </ul>
          ) : null}

          {section.orderedList ? (
            <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-600 dark:text-[#9ef0c3]">
              {section.orderedList.map((item, index) => (
                <li key={`${section.heading}-o-${index}`}>{item}</li>
              ))}
            </ol>
          ) : null}

          {section.bullets || section.orderedList ? (
            <Separator className="mt-4 w-16 bg-emerald-200 dark:bg-[#66ffa3]/30" />
          ) : null}
        </article>
      ))}
    </div>
  );
}
