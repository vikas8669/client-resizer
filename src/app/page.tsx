'use client';

import Link from "next/link";
import { Hero } from "@/features/landing/components/Hero";
import { Features } from "@/features/landing/components/Features";
import { HowItWorks } from "@/features/landing/components/HowItWorks";
import { CTA } from "@/features/landing/components/CTA";
import { Testimonials } from "@/features/landing/components/Testimonials";
import { EditorWorkspace } from "@/features/editor/components/EditorWorkspace";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-[#1E1F25] dark:text-white selection:bg-primary/30 overflow-x-hidden w-full">

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200/50 dark:border-white/5 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-semibold text-zinc-500 hover:text-[#1E1F25] dark:hover:text-white transition-colors">
              Product
            </Link>
            <Link href="#how-it-works" className="text-sm font-semibold text-zinc-500 hover:text-[#1E1F25] dark:hover:text-white transition-colors">
              Solutions
            </Link>
            <Link href="#testimonials" className="text-sm font-semibold text-zinc-500 hover:text-[#1E1F25] dark:hover:text-white transition-colors">
              Customers
            </Link>
            <Link href="#pricing" className="text-sm font-semibold text-zinc-500 hover:text-[#1E1F25] dark:hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />

            <Link
              href="#editor"
              className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-[#1E1F25]"
            >
              Log in
            </Link>

            <Button
              size="sm"
              className="rounded-full bg-[#1E1F25] hover:bg-zinc-800 text-white dark:bg-white dark:text-[#1E1F25] px-6"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -mr-2"
            >
              <Menu className="w-6 h-6 text-zinc-900 dark:text-white" />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-200/50 bg-white dark:bg-zinc-950 px-6 py-4 flex flex-col gap-4 shadow-xl absolute w-full left-0">

            <Link
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-zinc-600 dark:text-zinc-300"
            >
              Product
            </Link>

            <Link
              href="#how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-zinc-600 dark:text-zinc-300"
            >
              Solutions
            </Link>

            <Button className="w-full rounded-full bg-primary mt-2">
              Get Started
            </Button>
          </div>
        )}
      </header>

      {/* MAIN */}
      <main className="flex-1">
        <Hero />

        {/* Editor Section */}
        <div
          id="editor"
          className="relative -mt-8 pb-8 sm:pb-16 md:pb-32 bg-background scroll-mt-20 px-2 sm:px-4 md:px-8"
        >
          <div className="container mx-auto">
            <div className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-lg sm:rounded-2xl md:rounded-[2rem] p-2 sm:p-3 md:p-4 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_80px_-20px_rgba(255,255,255,0.05)] ring-1 ring-black/5 overflow-x-hidden">

              {/* Fake Mac Controls */}
              <div className="hidden sm:flex items-center gap-2 mb-4 px-2 pt-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>

              {/* Editor */}
              <div className="bg-white dark:bg-zinc-950 rounded-lg sm:rounded-xl md:rounded-[1.5rem] overflow-hidden border border-zinc-200/50 dark:border-white/5">
                <EditorWorkspace />
              </div>
            </div>
          </div>
        </div>

        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>

      {/* FOOTER */}
      <footer className="py-16 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-white/10 text-center text-zinc-500 text-sm">
        <div className="flex justify-center mb-4">
          <Logo />
        </div>
        <p>
          &copy; {new Date().getFullYear()} PrintPix. All rights reserved.
        </p>
      </footer>
    </div>
  );
}