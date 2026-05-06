'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, UserPlus, Shield, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ManageUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Manage Users</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">View and manage user accounts and permissions.</p>
        </div>
        <Button size="sm" className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20">
          <UserPlus className="h-4 w-4 mr-2" /> Add User
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
        <Input 
          placeholder="Search by name or email..." 
          className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-10 dark:text-zinc-100"
        />
      </div>

      <Card className="border-dashed py-16 text-center bg-zinc-50/30 dark:bg-zinc-900/30 dark:border-zinc-800">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 mb-4">
          <Users className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">User database empty</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto">
          Registered users will be listed here. You can manage their roles and access from this panel.
        </p>
      </Card>
    </div>
  );
}
