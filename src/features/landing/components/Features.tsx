'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// --- Custom Fancy SVGs ---

const ResizeSvg = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="32" height="32" rx="6" fill="url(#paint0_linear)" fillOpacity="0.2"/>
    <rect x="8" y="8" width="32" height="32" rx="6" stroke="url(#paint1_linear)" strokeWidth="2"/>
    <motion.rect 
      initial={{ x: 16, y: 16, width: 16, height: 16 }}
      whileHover={{ x: 12, y: 12, width: 24, height: 24 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      rx="4" fill="url(#paint2_linear)" className="drop-shadow-md" 
    />
    <defs>
      <linearGradient id="paint0_linear" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2262C7" />
        <stop offset="1" stopColor="#8A2BE2" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="paint1_linear" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2262C7" stopOpacity="0.5" />
        <stop offset="1" stopColor="#8A2BE2" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="paint2_linear" x1="16" y1="16" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2262C7" />
        <stop offset="1" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
  </svg>
);

const CompressSvg = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.path 
      initial={{ pathLength: 1, strokeDashoffset: 0 }}
      whileHover={{ strokeDashoffset: 40 }}
      transition={{ duration: 1, ease: "linear", repeat: Infinity }}
      d="M24 8C15.1634 8 8 15.1634 8 24C8 32.8366 15.1634 40 24 40C32.8366 40 40 32.8366 40 24" 
      stroke="url(#comp_grad)" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 8"
    />
    <motion.circle 
      whileHover={{ scale: 0.8 }} 
      cx="24" cy="24" r="10" fill="url(#comp_solid)" className="drop-shadow-lg" 
    />
    <motion.path 
      whileHover={{ scale: 0.6, opacity: 0 }}
      d="M20 24L24 28L28 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    />
    <defs>
      <linearGradient id="comp_grad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#10B981" />
        <stop offset="1" stopColor="#047857" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id="comp_solid" x1="14" y1="14" x2="34" y2="34" gradientUnits="userSpaceOnUse">
        <stop stopColor="#10B981" />
        <stop offset="1" stopColor="#34D399" />
      </linearGradient>
    </defs>
  </svg>
);

const PresetsSvg = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.path 
      whileHover={{ rotate: 15, scale: 1.1 }}
      d="M20 12L23 20L31 23L23 26L20 34L17 26L9 23L17 20L20 12Z" 
      fill="url(#star_grad1)" className="drop-shadow-md"
    />
    <motion.path 
      whileHover={{ rotate: -15, scale: 1.2 }}
      d="M34 10L35.5 14L39.5 15.5L35.5 17L34 21L32.5 17L28.5 15.5L32.5 14L34 10Z" 
      fill="url(#star_grad2)" 
    />
    <motion.path 
      whileHover={{ scale: 1.3 }}
      d="M12 32L13 35L16 36L13 37L12 40L11 37L8 36L11 35L12 32Z" 
      fill="url(#star_grad3)" 
    />
    <defs>
      <linearGradient id="star_grad1" x1="9" y1="12" x2="31" y2="34" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="1" stopColor="#FCD34D" />
      </linearGradient>
      <linearGradient id="star_grad2" x1="28.5" y1="10" x2="39.5" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EC4899" />
        <stop offset="1" stopColor="#F472B6" />
      </linearGradient>
      <linearGradient id="star_grad3" x1="8" y1="32" x2="16" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8B5CF6" />
        <stop offset="1" stopColor="#C4B5FD" />
      </linearGradient>
    </defs>
  </svg>
);

const PrintLayoutSvg = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="6" width="32" height="36" rx="4" fill="white" stroke="#E5E7EB" strokeWidth="2" className="drop-shadow-lg" />
    <motion.g whileHover={{ gap: 4 }}>
      <rect x="12" y="10" width="10" height="10" rx="2" fill="url(#print_g1)" />
      <rect x="26" y="10" width="10" height="10" rx="2" fill="url(#print_g2)" />
      <rect x="12" y="24" width="10" height="10" rx="2" fill="url(#print_g3)" />
      <rect x="26" y="24" width="10" height="10" rx="2" fill="url(#print_g4)" />
    </motion.g>
    <defs>
      <linearGradient id="print_g1" x1="12" y1="10" x2="22" y2="20" gradientUnits="userSpaceOnUse"><stop stopColor="#3B82F6"/><stop offset="1" stopColor="#60A5FA"/></linearGradient>
      <linearGradient id="print_g2" x1="26" y1="10" x2="36" y2="20" gradientUnits="userSpaceOnUse"><stop stopColor="#10B981"/><stop offset="1" stopColor="#34D399"/></linearGradient>
      <linearGradient id="print_g3" x1="12" y1="24" x2="22" y2="34" gradientUnits="userSpaceOnUse"><stop stopColor="#F59E0B"/><stop offset="1" stopColor="#FCD34D"/></linearGradient>
      <linearGradient id="print_g4" x1="26" y1="24" x2="36" y2="34" gradientUnits="userSpaceOnUse"><stop stopColor="#EC4899"/><stop offset="1" stopColor="#F472B6"/></linearGradient>
    </defs>
  </svg>
);


// --- Features Component ---

const features = [
  {
    icon: <ResizeSvg />,
    title: 'Precision Resizing',
    description: 'Scale your images to exact pixel dimensions without losing quality. Perfect for any platform requirements.',
    colSpan: 'md:col-span-2',
    glowColor: 'from-blue-500/20'
  },
  {
    icon: <CompressSvg />,
    title: 'Smart Compression',
    description: 'Reduce file sizes up to 80% with our intelligent compression algorithms while maintaining visual fidelity.',
    colSpan: 'md:col-span-1',
    glowColor: 'from-emerald-500/20'
  },
  {
    icon: <PresetsSvg />,
    title: 'One-Click Presets',
    description: 'Instantly format photos for Passports, Visas, or social media networks with intelligent predefined ratios.',
    colSpan: 'md:col-span-1',
    glowColor: 'from-amber-500/20'
  },
  {
    icon: <PrintLayoutSvg />,
    title: 'A4 Print Layouts',
    description: 'Automatically tile your photos into beautiful, print-ready A4 composites. Choose from 8 to 52 photos per page.',
    colSpan: 'md:col-span-2',
    glowColor: 'from-pink-500/20'
  }
];

export function Features() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="features" className="py-16 md:py-32 bg-[#F9FAFB] dark:bg-zinc-950 relative overflow-hidden transition-colors duration-500">
      {/* Background ambient glow */}
      <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[600px] bg-primary/5 rounded-[100%] blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
        <div className="max-w-3xl mb-12 md:mb-24 px-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E1F25] dark:text-white mb-4 md:mb-6 tracking-tighter leading-tight">
            Advanced image processing. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
              Beautifully engineered.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`relative group p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden ${feature.colSpan}`}
            >
              {/* Fancy Hover Gradient Glow */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${feature.glowColor} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} 
              />
              
              {/* Inner highlight border to give glass feeling */}
              <div className="absolute inset-0 rounded-3xl md:rounded-[2.5rem] border border-white/40 dark:border-white/5 pointer-events-none" />

              <div className="relative z-10">
                <motion.div className="mb-8">
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl font-bold text-[#1E1F25] dark:text-white mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-base">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
