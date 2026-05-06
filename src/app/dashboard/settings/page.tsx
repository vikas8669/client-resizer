'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldAlert, Trash2, ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import apiClient from '@/api/api';
import { ENDPOINTS } from '@/api/endpoints';
import { toast } from 'sonner';
import { logout } from '@/lib/auth';

export default function UserSettingsPage() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(
      'Are you absolutely sure? This will permanently delete your account and all your data. This action cannot be undone.'
    );

    if (!confirmation) return;

    setIsDeleting(true);
    try {
      await apiClient.delete(ENDPOINTS.DELETE_ME);
      toast.success('Account deleted successfully');
      logout(); // Clear local storage
      router.push('/'); // Redirect to landing
    } catch (error) {
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-2xl">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <SettingsIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Account Settings</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Manage your account and data privacy.</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-red-100 dark:border-red-900/30 bg-white dark:bg-zinc-900 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2 text-red-600">
                <ShieldAlert className="h-5 w-5" />
                <CardTitle className="text-lg">Danger Zone</CardTitle>
              </div>
              <CardDescription className="dark:text-zinc-400">
                These actions are permanent and cannot be reversed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                <div>
                  <h4 className="text-sm font-semibold text-red-900 dark:text-red-400">Delete Account</h4>
                  <p className="text-xs text-red-700 dark:text-red-500/80 mt-1">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  disabled={isDeleting}
                  onClick={handleDeleteAccount}
                  className="rounded-xl shadow-lg shadow-red-500/20"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg dark:text-zinc-100">Privacy & Data</CardTitle>
              <CardDescription className="dark:text-zinc-400">
                Your data is handled according to our privacy policy.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                We store your processing history to help you keep track of your work. You can view this on your dashboard.
                When you delete your account, all this data is permanently removed from our servers.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
