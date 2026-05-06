'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings, Shield, Bell, Database, Save } from 'lucide-react';
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

      <div className="flex justify-end">
        <Button className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 px-8">
          <Save className="h-4 w-4 mr-2" /> Save Configuration
        </Button>
      </div>
    </div>
  );
}
