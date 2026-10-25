'use client';

import React from 'react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus, Sparkles, ShieldCheck } from 'lucide-react';

interface ResumeAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeAuthModal({ isOpen, onClose }: ResumeAuthModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-6 sm:p-7 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 shadow-2xl">
        <DialogHeader className="space-y-2 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-900/40">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <DialogTitle className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
              Sign in to Download Resume
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Please sign in or create a free account so your resume, unlocked downloads, and credits
              are permanently saved to your account.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="my-2 p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-xs text-indigo-700 dark:text-indigo-300 space-y-1.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>Editing and previewing resumes is always 100% free.</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>Purchased credits never expire and stay saved to your profile.</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <Link
            href="/signup"
            className="flex-1 inline-flex items-center justify-center rounded-xl text-xs h-10 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            Create Free Account
          </Link>
          <Link
            href="/login"
            className="flex-1 inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-10 shadow-md transition-colors"
          >
            <LogIn className="w-3.5 h-3.5 mr-1.5" />
            Sign In
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
