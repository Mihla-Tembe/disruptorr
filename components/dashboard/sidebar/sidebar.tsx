"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
   navGroups,
   LABEL_MAIN_MENU,
   LABEL_COMING_SOON,
   PLACEHOLDER_SEARCH,
   ARIA_SEARCH_NAV,
} from "@/constants";
import { cn } from "@/lib/utils";
import Logo from "@/public/disruptor-logo.svg";
import searchIcon from "@/public/icons/search.svg";
import closeIcon from "@/public/icons/close.svg";
import collapseIcon from "@/public/icons/collapse-dashboard.svg";
import AI from "@/public/ai-logo.svg";
import startIcon from "@/public/icons/start.svg";
import articleIcon from "@/public/icons/article.svg";
import openMenuIcon from "@/public/icons/open-menu.svg";
import closeMenuIcon from "@/public/icons/close-menu.svg";
import type { NavItem, NavGroup } from "@/types";
import { useAuth } from "@/components/providers/auth-provider";

const guestNavGroups: NavGroup[] = [
   { id: "articles", label: "Articles", href: "/news" },
   { id: "terms", label: "Terms", href: "/terms" },
   { id: "signin", label: "Sign In", href: "/signin" },
];

export type SidebarProps = {
   onClose?: () => void;
   collapsed?: boolean;
   onToggleCollapse?: () => void;
};

