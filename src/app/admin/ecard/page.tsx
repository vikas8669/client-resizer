'use client';

import React, { useState, useEffect } from 'react';
import {
  Scissors,
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  Save,
  Check,
  AlertCircle,
  Shield,
  Layers,
  Sparkles,
  RefreshCw,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import apiClient from '@/api/api';
import { ENDPOINTS } from '@/api/endpoints';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PlanEditorState {
  id: string;
  name: string;
  durationMonths: number;
  regularPriceRupees: number;
  offerPriceRupees: number;
  isActive: boolean;
  features: string[];
}

interface AdminSettingsResponse {
  success: boolean;
  settings: {
    ecutterEnabled: boolean;
    paymentEnabled: boolean;
    freeMonthlyLimit: number;
    currency: string;
    plans: Array<{
      id: string;
      name: string;
      durationMonths: number;
      regularPricePaise: number;
      offerPricePaise: number;
      discountPercent: number;
      isActive: boolean;
      features: string[];
    }>;
    updatedAt: string;
  };
  stats: {
    activeSubscriptions: number;
    totalRevenueRupees: number;
    periodTotalCuts: number;
    periodActiveUsers: number;
    totalOrders: number;
    currentPeriod: string;
  };
}

export default function AdminEcardPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Settings state
  const [ecutterEnabled, setEcutterEnabled] = useState<boolean>(true);
  const [paymentEnabled, setPaymentEnabled] = useState<boolean>(true);
  const [freeMonthlyLimit, setFreeMonthlyLimit] = useState<number>(5);
  const [plans, setPlans] = useState<PlanEditorState[]>([]);

  // Stats state
  const [stats, setStats] = useState<{
    activeSubscriptions: number;
    totalRevenueRupees: number;
    periodTotalCuts: number;
    periodActiveUsers: number;
    totalOrders: number;
    currentPeriod: string;
  }>({
    activeSubscriptions: 0,
    totalRevenueRupees: 0,
    periodTotalCuts: 0,
    periodActiveUsers: 0,
    totalOrders: 0,
    currentPeriod: '',
  });

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get<AdminSettingsResponse>(ENDPOINTS.ECARD_ADMIN_SETTINGS);
      if (res.data?.success) {
        const { settings: s, stats: st } = res.data;
        setEcutterEnabled(s.ecutterEnabled);
        setPaymentEnabled(s.paymentEnabled);
        setFreeMonthlyLimit(s.freeMonthlyLimit);

        // Convert paise to rupees for friendly UI editing
        const loadedPlans: PlanEditorState[] = (s.plans || []).map((p) => ({
          id: p.id,
          name: p.name,
          durationMonths: p.durationMonths,
          regularPriceRupees: Math.round(p.regularPricePaise / 100),
          offerPriceRupees: Math.round(p.offerPricePaise / 100),
          isActive: p.isActive,
          features: p.features || [],
        }));
        setPlans(loadedPlans);

        if (st) {
          setStats(st);
        }
      }
    } catch (err: any) {
      console.error('Failed to load admin ecard settings:', err);
      toast.error(err?.response?.data?.message || 'Failed to load E-Card settings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handlePlanPriceChange = (
    index: number,
    field: 'regularPriceRupees' | 'offerPriceRupees',
    value: number
  ) => {
    setPlans((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: Math.max(0, value) };
      return next;
    });
  };

  const handlePlanToggle = (index: number) => {
    setPlans((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], isActive: !next[index].isActive };
      return next;
    });
  };

  const handleSave = async () => {
    // Basic validation
    for (const p of plans) {
      if (p.offerPriceRupees > p.regularPriceRupees) {
        toast.error(`Offer price cannot exceed regular price for "${p.name}"`);
        return;
      }
    }

    try {
      setIsSaving(true);
      // Convert rupees back to paise before sending to backend
      const payloadPlans = plans.map((p) => ({
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
        toast.success('E-Card Cutter settings updated successfully!');
      } else {
        toast.error('Failed to update settings');
      }
    } catch (err: any) {
      console.error('Save error:', err);
      toast.error(err?.response?.data?.message || 'Error updating settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                E-Card Cutter Controls
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Manage usage limits, Razorpay subscriptions, pricing plans, and master switches.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchSettings}
            disabled={isLoading || isSaving}
            className="rounded-xl gap-2 font-semibold cursor-pointer"
          >
            <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
            <span>Refresh</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={isLoading || isSaving}
            className="rounded-xl gap-2 font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 cursor-pointer"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Active Subscriptions
              </span>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-zinc-900 dark:text-white">
              {stats.activeSubscriptions}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Currently active paid members
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Total Revenue
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              ₹{stats.totalRevenueRupees.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              From {stats.totalOrders} total orders
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Monthly Cuts ({stats.currentPeriod || 'This Month'})
              </span>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <Scissors className="w-4 h-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-zinc-900 dark:text-white">
              {stats.periodTotalCuts}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Successful cutting operations
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Active Users ({stats.currentPeriod || 'This Month'})
              </span>
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-zinc-900 dark:text-white">
              {stats.periodActiveUsers}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Users cutting documents
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Feature Switches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Master Feature Switch */}
        <Card className="rounded-3xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Master Feature Access</CardTitle>
            </div>
            <CardDescription>
              Globally enable or disable the E-Card Cutter tool for all non-admin users.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
              <div className="space-y-1">
                <Label className="text-sm font-bold text-zinc-900 dark:text-white">
                  E-Card Cutter Tool
                </Label>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {ecutterEnabled
                    ? 'Available for public usage (subject to limits & subscriptions).'
                    : 'Disabled. Non-admin users will see a maintenance notice.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEcutterEnabled(!ecutterEnabled)}
                className={cn(
                  'w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none',
                  ecutterEnabled ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-700'
                )}
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5',
                    ecutterEnabled ? 'right-0.5' : 'left-0.5'
                  )}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Payment & Usage Limit Switch */}
        <Card className="rounded-3xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-lg">Payment & Limit Enforcement</CardTitle>
            </div>
            <CardDescription>
              Toggle between monetization enforcement and completely free unlimited access.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
              <div className="space-y-1">
                <Label className="text-sm font-bold text-zinc-900 dark:text-white">
                  Enforce Limits & Paywall
                </Label>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {paymentEnabled
                    ? `Enforcing ${freeMonthlyLimit} free cuts/month. Razorpay paywall triggered after limit.`
                    : 'Unlimited cuts for all logged-in users with 0 payment prompts.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPaymentEnabled(!paymentEnabled)}
                className={cn(
                  'w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none',
                  paymentEnabled ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-700'
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

            <div className="pt-2">
              <Label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                Free Cuts Monthly Quota (per authenticated user)
              </Label>
              <div className="flex items-center gap-3 mt-1.5">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={freeMonthlyLimit}
                  onChange={(e) => setFreeMonthlyLimit(parseInt(e.target.value) || 0)}
                  disabled={!paymentEnabled}
                  className="w-28 rounded-xl font-bold text-sm"
                />
                <span className="text-xs text-zinc-500">
                  Resets automatically on 1st of every calendar month (UTC).
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Pricing Plans */}
      <Card className="rounded-3xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Subscription Pricing Plans</CardTitle>
              </div>
              <CardDescription>
                Configure regular and offer prices for the 3 subscription tiers. Prices are automatically
                converted to integer paise on the server.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      ? 'border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/30'
                      : 'border-dashed border-zinc-300 dark:border-zinc-800 opacity-60 bg-transparent'
                  )}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-zinc-900 dark:text-white">
                        {plan.name} ({plan.durationMonths}{' '}
                        {plan.durationMonths === 1 ? 'Month' : 'Months'})
                      </span>
                      <button
                        type="button"
                        onClick={() => handlePlanToggle(index)}
                        className={cn(
                          'text-[11px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors',
                          plan.isActive
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                        )}
                      >
                        {plan.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[11px] font-medium text-zinc-500">
                          Regular (₹)
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          value={plan.regularPriceRupees}
                          onChange={(e) =>
                            handlePlanPriceChange(
                              index,
                              'regularPriceRupees',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="mt-1 rounded-xl text-sm font-bold"
                        />
                      </div>
                      <div>
                        <Label className="text-[11px] font-medium text-zinc-500">
                          Offer Price (₹)
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          value={plan.offerPriceRupees}
                          onChange={(e) =>
                            handlePlanPriceChange(
                              index,
                              'offerPriceRupees',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="mt-1 rounded-xl text-sm font-bold text-blue-600 dark:text-blue-400"
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1">
                      <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                        <span>Discount:</span>
                        <span className="font-bold text-emerald-600">
                          {discountPct > 0 ? `${discountPct}% OFF` : '0%'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                        <span>Customer Saves:</span>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">
                          ₹{savings}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/80">
                    <span className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      Included Features:
                    </span>
                    <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span className="truncate">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
