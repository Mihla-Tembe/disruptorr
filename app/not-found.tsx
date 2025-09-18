import Image from "next/image";
import Link from "next/link";

import NotFoundBg from "@/public/404-bg.jpg";
import { Sidebar } from "@/components/dashboard/sidebar/sidebar";

export default function NotFound() {
   return (
      <div className="relative min-h-screen bg-primary text-white md:pl-[18rem]">
         <div className="hidden md:block">
            <Sidebar />
         </div>

         <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
            <Image
               src={NotFoundBg.src}
               alt="Blurred gradient background"
               fill
               priority
               className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
               <span className="text-[8rem] font-light leading-none tracking-[0.02em] sm:text-[10rem] md:text-[12rem]">
                  404
               </span>
               <p className="max-w-xl text-base text-white/80 sm:text-lg">
                  Looks like the page you are trying to reach is unavailable.
               </p>
               <Link
                  href="/dashboard"
                  className="text-base font-medium text-[#c8a6ff] underline-offset-4 hover:text-white hover:underline">
                  Go back
               </Link>
            </div>
         </div>
      </div>
   );
}
