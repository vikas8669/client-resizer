"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react"; // Added X for closing
import { motion, AnimatePresence } from "framer-motion";

import { Hero } from "@/features/landing/components/Hero";
import { Features } from "@/features/landing/components/Features";
import { HowItWorks } from "@/features/landing/components/HowItWorks";
import { CTA } from "@/features/landing/components/CTA";
import { Testimonials } from "@/features/landing/components/Testimonials";
import { EditorWorkspace } from "@/features/editor/components/EditorWorkspace";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import { Footer } from "@/components/Footer";
import SmartProcessingSection from "@/components/SmartProcessingSection";
import { StickyBanner } from "@/components/ui/sticky-banner";
import { SplashScreen } from "@/components/SplashScreen";

/* =========================
   INFINITY LIGHT BACKGROUND
========================= */
function InfinityLight() {
  return (
    // Lower z-index to ensure it stays behind everything
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        animate={{ x: [0, 100, 0], opacity: [0.1, 0.2, 0.1] }} // Reduced movement for mobile performance
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-500/20 blur-[80px] md:blur-3xl rounded-full left-[-150px] top-1/3"
      />
      <motion.div
        animate={{ x: [0, -100, 0], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-purple-500/20 blur-[80px] md:blur-3xl rounded-full right-[-150px] top-1/4"
      />
    </div>
  );
}

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBannerOpen, setIsBannerOpen] = useState(true);
  const [bannerHeight, setBannerHeight] = useState(40);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when a link is clicked
  const closeMenu = () => setIsMobileMenuOpen(false);

  // Measure real banner height (handles text wrapping on small screens)
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

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-[#1E1F25] dark:text-white overflow-x-hidden selection:bg-blue-500/30">
      {/* 🎬 SPLASH SCREEN */}
      <SplashScreen />

      <InfinityLight />

      {/* ✅ TOP BANNER */}
      <StickyBanner
        ref={bannerRef}
        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
        onOpenChange={setIsBannerOpen}
      >
        {/* Mobile: short text | Desktop: full text */}
        <p className="text-white text-xs sm:text-sm md:text-base font-medium text-center leading-snug px-8">
          <span className="md:hidden">
            👋 <span className="font-bold">PrintPix</span> —{" "}
            <a href="#features" className="underline hover:opacity-80 transition">Explore features</a>
          </span>
          <span className="hidden md:inline">
            👋 Welcome to <span className="font-bold">PrintPix</span> — AI-powered image processing & design workspace.{" "}
            <a href="#features" className="underline ml-2 hover:opacity-80 transition">Explore features</a>
          </span>
        </p>
      </StickyBanner>

      {/* ================= NAVBAR ================= */}
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
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Link href="#login" className="text-sm font-semibold text-zinc-500 hover:text-black dark:hover:text-white">
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
                <Link onClick={closeMenu} href="#features">Product</Link>
                <Link onClick={closeMenu} href="#solutions">Solutions</Link>
                <Link onClick={closeMenu} href="#testimonials">Customers</Link>
                <Link onClick={closeMenu} href="#pricing">Pricing</Link>
              </div>
              <hr className="border-zinc-100 dark:border-white/5" />
              <div className="flex flex-col gap-4">
                <Button className="w-full py-6 text-lg rounded-xl">Get Started</Button>
                <Button variant="ghost" className="w-full py-6 text-lg">Log In</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ================= MAIN ================= */}
      {/* paddingTop = navbar (64px) + banner height (or 0) so content never hides under fixed stack */}
      <main
        className="flex-1 relative z-10 transition-[padding-top] duration-300 ease-in-out"
        style={{ paddingTop: `calc(4rem + ${isBannerOpen ? bannerHeight : 0}px)` }}
      >

        {/* HERO - Handled by internal component, but ensure it has responsive padding */}
        <Hero />

        {/* EDITOR WORKSPACE WRAPPER */}
        <section id="editor" className="py-12 md:py-24 px-4 sm:px-6">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl md:rounded-[2.5rem] p-2 md:p-4 shadow-2xl overflow-hidden"
            >
              {/* Browser-like window header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-white/5 md:border-none">
                <div className="flex gap-1.5 md:gap-2">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-400" />
                </div>
                <div className="md:hidden text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                  Editor Preview
                </div>
                <div className="w-12 hidden md:block" /> {/* Spacer */}
              </div>

              {/* The Actual Workspace */}
              <div className="bg-white dark:bg-zinc-950 rounded-xl overflow-hidden border border-zinc-200 dark:border-white/10 shadow-inner">
                {/* Ensure EditorWorkspace is internally responsive */}
                <EditorWorkspace />
              </div>
            </motion.div>
          </div>
        </section>

        {/* CORE SECTIONS */}
        <section id="features" className="relative">
          <Features />
        </section>

        <section className="py-12 md:py-20 bg-zinc-50/30 dark:bg-zinc-900/10">
          <SmartProcessingSection />
        </section>

        <section id="how-it-works">
          <HowItWorks />
        </section>

        <section id="testimonials">
          <Testimonials />
        </section>

        <section className="pb-20">
          <CTA />
        </section>
      </main>

      <Footer />
    </div>
  );
}