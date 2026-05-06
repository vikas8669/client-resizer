'use client';

import React, { useEffect } from 'react';
import { Star } from 'lucide-react';
import { useFeedback } from '@/hooks/useFeedback';
import { motion } from 'framer-motion';

export function Testimonials() {
  const { feedback: testimonials, isLoading, refetch } = useFeedback();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <p className="text-zinc-500">Loading testimonials...</p>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) return null;

  // duplicate for infinite effect
  const row1 = testimonials.slice(0, 6);
  const row2 = testimonials.slice(6, 12).length
    ? testimonials.slice(6, 12)
    : testimonials.slice(0, 6);

  const duplicatedRow1 = [...row1, ...row1];
  const duplicatedRow2 = [...row2, ...row2];

  return (
    <div className="py-24 relative overflow-hidden border-t border-zinc-200 dark:border-zinc-800">

      {/* 🌫️ Fog edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-black to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-black to-transparent z-10" />

      <div className="max-w-6xl mx-auto text-center mb-16 px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
          Loved by users worldwide
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Real feedback from real users using your platform.
        </p>
      </div>

      {/* 🔥 ROW 1 (LEFT → RIGHT) */}
      <motion.div
        className="flex gap-6 mb-8"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: 25,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {duplicatedRow1.map((item, i) => (
          <Card key={i} item={item} />
        ))}
      </motion.div>

      {/* 🔥 ROW 2 (RIGHT → LEFT) */}
      <motion.div
        className="flex gap-6"
        animate={{ x: ['-50%', '0%'] }}
        transition={{
          duration: 25,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {duplicatedRow2.map((item, i) => (
          <Card key={i} item={item} />
        ))}
      </motion.div>
    </div>
  );
}

/* 💎 Card Component */
function Card({ item }: any) {
  return (
    <div className="
      min-w-[280px] max-w-[280px]
      group relative
      bg-white/70 dark:bg-zinc-900/70
      backdrop-blur-xl
      border border-zinc-200/60 dark:border-zinc-800/60
      rounded-2xl p-6
      shadow-sm hover:shadow-xl
      transition-all duration-300
    ">

      {/* ✨ Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 blur-xl" />
      </div>

      {/* ⭐ Stars */}
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < item.rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-zinc-300 dark:text-zinc-700'
            }`}
          />
        ))}
      </div>

      {/* 💬 Text */}
      <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-4 line-clamp-4">
        “{item.comment}”
      </p>

      {/* 🏷️ Tags */}
      {item.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {item.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-[10px] uppercase font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 👤 User */}
      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        {item.name || 'Anonymous'}
      </p>
    </div>
  );
}