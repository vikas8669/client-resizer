'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Check, ShieldCheck, Zap, RefreshCw, Loader2, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResumePackItem } from '../hooks/useResumePayment';

interface ResumePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: ResumePackItem[];
  currentCredits: number;
  onSelectPack: (packId: string) => Promise<void>;
  isProcessing?: boolean;
}

export function ResumePaymentModal({
  isOpen,
  onClose,
  plans,
  currentCredits,
  onSelectPack,
  isProcessing = false,
}: ResumePaymentModalProps) {
  // Default to the 5 downloads popular pack
  const [selectedPackId, setSelectedPackId] = useState<string>(
    plans.find((p) => p.credits === 5)?.id || plans[0]?.id || '5_downloads'
  );

  const selectedPack = plans.find((p) => p.id === selectedPackId) || plans[0];

  const handlePay = async () => {
    if (selectedPackId) {
      await onSelectPack(selectedPackId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isProcessing && onClose()}>
      <DialogContent className="sm:max-w-2xl p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 shadow-2xl">
        <DialogHeader className="space-y-2.5 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-900/40">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <DialogTitle className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              Get Resume Download Credits
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto mt-1.5">
              Pay only when you download. No monthly subscription or hidden fees.
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-3">
          {plans.map((pack) => {
            const isSelected = selectedPackId === pack.id;
            const isPopular = pack.id === '5_downloads';

            return (
              <div
                key={pack.id}
                onClick={() => !isProcessing && setSelectedPackId(pack.id)}
                className={cn(
                  'relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer select-none text-left',
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-md ring-2 ring-indigo-600/20'
                    : 'border-zinc-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/50'
                )}
              >
                {/* Popular or Recommended Badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-zinc-900 dark:text-white">
                      {pack.name}
                    </span>
                    {pack.badge && !isPopular && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold">
                        {pack.badge}
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mt-2.5 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-zinc-900 dark:text-white">
                      ₹{pack.priceRupees}
                    </span>
                  </div>

                  {/* Per download tag */}
                  <div className="mt-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    {pack.tag}
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    {pack.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {pack.credits} {pack.credits === 1 ? 'Credit' : 'Credits'}
                  </span>
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center transition-colors',
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'border border-zinc-300 dark:border-zinc-700 text-transparent'
                    )}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits & Policy Guarantees */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/5 space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>
              <strong>Zero double-charging:</strong> Re-downloading the same resume is always free
              with 0 credits deducted.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>
              <strong>Credits never expire:</strong> Unused credits remain saved in your account for
              future resume downloads.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>
              <strong>Instant & Secure:</strong> Razorpay cryptographic verification with UPI,
              Cards, & Netbanking.
            </span>
          </div>
        </div>

        {/* Pay CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 text-center sm:text-left">
            Current balance:{' '}
            <span className="font-semibold text-zinc-900 dark:text-white">
              {currentCredits} credit{currentCredits === 1 ? '' : 's'}
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 sm:flex-initial rounded-xl text-xs h-10 px-4"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePay}
              disabled={isProcessing || !selectedPack}
              className="flex-1 sm:flex-initial rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-10 px-6 shadow-md transition-all cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                  Pay ₹{selectedPack?.priceRupees || 9} via Razorpay
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
