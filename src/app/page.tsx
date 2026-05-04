"use client";

import { motion } from "framer-motion";

import { Hero } from "@/features/landing/components/Hero";
import { Features } from "@/features/landing/components/Features";
import { HowItWorks } from "@/features/landing/components/HowItWorks";
import { CTA } from "@/features/landing/components/CTA";
import { Testimonials } from "@/features/landing/components/Testimonials";
import { EditorWorkspace } from "@/features/editor/components/EditorWorkspace";
import SmartProcessingSection from "@/components/SmartProcessingSection";

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
  return (
    <>
      <InfinityLight />

      {/* HERO - Handled by internal component, but ensure it has responsive padding */}
      <Hero />

      {/* EDITOR WORKSPACE WRAPPER */}
      <section id="editor" className="py-10 md:py-24 px-4 sm:px-6">
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
    </>
  );
}