"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";

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



/* =========================
   INFINITY LIGHT BACKGROUND
========================= */
function InfinityLight() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      <motion.div
        animate={{ x: [0, 300, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[600px] h-[600px] bg-blue-500/20 blur-3xl rounded-full left-[-250px] top-1/3"
      />

      <motion.div
        animate={{ x: [0, -300, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full right-[-250px] top-1/4"
      />

      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute w-[700px] h-[700px] bg-pink-500/10 blur-[120px] rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}

/* =========================
   MAIN PAGE
========================= */
export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-[#1E1F25] dark:text-white overflow-x-hidden">

      {/* GLOBAL LIGHT BACKGROUND */}
      <InfinityLight />

      {/* ================= NAVBAR ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200/50 dark:border-white/5 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">

        <div className="container mx-auto px-6 h-16 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-semibold text-zinc-500 hover:text-black dark:hover:text-white">
              Product
            </Link>
            <Link href="#how-it-works" className="text-sm font-semibold text-zinc-500 hover:text-black dark:hover:text-white">
              Solutions
            </Link>
            <Link href="#testimonials" className="text-sm font-semibold text-zinc-500 hover:text-black dark:hover:text-white">
              Customers
            </Link>
            <Link href="#pricing" className="text-sm font-semibold text-zinc-500 hover:text-black dark:hover:text-white">
              Pricing
            </Link>
          </nav>

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />

            <Link href="#editor" className="text-sm font-semibold text-zinc-500">
              Log in
            </Link>

            <Button className="rounded-full bg-black text-white dark:bg-white dark:text-black px-6">
              Get Started
            </Button>
          </div>

          {/* MOBILE */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu />
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-zinc-950 px-6 py-4 flex flex-col gap-4 border-t">
            <Link href="#features">Product</Link>
            <Link href="#how-it-works">Solutions</Link>
            <Button className="w-full">Get Started</Button>
          </div>
        )}
      </header>

      {/* ================= MAIN ================= */}
      <main className="flex-1 pt-20">

        {/* HERO */}
        <Hero />

        {/* EDITOR */}
        <div id="editor" className="relative py-20 px-4 sm:px-6 md:px-10">

          <div className="container mx-auto">

            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl md:rounded-[2rem] p-4 shadow-xl">

              {/* mac controls */}
              <div className="hidden sm:flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>

              <div className="bg-white dark:bg-zinc-950 rounded-xl overflow-hidden border border-zinc-200 dark:border-white/10">
                <EditorWorkspace />
              </div>

            </div>

          </div>
        </div>

        {/* FEATURES */}
        <Features />
        {/* <PrintPixHeroAndFeature /> */}
        <SmartProcessingSection />
        {/* HOW IT WORKS */}
        <HowItWorks />

        {/* TESTIMONIALS */}
        <Testimonials />

        {/* CTA */}
        <CTA />

        {/* ================= PRINTPIX SECTION ================= */}



      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}