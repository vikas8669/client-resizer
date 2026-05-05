'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFeedback } from '@/hooks/useFeedback';

const HOW_TO_USE_STEPS = [
  {
    title: 'Upload Your Photo',
    description: 'Add your image from mobile or desktop. Keep face clearly visible for best passport output.',
  },
  {
    title: 'Adjust Size and Framing',
    description: 'Pick passport size, then nudge the face alignment to center properly before processing.',
  },
  {
    title: 'Generate Print Layout',
    description: 'Choose 8, 16, 32, or 52 copies and create a print-ready A4 sheet with equal spacing.',
  },
  {
    title: 'Download and Print',
    description: 'Download the PDF and print at 100% scale on photo paper for real passport-photo results.',
  },
];

export default function ProductPage() {
  const [name, setName] = useState('');
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
        rating: 5,
        comment: `[Product Page Suggestion] ${trimmedSuggestion}`,
        tags: ['Product Suggestion'],
      });
      setSuggestion('');
      setName('');
    } catch {
      // toast is handled in the feedback hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-sky-50 py-14 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <div className="rounded-3xl border border-zinc-200 bg-white/90 shadow-xl p-8 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900">How To Use PrintPix Product</h1>
          <p className="mt-3 text-zinc-600">
            Follow these quick steps to create proper passport photos and print them cleanly on an A4 sheet.
          </p>

          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            {HOW_TO_USE_STEPS.map((step, index) => (
              <article key={step.title} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <p className="text-xs font-semibold tracking-wide text-sky-700">STEP {index + 1}</p>
                <h2 className="mt-1 text-lg font-semibold text-zinc-900">{step.title}</h2>
                <p className="mt-2 text-sm text-zinc-600">{step.description}</p>
              </article>
            ))}
          </section>

          <section className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-zinc-900">Share Your Suggestion</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Tell us what to improve in this product page or photo-print workflow.
            </p>

            <form onSubmit={handleSubmitSuggestion} className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="suggestion-name">Name (Optional)</Label>
                <Input
                  id="suggestion-name"
                  placeholder="Your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="suggestion-text">Your Suggestion</Label>
                <textarea
                  id="suggestion-text"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Example: add crop guide lines, show print paper tips, add live millimeter preview."
                  value={suggestion}
                  onChange={(event) => setSuggestion(event.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button type="submit" disabled={isSubmitting || submitFeedback.isPending}>
                  {isSubmitting || submitFeedback.isPending ? 'Submitting...' : 'Submit Suggestion'}
                </Button>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
