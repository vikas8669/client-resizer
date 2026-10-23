'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '@/api/api';
import { ENDPOINTS } from '@/api/endpoints';
import type { FormattedPlan } from '@/features/ecard/hooks/useEcardAccess';

interface PricingResponse {
  plans: FormattedPlan[];
  paymentEnabled: boolean;
  hasActiveSubscription: boolean;
  subscription?: {
    planId: string;
    expiryDate: string;
  } | null;
}

export default function PricingSection() {
  const [plans, setPlans] = useState<FormattedPlan[]>([]);
  const [paymentEnabled, setPaymentEnabled] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const { data } = await apiClient.get<PricingResponse>(ENDPOINTS.ECARD_STATUS);
        setPlans(data.plans || []);
        setPaymentEnabled(data.paymentEnabled);
        setHasActiveSubscription(data.hasActiveSubscription);
        setActivePlanId(data.subscription?.planId || null);
      } catch (error) {
        console.error('Unable to load subscription pricing:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPlans();
  }, []);

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-gray-900 dark:bg-black dark:text-white">
      <section className="mx-auto max-w-6xl text-center">
        <h1 className="text-4xl font-bold md:text-5xl">E-Card Cutter Pricing</h1>
        <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-300">
          Choose a plan below. These prices are managed by the administrator and match Razorpay checkout.
        </p>

        {!paymentEnabled && !isLoading && (
          <p className="mx-auto mt-6 max-w-xl rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            Payments are currently disabled. E-Card Cutter access is available without a subscription.
          </p>
        )}

        {hasActiveSubscription && !isLoading && (
          <p className="mx-auto mt-6 max-w-xl rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
            You already have an active subscription. You can continue using E-Card Cutter without purchasing another plan.
          </p>
        )}

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {isLoading && Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-96 animate-pulse rounded-2xl border bg-gray-100 dark:border-gray-800 dark:bg-gray-900" />
          ))}

          {!isLoading && plans.map((plan) => {
            const isActivePlan = activePlanId === plan.id;

            return (
            <motion.article key={plan.id} whileHover={{ y: -6 }} className={`relative flex flex-col rounded-2xl border bg-white p-7 text-left shadow-lg dark:bg-gray-900 ${isActivePlan ? 'border-2 border-blue-600 ring-4 ring-blue-100 dark:border-blue-400 dark:ring-blue-950' : 'border-gray-200 dark:border-gray-700'}`}>
              {isActivePlan && (
                <span className="absolute left-5 top-5 rounded-full bg-blue-600 px-2.5 py-1 text-xs font-bold text-white">
                  Your active plan
                </span>
              )}
              {plan.discountPercent > 0 && (
                <span className="absolute right-5 top-5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{plan.discountPercent}% OFF</span>
              )}
              <h2 className={`text-2xl font-semibold ${isActivePlan ? 'mt-8' : ''}`}>{plan.name}</h2>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-4xl font-bold">₹{plan.offerPriceRupees}</span>
                <span className="pb-1 text-sm text-gray-500">for {plan.durationMonths} {plan.durationMonths === 1 ? 'month' : 'months'}</span>
              </div>
              {plan.savingsRupees > 0 && <p className="mt-2 text-sm text-gray-500"><span className="line-through">₹{plan.regularPriceRupees}</span> · Save ₹{plan.savingsRupees}</p>}
              <ul className="mt-7 flex-1 space-y-3 border-t border-gray-100 pt-5 text-sm dark:border-gray-800">
                {plan.features.map((feature) => <li key={feature}>✓ {feature}</li>)}
              </ul>
              {hasActiveSubscription ? (
                <span className="mt-8 block cursor-not-allowed rounded-lg bg-gray-200 px-4 py-2.5 text-center text-sm font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  {isActivePlan ? 'Current plan' : 'Subscription active'}
                </span>
              ) : (
                <Link href="/ecard-cutter" className="mt-8 block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700">
                  Choose this plan
                </Link>
              )}
            </motion.article>
            );
          })}
        </div>

        {!isLoading && plans.length === 0 && <p className="mt-12 text-gray-600 dark:text-gray-300">No subscription plans are available right now.</p>}
      </section>
    </main>
  );
}
