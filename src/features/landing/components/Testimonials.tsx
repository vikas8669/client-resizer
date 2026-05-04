'use client';

import React, { useEffect } from 'react';
import { Star } from 'lucide-react';
import { useFeedback } from '@/hooks/useFeedback';

interface Feedback {
  _id: string;
  name?: string;
  rating: number;
  comment: string;
  tags: string[];
  createdAt: string;
}

export function Testimonials() {
  const { feedback: testimonials, isLoading, refetch } = useFeedback();

  // Attempt to fetch testimonials once on component mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="py-20 md:py-24 bg-background relative border-t border-border transition-colors duration-500">
        <div className="container mx-auto px-4 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <div className="py-20 md:py-24 bg-background relative border-t border-border transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white mb-4 md:mb-6">
            Loved by users worldwide
          </h2>
          <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400">
            See what our users have to say about their experience with ImageSaaS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {testimonials.slice(0, 6).map((testimonial) => (
            <div key={testimonial._id} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] flex flex-col h-full hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-300 dark:text-zinc-600'}`} 
                  />
                ))}
              </div>
              <p className="text-zinc-700 dark:text-zinc-300 flex-1 mb-6">&ldquo;{testimonial.comment}&rdquo;</p>
              
              <div className="mt-auto flex flex-col gap-3">
                {testimonial.tags && testimonial.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {testimonial.tags.map(tag => (
                      <span key={tag} className="text-[10px] uppercase font-bold tracking-wider bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300 border border-primary/20 px-2 py-1 rounded-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                  {testimonial.name || 'Anonymous User'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
