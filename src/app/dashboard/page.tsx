'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Activity, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock3, 
  Eye, 
  EyeOff, 
  History, 
  ImageIcon, 
  Lock, 
  LogOut, 
  Loader2, 
  ShieldAlert, 
  Trash2, 
  User as UserIcon,
  CreditCard,
  Calendar,
  Sparkles,
  Scissors,
  Zap,
  Check,
  Percent,
  RefreshCw,
  Clock
} from 'lucide-react';
import apiClient from '@/api/api';
import { ENDPOINTS } from '@/api/endpoints';
import { getStoredUser, logout } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useEcardAccess } from '@/features/ecard/hooks/useEcardAccess';

interface HistoryItem { 
  _id: string; 
  action: string; 
  createdAt: string; 
  meta?: Record<string, unknown>; 
}

const panelClass = 'rounded-3xl border border-zinc-200/80 bg-white shadow-[0_12px_40px_-22px_rgba(24,24,27,0.22)] dark:border-zinc-800 dark:bg-zinc-900';

export default function DashboardPage() {
  const router = useRouter();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('subscription');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // E-Card subscription and plan access hook
  const {
    hasActiveSubscription,
    subscription,
    freeMonthlyLimit,
    usedCount,
    remainingCount,
    plans,
    subscribeToPlan,
    isCheckingPayment,
    refetch: refetchAccess,
  } = useEcardAccess();

  useEffect(() => {
    const user = getStoredUser();
    if (!user) { 
      router.replace('/login'); 
      return; 
    }
    if (user.role === 'admin') { 
      router.replace('/admin'); 
      return; 
    }
    setUserName(user.name);
    apiClient
      .get(ENDPOINTS.HISTORY)
      .then((res) => setItems(res.data?.data || []))
      .finally(() => setLoading(false));
  }, [router]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (getStoredUser()?.authProvider === 'google') { 
      toast.error('This account uses Google sign-in.'); 
      return; 
    }
    if (newPassword.length < 6) { 
      toast.error('New password must be at least 6 characters'); 
      return; 
    }
    setIsChangingPassword(true);
    try { 
      await apiClient.post(ENDPOINTS.CHANGE_PASSWORD, { currentPassword, newPassword }); 
      toast.success('Password changed. Please sign in again.'); 
      logout(); 
      router.push('/login'); 
    } catch (error: any) { 
      toast.error(error.response?.data?.message || 'Failed to change password'); 
    } finally { 
      setIsChangingPassword(false); 
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you absolutely sure? This will permanently delete your account and all your data.')) return;
    setIsDeleting(true);
    try { 
      await apiClient.delete(ENDPOINTS.DELETE_ME); 
      toast.success('Account deleted successfully'); 
      logout(); 
      router.push('/'); 
    } catch { 
      toast.error('Failed to delete account'); 
    } finally { 
      setIsDeleting(false); 
    }
  };

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

  const getDaysRemaining = (expiryDate?: string) => {
    if (!expiryDate) return 0;
    const now = new Date().getTime();
    const exp = new Date(expiryDate).getTime();
    return Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
  };

  const currentPlanObj = plans.find((p) => p.id === subscription?.planId);
  const planDisplayName = currentPlanObj?.name || (subscription?.planId ? `${subscription.durationMonths} Month Access` : 'Free Starter Plan');
  const daysRemaining = subscription?.expiryDate ? getDaysRemaining(subscription.expiryDate) : 0;
  const isExpired = subscription?.status === 'expired' || (subscription?.expiryDate && daysRemaining <= 0);

  const PasswordField = ({ 
    label, 
    value, 
    setValue, 
    visible, 
    setVisible 
  }: { 
    label: string; 
    value: string; 
    setValue: (value: string) => void; 
    visible: boolean; 
    setVisible: (value: boolean) => void;
  }) => (
    <label className="block space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
      {label}
      <span className="relative block">
        <input 
          type={visible ? 'text' : 'password'} 
          required 
          value={value} 
          onChange={(e) => setValue(e.target.value)} 
          className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 pr-10 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-orange-500/10" 
        />
        <button 
          type="button" 
          onClick={() => setVisible(!visible)} 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </span>
    </label>
  );

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.13),_transparent_29%),linear-gradient(to_bottom,_#fff7ed_0%,_#fafafa_38%,_#fafafa_100%)] px-4 py-8 dark:bg-[radial-gradient(circle_at_top_right,_rgba(234,88,12,0.18),_transparent_30%),linear-gradient(to_bottom,_#18181b,_#09090b)] sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
              <span className="h-2 w-2 rounded-full bg-orange-500" /> Workspace
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
              Good to see you, {userName.split(' ')[0] || 'there'}.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Manage your subscription, review pricing & expiration details, and access your image tools.
            </p>
          </div>
          <Button 
            onClick={() => { logout(); router.push('/login'); }} 
            variant="outline" 
            className="h-10 rounded-xl border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900 cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </header>

        {/* 4 KPI Overview Cards (Subscription, Expiry, Quota, History) */}
        <section className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Current Plan & Price */}
          <div className="rounded-2xl border border-orange-200/80 bg-white dark:bg-zinc-900 p-5 shadow-xs transition hover:shadow-md dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Current Plan</span>
              <div className="p-2 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xl font-bold text-zinc-900 dark:text-white truncate">
              {hasActiveSubscription ? planDisplayName : isExpired ? 'Expired Plan' : 'Free Starter Tier'}
            </p>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-500">
                {hasActiveSubscription && subscription?.amountRupees 
                  ? `₹${subscription.amountRupees} Paid`
                  : currentPlanObj?.offerPriceRupees 
                  ? `₹${currentPlanObj.offerPriceRupees} Plan`
                  : '₹0 (Free Plan)'}
              </span>
              {hasActiveSubscription ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
              ) : isExpired ? (
                <span className="font-bold text-rose-500">Expired</span>
              ) : (
                <span className="font-bold text-blue-600 dark:text-blue-400">Free Tier</span>
              )}
            </div>
          </div>

          {/* Card 2: Expiration / Validity */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white dark:bg-zinc-900 p-5 shadow-xs transition hover:shadow-md dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Plan Validity</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xl font-bold text-zinc-900 dark:text-white">
              {hasActiveSubscription 
                ? (daysRemaining > 0 ? `${daysRemaining} Days Left` : 'Expires Today')
                : isExpired 
                ? 'Expired'
                : 'Monthly Quota'}
            </p>
            <p className="mt-2 text-xs text-zinc-500 truncate">
              {hasActiveSubscription && subscription?.expiryDate
                ? `Expires on ${new Date(subscription.expiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
                : isExpired && subscription?.expiryDate
                ? `Expired on ${new Date(subscription.expiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
                : 'Resets on 1st of every month'}
            </p>
          </div>

          {/* Card 3: Free Cuts / Quota */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white dark:bg-zinc-900 p-5 shadow-xs transition hover:shadow-md dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">E-Card Cuts</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <Scissors className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xl font-bold text-zinc-900 dark:text-white">
              {hasActiveSubscription ? 'Unlimited' : `${remainingCount} Remaining`}
            </p>
            <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
              <span>{hasActiveSubscription ? 'Continuous VIP access' : `${usedCount} / ${freeMonthlyLimit} used this month`}</span>
            </div>
          </div>

          {/* Card 4: Quick Action */}
          <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500 to-amber-600 p-5 text-white shadow-lg shadow-orange-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-100">Quick Access</span>
                <Sparkles className="h-4 w-4 text-orange-200" />
              </div>
              <p className="text-lg font-bold">
                {hasActiveSubscription ? 'E-Card Studio' : 'Upgrade Plan'}
              </p>
              <p className="text-xs text-orange-100 mt-1 line-clamp-1">
                {hasActiveSubscription ? 'Generate high-res cards' : 'Get unlimited cuts & fast generation'}
              </p>
            </div>
            <button
              onClick={() => {
                if (!hasActiveSubscription) {
                  setActiveTab('subscription');
                } else {
                  router.push('/ecard-cutter');
                }
              }}
              className="mt-3 flex items-center justify-between rounded-xl bg-white/20 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/30 transition cursor-pointer"
            >
              <span>{hasActiveSubscription ? 'Open Studio' : 'View Pricing Plans'}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-6">
          <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-2xl border border-zinc-200/80 bg-white p-1.5 dark:border-zinc-800 dark:bg-zinc-900 sm:w-fit">
            <TabsTrigger 
              value="subscription" 
              className="h-10 rounded-xl px-4 data-[active]:bg-zinc-900 data-[active]:text-white dark:data-[active]:bg-orange-500 cursor-pointer flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              <span>Subscription & Plans</span>
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="h-10 rounded-xl px-4 data-[active]:bg-zinc-900 data-[active]:text-white dark:data-[active]:bg-orange-500 cursor-pointer flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              <span>Activity History ({items.length})</span>
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="h-10 rounded-xl px-4 data-[active]:bg-zinc-900 data-[active]:text-white dark:data-[active]:bg-orange-500 cursor-pointer flex items-center gap-2"
            >
              <Lock className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger 
              value="account" 
              className="h-10 rounded-xl px-4 data-[active]:bg-zinc-900 data-[active]:text-white dark:data-[active]:bg-orange-500 cursor-pointer flex items-center gap-2"
            >
              <UserIcon className="h-4 w-4" />
              <span>Account</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: SUBSCRIPTION & PRICING TAB */}
          <TabsContent value="subscription" className="space-y-6">
            {/* Active Subscription Details Card */}
            <Card className={panelClass}>
              <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
                      <Zap className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Plan & Entitlement Status</span>
                    </div>
                    <CardTitle className="text-xl font-bold">Your Subscription Details</CardTitle>
                    <CardDescription>
                      Full breakdown of your current plan, exact price paid, purchasing date, and expiration time.
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetchAccess()}
                      className="rounded-xl gap-2 font-semibold cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Refresh</span>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => router.push('/ecard-cutter')}
                      className="rounded-xl gap-2 font-bold bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
                    >
                      <Scissors className="h-4 w-4" />
                      <span>Open E-Card Cutter</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Active Plan Info Box */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Item 1: Plan & Status */}
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800">
                    <span className="text-xs text-zinc-500 block mb-1">Subscribed Plan</span>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-zinc-900 dark:text-white">
                        {hasActiveSubscription ? planDisplayName : isExpired ? 'Expired Plan' : 'Free Starter Plan'}
                      </span>
                      {hasActiveSubscription ? (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          Active
                        </span>
                      ) : isExpired ? (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                          Expired
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          Free
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-400 mt-2 block">
                      {hasActiveSubscription 
                        ? `${subscription?.durationMonths || 1} Month duration` 
                        : `${freeMonthlyLimit} free cuts every month`}
                    </span>
                  </div>

                  {/* Item 2: Price Paid */}
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800">
                    <span className="text-xs text-zinc-500 block mb-1">Price Paid / Value</span>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-orange-600 dark:text-orange-400">
                        {hasActiveSubscription && subscription?.amountRupees 
                          ? `₹${subscription.amountRupees}` 
                          : currentPlanObj?.offerPriceRupees 
                          ? `₹${currentPlanObj.offerPriceRupees}` 
                          : '₹0'}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {hasActiveSubscription ? 'Billed via Razorpay' : 'No payment required'}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-400 mt-2 block">
                      {hasActiveSubscription ? 'Zero extra charges or hidden fees' : 'Upgrade below for unlimited cuts'}
                    </span>
                  </div>

                  {/* Item 3: Expiration Date & Time */}
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800">
                    <span className="text-xs text-zinc-500 block mb-1">Expiration Time</span>
                    <div className="flex items-center gap-1.5 text-zinc-900 dark:text-white font-bold text-sm">
                      <Clock className="h-4 w-4 text-orange-500 shrink-0" />
                      <span className="truncate">
                        {subscription?.expiryDate ? formatDate(subscription.expiryDate) : 'Renews Monthly (1st)'}
                      </span>
                    </div>
                    <div className="mt-2">
                      {hasActiveSubscription ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Expires today'}
                        </span>
                      ) : isExpired ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                          Expired {Math.abs(daysRemaining)} days ago
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400">
                          {remainingCount} of {freeMonthlyLimit} free cuts left
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subscribed Plan Benefits Checklist */}
                <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
                    Your Current Access Privileges
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-zinc-700 dark:text-zinc-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{hasActiveSubscription ? 'Unlimited Exact E-Card Cuts' : `${freeMonthlyLimit} Free cuts / month`}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>All document types (Aadhaar, PAN, DL)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Vector-crisp printable PDF</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Zero watermark or downscaling</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Plans & Upgrades Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  {hasActiveSubscription ? 'Extend or Change Subscription Plan' : 'Choose an Unlimited Subscription Plan'}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Instant activation via Razorpay UPI, Cards, NetBanking, or Wallets. Valid immediately.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {plans.map((plan) => {
                  const isCurrent = subscription?.planId === plan.id && hasActiveSubscription;
                  const regular = plan.regularPriceRupees || 0;
                  const offer = plan.offerPriceRupees || 0;
                  const savings = plan.savingsRupees || Math.max(0, regular - offer);
                  const discountPct = plan.discountPercent || (regular > 0 ? Math.round(((regular - offer) / regular) * 100) : 0);

                  return (
                    <div
                      key={plan.id}
                      className={cn(
                        'p-5 rounded-3xl border transition-all flex flex-col justify-between relative bg-white dark:bg-zinc-900',
                        isCurrent
                          ? 'border-orange-500 shadow-lg shadow-orange-500/10 ring-2 ring-orange-500/20'
                          : 'border-zinc-200/80 dark:border-zinc-800 hover:border-orange-300 dark:hover:border-zinc-700 hover:shadow-md'
                      )}
                    >
                      {discountPct > 0 && (
                        <div className="absolute -top-3 right-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                          <Percent className="w-3 h-3" />
                          <span>{discountPct}% OFF</span>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                              {plan.name}
                            </h4>
                            <span className="text-xs text-zinc-400">
                              {plan.durationMonths} {plan.durationMonths === 1 ? 'Month' : 'Months'} Access
                            </span>
                          </div>

                          {isCurrent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
                              Current Plan
                            </span>
                          )}
                        </div>

                        {/* Pricing */}
                        <div className="flex items-baseline gap-2 pt-1">
                          <span className="text-3xl font-black text-zinc-900 dark:text-white">
                            ₹{offer}
                          </span>
                          {regular > offer && (
                            <span className="text-sm font-semibold text-zinc-400 line-through">
                              ₹{regular}
                            </span>
                          )}
                          <span className="text-xs text-zinc-500">
                            / {plan.durationMonths === 1 ? 'month' : `${plan.durationMonths} months`}
                          </span>
                        </div>

                        {savings > 0 && (
                          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            Save ₹{savings} with this plan
                          </div>
                        )}

                        {/* Features list */}
                        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                          {plan.features?.map((f, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                              <Check className="h-3.5 w-3.5 text-orange-500 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Subscribe Button */}
                      <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <Button
                          onClick={() => subscribeToPlan(plan.id)}
                          disabled={isCheckingPayment}
                          className={cn(
                            'w-full rounded-xl font-bold text-xs h-10 shadow-xs cursor-pointer transition',
                            isCurrent
                              ? 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-800 dark:hover:bg-zinc-700'
                              : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/20'
                          )}
                        >
                          {isCheckingPayment ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                          ) : isCurrent ? (
                            'Extend Current Plan'
                          ) : (
                            `Get ${plan.name}`
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: ACTIVITY HISTORY */}
          <TabsContent value="history">
            <Card className={panelClass}>
              <CardHeader className="flex-row items-start justify-between border-b border-zinc-100 pb-5 dark:border-zinc-800">
                <div>
                  <CardTitle className="text-xl">Recent activity</CardTitle>
                  <CardDescription className="mt-1">A record of your latest image-processing actions.</CardDescription>
                </div>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-500/10 dark:text-orange-300">
                  {items.length} total
                </span>
              </CardHeader>
              <CardContent className="p-0">
                {items.length === 0 ? (
                  <div className="py-20 text-center">
                    <Clock3 className="mx-auto mb-4 h-10 w-10 text-zinc-200 dark:text-zinc-700" />
                    <p className="font-medium text-zinc-800 dark:text-zinc-200">Nothing here yet</p>
                    <p className="mt-1 text-sm text-zinc-500">Your processing history will appear here.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {items.map((item) => (
                      <div key={item._id} className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-orange-50/40 sm:px-6 dark:hover:bg-zinc-800/40">
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold capitalize text-zinc-900 dark:text-zinc-100">
                              {item.action.replaceAll('_', ' ')}
                            </p>
                            <p className="mt-0.5 text-xs text-zinc-500">{new Date(item.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        {item.meta?.format ? (
                          <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:bg-zinc-800">
                            {String(item.meta.format)}
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: SECURITY */}
          <TabsContent value="security">
            <Card className={panelClass}>
              <CardHeader className="border-b border-zinc-100 dark:border-zinc-800">
                <CardTitle className="text-xl">Password & security</CardTitle>
                <CardDescription>Use a unique password to protect your account.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleChangePassword} className="max-w-md space-y-5">
                  <PasswordField 
                    label="Current password" 
                    value={currentPassword} 
                    setValue={setCurrentPassword} 
                    visible={showCurrentPassword} 
                    setVisible={setShowCurrentPassword} 
                  />
                  <PasswordField 
                    label="New password" 
                    value={newPassword} 
                    setValue={setNewPassword} 
                    visible={showNewPassword} 
                    setVisible={setShowNewPassword} 
                  />
                  <Button 
                    type="submit" 
                    disabled={isChangingPassword} 
                    className="h-10 rounded-xl bg-orange-500 px-5 hover:bg-orange-600 cursor-pointer"
                  >
                    {isChangingPassword ? 'Updating…' : 'Update password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: ACCOUNT */}
          <TabsContent value="account">
            <Card className="overflow-hidden rounded-3xl border-red-100 bg-white shadow-[0_12px_40px_-22px_rgba(24,24,27,0.22)] dark:border-red-900/40 dark:bg-zinc-900">
              <CardHeader className="border-b border-red-100 bg-red-50/60 dark:border-red-900/30 dark:bg-red-950/20">
                <div className="flex items-center gap-2 text-red-600">
                  <ShieldAlert className="h-5 w-5" />
                  <CardTitle className="text-xl">Danger zone</CardTitle>
                </div>
                <CardDescription>These actions are permanent and cannot be reversed.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center">
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">Delete your account</p>
                  <p className="mt-1 text-sm text-zinc-500">All of your history and account data will be removed.</p>
                </div>
                <Button 
                  variant="destructive" 
                  disabled={isDeleting} 
                  onClick={handleDeleteAccount} 
                  className="h-10 rounded-xl px-4 cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDeleting ? 'Deleting…' : 'Delete account'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
