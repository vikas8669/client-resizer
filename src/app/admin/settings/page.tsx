'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings, Shield, Bell, Database, Save, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
// import { Switch } from '@/components/ui/switch';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Admin Settings</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Configure global application parameters and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-all hover:shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-lg dark:text-zinc-100">Security & Access</CardTitle>
            </div>
            <CardDescription className="dark:text-zinc-400">Manage how users authenticate and roles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="dark:text-zinc-200">Public Signups</Label>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Allow new users to create accounts.</p>
              </div>
              <div className="h-6 w-10 rounded-full bg-orange-500 flex items-center px-1">
                <div className="h-4 w-4 rounded-full bg-white ml-auto" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="dark:text-zinc-200">Admin Approval</Label>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Require approval for new registrations.</p>
              </div>
              <div className="h-6 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center px-1">
                <div className="h-4 w-4 rounded-full bg-white dark:bg-zinc-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-all hover:shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-lg dark:text-zinc-100">Notifications</CardTitle>
            </div>
            <CardDescription className="dark:text-zinc-400">Configure system-wide alerts and emails.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="dark:text-zinc-200">Email Alerts</Label>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Send emails for critical system events.</p>
              </div>
              <div className="h-6 w-10 rounded-full bg-orange-500 flex items-center px-1">
                <div className="h-4 w-4 rounded-full bg-white ml-auto" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="dark:text-zinc-200">Feedback Notifications</Label>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Notify admins of new user feedback.</p>
              </div>
              <div className="h-6 w-10 rounded-full bg-orange-500 flex items-center px-1">
                <div className="h-4 w-4 rounded-full bg-white ml-auto" />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      <Card className="border-red-100 dark:border-red-900/30 bg-white dark:bg-zinc-900 shadow-sm mt-6">
        <CardHeader>
          <div className="flex items-center gap-2 text-red-600">
            <Shield className="h-5 w-5" />
            <CardTitle className="text-lg">Danger Zone</CardTitle>
          </div>
          <CardDescription className="dark:text-zinc-400">Personal account actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
            <div>
              <h4 className="text-sm font-semibold text-red-900 dark:text-red-400">Delete Admin Account</h4>
              <p className="text-xs text-red-700 dark:text-red-500/80 mt-1">
                You will lose all admin privileges and your account will be permanently removed.
              </p>
            </div>
            <Button 
              variant="destructive" 
              onClick={async () => {
                if (confirm('Are you SURE you want to delete your admin account? This cannot be undone.')) {
                  try {
                    await (await import('@/api/api')).default.delete((await import('@/api/endpoints')).ENDPOINTS.DELETE_ME);
                    (await import('@/lib/auth')).logout();
                    window.location.href = '/';
                  } catch (e) {
                    alert('Failed to delete account');
                  }
                }
              }}
              className="rounded-xl"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete My Account
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">

        <Button className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 px-8">
          <Save className="h-4 w-4 mr-2" /> Save Configuration
        </Button>
      </div>
    </div>
  );
}
