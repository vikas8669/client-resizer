'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function CTA() {
  return (
    <section className="py-12 sm:py-16 md:py-24 relative overflow-hidden bg-background border-t border-border transition-colors duration-500">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-20 mix-blend-overlay pointer-events-none" />
      
      {/* Animated Energy Wave Background */}
      <div className="absolute bottom-0 left-0 right-0 h-[200px] sm:h-[300px] md:h-[400px] overflow-hidden pointer-events-none opacity-40 dark:opacity-20 translate-y-[15%] sm:translate-y-[25%] md:translate-y-[30%]">
        <svg viewBox="0 0 1000 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
          <path d="M 0,100 C 250,200 750,0 1000,100" stroke="currentColor" strokeWidth="2" className="text-zinc-200 dark:text-zinc-800" />
          <motion.path 
            d="M 0,100 C 250,200 750,0 1000,100" 
            stroke="url(#cta_glow)" 
            strokeWidth="6" 
            strokeLinecap="round" 
            pathLength="100" 
            strokeDasharray="40 100"
            animate={{ strokeDashoffset: [100, -100] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ willChange: 'stroke-dashoffset' }}
          />
          <defs>
            <linearGradient id="cta_glow" x1="0" y1="0" x2="1" y2="0">
              <stop stopColor="#3B82F6" stopOpacity="0" />
              <stop offset="0.5" stopColor="#2262C7" />
              <stop offset="1" stopColor="#60A5FA" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto rounded-2xl sm:rounded-3xl bg-white dark:bg-gradient-to-br dark:from-primary/20 dark:via-zinc-900 dark:to-purple-500/20 p-6 sm:p-8 md:p-20 text-center border border-zinc-200 dark:border-white/10 shadow-xl dark:shadow-[0_0_100px_rgba(255,255,255,0.05)] backdrop-blur-2xl"
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-zinc-950 dark:text-white mb-3 sm:mb-4 md:mb-6 tracking-tight">
            Ready to enhance your images?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-zinc-600 dark:text-zinc-300 mb-6 sm:mb-8 md:mb-10 max-w-xl mx-auto">
            Join thousands of users processing images effortlessly. No credit card required. No sign-up wall. Just instant access.
          </p>
          
          <a
            href="#editor"
            className="inline-flex items-center justify-center px-5 sm:px-6 md:px-8 py-3 md:py-4 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold text-sm sm:text-base md:text-lg shadow-lg dark:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-xl dark:hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-105 transition-all"
          >
            Open Editor
          </a>
        </motion.div>
      </div>
    </section>
  );
}
