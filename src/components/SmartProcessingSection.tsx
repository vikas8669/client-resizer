"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Image as ImageIcon, Zap, Sparkles, CheckCircle2 } from "lucide-react";

/* =========================
   STAGGERED BEAM COMPONENT
========================= */

type BeamProps = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  fromRef: React.RefObject<HTMLDivElement | null>;
  toRef: React.RefObject<HTMLDivElement | null>;
  curvature?: number;
  pathColor?: string;
  duration?: number;
  delay?: number;
  repeatDelay?: number;
};

function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  pathColor = "#6366f1",
  duration = 2,
  delay = 0,
  repeatDelay = 1,
}: BeamProps) {
  const [d, setD] = useState("");
  const id = useId();

  useEffect(() => {
    const update = () => {
      if (!containerRef.current || !fromRef.current || !toRef.current) return;
      const c = containerRef.current.getBoundingClientRect();
      const a = fromRef.current.getBoundingClientRect();
      const b = toRef.current.getBoundingClientRect();

      const startX = a.left + a.width / 2 - c.left;
      const startY = a.top + a.height / 2 - c.top;
      const endX = b.left + b.width / 2 - c.left;
      const endY = b.top + b.height / 2 - c.top;

      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2 + curvature;
      setD(`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [containerRef, fromRef, toRef, curvature]);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
      <defs>
        <motion.linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          animate={{ x1: ["0%", "100%"], x2: ["0%", "120%"] }}
          transition={{ duration, delay, repeat: Infinity, repeatDelay, ease: "easeInOut" }}
        >
          <stop stopColor={pathColor} stopOpacity="0" />
          <stop offset="50%" stopColor={pathColor} stopOpacity="1" />
          <stop offset="100%" stopColor={pathColor} stopOpacity="0" />
        </motion.linearGradient>
      </defs>
      <path d={d} stroke={pathColor} strokeWidth="2" fill="none" opacity="0.1" />
      <path d={d} stroke={`url(#${id})`} strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* =========================
   NODE COMPONENT
========================= */

function Node({ icon: Icon, innerRef, className = "" }: { icon: any; innerRef: any; className?: string }) {
  return (
    <motion.div
      ref={innerRef}
      whileHover={{ scale: 1.05 }}
      className={`z-10 w-16 h-16 rounded-2xl border bg-white dark:bg-zinc-900 flex items-center justify-center shadow-lg dark:shadow-indigo-500/10 relative group ${className}`}
    >
      <Icon className="w-6 h-6 text-zinc-600 dark:text-zinc-400 group-hover:text-indigo-500 transition-colors" />
    </motion.div>
  );
}

/* =========================
   MAIN COMPONENT
========================= */

export default function SmartProcessingSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const aiRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);
  const zapRef = useRef<HTMLDivElement | null>(null);
  const outRef = useRef<HTMLDivElement | null>(null);

  return (
    <section className="relative w-full py-32  dark:bg-zinc-950 overflow-hidden">
      
      {/* ================= UPDATED LEFT-TO-RIGHT FADE GRID ================= */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 
            bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] 
            dark:bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] 
            bg-[size:40px_40px]
            [mask-image:linear-gradient(to_right,black_0%,transparent_100%)]" 
        />
        
        {/* Secondary Vertical/Horizontal Soft Fades to blend edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-zinc-950 dark:via-transparent dark:to-zinc-950 opacity-100" />
      </div>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
        
        {/* TEXT CONTENT */}
        <div className="order-2 md:order-1">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-indigo-500 font-semibold tracking-wider uppercase text-xs">Neural Infrastructure</span>
            <h2 className="text-5xl font-bold mt-2 tracking-tight text-zinc-900 dark:text-white leading-tight">
              Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Processing</span>
            </h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 mt-6 leading-relaxed">
              Experience lightning-fast image transformation with our asynchronous processing pipeline.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                { label: "AI Upscaling", color: "text-blue-500" },
                { label: "Predictive Compression", color: "text-purple-500" },
                { label: "Instant CDN Purge", color: "text-pink-500" }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                  <CheckCircle2 className={`w-5 h-5 ${item.color}`} />
                  {item.label}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ANIMATION BOX */}
        <div
          ref={containerRef}
          className="order-1 md:order-2 relative h-[450px] w-full flex items-center justify-center rounded-[2.5rem] backdrop-blur-md"
        >
          {/* INPUT NODES (Left) */}
          <div className="absolute left-10 flex flex-col gap-12">
            <Node icon={Brain} innerRef={aiRef} className="border-blue-500/20" />
            <Node icon={ImageIcon} innerRef={imgRef} className="border-purple-500/20" />
            <Node icon={Zap} innerRef={zapRef} className="border-pink-500/20" />
          </div>

          {/* OUTPUT HUB (Right) */}
          <div className="absolute right-10">
            <Node 
              icon={Sparkles} 
              innerRef={outRef} 
              className="w-24 h-24 border-indigo-500/30  dark:bg-zinc-800" 
            />
          </div>

          <AnimatedBeam containerRef={containerRef} fromRef={aiRef} toRef={outRef} curvature={-60} pathColor="#3b82f6" duration={1.8} delay={0} repeatDelay={0.5} />
          <AnimatedBeam containerRef={containerRef} fromRef={imgRef} toRef={outRef} curvature={0} pathColor="#a855f7" duration={2.5} delay={0.4} repeatDelay={1.2} />
          <AnimatedBeam containerRef={containerRef} fromRef={zapRef} toRef={outRef} curvature={60} pathColor="#ec4899" duration={1.5} delay={1.8} repeatDelay={0.1} />
        </div>
      </div>
    </section>
  );
}