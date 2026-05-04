// components/InfinityLight.tsx
"use client";

import { motion } from "framer-motion";

export default function InfinityLight() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* LEFT GLOW */}
      <motion.div
        animate={{ x: [0, 300, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[600px] h-[600px] bg-blue-500/20 blur-3xl rounded-full left-[-250px] top-1/3"
      />

      {/* RIGHT GLOW */}
      <motion.div
        animate={{ x: [0, -300, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full right-[-250px] top-1/4"
      />

      {/* CENTER SOFT LIGHT */}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute w-[700px] h-[700px] bg-pink-500/10 blur-[120px] rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}