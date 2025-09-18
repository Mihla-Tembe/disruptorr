import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { RelatedBlog } from "@/types";

interface RelatedBlogsCardProps {
  blogs: RelatedBlog[];
}

export function RelatedBlogsCard({ blogs }: RelatedBlogsCardProps) {
  return (
    <Card className="border-emerald-100/60 bg-white/90 shadow-sm backdrop-blur rounded-none dark:border-[#66ffa3]/30 dark:bg-[#031611]/90">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold text-emerald-900 dark:text-[#66ffa3]">
          Related Blogs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {blogs.map((blog, index) => (
          <div key={blog.slug} className="space-y-3">
            <div className="flex gap-3">
              <div className="relative h-16 w-16 overflow-hidden rounded-none">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-[#53e590]">
                  {blog.category}
                </p>
                <Link
                  href={blog.slug}
                  className="block text-sm font-semibold text-slate-900 transition-colors hover:text-emerald-700 dark:text-[#66ffa3] dark:hover:text-[#53e590]"
                >
                  {blog.title}
                </Link>
                <p className="text-xs text-slate-500 dark:text-[#9ef0c3]">
                  {blog.publishedOn} · {blog.readTime}
                </p>
              </div>
            </div>
            {index !== blogs.length - 1 ? (
              <Separator className="bg-emerald-100 dark:bg-[#66ffa3]/20" />
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
