'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { History, Lock, User as UserIcon, Trash2, ShieldAlert, LogOut, Loader2, Sparkles, Clock, CheckCircle2, Eye, EyeOff } from 'lucide-react';

import apiClient from '@/api/api';
import { ENDPOINTS } from '@/api/endpoints';
import { getStoredUser, logout } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface HistoryItem {
  _id: string;
  action: string;
  createdAt: string;
  meta?: Record<string, unknown>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');
  const [activeTab, setActiveTab] = useState('history');

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);


  // Delete Account State
  const [isDeleting, setIsDeleting] = useState(false);

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

    const load = async () => {
      try {
        const res = await apiClient.get(ENDPOINTS.HISTORY);
        setItems(res.data?.data || []);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = getStoredUser();
    if (user?.authProvider === 'google') {
      toast.error("you login with google so you login with google");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setIsChangingPassword(true);
    try {
      await apiClient.post(ENDPOINTS.CHANGE_PASSWORD, { currentPassword, newPassword });
      toast.success("Password changed successfully. Please login again.");
      logout();
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
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
    } catch (error) {
      toast.error('Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 px-4 py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-orange-500" />
              User Dashboard
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">Welcome back, <span className="font-semibold text-zinc-900 dark:text-zinc-100">{userName}</span>.</p>
          </div>
          <Button variant="outline" onClick={() => { logout(); router.push('/login'); }} className="rounded-xl border-zinc-200 dark:border-zinc-800">
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-2xl shadow-sm overflow-x-auto inline-flex w-full sm:w-auto">
            <TabsTrigger value="history" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all">
              <History className="h-4 w-4 mr-2" /> Activity
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all">
              <Lock className="h-4 w-4 mr-2" /> Security
            </TabsTrigger>
            <TabsTrigger value="account" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all">
              <UserIcon className="h-4 w-4 mr-2" /> Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-0">
            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-zinc-100 dark:border-zinc-800">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Your last 100 image processing actions.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {items.length === 0 ? (
                  <div className="py-20 text-center">
                    <Clock className="h-12 w-12 text-zinc-200 dark:text-zinc-800 mx-auto mb-4" />
                    <p className="text-zinc-500">No activity history yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {items.map((item) => (
                      <div key={item._id} className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                              {item.action.replaceAll('_', ' ')}
                            </p>
                            <p className="text-xs text-zinc-500">
                              {new Date(item.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {!!item.meta?.format && (
                          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md text-zinc-500">
                            {String(item.meta.format)}
                          </span>
                        )}

                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-0">
            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Password & Security</CardTitle>
                <CardDescription>Update your password to keep your account secure.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Current Password</label>
                    <div className="relative">
                      <input 
                        type={showCurrentPassword ? "text" : "password"} 
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-2.5 text-sm outline-none focus:border-orange-500 transition-all pr-10"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">New Password</label>
                    <div className="relative">
                      <input 
                        type={showNewPassword ? "text" : "password"} 
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-2.5 text-sm outline-none focus:border-orange-500 transition-all pr-10"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" disabled={isChangingPassword} className="rounded-xl w-full sm:w-auto">
                    {isChangingPassword ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="mt-0">
            <Card className="border-red-100 dark:border-red-900/30 bg-white dark:bg-zinc-900 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="bg-red-50/50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/20">
                <div className="flex items-center gap-2 text-red-600">
                  <ShieldAlert className="h-5 w-5" />
                  <CardTitle className="text-lg">Danger Zone</CardTitle>
                </div>
                <CardDescription className="text-red-700/70 dark:text-red-400/70">
                  Permanently delete your account and all your data.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Delete Account</p>
                    <p className="text-xs text-zinc-500">This action cannot be undone. All your history will be lost.</p>
                  </div>
                  <Button variant="destructive" disabled={isDeleting} onClick={handleDeleteAccount} className="rounded-xl">
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting ? "Deleting..." : "Delete Permanently"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

