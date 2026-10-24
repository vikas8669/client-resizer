'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/api';
import { ENDPOINTS } from '@/api/endpoints';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  LayoutDashboard,
  ArrowRight,
  Settings,
  Star, 
  Users, 
  Image as ImageIcon, 
  MessageSquare, 
  RefreshCw, 
  TrendingUp, 
  Inbox, 
  Send,
  CreditCard,
  Save,
  CheckCircle2,
  DollarSign,
  Scissors,
  Shield,
  Percent,
  Receipt,
  Clock,
  Search,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter
} from 'lucide-react';
import { useFeedback } from '@/hooks/useFeedback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const cardBase = `
group relative overflow-hidden rounded-2xl
border border-zinc-200/60 dark:border-zinc-800/60
bg-white/70 dark:bg-zinc-900/70
backdrop-blur-xl
shadow-sm hover:shadow-xl
transition-all duration-300
`;

interface PlanEditorState {
  id: string;
  name: string;
  durationMonths: number;
  regularPriceRupees: number;
  offerPriceRupees: number;
  isActive: boolean;
  features: string[];
}

interface SubscriptionRecord {
  _id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  planId: string;
  durationMonths: number;
  amountPaise: number;
  amountRupees: number;
  currency: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  startDate: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
}

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  const [isMounted, setIsMounted] = useState(false);
  const { feedback, refetch, resolveSuggestion } = useFeedback();
  const [replyText, setReplyText] = useState('');
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Pricing plans state
  const [plans, setPlans] = useState<PlanEditorState[]>([]);
  const [isPlansLoading, setIsPlansLoading] = useState(false);
  const [isSavingPlans, setIsSavingPlans] = useState(false);
  const [ecutterEnabled, setEcutterEnabled] = useState(true);
  const [paymentEnabled, setPaymentEnabled] = useState(true);
  const [freeMonthlyLimit, setFreeMonthlyLimit] = useState(5);

  // User subscription purchases state
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [isSubsLoading, setIsSubsLoading] = useState(false);
  const [subSearchQuery, setSubSearchQuery] = useState('');
  const [subStatusFilter, setSubStatusFilter] = useState<'all' | 'active' | 'expired'>('all');

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await apiClient.get(ENDPOINTS.ANALYTICS);
      return res.data;
    },
    enabled: isMounted,
  });

  const fetchPricingSettings = async () => {
    try {
      setIsPlansLoading(true);
      const res = await apiClient.get(ENDPOINTS.ECARD_ADMIN_SETTINGS);
      if (res.data?.success && res.data.settings) {
        const s = res.data.settings;
        setEcutterEnabled(s.ecutterEnabled ?? true);
        setPaymentEnabled(s.paymentEnabled ?? true);
        setFreeMonthlyLimit(s.freeMonthlyLimit ?? 5);

        const loadedPlans: PlanEditorState[] = (s.plans || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          durationMonths: p.durationMonths,
          regularPriceRupees: Math.round((p.regularPricePaise || 0) / 100),
          offerPriceRupees: Math.round((p.offerPricePaise || 0) / 100),
          isActive: p.isActive !== false,
          features: p.features || [],
        }));
        setPlans(loadedPlans);
      }
    } catch (err: any) {
      console.error('Failed to load plans:', err);
    } finally {
      setIsPlansLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      setIsSubsLoading(true);
      const res = await apiClient.get(ENDPOINTS.ECARD_ADMIN_SUBSCRIPTIONS);
      if (res.data?.success && Array.isArray(res.data.subscriptions)) {
        setSubscriptions(res.data.subscriptions);
      }
    } catch (err: any) {
      console.error('Failed to load subscriptions:', err);
    } finally {
      setIsSubsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    refetch();
    fetchPricingSettings();
    fetchSubscriptions();
  }, []);

  const formatDate = (isoString?: string) => {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  const getPlanBadge = (planId: string, durationMonths: number) => {
    if (durationMonths === 6 || planId.includes('6')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
          6 Months Access
        </span>
      );
    }
    if (durationMonths === 3 || planId.includes('3')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          3 Months Access
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
        1 Month Access
      </span>
    );
  };

  const getExpiryBadge = (expiryDate?: string, status?: string) => {
    if (!expiryDate) return null;
    const now = new Date().getTime();
    const exp = new Date(expiryDate).getTime();
    const diffMs = exp - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (status === 'expired' || diffDays <= 0) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-900/40">
          Expired {diffDays <= 0 ? (diffDays === 0 ? 'today' : `${Math.abs(diffDays)}d ago`) : ''}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/40">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        {diffDays} days left
      </span>
    );
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesStatus =
      subStatusFilter === 'all'
        ? true
        : subStatusFilter === 'active'
        ? sub.status === 'active'
        : sub.status === 'expired';

    const term = subSearchQuery.trim().toLowerCase();
    const matchesSearch =
      !term ||
      (sub.user?.name && sub.user.name.toLowerCase().includes(term)) ||
      (sub.user?.email && sub.user.email.toLowerCase().includes(term)) ||
      (sub.planId && sub.planId.toLowerCase().includes(term)) ||
      (sub.razorpayPaymentId && sub.razorpayPaymentId.toLowerCase().includes(term));

    return matchesStatus && matchesSearch;
  });

  const activeSubsCount = subscriptions.filter((s) => s.status === 'active').length;
  const expiredSubsCount = subscriptions.filter((s) => s.status === 'expired').length;
  const totalRevenueCollected = subscriptions.reduce((sum, s) => sum + (s.amountRupees || 0), 0);

  if (!isMounted) return null;

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const stats = analytics?.stats || { totalImagesProcessed: 0, totalUsers: 0, averageRating: 0 };
  const suggestionItems = feedback.filter(f => f.type === 'suggestion');
  const feedbackItems = feedback.filter(f => f.type === 'feedback');

  const handlePriceChange = (
    index: number,
    field: 'regularPriceRupees' | 'offerPriceRupees',
    value: number
  ) => {
    setPlans(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: Math.max(0, value) };
      return next;
    });
  };

  const handlePlanToggle = (index: number) => {
    setPlans(prev => {
      const next = [...prev];
      next[index] = { ...next[index], isActive: !next[index].isActive };
      return next;
    });
  };

  const handleSavePrices = async () => {
    for (const p of plans) {
      if (p.offerPriceRupees > p.regularPriceRupees) {
        toast.error(`Offer price cannot exceed regular price for "${p.name}"`);
        return;
      }
    }

    try {
      setIsSavingPlans(true);
      const payloadPlans = plans.map(p => ({
        id: p.id,
        name: p.name,
        durationMonths: p.durationMonths,
        regularPricePaise: Math.round(p.regularPriceRupees * 100),
        offerPricePaise: Math.round(p.offerPriceRupees * 100),
        isActive: p.isActive,
        features: p.features,
      }));

      const res = await apiClient.put(ENDPOINTS.ECARD_ADMIN_SETTINGS, {
        ecutterEnabled,
        paymentEnabled,
        freeMonthlyLimit,
        plans: payloadPlans,
      });

      if (res.data?.success) {
        toast.success('Subscription prices updated successfully!');
        if (res.data.settings?.plans) {
          setPlans(
            res.data.settings.plans.map((p: any) => ({
              id: p.id,
              name: p.name,
              durationMonths: p.durationMonths,
              regularPriceRupees: Math.round((p.regularPricePaise || 0) / 100),
              offerPriceRupees: Math.round((p.offerPricePaise || 0) / 100),
              isActive: p.isActive !== false,
              features: p.features || [],
            }))
          );
        }
      } else {
        toast.error('Failed to update prices');
      }
    } catch (err: any) {
      console.error('Error saving prices:', err);
      toast.error(err?.response?.data?.message || 'Error updating prices');
    } finally {
      setIsSavingPlans(false);
    }
  };

  const handleResolve = async () => {
    if (!selectedSuggestionId || !replyText.trim()) {
      toast.error('Enter reply');
      return;
    }

    await resolveSuggestion.mutateAsync({
      id: selectedSuggestionId,
      adminReply: replyText,
    });

    setReplyText('');
    setSelectedSuggestionId(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 rounded-3xl border border-zinc-200/70 bg-gradient-to-br from-white via-white to-orange-50/70 p-6 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-orange-950/20 sm:flex-row sm:items-end md:p-8">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Admin workspace</p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">Dashboard overview</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">Manage plan pricing, feature controls, and review user feedback in real time.</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-white/80 px-4 py-3 text-sm dark:border-emerald-900/50 dark:bg-zinc-950/50">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="font-medium text-zinc-700 dark:text-zinc-300">System operational</span>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: 'Images processed', value: stats.totalImagesProcessed, icon: ImageIcon, accent: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400' },
          { title: 'Average rating', value: stats.averageRating.toFixed(1), icon: Star, accent: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' },
          { title: 'Total users', value: stats.totalUsers, icon: Users, accent: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' },
        ].map((item, i) => (
          <motion.div key={i} whileHover={{ y: -6 }}>
            <Card className={cardBase}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-indigo-500/20 to-blue-500/20 blur-xl" />
              </div>

              <CardHeader className="flex-row items-center justify-between pb-4">
                <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {item.title}
                </CardTitle>
                <span className={`grid h-10 w-10 place-items-center rounded-xl ${item.accent}`}><item.icon className="h-5 w-5" /></span>
              </CardHeader>

              <CardContent>
                <div className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                  {item.value}
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-emerald-600"><TrendingUp className="h-3.5 w-3.5" /> Live analytics</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs  value={currentTab} onValueChange={(v) => router.push(v === 'overview' ? '/admin' : `/admin?tab=${v}`)}>
        <TabsList className=" bg-white/90 dark:bg-zinc-900/90 backdrop-blur rounded-2xl p-1.5 flex flex-wrap gap-1">
          <TabsTrigger 
            className="h-10 rounded-xl px-4 data-[active]:bg-zinc-900 data-[active]:text-white dark:data-[active]:bg-orange-500 cursor-pointer flex items-center gap-2" 
            value="overview"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger 
            className="h-10 rounded-xl px-4 data-[active]:bg-zinc-900 data-[active]:text-white dark:data-[active]:bg-orange-500 cursor-pointer flex items-center gap-2" 
            value="purchases"
          >
            <Receipt className="w-4 h-4" />
            <span>User Purchases ({subscriptions.length})</span>
          </TabsTrigger>
          <TabsTrigger 
            className="h-10 rounded-xl px-4 data-[active]:bg-zinc-900 data-[active]:text-white dark:data-[active]:bg-orange-500 cursor-pointer flex items-center gap-2" 
            value="pricing"
          >
            <CreditCard className="w-4 h-4" />
            <span>Plans & Pricing</span>
          </TabsTrigger>
          <TabsTrigger 
            className="h-10 rounded-xl px-4 data-[active]:bg-zinc-900 data-[active]:text-white dark:data-[active]:bg-orange-500 cursor-pointer flex items-center gap-2" 
            value="suggestions"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Suggestions ({suggestionItems.length})</span>
          </TabsTrigger>
          <TabsTrigger 
            className="h-10 rounded-xl px-4 data-[active]:bg-zinc-900 data-[active]:text-white dark:data-[active]:bg-orange-500 cursor-pointer flex items-center gap-2" 
            value="feedback"
          >
            <Star className="w-4 h-4" />
            <span>Feedback ({feedbackItems.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* DASHBOARD OVERVIEW TAB CONTENT */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="rounded-2xl border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
              <CardContent className="p-4">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
                  Total Purchases
                </span>
                <div className="text-2xl font-black text-zinc-900 dark:text-white">
                  {subscriptions.length}
                </div>
                <span className="text-[11px] text-zinc-400">All-time order transactions</span>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
              <CardContent className="p-4">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
                  Active Members
                </span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <span>{activeSubsCount}</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">Currently valid access</span>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
              <CardContent className="p-4">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
                  Revenue Collected
                </span>
                <div className="text-2xl font-black text-orange-600 dark:text-orange-400">
                  ₹{totalRevenueCollected.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-zinc-400">From paid subscriptions</span>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
              <CardContent className="p-4">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
                  Expired Plans
                </span>
                <div className="text-2xl font-black text-zinc-500 dark:text-zinc-400">
                  {expiredSubsCount}
                </div>
                <span className="text-[11px] text-zinc-400">Past access periods</span>
              </CardContent>
            </Card>
          </div>

          {/* Highlights Grid */}
          <div className="grid  grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Purchases Card */}
            <Card className="rounded-3xl border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
                        <Receipt className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold">Recent Purchases</CardTitle>
                        <CardDescription className="text-xs">Latest customer subscription payments</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {subscriptions.length === 0 ? (
                    <p className="text-xs text-zinc-400 py-6 text-center">No purchases recorded yet</p>
                  ) : (
                    subscriptions.slice(0, 3).map((sub) => (
                      <div key={sub._id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                        <div>
                          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{sub.user?.name || 'Customer'}</p>
                          <p className="text-xs text-zinc-400">{sub.user?.email || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-orange-600 dark:text-orange-400">₹{sub.amountRupees || Math.round(sub.amountPaise / 100)}</p>
                          <span className={cn(
                            "inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mt-0.5",
                            sub.status === 'active' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                          )}>
                            {sub.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </div>
              <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/80">
                <Button 
                  onClick={() => router.push('/admin?tab=purchases')}
                  variant="outline" 
                  className="w-full rounded-xl text-xs font-semibold justify-between cursor-pointer"
                >
                  <span>View All User Purchases ({subscriptions.length})</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Plans & Settings Summary */}
            <Card className="rounded-3xl border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold">Plans & Feature Controls</CardTitle>
                      <CardDescription className="text-xs">Pricing plans and cutter access</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Total Configured Plans</span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">{plans.length} Plans</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">E-Card Cutter Tool</span>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-semibold",
                      ecutterEnabled ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" : "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300"
                    )}>
                      {ecutterEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Razorpay Payments</span>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-semibold",
                      paymentEnabled ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" : "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300"
                    )}>
                      {paymentEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </CardContent>
              </div>
              <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/80">
                <Button 
                  onClick={() => router.push('/admin?tab=pricing')}
                  variant="outline" 
                  className="w-full rounded-xl text-xs font-semibold justify-between cursor-pointer"
                >
                  <span>Edit Pricing & Access Settings</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Suggestions Card */}
            <Card className="rounded-3xl border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold">User Suggestions</CardTitle>
                      <CardDescription className="text-xs">Feature requests submitted by users</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {suggestionItems.length === 0 ? (
                    <p className="text-xs text-zinc-400 py-6 text-center">No suggestions yet</p>
                  ) : (
                    suggestionItems.slice(0, 2).map((item) => (
                      <div key={item._id} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 line-clamp-1">{item.name ? `${item.name}: ` : ''}{item.comment}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{item.isResolved ? '✓ Resolved' : '● Pending review'}</p>
                      </div>
                    ))
                  )}
                </CardContent>
              </div>
              <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/80">
                <Button 
                  onClick={() => router.push('/admin?tab=suggestions')}
                  variant="outline" 
                  className="w-full rounded-xl text-xs font-semibold justify-between cursor-pointer"
                >
                  <span>Manage Suggestions ({suggestionItems.length})</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Feedback & Ratings Card */}
            <Card className="rounded-3xl border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <Star className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold">Feedback & Satisfaction</CardTitle>
                      <CardDescription className="text-xs">User satisfaction rating: {stats.averageRating.toFixed(1)} / 5</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {feedbackItems.length === 0 ? (
                    <p className="text-xs text-zinc-400 py-6 text-center">No feedback reviews yet</p>
                  ) : (
                    feedbackItems.slice(0, 2).map((item) => (
                      <div key={item._id} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                        <div className="flex gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn("w-3.5 h-3.5", i < item.rating ? "text-yellow-400 fill-yellow-400" : "text-zinc-300")} />
                          ))}
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2">{item.comment}</p>
                      </div>
                    ))
                  )}
                </CardContent>
              </div>
              <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/80">
                <Button 
                  onClick={() => router.push('/admin?tab=feedback')}
                  variant="outline" 
                  className="w-full rounded-xl text-xs font-semibold justify-between cursor-pointer"
                >
                  <span>View All Feedback Reviews ({feedbackItems.length})</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Quick Tool Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button 
              onClick={() => router.push('/admin/ecard')} 
              className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-left hover:border-orange-300 dark:hover:border-orange-500/30 transition-all group cursor-pointer"
            >
              <Scissors className="h-5 w-5 text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">E-Card Cutter</p>
              <p className="text-[11px] text-zinc-400">Launch ecard tool</p>
            </button>

            <button 
              onClick={() => router.push('/admin/users')} 
              className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-left hover:border-orange-300 dark:hover:border-orange-500/30 transition-all group cursor-pointer"
            >
              <Users className="h-5 w-5 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">Manage Users</p>
              <p className="text-[11px] text-zinc-400">{stats.totalUsers} registered users</p>
            </button>

            <button 
              onClick={() => router.push('/admin/images')} 
              className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-left hover:border-orange-300 dark:hover:border-orange-500/30 transition-all group cursor-pointer"
            >
              <ImageIcon className="h-5 w-5 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">Processed Images</p>
              <p className="text-[11px] text-zinc-400">{stats.totalImagesProcessed} files converted</p>
            </button>

            <button 
              onClick={() => router.push('/admin/settings')} 
              className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-left hover:border-orange-300 dark:hover:border-orange-500/30 transition-all group cursor-pointer"
            >
              <Settings className="h-5 w-5 text-zinc-500 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">Settings</p>
              <p className="text-[11px] text-zinc-400">System configuration</p>
            </button>
          </div>
        </TabsContent>

        {/* USER PURCHASES TRACKING TAB CONTENT */}
        <TabsContent value="purchases" className="mt-6 space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="rounded-2xl border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
              <CardContent className="p-4">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
                  Total Purchases
                </span>
                <div className="text-2xl font-black text-zinc-900 dark:text-white">
                  {subscriptions.length}
                </div>
                <span className="text-[11px] text-zinc-400">All-time order transactions</span>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
              <CardContent className="p-4">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
                  Active Members
                </span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <span>{activeSubsCount}</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">Currently valid access</span>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
              <CardContent className="p-4">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
                  Revenue Collected
                </span>
                <div className="text-2xl font-black text-orange-600 dark:text-orange-400">
                  ₹{totalRevenueCollected.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-zinc-400">From paid subscriptions</span>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
              <CardContent className="p-4">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
                  Expired Plans
                </span>
                <div className="text-2xl font-black text-zinc-500 dark:text-zinc-400">
                  {expiredSubsCount}
                </div>
                <span className="text-[11px] text-zinc-400">Past access periods</span>
              </CardContent>
            </Card>
          </div>

          {/* Main Purchases Table Card */}
          <Card className="rounded-3xl border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/80 pb-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
                    <Receipt className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Purchase Audit Trail</span>
                  </div>
                  <CardTitle className="text-xl font-bold">Track User Subscription Purchases</CardTitle>
                  <CardDescription>
                    Real-time log of users, purchased plans, exact purchasing times, and expiration dates.
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={fetchSubscriptions}
                    disabled={isSubsLoading}
                    className="rounded-xl gap-2 cursor-pointer font-semibold"
                  >
                    <RefreshCw className={cn('w-4 h-4', isSubsLoading && 'animate-spin')} />
                    <span>Refresh Data</span>
                  </Button>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
                  <Input
                    placeholder="Search by user name, email, plan, or payment ID..."
                    value={subSearchQuery}
                    onChange={(e) => setSubSearchQuery(e.target.value)}
                    className="pl-9 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                  />
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl">
                  {(['all', 'active', 'expired'] as const).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setSubStatusFilter(filter)}
                      className={cn(
                        'px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-colors cursor-pointer',
                        subStatusFilter === filter
                          ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                          : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                      )}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {isSubsLoading && subscriptions.length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
                  <span className="text-sm text-zinc-500 font-medium">Loading subscription history...</span>
                </div>
              ) : filteredSubscriptions.length === 0 ? (
                <div className="py-16 text-center px-4">
                  <div className="w-14 h-14 rounded-3xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto mb-3">
                    <Receipt className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                    No Subscription Purchases Found
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    {subSearchQuery || subStatusFilter !== 'all'
                      ? 'No records match your active filters. Try searching for something else.'
                      : 'When users complete a subscription purchase via Razorpay, their plan details, purchasing time, and expiration date will appear here in real time.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-800/30 text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        <th className="py-3.5 px-5">User</th>
                        <th className="py-3.5 px-4">Plan</th>
                        <th className="py-3.5 px-4">Amount</th>
                        <th className="py-3.5 px-4">Purchasing Time</th>
                        <th className="py-3.5 px-4">Expire Time</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-5">Payment Ref</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-sm">
                      {filteredSubscriptions.map((sub) => {
                        const userInitial = sub.user?.name ? sub.user.name.charAt(0).toUpperCase() : 'U';
                        const isActive = sub.status === 'active';

                        return (
                          <tr
                            key={sub._id}
                            className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                          >
                            {/* USER */}
                            <td className="py-4 px-5">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                                  {userInitial}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                                    {sub.user?.name || 'Anonymous User'}
                                  </div>
                                  <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                                    {sub.user?.email || 'No email provided'}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* PLAN */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              {getPlanBadge(sub.planId, sub.durationMonths)}
                            </td>

                            {/* AMOUNT */}
                            <td className="py-4 px-4 whitespace-nowrap font-bold text-zinc-900 dark:text-zinc-100">
                              ₹{sub.amountRupees}
                            </td>

                            {/* PURCHASING TIME */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                                <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                <span>{formatDate(sub.createdAt)}</span>
                              </div>
                            </td>

                            {/* EXPIRE TIME */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                                  <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                  <span>{formatDate(sub.expiryDate)}</span>
                                </div>
                                <div>{getExpiryBadge(sub.expiryDate, sub.status)}</div>
                              </div>
                            </td>

                            {/* STATUS */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              {isActive ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                  Expired
                                </span>
                              )}
                            </td>

                            {/* PAYMENT ID */}
                            <td className="py-4 px-5 whitespace-nowrap text-xs text-zinc-500 font-mono">
                              {sub.razorpayPaymentId ? (
                                <span className="bg-zinc-100 dark:bg-zinc-800/80 px-2 py-1 rounded-md text-[11px]">
                                  {sub.razorpayPaymentId}
                                </span>
                              ) : sub.razorpayOrderId ? (
                                <span className="bg-zinc-100 dark:bg-zinc-800/80 px-2 py-1 rounded-md text-[11px]">
                                  {sub.razorpayOrderId}
                                </span>
                              ) : (
                                <span className="text-zinc-400">Direct / Offline</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PRICING TAB CONTENT */}
        <TabsContent value="pricing" className="mt-6 space-y-6">
          <Card className="rounded-3xl border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/80 pb-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
                    <DollarSign className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Subscription Price Management</span>
                  </div>
                  <CardTitle className="text-xl font-bold">Edit Subscription Plans & Prices</CardTitle>
                  <CardDescription>
                    Change prices directly below in ₹ (Rupees). Any updates reflect immediately across Razorpay and the customer checkout.
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={fetchPricingSettings}
                    disabled={isPlansLoading || isSavingPlans}
                    className="rounded-xl gap-2 cursor-pointer font-semibold"
                  >
                    <RefreshCw className={cn('w-4 h-4', isPlansLoading && 'animate-spin')} />
                    <span>Reset</span>
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSavePrices}
                    disabled={isPlansLoading || isSavingPlans}
                    className="rounded-xl gap-2 font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-500/20 cursor-pointer"
                  >
                    {isSavingPlans ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Save Prices</span>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {isPlansLoading && plans.length === 0 ? (
                <div className="py-12 flex justify-center">
                  <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {plans.map((plan, index) => {
                    const regular = plan.regularPriceRupees || 0;
                    const offer = plan.offerPriceRupees || 0;
                    const savings = Math.max(0, regular - offer);
                    const discountPct = regular > 0 ? Math.round(((regular - offer) / regular) * 100) : 0;

                    return (
                      <div
                        key={plan.id}
                        className={cn(
                          'p-5 rounded-2xl border transition-all flex flex-col justify-between',
                          plan.isActive
                            ? 'border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/25 shadow-xs'
                            : 'border-dashed border-zinc-300 dark:border-zinc-800 opacity-60 bg-transparent'
                        )}
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                                {plan.name}
                              </h3>
                              <span className="text-xs text-zinc-500">
                                {plan.durationMonths} {plan.durationMonths === 1 ? 'Month' : 'Months'} duration
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handlePlanToggle(index)}
                              className={cn(
                                'text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors',
                                plan.isActive
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                  : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                              )}
                            >
                              {plan.isActive ? 'Active' : 'Disabled'}
                            </button>
                          </div>

                          {/* PRICE INPUTS */}
                          <div className="grid grid-cols-2 gap-3 pt-1">
                            <div>
                              <Label className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                                Regular Price (₹)
                              </Label>
                              <div className="relative mt-1">
                                <span className="absolute left-3 top-2.5 text-xs text-zinc-400 font-bold">₹</span>
                                <Input
                                  type="number"
                                  min="0"
                                  value={plan.regularPriceRupees}
                                  onChange={(e) =>
                                    handlePriceChange(
                                      index,
                                      'regularPriceRupees',
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="pl-7 rounded-xl text-sm font-bold bg-white dark:bg-zinc-900"
                                />
                              </div>
                            </div>

                            <div>
                              <Label className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                                Offer Price (₹)
                              </Label>
                              <div className="relative mt-1">
                                <span className="absolute left-3 top-2.5 text-xs text-orange-500 font-bold">₹</span>
                                <Input
                                  type="number"
                                  min="0"
                                  value={plan.offerPriceRupees}
                                  onChange={(e) =>
                                    handlePriceChange(
                                      index,
                                      'offerPriceRupees',
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="pl-7 rounded-xl text-sm font-bold text-orange-600 dark:text-orange-400 bg-white dark:bg-zinc-900 border-orange-200 dark:border-orange-900/50"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Calculated Discount Badge & Savings */}
                          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 text-xs space-y-1.5">
                            <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                              <span className="flex items-center gap-1 font-medium">
                                <Percent className="w-3.5 h-3.5 text-emerald-500" />
                                Discount:
                              </span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {discountPct > 0 ? `${discountPct}% OFF` : 'None (0%)'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                              <span className="font-medium">Customer Saves:</span>
                              <span className="font-bold text-zinc-900 dark:text-white">
                                ₹{savings}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-zinc-200/60 dark:border-zinc-800">
                          <span className="text-[11px] font-semibold text-zinc-400 block mb-2">
                            Plan Features:
                          </span>
                          <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5">
                            {plan.features.map((f, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Free Monthly Quota & Feature Toggles */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-bold text-zinc-900 dark:text-white">
                      Free Monthly Limit
                    </Label>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Free cards per user before subscription paywall triggers.
                    </p>
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      min="0"
                      max="1000"
                      value={freeMonthlyLimit}
                      onChange={(e) => setFreeMonthlyLimit(parseInt(e.target.value) || 0)}
                      className="rounded-xl font-bold text-center"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-bold text-zinc-900 dark:text-white">
                      Paywall Enforcement
                    </Label>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {paymentEnabled ? 'Active (Razorpay paywall enforced)' : 'Free unlimited for all users'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPaymentEnabled(!paymentEnabled)}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none',
                      paymentEnabled ? 'bg-orange-600' : 'bg-zinc-300 dark:bg-zinc-700'
                    )}
                  >
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5',
                        paymentEnabled ? 'right-0.5' : 'left-0.5'
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* Save Bar */}
              <div className="pt-2 flex justify-end">
                <Button
                  type="button"
                  onClick={handleSavePrices}
                  disabled={isPlansLoading || isSavingPlans}
                  className="rounded-xl px-6 font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/20 cursor-pointer"
                >
                  {isSavingPlans ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  <span>Save All Changes</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SUGGESTIONS TAB CONTENT */}
        <TabsContent value="suggestions" className="mt-6 space-y-4">
          {suggestionItems.length === 0 ? <Card className="rounded-3xl border-dashed border-zinc-300 bg-white/60 py-14 text-center dark:border-zinc-700 dark:bg-zinc-900/60"><Inbox className="mx-auto mb-3 h-9 w-9 text-zinc-300" /><p className="font-medium text-zinc-800 dark:text-zinc-200">Your inbox is clear</p><p className="mt-1 text-sm text-zinc-500">New suggestions will show up here.</p></Card> : suggestionItems.map(item => (
            <Card key={item._id} className={cardBase}>

              <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-indigo-500 to-purple-500" />

              <CardContent className="p-6 space-y-4">

                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white">
                      {item.name || 'Anonymous'}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {item.email}
                    </p>
                  </div>

                  {!item.isResolved && (
                    <Dialog 
                      open={isDialogOpen && selectedSuggestionId === item._id} 
                      onOpenChange={(open) => {
                        if (!open) {
                          setIsDialogOpen(false);
                          setSelectedSuggestionId(null);
                          setReplyText('');
                        }
                      }}
                    >
                      <DialogTrigger
                        render={
                          <Button 
                            size="sm"
                            onClick={() => {
                              setSelectedSuggestionId(item._id);
                              setIsDialogOpen(true);
                            }}
                          >
                            Reply
                          </Button>
                        }
                      />

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reply to {item.name || 'user'}</DialogTitle>
                        </DialogHeader>

                        <textarea
                          placeholder="Write a helpful response…"
                          className="min-h-28 w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm outline-none focus:border-orange-400 dark:border-zinc-800 dark:bg-zinc-950"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />

                        <DialogFooter>
                          <Button onClick={handleResolve} className="bg-orange-500 hover:bg-orange-600"><Send className="mr-2 h-4 w-4" />Send reply</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  {item.comment}
                </p>

                {item.isResolved && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl">
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                      {item.adminReply}
                    </p>
                  </div>
                )}

              </CardContent>
            </Card>
          ))}

        </TabsContent>

        {/* FEEDBACK TAB CONTENT */}
        <TabsContent value="feedback" className="mt-6 grid md:grid-cols-2 gap-4">
          {feedbackItems.length === 0 ? <Card className="col-span-full rounded-3xl border-dashed border-zinc-300 bg-white/60 py-14 text-center dark:border-zinc-700 dark:bg-zinc-900/60"><Star className="mx-auto mb-3 h-9 w-9 text-zinc-300" /><p className="font-medium text-zinc-800 dark:text-zinc-200">No feedback yet</p><p className="mt-1 text-sm text-zinc-500">Customer ratings and notes will appear here.</p></Card> : feedbackItems.map(item => (
            <Card key={item._id} className={cardBase}>
              <CardContent className="p-6">

                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("w-4 h-4", i < item.rating ? "text-yellow-400" : "text-zinc-300")} />
                  ))}
                </div>

                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  {item.comment}
                </p>

              </CardContent>
            </Card>
          ))}

        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
