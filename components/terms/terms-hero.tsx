import Image, { type StaticImageData } from "next/image";

import { cn } from "@/lib/utils";

interface TermsHeroProps {
   image: StaticImageData | string;
   alt: string;
   variant?: "default" | "plain";
}

export function TermsHero({ image, alt, variant = "default" }: TermsHeroProps) {
   const wrapperClass =
      variant === "default"
         ? "overflow-hidden rounded-xl border border-emerald-100/60 bg-gradient-to-br from-white to-emerald-50 shadow-sm dark:border-[#66ffa3]/30 dark:from-[#031611] dark:to-[#031611]"
         : "overflow-hidden bg-white dark:bg-[#010a07]";

   const imageHeightClass =
      variant === "default"
         ? "h-72 sm:h-80 lg:h-90"
         : "h-[500px] sm:h-[450px] lg:h-[400px]";

   return (
      <div className={cn("relative w-full", wrapperClass)}>
         <div className={cn("relative w-full", imageHeightClass)}>
            <Image
               src={image}
               alt={alt}
               fill
               priority
               className="object-cover"
            />
         </div>
      </div>
   );
}
