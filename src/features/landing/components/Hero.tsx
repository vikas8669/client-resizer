'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-12 md:pt-20 pb-20 bg-background overflow-hidden flex flex-col items-center">
      
      {/* ================= NEW HIGH-VISIBILITY GRID ================= */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Primary Grid Lines */}
        <div 
          className="absolute inset-0 
            bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] 
            dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] 
            bg-[size:40px_40px] 
            [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_10%,transparent_100%)]" 
        />
        
        {/* Secondary Micro-Dot Pattern */}
        <div 
          className="absolute inset-0 
            bg-[radial-gradient(#80808012_1px,transparent_1px)] 
            dark:bg-[radial-gradient(#ffffff08_1px,transparent_1px)] 
            bg-[size:20px_20px] 
            [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_10%,transparent_100%)]" 
        />
      </div>

      {/* Animated Neural Paths (Maintained from your original) */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-40 dark:opacity-20 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1000 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMin slice">
          <path d="M -100,200 C 300,100 600,400 1100,150" stroke="currentColor" strokeWidth="1" className="text-zinc-200 dark:text-zinc-800" />
          <motion.path 
            d="M -100,200 C 300,100 600,400 1100,150" stroke="url(#hero_glow1)" strokeWidth="3" strokeLinecap="round" pathLength="100" strokeDasharray="15 100"
            animate={{ strokeDashoffset: [100, -100] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
          <path d="M -100,600 C 400,600 500,200 1100,300" stroke="currentColor" strokeWidth="1" className="text-zinc-200 dark:text-zinc-800" />
          <motion.path 
            d="M -100,600 C 400,600 500,200 1100,300" stroke="url(#hero_glow2)" strokeWidth="2" strokeLinecap="round" pathLength="100" strokeDasharray="10 100"
            animate={{ strokeDashoffset: [-100, 100] }} transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          />
          <path d="M 200,-100 C 200,300 800,500 800,900" stroke="currentColor" strokeWidth="1" className="text-zinc-200 dark:text-zinc-800" />
          <motion.path 
            d="M 200,-100 C 200,300 800,500 800,900" stroke="url(#hero_glow3)" strokeWidth="2" strokeLinecap="round" pathLength="100" strokeDasharray="20 100"
            animate={{ strokeDashoffset: [100, -100] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          <defs>
            <linearGradient id="hero_glow1" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#3B82F6" stopOpacity="0" /><stop offset="0.5" stopColor="#2262C7" /><stop offset="1" stopColor="#60A5FA" stopOpacity="0" /></linearGradient>
            <linearGradient id="hero_glow2" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#8B5CF6" stopOpacity="0" /><stop offset="0.5" stopColor="#6D28D9" /><stop offset="1" stopColor="#C4B5FD" stopOpacity="0" /></linearGradient>
            <linearGradient id="hero_glow3" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#10B981" stopOpacity="0" /><stop offset="0.5" stopColor="#047857" /><stop offset="1" stopColor="#34D399" stopOpacity="0" /></linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center">
        <div className="flex flex-col items-center">
          {/* Top Pill Badge */}
          <a href="#how-it-works" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 text-sm font-medium mb-8 hover:bg-zinc-200/50 transition-colors">
            🎉 Announcing ImageSaaS 2.0 <ArrowRight className="w-3 h-3" />
          </a>
          
          {/* Massive Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tighter text-[#1E1F25] dark:text-white mb-4 md:mb-6 max-w-5xl mx-auto leading-[1.1] md:leading-[1.05] px-2">
            The intelligent operating system for <br className="md:hidden" /><span className="text-primary">images</span>.
          </h1>
          
          {/* Sub-headline */}
          <p className="text-base md:text-xl text-zinc-500 dark:text-zinc-400 mb-8 md:mb-10 max-w-2xl mx-auto font-medium leading-relaxed px-4">
            Resize, compress, optimize, and generate print layouts directly in your browser. Engineered for speed, privacy, and pristine quality.
          </p>

          {/* Dual Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              href="#editor"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-full bg-primary text-white font-semibold text-base shadow-sm hover:shadow-md transition-all"
            >
              Start editing for free
            </motion.a>
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              href="#how-it-works"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-sm text-[#1E1F25] dark:text-white border border-zinc-200 dark:border-white/10 font-semibold text-base shadow-sm hover:bg-zinc-50 transition-all"
            >
              See how it works
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}