export function Sidebar({
   onClose,
   collapsed,
   onToggleCollapse,
}: SidebarProps) {
   const pathname = usePathname();
   const router = useRouter();
   const { status } = useAuth();
   const [query, setQuery] = React.useState("");

   const isLoading = status === "loading";
   const isMember = status === "member";
   const navData = React.useMemo<NavGroup[] | null>(() => {
      if (isLoading) return null;
      return isMember ? navGroups : guestNavGroups;
   }, [isLoading, isMember]);

   const filtered = React.useMemo(() => {
      if (!navData) return [];
      if (!query.trim()) return navData;
      const q = query.toLowerCase();

      function filterItems(items: NavItem[]): NavItem[] {
         const result: NavItem[] = [];
         for (const it of items ?? []) {
            const selfMatch = it.label.toLowerCase().includes(q);
            if (it.items && it.items.length) {
               const children = filterItems(it.items);
               if (selfMatch || children.length)
                  result.push({ ...it, items: children });
            } else if (selfMatch) {
               result.push({ ...it });
            }
         }
         return result;
      }

      return navData
         .map((g) => {
            const groupMatch = g.label.toLowerCase().includes(q);
            if (g.href) return groupMatch ? g : null;
            const items = filterItems(g.items ?? []);
            if (groupMatch || items.length) return { ...g, items };
            return null;
         })
         .filter(Boolean) as NavGroup[];
   }, [query, navData]);

   function findFirstHref(
      items: NonNullable<(typeof navGroups)[number]["items"]>
   ): string | null {
      for (const it of items ?? []) {
         if (it.href) return it.href;
         if (it.items && it.items.length) {
            const found = findFirstHref(it.items);
            if (found) return found;
         }
      }
      return null;
   }

   function navItemIsActive(item: NavItem | undefined): boolean {
      if (!item) return false;
      if (item.href && pathname === item.href) return true;
      if (item.items && item.items.length) {
         return item.items.some(navItemIsActive);
      }
      return false;
   }

   function hasActiveDescendant(items?: NavItem[]): boolean {
      if (!items || items.length === 0) return false;
      return items.some(navItemIsActive);
   }

   return (
      <aside
         className={cn(
            "sticky top-0 h-screen flex shrink-0 flex-col bg-primary text-white relative md:fixed md:inset-y-0 md:left-0 md:top-0",
            collapsed ? "w-16" : "w-72"
         )}>
         <div
            className={`flex items-center justify-between gap-2 ${
               collapsed ? "px-3" : "px-4"
            } py-4`}>
            {collapsed ? null : (
               <Link href="/dashboard" className="flex items-center gap-2">
                  <Image
                     src={Logo.src}
                     alt="Person with colorful lighting effects representing innovation and creativity"
                     width={130}
                     height={50}
                     className="object-cover"
                     priority
                  />
               </Link>
            )}
            <div className="flex items-center">
               <Button
                  size="icon"
                  variant="ghost"
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                  onClick={onToggleCollapse}
                  className="hover:bg-[#66FFA3] focus-visible:bg-[#66FFA3]">
                  <Image
                     src={collapseIcon}
                     alt=""
                     width={20}
                     height={20}
                     className={cn(
                        "h-5 w-5 transition-transform",
                        !collapsed && "rotate-180"
                     )}
                     aria-hidden={true}
                  />
               </Button>
               {onClose ? (
                  <Button
                     size="icon"
                     variant="ghost"
                     aria-label="Close sidebar"
                     className="md:hidden hover:bg-[#66FFA3] focus-visible:bg-[#66FFA3]"
                     onClick={onClose}>
                     <Image
                        src={closeIcon}
                        alt=""
                        width={24}
                        height={24}
                        className="h-6 w-6"
                        aria-hidden={true}
                     />
                  </Button>
               ) : null}
            </div>
         </div>
         {!collapsed && isMember && (
            <div className="px-4 pb-3">
               <div className="relative">
                  <Image
                     src={searchIcon}
                     alt=""
                     width={20}
                     height={20}
                     className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2"
                     aria-hidden={true}
                  />
                  <Input
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                     onKeyDown={(e) => {
                        if (e.key === "Enter") {
                           const first = filtered[0];
                           if (!first) return;
                           const target =
                              first.href ?? findFirstHref(first.items ?? []);
                           if (target) router.push(target);
                        }
                     }}
                     placeholder={PLACEHOLDER_SEARCH}
                     className="pl-12 border-none text-white placeholder:text-white focus:ring-0  bg-primary-foreground/10 py-6"
                     aria-label={ARIA_SEARCH_NAV}
                     style={{ background: "rgba(255, 255, 255, 0.10)" }}
                  />
               </div>
            </div>
         )}

         {!collapsed && (isLoading ? (
            <div className="px-4 py-6 space-y-3">
               <div className="h-4 rounded bg-white/10" />
               <div className="h-4 rounded bg-white/10" />
               <div className="h-4 rounded bg-white/10" />
               <div className="h-4 rounded bg-white/10" />
            </div>
         ) : (
            navData && (
               <ScrollArea className="h-[calc(100vh-120px)]">
                  <nav className="px-2 py-6 text-sm">
                  <div className="px-2 text-center text-xs text-white font-semibold grid grid-cols-3 items-center gap-2 mb-8">
                     <Separator />
                     <span className="w-full">{LABEL_MAIN_MENU}</span>
                     <Separator />
                  </div>

                  {filtered.map((group) => {
                     if (group.href) {
                        const isActive = pathname === group.href;
                        const Icon = group.icon;
                        const isAskAnything = group.id === "ask-anything";
                        const isArticles = group.id === "insight-stream";
                        const isStart = group.id === "start";
                        const isHighlighted = isAskAnything || isArticles;
                        const highlightSpacing = isAskAnything
                           ? "mt-2"
                           : isArticles
                           ? "pt-6 border-t border-white/15 mt-6"
                           : undefined;

                        return (
                           <div key={group.id}>
                              <Link
                                 href={group.href}
                                 className={cn(
                                    "group relative flex items-center px-3 py-2 text-sm transition-all focus-visible:outline-none",
                                    isHighlighted ? "gap-3" : "gap-2",
                                    isAskAnything &&
                                       "font-semibold text-[#E0B5FF] focus-visible:ring-2 focus-visible:ring-[#D29CFF]",
                                    isArticles &&
                                       "font-semibold text-white tracking-wide hover:text-[#66FFA3] focus-visible:ring-2 focus-visible:ring-[#66FFA3]/40",
                                    !isHighlighted && "hover:bg-emerald-700",
                                    highlightSpacing,
                                    isAskAnything &&
                                       !isActive &&
                                       "hover:text-white",
                                    isArticles &&
                                       !isActive &&
                                       "hover:text-[#66FFA3]",
                                    isActive &&
                                       (isAskAnything
                                          ? "text-white"
                                          : isArticles
                                          ? "text-[#66FFA3]"
                                          : "font-bold text-[#66FFA3]")
                                 )}>
                                 {Icon ? (
                                    <Icon
                                       className="h-4 w-4"
                                       aria-hidden={true}
                                    />
                                 ) : isAskAnything ? (
                                    <span
                                       className={cn(
                                          "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
                                          isActive
                                             ? "bg-primary"
                                             : "bg-[#E0B5FF] shadow-[0_0_12px_rgba(224,181,255,0.45)] group-hover:bg-[#D29CFF] group-hover:shadow-[0_0_14px_rgba(210,156,255,0.6)]"
                                       )}>
                                       <Image
                                          src={AI.src}
                                          alt="AI logo"
                                          width={20}
                                          height={20}
                                          className="h-5 w-5"
                                       />
                                    </span>
                                 ) : isArticles ? (
                                    <Image
                                       src={articleIcon}
                                       alt=""
                                       width={20}
                                       height={20}
                                       className={cn(
                                          "h-5 w-5 transition-opacity",
                                          isActive
                                             ? "opacity-100"
                                             : "opacity-80 group-hover:opacity-100"
                                       )}
                                    />
                                 ) : isStart ? (
                                    <Image
                                       src={startIcon}
                                       alt=""
                                       width={16}
                                       height={16}
                                       className={cn(
                                          "h-4 w-4 transition-opacity",
                                          isActive
                                             ? "opacity-100"
                                             : "opacity-80 group-hover:opacity-100"
                                       )}
                                    />
                                 ) : null}
                                 <span
                                    className={cn(
                                       "flex-1",
                                       isAskAnything && "tracking-wide",
                                       isArticles && "tracking-wide"
                                    )}>
                                    {group.label}
                                 </span>
                                 {isAskAnything ? (
                                    <span
                                       className={cn(
                                          "ml-auto px-2 py-0.5 text-[11px] font-semibold uppercase leading-none tracking-wide text-[#E0B5FF] transition-colors group-hover:text-white",
                                          isActive && "text-white"
                                       )}>
                                       AI
                                    </span>
                                 ) : null}
                                 {isArticles ? (
                                    <span
                                       className={cn(
                                          "ml-auto px-2 py-0.5 text-[11px] font-semibold uppercase leading-none tracking-wide text-white transition-colors",
                                          isActive
                                             ? "text-[#66FFA3]"
                                             : "text-white/60 group-hover:text-[#66FFA3]"
                                       )}>
                                       NEWS
                                    </span>
                                 ) : null}
                              </Link>
                           </div>
                        );
                     }

                     function RenderItems({
                        items,
                        parent,
                     }: {
                        items: NavItem[];
                        parent: string;
                     }) {
                        if (!items || items.length === 0) {
                           return (
                              <div className="px-3 py-2 text-xs text-white">
                                 {LABEL_COMING_SOON}
                              </div>
                           );
                        }
                        return (
                           <div className="mb-2 ml-2 flex flex-col gap-1">
                              {items.map((it, idx) => {
                                 const key = `${parent}-${idx}-${it.label}`;
                                 if (it.items && it.items.length) {
                                    const Icon = it.icon;
                                    const branchActive = navItemIsActive(it);
                                    return (
                                       <Accordion
                                          type="single"
                                          collapsible
                                          key={key}
                                          defaultValue={
                                             branchActive ? key : undefined
                                          }>
                                          <AccordionItem value={key}>
                                             <AccordionTrigger
                                                className={cn(
                                                   "px-3 py-2 hover:text-emerald-500 text-[13px] [&>img]:hidden [&[data-state=open]_.plus-icon]:hidden [&[data-state=open]_.minus-icon]:block",
                                                   branchActive &&
                                                      "text-[#66FFA3] hover:text-[#66FFA3]"
                                                )}>
                                                <div className="flex w-full items-center justify-between">
                                                   <div className="flex items-center gap-2">
                                                      {Icon ? (
                                                         <Icon
                                                            className="h-4 w-4"
                                                            aria-hidden={true}
                                                         />
                                                      ) : null}
                                                      <span>{it.label}</span>
                                                   </div>
                                                   <Image
                                                      src={openMenuIcon}
                                                      alt=""
                                                      width={16}
                                                      height={16}
                                                      className="plus-icon h-4 w-4"
                                                      aria-hidden={true}
                                                   />
                                                   <Image
                                                      src={closeMenuIcon}
                                                      alt=""
                                                      width={16}
                                                      height={16}
                                                      className="minus-icon hidden h-4 w-4"
                                                      aria-hidden={true}
                                                   />
                                                </div>
                                             </AccordionTrigger>
                                             <AccordionContent>
                                                <RenderItems
                                                   items={it.items}
                                                   parent={key}
                                                />
                                             </AccordionContent>
                                          </AccordionItem>
                                       </Accordion>
                                    );
                                 }
                                 const Icon = it.icon;
                                 const isActive = pathname === it.href;
                                 return (
                                    <Link
                                       key={key}
                                       href={it.href!}
                                       className={cn(
                                          "flex items-center gap-2 rounded-md px-3 py-1 text-white transition-colors hover:bg-accent hover:text-accent-foreground text-[13px]",
                                          isActive &&
                                             "bg-transparent font-semibold text-[#66FFA3] hover:bg-transparent hover:text-[#66FFA3]"
                                       )}>
                                       {Icon ? (
                                          <Icon
                                             className="h-4 w-4"
                                             aria-hidden={true}
                                          />
                                       ) : null}
                                       {it.label}
                                    </Link>
                                 );
                              })}
                           </div>
                        );
                     }

                     const groupActive = hasActiveDescendant(group.items);
                     const Icon = group.icon;

                     return (
                        <Accordion
                           type="single"
                           collapsible
                           key={group.id}
                           defaultValue={groupActive ? group.id : undefined}>
                           <AccordionItem value={group.id}>
                              <AccordionTrigger
                                 className={cn(
                                    "px-3 py-3 text-sm hover:text-emerald-500 [&>img]:hidden [&[data-state=open]_.plus-icon]:hidden [&[data-state=open]_.minus-icon]:block",
                                    groupActive &&
                                       "text-[#66FFA3] hover:text-[#66FFA3]"
                                 )}>
                                 <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center gap-2">
                                       {Icon ? (
                                          <Icon
                                             className="h-4 w-4"
                                             aria-hidden={true}
                                          />
                                       ) : null}
                                       <span>{group.label}</span>
                                    </div>
                                    <Image
                                       src={openMenuIcon}
                                       alt=""
                                       width={16}
                                       height={16}
                                       className="plus-icon h-4 w-4"
                                       aria-hidden={true}
                                    />
                                    <Image
                                       src={closeMenuIcon}
                                       alt=""
                                       width={16}
                                       height={16}
                                       className="minus-icon hidden h-4 w-4"
                                       aria-hidden={true}
                                    />
                                 </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                 <RenderItems
                                    items={group.items ?? []}
                                    parent={group.id}
                                 />
                              </AccordionContent>
                           </AccordionItem>
                        </Accordion>
                     );
                  })}
                  </nav>
               </ScrollArea>
            )
         ))}
      </aside>
   );
}
