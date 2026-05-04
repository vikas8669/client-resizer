"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button, buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import { Footer } from "@/components/Footer";
import { StickyBanner } from "@/components/ui/sticky-banner";
import { SplashScreen } from "@/components/SplashScreen";
import { cn } from "@/lib/utils";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBannerOpen, setIsBannerOpen] = useState(true);
  const [bannerHeight, setBannerHeight] = useState(40);
  const bannerRef = useRef<HTMLDivElement>(null);

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
            <Link href="/login" className="text-sm font-semibold text-zinc-500 hover:text-black dark:hover:text-white">
              Log in
            </Link>
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
                <Link
                  onClick={closeMenu}
                  href="/login"
                  className={buttonVariants({ variant: "ghost", className: "w-full py-6 text-lg" })}
                >
                  Log In
                </Link>
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
