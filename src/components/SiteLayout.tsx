"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, UserCircle2, KeyRound, MailQuestion, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button, buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import { Footer } from "@/components/Footer";
import { StickyBanner } from "@/components/ui/sticky-banner";
import { SplashScreen } from "@/components/SplashScreen";
import { cn } from "@/lib/utils";
import { AuthUser, getStoredUser } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isBannerOpen, setIsBannerOpen] = useState(true);
  const [bannerHeight, setBannerHeight] = useState(40);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const { logout } = useAuth();

  const closeMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    const measure = () => {
      if (bannerRef.current) {
        setBannerHeight(bannerRef.current.scrollHeight);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isBannerOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const refreshUser = () => setUser(getStoredUser());
    refreshUser();
    window.addEventListener("auth-user-updated", refreshUser);
    window.addEventListener("storage", refreshUser);
    return () => {
      window.removeEventListener("auth-user-updated", refreshUser);
      window.removeEventListener("storage", refreshUser);
    };
  }, []);

  const handleLogout = async () => {
    await logout.mutateAsync();
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-[#1E1F25] dark:text-white overflow-x-hidden selection:bg-blue-500/30">
      <SplashScreen />

      <StickyBanner
        ref={bannerRef}
        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
        onOpenChange={setIsBannerOpen}
      >
        <p className="text-white text-xs sm:text-sm md:text-base font-medium text-center leading-snug px-8">
          <span className="md:hidden">
            👋 <span className="font-bold">PrintPix</span> —{" "}
            <Link href="/features" className="underline hover:opacity-80 transition">Explore features</Link>
          </span>
          <span className="hidden md:inline">
            👋 Welcome to <span className="font-bold">PrintPix</span> — AI-powered image processing & design workspace.{" "}
            <Link href="/features" className="underline ml-2 hover:opacity-80 transition">Explore features</Link>
          </span>
        </p>
      </StickyBanner>

      <motion.header
        animate={{ top: isBannerOpen ? bannerHeight : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 right-0 z-[100] border-b border-zinc-200/100 dark:border-white/5 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0 z-50">
            <Logo />
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {["Product", "Solutions", "Customers", "Pricing"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-sm font-medium text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-white/10 dark:text-zinc-200"
                >
                  <UserCircle2 className="h-4 w-4" />
                  {user.name}
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg dark:bg-zinc-900 dark:border-white/10">
                    <Link href="/dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10" onClick={() => setIsProfileMenuOpen(false)}>
                      <UserCircle2 className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link href="/change-password" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10" onClick={() => setIsProfileMenuOpen(false)}>
                      <KeyRound className="h-4 w-4" />
                      Change Password
                    </Link>
                    <Link href="/forgot-password" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10" onClick={() => setIsProfileMenuOpen(false)}>
                      <MailQuestion className="h-4 w-4" />
                      Forgot Password
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={logout.isPending}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-4 w-4" />
                      {logout.isPending ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-sm font-semibold text-zinc-500 hover:text-black dark:hover:text-white">
                Log in
              </Link>
            )}
            <Button className="rounded-full px-6 py-6 shadow-lg hover:shadow-indigo-500/20 transition-all">
              Get Started
            </Button>
          </div>

          {/* MOBILE TOGGLE */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              className="p-2 z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ENHANCED MOBILE MENU */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-16 left-0 right-0 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-white/10 px-6 py-8 flex flex-col gap-6 md:hidden shadow-2xl overflow-y-auto"
              style={{ height: `calc(100vh - 4rem - ${isBannerOpen ? bannerHeight : 0}px)` }}
            >
              <div className="flex flex-col gap-6 text-xl font-medium">
                <Link onClick={closeMenu} href="/product">Product</Link>
                <Link onClick={closeMenu} href="/solutions">Solutions</Link>
                <Link onClick={closeMenu} href="/customers">Customers</Link>
                <Link onClick={closeMenu} href="/pricing">Pricing</Link>
              </div>
              <hr className="border-zinc-100 dark:border-white/5" />
              <div className="flex flex-col gap-4">
                <Button className="w-full py-6 text-lg rounded-xl">Get Started</Button>
                {user ? (
                  <>
                    <div className="px-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                      Signed in as {user.name}
                    </div>
                    <Link onClick={closeMenu} href="/dashboard" className={buttonVariants({ variant: "ghost", className: "w-full py-6 text-lg" })}>
                      Dashboard
                    </Link>
                    <Link onClick={closeMenu} href="/change-password" className={buttonVariants({ variant: "ghost", className: "w-full py-6 text-lg" })}>
                      Change Password
                    </Link>
                    <Link onClick={closeMenu} href="/forgot-password" className={buttonVariants({ variant: "ghost", className: "w-full py-6 text-lg" })}>
                      Forgot Password
                    </Link>
                    <button type="button" onClick={handleLogout} disabled={logout.isPending} className={buttonVariants({ variant: "ghost", className: "w-full py-6 text-lg text-red-600 hover:text-red-700 disabled:opacity-60" })}>
                      {logout.isPending ? "Logging out..." : "Logout"}
                    </button>
                  </>
                ) : (
                  <Link
                    onClick={closeMenu}
                    href="/login"
                    className={buttonVariants({ variant: "ghost", className: "w-full py-6 text-lg" })}
                  >
                    Log In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main
        className="flex-1 relative z-10 transition-[padding-top] duration-300 ease-in-out"
        style={{ paddingTop: `calc(4rem + ${isBannerOpen ? bannerHeight : 0}px)` }}
      >
        {children}
      </main>

      <Footer />
    </div>
  );
}
