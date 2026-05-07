'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useFeedback } from '@/hooks/useFeedback';
import { CheckCircle2, MessageSquare, ArrowLeft, Sparkles, Lightbulb, BadgeCheck } from 'lucide-react';
;

export default function SolutionsPage() {
  const { resolvedFeedback, isLoading } = useFeedback();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_10%_20%,#fef3c7_0%,transparent_45%),radial-gradient(circle_at_85%_10%,#bfdbfe_0%,transparent_45%),linear-gradient(180deg,#fff7ed_0%,#ffffff_60%)] dark:bg-zinc-950 dark:bg-none py-16 px-4 sm:px-6">
      <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-orange-200/40 dark:bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-sky-200/40 dark:bg-sky-500/10 blur-3xl" />


      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full border border-orange-200 dark:border-white/10 bg-amber-50 dark:bg-amber-900/20 px-4 py-1.5 text-sm font-semibold text-amber-800 dark:text-amber-400 mb-4"
          >
            <Sparkles className="h-4 w-4" />
            Community-Driven Improvements
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl mb-4"
          >
            Solutions & Suggestions
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
          >
            We listen to your feedback. Here are the suggestions we've implemented and the solutions we've provided to improve your PrintPix experience.
          </motion.p>

        </div>

        <div className="space-y-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
              <p className="text-zinc-500 animate-pulse">Fetching solutions...</p>
            </div>
          ) : resolvedFeedback.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl border border-dashed border-zinc-300 dark:border-white/10 bg-white/50 dark:bg-white/5 p-12 text-center"
            >
              <Lightbulb className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">No resolved suggestions yet</h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">Be the first to share a great idea on our product page!</p>
              <Link href="/product" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-orange-600 transition-all">
                Submit a Suggestion
              </Link>
            </motion.div>

          ) : (
            resolvedFeedback.map((item, index) => (
              <motion.article
                key={item._id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative rounded-3xl border border-orange-100 dark:border-white/5 bg-white/90 dark:bg-zinc-900/60 p-8 shadow-sm backdrop-blur-sm transition-all hover:shadow-xl dark:hover:shadow-none hover:border-orange-200 dark:hover:border-white/10"
              >

                <div className="absolute -top-3 -right-3 rounded-full bg-emerald-500 p-2 text-white shadow-lg group-hover:scale-110 transition-transform">
                  <BadgeCheck className="h-5 w-5" />
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-orange-100 dark:bg-orange-500/20 p-3 text-orange-600 dark:text-orange-400">
                    <MessageSquare className="h-6 w-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-zinc-900 dark:text-white">Suggestion from {item.name || 'Anonymous'}</span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">• {new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-lg text-zinc-700 dark:text-zinc-300 italic leading-relaxed">
                      "{item.comment}"
                    </p>


                    <div className="mt-6 relative">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full" />
                      <div className="pl-6">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Solution Implemented</span>
                        </div>
                        <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                          {item.adminReply}
                        </p>

                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/product"
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 px-8 py-3 text-sm font-semibold text-zinc-900 dark:text-white shadow-sm transition-all hover:bg-zinc-50 dark:hover:bg-white/5 hover:border-zinc-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Product Page
          </Link>

        </div>
      </div>
    </main>
  );
}
