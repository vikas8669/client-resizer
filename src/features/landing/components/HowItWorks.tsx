'use client';

import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: "01",
    title: 'Drop your image',
    description: 'Securely upload your photo directly to the browser. We process everything locally for maximum privacy.',
    color: 'from-blue-500/20 to-cyan-500/5'
  },
  {
    number: "02",
    title: 'Tweak and tune',
    description: 'Apply smart presets or manually adjust dimensions and compression quality to fit your exact needs.',
    color: 'from-purple-500/20 to-pink-500/5'
  },
  {
    number: "03",
    title: 'Export & Print',
    description: 'Download the optimized single image or generate a ready-to-print A4 layout with multiple copies.',
    color: 'from-emerald-500/20 to-teal-500/5'
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-32 bg-white dark:bg-zinc-950 relative border-t border-zinc-100 dark:border-white/5 transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="text-center mb-12 md:mb-28 px-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-[#1E1F25] dark:text-white mb-4 md:mb-6">
            Optimized in three clicks.
          </h2>
          <p className="text-base md:text-xl text-zinc-500 dark:text-zinc-400 font-medium">No complex manuals. Just an incredibly fluid workflow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Animated Decorative Connecting Line behind cards */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-zinc-100 dark:bg-white/5 -translate-y-1/2 z-0 overflow-hidden rounded-full">
            <motion.div 
              animate={{ x: ["-100%", "300%"] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="w-1/3 h-full bg-gradient-to-r from-transparent via-primary to-transparent"
            />
          </div>

          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50 dark:to-transparent rounded-[2rem] pointer-events-none" />
              
              <div className="relative p-8 md:p-10 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full overflow-hidden flex flex-col items-center text-center">
                
                {/* Glowing Background effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                {/* Floating Number Badge */}
                <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-white/10 flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                  <span className="text-2xl font-bold text-[#1E1F25] dark:text-white tracking-tighter">{step.number}</span>
                </div>

                <h3 className="text-2xl font-bold text-[#1E1F25] dark:text-white mb-4 tracking-tight">{step.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
