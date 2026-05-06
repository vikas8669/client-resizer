"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if splash has already been shown in this session
    const hasShown = sessionStorage.getItem('splash-shown');
    
    if (!hasShown) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem('splash-shown', 'true');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          // Use will-change so the browser promotes this to its own GPU composite layer
          style={{ willChange: "opacity" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950 overflow-hidden"
        >
          {/*
            DESKTOP ONLY: animated ambient blobs.
            hidden on mobile (md:block) to avoid expensive blur+scale
            GPU compositing on mobile kills frame rate.
          */}
          <div
            className="hidden md:block absolute w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)",
              top: "-80px",
              left: "-80px",
              willChange: "transform",
            }}
          />
          <div
            className="hidden md:block absolute w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)",
              bottom: "-60px",
              right: "-60px",
              willChange: "transform",
            }}
          />

          {/*
            MOBILE: simple static gradient — no blur, no animation.
            Gives a colorful background without any GPU strain.
          */}
          <div
            className="md:hidden absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at top left, rgba(99,102,241,0.25) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(168,85,247,0.2) 0%, transparent 60%)",
            }}
          />

          {/* Logo mark — GPU-composited via translateZ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="mb-6 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-indigo-500/40"
          >
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
              <rect x="4"  y="4"  width="14" height="14" rx="3" fill="white" fillOpacity="0.9" />
              <rect x="22" y="4"  width="14" height="14" rx="3" fill="white" fillOpacity="0.5" />
              <rect x="4"  y="22" width="14" height="14" rx="3" fill="white" fillOpacity="0.5" />
              <rect x="22" y="22" width="14" height="14" rx="3" fill="white" fillOpacity="0.9" />
            </svg>
          </motion.div>

          {/* "Welcome to" label */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.25, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-indigo-400 mb-2"
          >
            Welcome to
          </motion.p>

          {/* Brand name */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.38, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white"
          >
            Print
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Pix
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.52, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="mt-3 text-zinc-400 text-xs sm:text-sm font-medium text-center px-8"
          >
            AI-powered image processing &amp; design workspace
          </motion.p>

          {/* Loading bar — single translateX animation, very cheap */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="mt-8 w-32 sm:w-40 h-[3px] rounded-full bg-white/10 overflow-hidden"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 1.8, delay: 0.65, ease: "easeInOut" }}
              style={{ willChange: "transform" }}
              className="h-full w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
