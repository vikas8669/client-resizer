'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Quote, ArrowLeft, Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useFeedback } from '@/hooks/useFeedback';
import { cn } from '@/lib/utils';

export default function CustomersPage() {
  const { topFeedback, averageRating, isLoading } = useFeedback();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-bold mb-6"
          >
            <Heart className="h-4 w-4 fill-orange-500" />
            Wall of Love
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6"
          >
            What Our Customers Say
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
          >
            Real stories from people who use PrintPix to simplify their professional and personal image workflows.
          </motion.p>

          {/* Aggregate Rating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 flex flex-col items-center"
          >
            <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 px-6 py-4 rounded-3xl shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-100 dark:border-white/5">
              <div className="text-center pr-6 border-right border-zinc-100 dark:border-white/10">
                <div className="text-3xl font-black text-zinc-900 dark:text-white">
                  {(averageRating?.average || 0).toFixed(1)}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Average</div>
              </div>
              <div className="flex flex-col">
                <div className="flex gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={cn(
                        "h-4 w-4", 
                        s <= Math.round(averageRating?.average || 0) 
                          ? "fill-orange-400 text-orange-400" 
                          : "text-zinc-200 dark:text-zinc-800"
                      )} 
                    />
                  ))}
                </div>
                <div className="text-sm font-medium text-zinc-500">
                  Based on {averageRating?.total || 0} reviews
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-3 gap-6"
          >
            {topFeedback.map((review) => (
              <motion.div
                key={review._id}
                variants={item}
                className="group relative bg-white dark:bg-zinc-900/50 p-8 rounded-3xl border border-zinc-100 dark:border-white/5 transition-all hover:shadow-2xl hover:shadow-zinc-200/50 dark:hover:shadow-none hover:-translate-y-2"
              >
                <div className="absolute top-6 right-8 text-zinc-100 dark:text-zinc-800 transition-colors group-hover:text-orange-100 dark:group-hover:text-orange-950/30">
                  <Quote className="h-10 w-10 rotate-180" />
                </div>
                
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={cn(
                        "h-3.5 w-3.5", 
                        s <= review.rating 
                          ? "fill-orange-400 text-orange-400" 
                          : "text-zinc-200 dark:text-zinc-800"
                      )} 
                    />
                  ))}
                </div>

                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed italic mb-8 relative z-10">
                  "{review.comment}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white font-bold text-sm uppercase">
                    {review.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <div className="font-bold text-zinc-900 dark:text-white text-sm">
                      {review.name || 'Anonymous'}
                    </div>
                    <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                      Verified User
                    </div>
                  </div>
                </div>
              </motion.div>

            ))}
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-24 text-center"
        >
          <div className="bg-gradient-to-br from-zinc-900 to-black p-12 rounded-[3rem] text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <Sparkles className="h-32 w-32" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4">Be our next success story</h2>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              Join thousands of users who have streamlined their printing workflow with PrintPix.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-white text-zinc-950 px-8 py-4 rounded-2xl font-bold hover:bg-zinc-100 transition-colors shadow-xl"
              >
                Try PrintPix Now
              </Link>
              <Link
                href="/solutions"
                className="bg-zinc-800 text-white px-8 py-4 rounded-2xl font-bold hover:bg-zinc-700 transition-colors"
              >
                View Community Solutions
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
