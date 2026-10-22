"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  UserCircle2,
  LogOut,
  LayoutDashboard,
  Settings,
  KeyRound,
  HelpCircle,
  Shield,
  ExternalLink,
  Download,
} from "lucide-react";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import { NAVIGATION_CONFIG } from "@/config/navigation";
import { AuthUser } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  user: AuthUser | null;
}

export function MobileNav({ user }: MobileNavProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>({
    "photo-tools": true,
    "ecard-cutter": true,
    "document-id-tools": true,
  });
  const [expandedSubmenus, setExpandedSubmenus] = React.useState<Record<string, boolean>>({});

  const pathname = usePathname();
  const { logout } = useAuth();

  const closeSheet = () => setIsOpen(false);

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSubmenu = (title: string) => {
    setExpandedSubmenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isHrefActive = (href: string) => {
    if (!href || href === "/#editor" || href.startsWith("/#")) {
      return false;
    }
    return pathname === href;
  };

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      closeSheet();
    } catch {
      // Handled in auth hook
    }
  };

  return (
    <div className="md:hidden flex items-center gap-2">
      <ThemeToggle />

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-9 h-9 border border-zinc-200 dark:border-white/10"
              aria-label="Open mobile navigation menu"
            />
          }
        >
          <Menu className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
        </SheetTrigger>

        <SheetContent
          side="right"
          showCloseButton={false}
          className="w-[90vw] sm:max-w-md p-0 flex flex-col bg-white dark:bg-zinc-950 border-zinc-200 dark:border-white/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-white/10">
            <Link href="/" onClick={closeSheet} className="flex items-center gap-2">
              <Logo />
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <SheetClose
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-full w-8 h-8"
                    aria-label="Close menu"
                  />
                }
              >
                <X className="w-4 h-4" />
              </SheetClose>
            </div>
          </div>

          {/* Accessible Sheet titles */}
          <div className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>Access all photo tools, document presets, and options</SheetDescription>
          </div>

          {/* Scrollable Content */}
          <ScrollArea className="flex-1 px-4 py-4">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Link
                href="/product"
                onClick={closeSheet}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "w-full rounded-xl py-5 font-semibold text-xs shadow-md"
                )}
              >
                Get Started Free
              </Link>
              <Link
                href="/resume-builder"
                onClick={closeSheet}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full rounded-xl py-5 font-semibold text-xs border-blue-200 dark:border-blue-900/40 text-blue-600 dark:text-blue-400"
                )}
              >
                Resume Maker ✨
              </Link>
            </div>

            <Separator className="my-3 opacity-60" />

            {/* Categories & Nested Items */}
            <div className="space-y-4">
              {NAVIGATION_CONFIG.map((category) => {
                const CategoryIcon = category.icon;
                const isExpanded = !!expandedCategories[category.id];

                return (
                  <div
                    key={category.id}
                    className="rounded-2xl border border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-900/30 overflow-hidden"
                  >
                    {/* Category Accordion Header */}
                    <button
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-left transition-colors hover:bg-zinc-100/70 dark:hover:bg-white/5"
                      aria-expanded={isExpanded}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {CategoryIcon && (
                          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary shrink-0">
                            <CategoryIcon className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-zinc-900 dark:text-white">
                              {category.title}
                            </span>
                            {category.badge && (
                              <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                                {category.badge}
                              </span>
                            )}
                          </div>
                          {category.description && (
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate max-w-[200px]">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0",
                          isExpanded && "rotate-180"
                        )}
                      />
                    </button>

                    {/* Category Items */}
                    {isExpanded && (
                      <div className="px-2 pb-2 pt-1 border-t border-zinc-100 dark:border-white/5 space-y-1">
                        {category.items.map((item) => {
                          const ItemIcon = item.icon;
                          const itemActive = isHrefActive(item.href);
                          const hasSubmenu = item.subItems && item.subItems.length > 0;
                          const isSubmenuOpen = !!expandedSubmenus[item.title];

                          if (hasSubmenu) {
                            return (
                              <div
                                key={item.title}
                                className="rounded-xl border border-zinc-200/60 dark:border-white/5 bg-white dark:bg-zinc-950 overflow-hidden"
                              >
                                <button
                                  type="button"
                                  onClick={() => toggleSubmenu(item.title)}
                                  className="w-full p-2.5 flex items-center justify-between text-left hover:bg-zinc-50 dark:hover:bg-white/5"
                                  aria-expanded={isSubmenuOpen}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    {ItemIcon && (
                                      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 shrink-0">
                                        <ItemIcon className="w-3.5 h-3.5" />
                                      </div>
                                    )}
                                    <div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-semibold text-zinc-900 dark:text-white">
                                          {item.title}
                                        </span>
                                        {item.badge && (
                                          <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">
                                            {item.badge}
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-[10px] text-zinc-400 block">
                                        {item.subItems?.length} presets available
                                      </span>
                                    </div>
                                  </div>
                                  <ChevronDown
                                    className={cn(
                                      "w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 shrink-0",
                                      isSubmenuOpen && "rotate-180"
                                    )}
                                  />
                                </button>

                                {isSubmenuOpen && (
                                  <div className="px-2 pb-2 pt-1 border-t border-zinc-100 dark:border-white/5 space-y-1 bg-zinc-50/50 dark:bg-zinc-900/20">
                                    {item.subItems?.map((sub) => {
                                      const SubIcon = sub.icon;
                                      const subActive = isHrefActive(sub.href);

                                      return (
                                        <Link
                                          key={sub.title}
                                          href={sub.href}
                                          onClick={closeSheet}
                                          className={cn(
                                            "flex items-center gap-2.5 p-2 rounded-lg text-xs transition-colors",
                                            subActive
                                              ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold"
                                              : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5"
                                          )}
                                        >
                                          {SubIcon && (
                                            <SubIcon className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                          )}
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                              <span className="font-medium truncate">
                                                {sub.title}
                                              </span>
                                              {sub.external && (
                                                <ExternalLink className="w-3 h-3 text-zinc-400 ml-auto" />
                                              )}
                                            </div>
                                            {sub.description && (
                                              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                                                {sub.description}
                                              </p>
                                            )}
                                          </div>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          }

                          return (
                            <Link
                              key={item.title}
                              href={item.href}
                              onClick={closeSheet}
                              className={cn(
                                "flex items-center gap-2.5 p-2.5 rounded-xl transition-colors",
                                itemActive
                                  ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold"
                                  : "text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900"
                              )}
                            >
                              {ItemIcon && (
                                <div
                                  className={cn(
                                    "flex items-center justify-center w-7 h-7 rounded-lg shrink-0",
                                    itemActive
                                      ? "bg-blue-600 text-white dark:bg-blue-500"
                                      : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                                  )}
                                >
                                  <ItemIcon className="w-3.5 h-3.5" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-semibold truncate">
                                    {item.title}
                                  </span>
                                  {item.badge && (
                                    <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                {item.description && (
                                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <Separator className="my-4 opacity-60" />

            {/* User Account & Auth Section */}
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 px-1">
                Account & Access
              </p>

              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-100 dark:bg-white/5">
                    <UserCircle2 className="w-8 h-8 text-primary shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/dashboard"
                      onClick={closeSheet}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "rounded-xl justify-start text-xs py-4"
                      )}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      onClick={closeSheet}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "rounded-xl justify-start text-xs py-4"
                      )}
                    >
                      <Settings className="w-3.5 h-3.5 mr-1.5" />
                      Settings
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/change-password"
                      onClick={closeSheet}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "rounded-xl justify-start text-xs"
                      )}
                    >
                      <KeyRound className="w-3.5 h-3.5 mr-1.5" />
                      Password
                    </Link>
                    <Link
                      href="/forgot-password"
                      onClick={closeSheet}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "rounded-xl justify-start text-xs"
                      )}
                    >
                      <HelpCircle className="w-3.5 h-3.5 mr-1.5" />
                      Forgot?
                    </Link>
                  </div>

                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={closeSheet}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "w-full rounded-xl justify-start text-xs border-amber-200 dark:border-amber-900/40 text-amber-700 dark:text-amber-400"
                      )}
                    >
                      <Shield className="w-3.5 h-3.5 mr-1.5" />
                      Admin Control Panel
                    </Link>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    disabled={logout.isPending}
                    className="w-full rounded-xl justify-start text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 py-4"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-1.5" />
                    {logout.isPending ? "Logging out..." : "Log out"}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/login"
                    onClick={closeSheet}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full rounded-xl py-5 text-xs font-semibold"
                    )}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={closeSheet}
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "w-full rounded-xl py-5 text-xs font-semibold"
                    )}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            <Separator className="my-4 opacity-60" />

            {/* Android APK Download Card */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 text-center">
              <p className="text-xs font-bold text-zinc-900 dark:text-white">
                📱 PrintPix Android App
              </p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Install for fast offline-ready passport tools
              </p>
              <a
                href="https://drive.google.com/uc?export=download&id=1OZsmRfKfE9Jo81LZK3hFxS3iaBtEwqM0"
                target="_blank"
                rel="noopener noreferrer"
                download="PrintPix.apk"
                className="inline-flex items-center justify-center gap-1.5 mt-2.5 w-full py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download APK</span>
              </a>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
