'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquarePlus, Star, X, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { useFeedback } from '@/hooks/useFeedback';
import { cn } from '@/lib/utils';

export function FloatingReview() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const { submitFeedback } = useFeedback();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please share your thoughts!');
      return;
    }

    try {
      await submitFeedback.mutateAsync({
        name: name.trim() || 'Anonymous',
        email: email.trim(),
        rating,
        comment: comment.trim(),
        type: 'feedback',
      });
      
      toast.success('Thank you for your review!');
      setIsOpen(false);
      // Reset form
      setRating(5);
      setName('');
      setEmail('');
      setComment('');
    } catch (err) {
      toast.error('Failed to submit review. Please try again.');
    }
  };

  return (
    <div className="fixed bottom-24 right-6 sm:bottom-12 sm:right-12 z-[100]">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger 
          render={
            <motion.button
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="group flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 dark:bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] dark:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.2)] transition-colors hover:bg-black dark:hover:bg-zinc-100"
            >
              <MessageSquarePlus className="h-6 w-6 text-white dark:text-zinc-950" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-zinc-950">
                5★
              </span>
            </motion.button>
          }
        />


        <DialogContent className="sm:max-w-[420px] rounded-3xl border-none bg-white dark:bg-zinc-950 p-0 overflow-hidden shadow-2xl mt-10">
          <div className="bg-zinc-900 dark:bg-zinc-900/50 p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Star className="h-6 w-6 text-orange-400 fill-orange-400" />
                Share Your Experience
              </DialogTitle>
              <p className="text-zinc-400 text-sm mt-1">
                Your feedback helps us build a better PrintPix.
              </p>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="flex flex-col items-center justify-center py-2">
              <Label className="text-sm font-medium text-zinc-500 mb-3 uppercase tracking-wider">
                How would you rate us?
              </Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="transition-all hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={cn(
                        "h-8 w-8 transition-colors",
                        star <= (hoverRating || rating)
                          ? "fill-orange-400 text-orange-400"
                          : "text-zinc-200 dark:text-zinc-800"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="rev-name" className="text-xs font-bold uppercase text-zinc-500">Name</Label>
                <Input
                  id="rev-name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl border-zinc-100 dark:border-white/10 dark:bg-zinc-900"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rev-comment" className="text-xs font-bold uppercase text-zinc-500">Review</Label>
                <Textarea
                  id="rev-comment"
                  placeholder="What did you like most?"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="rounded-xl border-zinc-100 dark:border-white/10 dark:bg-zinc-900 resize-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitFeedback.isPending}
              className="w-full h-12 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-lg hover:bg-black dark:hover:bg-zinc-100 transition-all shadow-xl"
            >
              {submitFeedback.isPending ? 'Sending...' : 'Submit Review'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
