"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import { Footer } from "@/components/Footer";
import { StickyBanner } from "@/components/ui/sticky-banner";
import { SplashScreen } from "@/components/SplashScreen";
import { AuthUser, getStoredUser } from "@/lib/auth";
import { DesktopNav } from "@/components/navigation/DesktopNav";
import { MobileNav } from "@/components/navigation/MobileNav";
import { UserNav } from "@/components/navigation/UserNav";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const [isBannerOpen, setIsBannerOpen] = useState(true);
  const [bannerHeight, setBannerHeight] = useState(40);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

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
    const refreshUser = () => setUser(getStoredUser());
    refreshUser();
    window.addEventListener("auth-user-updated", refreshUser);
    window.addEventListener("storage", refreshUser);
    return () => {
      window.removeEventListener("auth-user-updated", refreshUser);
      window.removeEventListener("storage", refreshUser);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-[#1E1F25] dark:text-white overflow-x-hidden selection:bg-blue-500/30">
      <SplashScreen />

      <StickyBanner
        ref={bannerRef}
        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white py-1.5 px-3"
        onOpenChange={setIsBannerOpen}
      >
        <div className="flex items-center justify-between sm:justify-center w-full max-w-5xl mx-auto gap-2 pr-6 sm:pr-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="bg-white/20 text-white text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              📱 APK
            </span>
            <p className="text-white text-xs sm:text-sm font-medium truncate">
              <span className="sm:hidden font-bold">PrintPix Android App</span>
              <span className="hidden sm:inline">
                Download <span className="font-extrabold">PrintPix Mobile App</span> for Android!
              </span>
            </p>
          </div>

          <a
            href="https://drive.google.com/uc?export=download&id=1OZsmRfKfE9Jo81LZK3hFxS3iaBtEwqM0"
            target="_blank"
            rel="noopener noreferrer"
            download="PrintPix.apk"
            className="inline-flex items-center gap-1 bg-white text-indigo-950 font-extrabold text-xs sm:text-sm px-3 py-1 rounded-full shadow-md hover:bg-slate-100 transition-all duration-200 hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Download</span>
            <span>⬇️</span>
          </a>
        </div>
      </StickyBanner>

      <motion.header
        animate={{ top: isBannerOpen ? bannerHeight : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 right-0 z-[100] border-b border-zinc-200/90 dark:border-white/5 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 shrink-0 z-50">
            <Logo />
          </Link>

          {/* DESKTOP NESTED NAVIGATION */}
          <DesktopNav />

          {/* DESKTOP ACTIONS: THEME TOGGLE & USER PROFILE / CTA */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <UserNav user={user} />
          </div>

          {/* MOBILE NAVIGATION */}
          <MobileNav user={user} />
        </div>
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
