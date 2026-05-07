'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Camera, Crop, Grid3X3, Printer, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFeedback } from '@/hooks/useFeedback';

const HOW_TO_USE_STEPS = [
  {
    title: 'Upload Your Photo',
    description: 'Add your image from mobile or desktop. Keep face clearly visible for best passport output.',
    icon: Camera,
  },
  {
    title: 'Adjust Size and Framing',
    description: 'Pick passport size, then nudge the face alignment to center properly before processing.',
    icon: Crop,
  },
  {
    title: 'Generate Print Layout',
    description: 'Choose 8, 16, 32, or 52 copies and create a print-ready A4 sheet with equal spacing.',
    icon: Grid3X3,
  },
  {
    title: 'Download and Print',
    description: 'Download the PDF and print at 100% scale on photo paper for real passport-photo results.',
    icon: Printer,
  },
];

export default function ProductPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitFeedback } = useFeedback();

  const handleSubmitSuggestion = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedSuggestion = suggestion.trim();
    if (!trimmedSuggestion) {
      toast.error('Please enter your suggestion');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitFeedback.mutateAsync({
        name: name.trim() || 'Anonymous',
        email: email.trim(),
        rating: 5,
        comment: trimmedSuggestion,
        type: 'suggestion',
        tags: ['Product Suggestion'],
      });
      setSuggestion('');
      setName('');
      setEmail('');
    } catch {
      // toast is handled in the feedback hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_10%_20%,#fef3c7_0%,transparent_45%),radial-gradient(circle_at_85%_10%,#bfdbfe_0%,transparent_45%),linear-gradient(180deg,#fff7ed_0%,#ffffff_60%)] dark:bg-zinc-950 dark:bg-none py-14 px-4 sm:px-6">
      <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-orange-200/40 dark:bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-sky-200/40 dark:bg-sky-500/10 blur-3xl" />


      <div className="mx-auto w-full max-w-6xl">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-3xl border border-orange-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 p-8 shadow-[0_20px_80px_-30px_rgba(30,64,175,0.45)] dark:shadow-none backdrop-blur-sm sm:p-10"
        >

          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
            <Sparkles className="h-3.5 w-3.5" />
            Print-ready passport workflow
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">How To Use PrintPix Product</h1>
          <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
            PrintPix is an all-in-one online photo tool where users can instantly resize, crop, create, and print passport-size photos for government forms and official documents in one click.
          </p>

          
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 rounded-full text-[13px] text-red-800 dark:text-red-300 font-medium animate-in fade-in slide-in-from-bottom-2 duration-700 shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500 dark:text-red-400" />
            <span>Important Note: Only 20 photo edits are allowed per day per IP address.</span>
          </div>


          <section className="mt-8 grid gap-4 sm:grid-cols-2">

            {HOW_TO_USE_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.article
                  key={step.title}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                  className="group rounded-2xl border border-zinc-200 dark:border-white/5 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-none"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wide text-sky-700 dark:text-sky-400">STEP {index + 1}</span>
                    <span className="rounded-lg bg-sky-100 dark:bg-sky-500/20 p-2 text-sky-700 dark:text-sky-300">
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-zinc-900 dark:text-white">{step.title}</h2>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{step.description}</p>
                </motion.article>

              );
            })}
          </section>

          <section className="mt-10 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/40 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Share Your Suggestion</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Tell us what to improve in this product page or print workflow.</p>

            <form onSubmit={handleSubmitSuggestion} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="suggestion-name" className="dark:text-zinc-300">Name (Optional)</Label>
                  <Input id="suggestion-name" placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} className="dark:bg-zinc-950 dark:border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="suggestion-email" className="dark:text-zinc-300">Email (Optional)</Label>
                  <Input id="suggestion-email" type="email" placeholder="your@email.com" value={email} onChange={(event) => setEmail(event.target.value)} className="dark:bg-zinc-950 dark:border-white/10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="suggestion-text" className="dark:text-zinc-300">Your Suggestion</Label>
                <textarea
                  id="suggestion-text"
                  className="flex min-h-[120px] w-full rounded-md border border-input dark:border-white/10 bg-transparent dark:bg-zinc-950 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
                  placeholder="Example: add crop guide lines, show print paper tips, add live millimeter preview."
                  value={suggestion}
                  onChange={(event) => setSuggestion(event.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button type="submit" className="rounded-xl bg-zinc-900 dark:bg-white dark:text-zinc-950 text-white" disabled={isSubmitting || submitFeedback.isPending}>
                  {isSubmitting || submitFeedback.isPending ? 'Submitting...' : 'Submit Suggestion'}
                </Button>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-300 dark:border-white/10 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </form>
          </section>

        </motion.section>
      </div>
    </main>
  );
}
