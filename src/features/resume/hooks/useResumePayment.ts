'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/api';
import { ENDPOINTS } from '@/api/endpoints';
import { getStoredUser, AuthUser } from '@/lib/auth';
import { openRazorpayCheckout } from '@/features/ecard/utils/razorpay';
import { toast } from 'sonner';

export interface ResumePackItem {
  id: '1_download' | '5_downloads' | '10_downloads';
  name: string;
  credits: number;
  priceRupees: number;
  pricePaise: number;
  perDownloadRupees: number;
  tag: string;
  badge?: string;
  description: string;
}

export interface ResumePaymentStatusResponse {
  success: boolean;
  credits: number;
  isAdmin?: boolean;
  isFreeAdmin?: boolean;
  unlockedResumeIds: string[];
  isCurrentResumeUnlocked?: boolean;
  plans: ResumePackItem[];
  keyId?: string;
}

export function useResumePayment(currentResumeId?: string) {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Store a pending callback to execute automatically after successful purchase
  const pendingDownloadCallbackRef = useRef<(() => void) | null>(null);

  // Sync user state with localStorage & custom events
  useEffect(() => {
    setCurrentUser(getStoredUser());
    const handleAuth = () => setCurrentUser(getStoredUser());
    window.addEventListener('auth-user-updated', handleAuth);
    return () => window.removeEventListener('auth-user-updated', handleAuth);
  }, []);

  const {
    data: paymentStatus,
    isLoading: isStatusLoading,
    refetch: refetchStatus,
  } = useQuery<ResumePaymentStatusResponse>({
    queryKey: ['resume-payment-status', currentUser?.email || 'guest', currentResumeId || 'none'],
    queryFn: async () => {
      if (!currentUser) {
        return {
          success: true,
          credits: 0,
          unlockedResumeIds: [],
          isCurrentResumeUnlocked: false,
          plans: [
            {
              id: '1_download',
              name: '1 Download',
              credits: 1,
              priceRupees: 9,
              pricePaise: 900,
              perDownloadRupees: 9,
              tag: 'Best for students and freshers',
              badge: 'Starter',
              description: 'Ideal for urgent single job applications',
            },
            {
              id: '5_downloads',
              name: '5 Downloads',
              credits: 5,
              priceRupees: 35,
              pricePaise: 3500,
              perDownloadRupees: 7,
              tag: '₹7 per download',
              badge: 'Popular',
              description: 'Great value for active job seekers',
            },
            {
              id: '10_downloads',
              name: '10 Downloads',
              credits: 10,
              priceRupees: 59,
              pricePaise: 5900,
              perDownloadRupees: 5.9,
              tag: '₹5.90 per download',
              badge: 'Best Value',
              description: 'Maximum savings for ongoing career updates',
            },
          ],
        };
      }
      const res = await apiClient.get<ResumePaymentStatusResponse>(
        `${ENDPOINTS.RESUME_PAYMENT_STATUS}${currentResumeId ? `?resumeId=${currentResumeId}` : ''}`
      );
      return res.data;
    },
    enabled: true,
    staleTime: 30 * 1000,
  });

  const isLoggedIn = !!currentUser;
  const isAdmin = currentUser?.role === 'admin' || paymentStatus?.isAdmin || false;
  const isFreeAdmin = isAdmin && paymentStatus?.isFreeAdmin !== false;
  const credits = paymentStatus?.credits ?? 0;
  const plans = paymentStatus?.plans || [];
  const isUnlocked = isFreeAdmin
    ? true
    : currentResumeId
    ? (paymentStatus?.unlockedResumeIds || []).includes(currentResumeId)
    : false;

  /**
   * Buy a resume download credit pack via Razorpay Checkout
   */
  const purchasePack = useCallback(
    async (packId: string, onCompleted?: () => void) => {
      if (isPaying) return;

      if (!isLoggedIn) {
        setIsAuthModalOpen(true);
        return;
      }

      let checkoutOpened = false;

      try {
        setIsPaying(true);

        // 1. Create order on backend
        const orderRes = await apiClient.post(ENDPOINTS.RESUME_PAYMENT_ORDER, { packId });
        const { orderId, amount, currency, keyId, pack } = orderRes.data;

        if (!orderId || !keyId) {
          throw new Error('Failed to create Razorpay payment order from server');
        }

        // 2. Open Razorpay Checkout modal
        await openRazorpayCheckout({
          key: keyId,
          amount,
          currency: currency || 'INR',
          name: 'PrintPix Resume Download',
          description: `${pack.name} (${pack.credits} ${pack.credits === 1 ? 'Download' : 'Downloads'})`,
          order_id: orderId,
          prefill: {
            name: currentUser?.name,
            email: currentUser?.email,
          },
          theme: {
            color: '#4f46e5', // Indigo matching resume builder theme
          },
          handler: async (response) => {
            try {
              toast.loading('Verifying payment cryptographically on backend...', {
                id: 'resume-pay-verify',
              });

              const verifyRes = await apiClient.post(
                ENDPOINTS.RESUME_PAYMENT_VERIFY,
                {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                },
                { timeout: 15000 }
              );

              if (verifyRes.data?.success) {
                toast.success(
                  `Payment verified! Added ${pack.credits} download credit${pack.credits > 1 ? 's' : ''} to your account.`,
                  { id: 'resume-pay-verify' }
                );

                setIsPaymentModalOpen(false);
                await queryClient.invalidateQueries({ queryKey: ['resume-payment-status'] });
                await refetchStatus();

                if (onCompleted) {
                  onCompleted();
                } else if (pendingDownloadCallbackRef.current) {
                  const cb = pendingDownloadCallbackRef.current;
                  pendingDownloadCallbackRef.current = null;
                  cb();
                }
              } else {
                toast.error('Payment verification failed. Please contact support.', {
                  id: 'resume-pay-verify',
                });
              }
            } catch (err: any) {
              console.error('Verification error:', err);
              const errMsg = err?.response?.data?.message || err?.message || 'Verification error';
              toast.error(errMsg, { id: 'resume-pay-verify' });
            } finally {
              setIsPaying(false);
            }
          },
          modal: {
            ondismiss: () => {
              toast.info('Checkout cancelled');
              setIsPaying(false);
            },
          },
        });

        checkoutOpened = true;
      } catch (err: any) {
        console.error('Payment order creation error:', err);
        toast.error(err?.response?.data?.message || err?.message || 'Could not initiate payment');
      } finally {
        if (!checkoutOpened) {
          setIsPaying(false);
        }
      }
    },
    [isLoggedIn, isPaying, currentUser, queryClient, refetchStatus]
  );

  /**
   * Check entitlement or consume a credit before triggering PDF generation.
   * If already unlocked: allows download immediately without credit deduction.
   * If not unlocked but credits > 0: consumes 1 credit and allows download.
   * If not unlocked and credits = 0: prompts payment modal and auto-resumes after payment.
   */
  const requestDownloadWithCredit = useCallback(
    async (resumeId: string, executeDownload: () => void | Promise<void>) => {
      if (!isLoggedIn) {
        setIsAuthModalOpen(true);
        return;
      }

      // Admins get immediate free unlimited download
      if (isFreeAdmin) {
        toast.info('Admin access: Free unlimited download enabled');
        await executeDownload();
        return;
      }

      try {
        const res = await apiClient.post(ENDPOINTS.RESUME_CONSUME_CREDIT, { resumeId });
        if (res.data?.success) {
          if (res.data.isAdmin) {
            toast.info('Admin access: Downloaded free of charge.');
          } else if (res.data.alreadyUnlocked) {
            toast.info('Resume previously unlocked. Downloading without deducting credits.');
          } else {
            toast.success(`1 download credit used. ${res.data.credits} credit(s) remaining.`);
            queryClient.invalidateQueries({ queryKey: ['resume-payment-status'] });
          }
          await executeDownload();
        }
      } catch (err: any) {
        if (err?.response?.status === 402 || err?.response?.data?.code === 'NO_CREDITS') {
          // Store download callback so it triggers automatically upon payment completion
          pendingDownloadCallbackRef.current = async () => {
            try {
              const retryRes = await apiClient.post(ENDPOINTS.RESUME_CONSUME_CREDIT, { resumeId });
              if (retryRes.data?.success) {
                toast.success('Resume unlocked! Downloading PDF now...');
                queryClient.invalidateQueries({ queryKey: ['resume-payment-status'] });
                await executeDownload();
              }
            } catch (retryErr) {
              console.error('Retry download error after payment:', retryErr);
            }
          };
          setIsPaymentModalOpen(true);
        } else {
          toast.error(err?.response?.data?.message || 'Failed to verify download entitlement');
        }
      }
    },
    [isLoggedIn, isFreeAdmin, queryClient]
  );

  return {
    currentUser,
    isLoggedIn,
    isAdmin,
    isFreeAdmin,
    credits,
    isUnlocked,
    plans,
    isStatusLoading,
    isPaying,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    purchasePack,
    requestDownloadWithCredit,
    refetchStatus,
  };
}
