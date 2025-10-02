"use client";

import * as React from "react";
import { Sidebar, type SidebarProps } from "./sidebar/sidebar";
import { UserMenu } from "../dashboard/user-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import collapseIcon from "@/public/icons/collapse-dashboard.png";
import closeIcon from "@/public/icons/close.svg";
import { HelperChat } from "@/components/helper-chat/helper-chat";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function DashboardLayout({
   children,
   sidebar,
   fullWidth = false,
   contentClassName,
   mainClassName,
}: {
   children: React.ReactNode;
   sidebar?: React.ReactNode;
   fullWidth?: boolean;
   contentClassName?: string;
   mainClassName?: string;
}) {
   const [mounted, setMounted] = React.useState(false);
   React.useEffect(() => setMounted(true), []);

   const pathname = usePathname();
   const isDashboardHome = pathname === "/dashboard";
   const [sidebarOpen, setSidebarOpen] = React.useState(false);
   const [collapsed, setCollapsed] = React.useState(false);

   const sidebarNode = React.useMemo(() => {
      const onClose = () => setSidebarOpen(false);
      const onToggleCollapse = () => setCollapsed((v) => !v);
      const injectedProps = { onClose, collapsed, onToggleCollapse };
      if (React.isValidElement(sidebar)) {
         return React.cloneElement(
            sidebar as React.ReactElement<SidebarProps>,
            injectedProps
         );
      }
      return <Sidebar {...injectedProps} />;
   }, [sidebar, collapsed]);

   const baseContentClassName = React.useMemo(() => {
      if (fullWidth) {
         return "w-full pb-24 pt-8";
      }

      return isDashboardHome
         ? "w-full px-0 pb-24 pt-0"
         : "mx-auto w-full max-w-1xl px-4 pb-24 pt-4";
   }, [fullWidth, isDashboardHome]);

   const resolvedContentClassName = cn(baseContentClassName, contentClassName);

   if (!mounted) {
      return null;
   }

   return (
      <div
         suppressHydrationWarning
         className={
            collapsed
               ? "grid min-h-screen md:grid-cols-[4rem_1fr] bg-primary relative"
               : "grid min-h-screen md:grid-cols-[18rem_1fr] bg-primary relative"
         }>
         {/* Static sidebar on md+ */}
         <div className="hidden md:block">{sidebarNode}</div>

         <div className="h-full">
            <main className={cn("relative flex h-full flex-col overflow-y-auto bg-white text-black dark:bg-neutral-950 dark:text-white", mainClassName)}>
               {/* Mobile menu toggle */}
               <div className="absolute left-6 top-6 z-20 md:hidden">
                  <Button
                     variant="secondary"
                     size="icon"
                     aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                     onClick={() => setSidebarOpen((v) => !v)}>
                     {sidebarOpen ? (
                        <Image
                           src={closeIcon}
                           alt=""
                           width={24}
                           height={24}
                           className="h-6 w-6"
                           aria-hidden={true}
                        />
                     ) : (
                        <Image
                           src={collapseIcon}
                           alt=""
                           width={20}
                           height={20}
                           className="h-5 w-5"
                           aria-hidden={true}
                        />
                     )}
                  </Button>
               </div>
               <div className="absolute right-6 top-6 z-50">
                  <UserMenu />
               </div>
               <div className="relative z-10 flex-1">
                  <div className={resolvedContentClassName}>{children}</div>
               </div>
               {/* Helper side chat on all dashboard pages */}
               <HelperChat />
            </main>
         </div>

         {/* Mobile overlay sidebar */}
         {sidebarOpen ? (
            <>
               <div
                  className="fixed inset-0 z-40 bg-black/40 md:hidden"
                  onClick={() => setSidebarOpen(false)}
                  aria-hidden
               />
               <div className="fixed inset-y-0 left-0 z-50 w-72 md:hidden">
                  {sidebarNode}
               </div>
            </>
         ) : null}
      </div>
   );
}
