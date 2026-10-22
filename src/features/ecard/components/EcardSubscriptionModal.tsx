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
import { Check, Sparkles, Shield, Zap, Lock, Loader2, ArrowRight } from 'lucide-react';
import { FormattedPlan } from '../hooks/useEcardAccess';
import { cn } from '@/lib/utils';

interface EcardSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: FormattedPlan[];
  onSelectPlan: (planId: string) => Promise<void>;
  isProcessing?: boolean;
  isLimitExhausted?: boolean;
  freeMonthlyLimit?: number;
}

export function EcardSubscriptionModal({
  isOpen,
  onClose,
  plans,
  onSelectPlan,
  isProcessing = false,
  isLimitExhausted = false,
  freeMonthlyLimit = 5,
}: EcardSubscriptionModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    plans.find((p) => p.durationMonths === 3)?.id || plans[0]?.id || '3-months'
  );

  const handlePurchase = async (planId: string) => {
    setSelectedPlanId(planId);
    await onSelectPlan(planId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 shadow-2xl">
        <DialogHeader className="space-y-3 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-900/40">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <DialogTitle className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              {isLimitExhausted
                ? `You've used all ${freeMonthlyLimit} free cuts this month`
                : 'Upgrade to E-Card Cutter Unlimited'}
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto mt-2">
              Choose a plan to continue using Aadhaar, PAN, driving licence, voter ID, and other E-Card
              Cutter tools with exact-size vector print generation.
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {plans.map((plan) => {
            const isPopular = plan.durationMonths === 3;
            const isSelected = selectedPlanId === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={cn(
                  'relative flex flex-col justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer',
                  isSelected
                    ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/20 shadow-md'
                    : 'border-zinc-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/50'
                )}
              >
                {/* Popular or Savings Badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{plan.name}</h4>
                    {plan.discountPercent > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold">
                        {plan.discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Pricing Display */}
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-zinc-900 dark:text-white">
                      ₹{plan.offerPriceRupees}
                    </span>
                    {plan.savingsRupees > 0 && (
                      <span className="text-xs text-zinc-400 line-through">
                        ₹{plan.regularPriceRupees}
                      </span>
                    )}
                    <span className="text-xs text-zinc-500">
                      / {plan.durationMonths} {plan.durationMonths === 1 ? 'mo' : 'mos'}
                    </span>
                  </div>

                  {plan.savingsRupees > 0 && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                      Save ₹{plan.savingsRupees} on this plan
                    </p>
                  )}

                  {/* Features List */}
                  <ul className="mt-4 space-y-2 border-t border-zinc-100 dark:border-white/5 pt-3">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  type="button"
                  size="sm"
                  disabled={isProcessing}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePurchase(plan.id);
                  }}
                  className={cn(
                    'mt-5 w-full rounded-xl text-xs font-bold cursor-pointer transition-all',
                    isSelected
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                      : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-600 hover:text-white text-zinc-700 dark:text-zinc-200'
                  )}
                >
                  {isProcessing && selectedPlanId === plan.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  ) : null}
                  <span>Choose {plan.durationMonths} Mo Plan</span>
                </Button>
              </div>
            );
          })}
        </div>

        {/* Security & Money-Back Notice */}
        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-white/5 flex flex-wrap items-center justify-between text-[11px] text-zinc-400 gap-2">
          <div className="flex items-center gap-1.5 text-zinc-500">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official Razorpay 256-bit Secure Checkout (UPI, Cards, NetBanking)</span>
          </div>
          <span>One-time prepaid access · No hidden recurring charges</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Workspace Banner shown inline when limit is exhausted
 */
export function EcardLimitExhaustedBanner({
  onOpenPlans,
  freeMonthlyLimit = 5,
}: {
  onOpenPlans: () => void;
  freeMonthlyLimit?: number;
}) {
  return (
    <div className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-amber-950/30 border border-amber-200 dark:border-amber-800/40 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 shrink-0">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-950 dark:text-amber-200">
            You've used all {freeMonthlyLimit} free cuts this month
          </h4>
          <p className="text-xs text-amber-800/80 dark:text-amber-400/80 mt-0.5 max-w-xl">
            Choose a plan to continue cutting Aadhaar, PAN, driving licence, voter ID, and other documents
            with zero paper waste and razor-sharp PDF exports.
          </p>
        </div>
      </div>

      <Button
        type="button"
        size="sm"
        onClick={onOpenPlans}
        className="rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shrink-0 shadow-sm cursor-pointer gap-1.5"
      >
        <span>View Plans & Subscribe</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
