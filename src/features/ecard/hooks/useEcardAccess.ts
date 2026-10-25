'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/api';
import { ENDPOINTS } from '@/api/endpoints';
import { getStoredUser, AuthUser } from '@/lib/auth';
import { openRazorpayCheckout } from '../utils/razorpay';
import { toast } from 'sonner';

export interface FormattedPlan {
  id: string;
  name: string;
  durationMonths: number;
  regularPricePaise: number;
  offerPricePaise: number;
  regularPriceRupees: number;
  offerPriceRupees: number;
  savingsRupees: number;
  discountPercent: number;
  isActive: boolean;
  features: string[];
}

export interface EcardAccessResponse {
  success: boolean;
  ecutterEnabled: boolean;
  paymentEnabled: boolean;
  freeMonthlyLimit: number;
  currentPeriod: string;
  usedCount: number;
  remainingCount: number;
  hasActiveSubscription: boolean;
  subscription?: {
    id: string;
    planId: string;
    startDate: string;
    expiryDate: string;
    durationMonths: number;
    amountRupees?: number;
    status?: string;
  } | null;
  canCut: boolean;
  isAdmin: boolean;
  code?: string;
  reason?: string;
  plans: FormattedPlan[];
}

export function useEcardAccess() {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  // Sync user from localStorage
  useEffect(() => {
    setCurrentUser(getStoredUser());

    const handleAuthChange = () => {
      setCurrentUser(getStoredUser());
    };

    window.addEventListener('auth-user-updated', handleAuthChange);
    return () => window.removeEventListener('auth-user-updated', handleAuthChange);
  }, []);

  const {
    data: accessData,
    isLoading,
    isError,
    refetch,
  } = useQuery<EcardAccessResponse>({
    queryKey: ['ecard-access-status', currentUser?.email || 'guest'],
    queryFn: async () => {
      const res = await apiClient.get<EcardAccessResponse>(ENDPOINTS.ECARD_STATUS);
      return res.data;
    },
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
  });

  const isLoggedIn = !!currentUser;
  const isAdmin = accessData?.isAdmin || currentUser?.role === 'admin';
  const paymentEnabled = accessData?.paymentEnabled ?? true;
  const ecutterEnabled = accessData?.ecutterEnabled ?? true;
  const hasActiveSubscription = accessData?.hasActiveSubscription ?? false;
  const subscription = accessData?.subscription;
  const freeMonthlyLimit = accessData?.freeMonthlyLimit ?? 5;
  const usedCount = accessData?.usedCount ?? 0;
  const remainingCount = accessData?.remainingCount ?? Math.max(0, freeMonthlyLimit - usedCount);

  // Determine if free limit is exhausted and payment is required
  const isFreeLimitExhausted =
    isLoggedIn &&
    !isAdmin &&
    paymentEnabled &&
    !hasActiveSubscription &&
    remainingCount <= 0;

  const canCut =
    !isLoading &&
    isLoggedIn &&
    (isAdmin || !paymentEnabled || hasActiveSubscription || remainingCount > 0);

  /**
   * Initiate Razorpay Checkout for a selected plan
   */
  const subscribeToPlan = useCallback(
    async (planId: string, options?: { allowExtension?: boolean }) => {
      if (isCheckingPayment) return;

      if (!isLoggedIn) {
        toast.error('Please sign in to purchase a subscription plan');
        return;
      }

      // Check if user already has an active subscription for this plan to prevent duplicate payment
      if (hasActiveSubscription && subscription?.planId === planId && !options?.allowExtension) {
        toast.info(
          `You already have an active subscription for this plan valid until ${
            subscription.expiryDate
              ? new Date(subscription.expiryDate).toLocaleDateString('en-IN')
              : 'next period'
          }. Duplicate payment is disabled.`
        );
        return;
      }

      let checkoutOpened = false;

      try {
        setIsCheckingPayment(true);

        // 1. Create order on backend
        const orderRes = await apiClient.post(ENDPOINTS.ECARD_ORDER, {
          planId,
          allowExtension: options?.allowExtension === true,
        });
        const { orderId, amount, currency, keyId, plan } = orderRes.data;

        if (!orderId || !keyId) {
          throw new Error('Failed to create payment order from server');
        }

        // 2. Open Razorpay Checkout modal
        await openRazorpayCheckout({
          key: keyId,
          amount,
          currency: currency || 'INR',
          name: 'PrintPix E-Card Cutter',
          description: `${plan.name} (${plan.durationMonths} ${plan.durationMonths === 1 ? 'Month' : 'Months'})`,
          order_id: orderId,
          prefill: {
            name: currentUser?.name,
            email: currentUser?.email,
          },
          theme: {
            color: '#2563EB', // Blue matching studio
          },
          handler: async (response) => {
            try {
              toast.loading('Verifying payment securely with server...', { id: 'payment-verify' });

              // 3. Verify signature and confirm capture state cryptographically on backend
              const verifyRes = await apiClient.post(
                ENDPOINTS.ECARD_VERIFY,
                {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                },
                { timeout: 15000 }
              );

              if (verifyRes.data?.success) {
                toast.success('Subscription activated! You now have unlimited cuts.', {
                  id: 'payment-verify',
                });
                // Invalidate query to refresh entitlement without full page reload
                queryClient.invalidateQueries({ queryKey: ['ecard-access-status'] });
                await refetch();
              } else {
                toast.error('Payment verification failed. Please contact support.', {
                  id: 'payment-verify',
                });
              }
            } catch (err: any) {
              console.error('Verification error:', err);
              const errCode = err?.response?.data?.code;
              const errMsg = err?.response?.data?.message;

              if (errCode === 'PAYMENT_NOT_CAPTURED') {
                toast.warning(
                  'Payment authorized but pending capture. Your plan will activate automatically once confirmed.',
                  { id: 'payment-verify' }
                );
              } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
                toast.error(
                  'Verification timed out. If money was debited, your subscription will activate automatically via webhook.',
                  { id: 'payment-verify' }
                );
              } else {
                toast.error(errMsg || 'Payment verification failed', { id: 'payment-verify' });
              }
            } finally {
              setIsCheckingPayment(false);
            }
          },
          modal: {
            ondismiss: () => {
              toast.info('Payment checkout cancelled');
              setIsCheckingPayment(false);
            },
          },
        });
        // Opening Checkout is synchronous after the SDK is loaded. Keep the
        // purchase controls locked until it is dismissed or verification ends.
        checkoutOpened = true;
      } catch (err: any) {
        console.error('Subscription error:', err);
        const errCode = err?.response?.data?.code;
        const errMsg = err?.response?.data?.message || err?.message || 'Could not initiate payment';
        if (errCode === 'ALREADY_SUBSCRIBED') {
          toast.info(errMsg);
        } else {
          toast.error(errMsg);
        }
      } finally {
        // Do not unlock immediately after Razorpay Checkout opens; doing so
        // permits another order to be started while the first is still active.
        if (!checkoutOpened) {
          setIsCheckingPayment(false);
        }
      }
    },
    [isLoggedIn, isCheckingPayment, hasActiveSubscription, subscription, currentUser, queryClient, refetch]
  );

  return {
    access: accessData,
    isLoading,
    isError,
    refetch,
    currentUser,
    isLoggedIn,
    isAdmin,
    ecutterEnabled,
    paymentEnabled,
    hasActiveSubscription,
    subscription: accessData?.subscription,
    freeMonthlyLimit,
    usedCount,
    remainingCount,
    isFreeLimitExhausted,
    canCut,
    plans: accessData?.plans || [],
    subscribeToPlan,
    isCheckingPayment,
  };
}
