import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import loginBg from "@/public/login-bg.jpg";

export function SupportCard() {
  return (
    <div className="overflow-hidden rounded-none bg-emerald-600 text-emerald-50 shadow-sm dark:bg-[#04271f] dark:text-[#66ffa3]">
      <div className="relative h-32 w-full">
        <Image src={loginBg} alt="" fill className="object-cover" aria-hidden />
      </div>
      <div className="space-y-4 px-5 pb-6 pt-4">
        <h2 className="text-lg font-semibold">Need live support?</h2>
        <p className="text-sm text-emerald-50/80 dark:text-[#9ef0c3]">
          Launch Ask Anything for instant answers or connect with your success partner for strategic guidance.
        </p>
        <Button asChild variant="secondary" className="text-emerald-700 dark:text-[#05271b] dark:bg-[#66ffa3] dark:hover:bg-[#53e590]">
          <Link href="/dashboard/chat">Open Ask Anything</Link>
        </Button>
      </div>
    </div>
  );
}
