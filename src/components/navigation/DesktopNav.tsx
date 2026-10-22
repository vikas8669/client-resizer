"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ExternalLink } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { NAVIGATION_CONFIG, NavCategory } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function DesktopNav() {
  const pathname = usePathname();

  const isHrefActive = (href: string) => {
    if (!href || href === "/#editor" || href.startsWith("/#")) {
      return false;
    }
    return pathname === href;
  };

  const isCategoryActive = (category: NavCategory) => {
    return category.items.some((item) => {
      if (isHrefActive(item.href)) return true;
      if (item.subItems?.some((sub) => isHrefActive(sub.href))) return true;
      return false;
    });
  };

  return (
    <nav
      className="hidden md:flex items-center gap-1 lg:gap-2"
      aria-label="Main Navigation"
    >
      {NAVIGATION_CONFIG.map((category) => {
        const CategoryIcon = category.icon;
        const categoryActive = isCategoryActive(category);

        return (
          <DropdownMenu key={category.id}>
            <DropdownMenuTrigger
              openOnHover
              delay={80}
              closeDelay={120}
              className={cn(
                "group inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 outline-none select-none cursor-pointer",
                "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-white",
                "focus-visible:ring-2 focus-visible:ring-primary/40",
                categoryActive
                  ? "text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/70 dark:bg-blue-950/40"
                  : "text-zinc-600 hover:text-black dark:text-zinc-300 dark:hover:text-white"
              )}
              aria-label={`${category.title} menu`}
            >
              {CategoryIcon && (
                <CategoryIcon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    categoryActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300"
                  )}
                />
              )}
              <span>{category.title}</span>
              {category.badge && (
                <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                  {category.badge}
                </span>
              )}
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200 opacity-60 group-data-[open]:rotate-180 group-hover:opacity-100"
                )}
                aria-hidden="true"
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="bottom"
              align="start"
              sideOffset={8}
              className="w-84 sm:w-92 p-2 rounded-2xl shadow-2xl border-zinc-200/90 dark:border-white/10 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl"
            >
              {category.description && (
                <div className="px-3 pt-2 pb-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    {category.title}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {category.description}
                  </p>
                </div>
              )}

              <DropdownMenuSeparator className="my-1.5" />

              <DropdownMenuGroup className="space-y-1">
                {category.items.map((item) => {
                  const ItemIcon = item.icon;
                  const itemActive = isHrefActive(item.href);

                  // If item has subItems, render nested Submenu!
                  if (item.subItems && item.subItems.length > 0) {
                    return (
                      <DropdownMenuSub key={item.title}>
                        <DropdownMenuSubTrigger
                          openOnHover
                          delay={80}
                          closeDelay={120}
                          className={cn(
                            "group/sub w-full p-2.5 rounded-xl transition-all duration-150 cursor-pointer flex items-center gap-3",
                            "hover:bg-zinc-100 dark:hover:bg-white/10"
                          )}
                        >
                          {ItemIcon && (
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 group-hover/sub:bg-primary/10 group-hover/sub:text-primary transition-colors shrink-0">
                              <ItemIcon className="w-4 h-4" />
                            </div>
                          )}
                          <div className="flex-1 text-left min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                                {item.title}
                              </span>
                              {item.badge && (
                                <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </DropdownMenuSubTrigger>

                        <DropdownMenuSubContent
                          sideOffset={6}
                          align="start"
                          className="w-80 p-2 rounded-2xl shadow-2xl border-zinc-200/90 dark:border-white/10 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl"
                        >
                          <DropdownMenuLabel className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                            {item.title}
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="my-1" />
                          <DropdownMenuGroup className="space-y-1">
                            {item.subItems.map((sub) => {
                              const SubIcon = sub.icon;
                              const subActive = isHrefActive(sub.href);

                              return (
                                <DropdownMenuItem
                                  key={sub.title}
                                  render={
                                    <Link
                                      href={sub.href}
                                      target={sub.external ? "_blank" : undefined}
                                      rel={sub.external ? "noopener noreferrer" : undefined}
                                    />
                                  }
                                  className={cn(
                                    "group/subitem w-full p-2 rounded-xl transition-all duration-150 cursor-pointer flex items-center gap-2.5",
                                    subActive
                                      ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold"
                                      : "hover:bg-zinc-100 dark:hover:bg-white/10"
                                  )}
                                >
                                  {SubIcon && (
                                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 group-hover/subitem:bg-primary/10 group-hover/subitem:text-primary transition-colors shrink-0">
                                      <SubIcon className="w-3.5 h-3.5" />
                                    </div>
                                  )}
                                  <div className="flex-1 text-left min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                                        {sub.title}
                                      </span>
                                      {sub.badge && (
                                        <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                                          {sub.badge}
                                        </span>
                                      )}
                                      {sub.external && (
                                        <ExternalLink className="w-3 h-3 text-zinc-400 ml-auto" />
                                      )}
                                    </div>
                                    {sub.description && (
                                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                                        {sub.description}
                                      </p>
                                    )}
                                  </div>
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuGroup>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    );
                  }

                  // Regular menu item without sub-items
                  return (
                    <DropdownMenuItem
                      key={item.title}
                      render={
                        <Link
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                        />
                      }
                      className={cn(
                        "group/item w-full p-2.5 rounded-xl transition-all duration-150 cursor-pointer flex items-center gap-3",
                        itemActive
                          ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold"
                          : "hover:bg-zinc-100 dark:hover:bg-white/10"
                      )}
                    >
                      {ItemIcon && (
                        <div
                          className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-white/5 transition-colors shrink-0",
                            itemActive
                              ? "bg-blue-600 text-white dark:bg-blue-500"
                              : "text-zinc-700 dark:text-zinc-300 group-hover/item:bg-primary/10 group-hover/item:text-primary"
                          )}
                        >
                          <ItemIcon className="w-4 h-4" />
                        </div>
                      )}
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              "text-sm font-semibold truncate",
                              itemActive
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-zinc-900 dark:text-white"
                            )}
                          >
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                              {item.badge}
                            </span>
                          )}
                          {item.external && (
                            <ExternalLink className="w-3 h-3 text-zinc-400 ml-auto" />
                          )}
                        </div>
                        {item.description && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}
    </nav>
  );
}
