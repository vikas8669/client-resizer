'use client';

import React from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { NotificationPanel } from '@/components/NotificationPanel';
import { User, Search } from 'lucide-react';
import { getDashboardPath, getStoredUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthorized, setIsAuthorized] = React.useState(false);
  const router = useRouter();
  
  // Stable user reference
  const user = React.useMemo(() => getStoredUser(), []);

  React.useEffect(() => {
    // Only run the redirect logic once on mount
    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.role !== 'admin') {
      router.replace(getDashboardPath(user));
      return;
    }
    setIsAuthorized(true);
  }, [user, router]);

  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm font-medium text-zinc-500 italic">Securing dashboard access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50/50">
      <AdminSidebar />
      
      <div className="flex flex-1 flex-col">
        {/* ... header and main code ... */}
        <header className="sticky top-0 z-[100] flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-8">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search analytics, suggestions..." 
                className="h-9 w-full rounded-full bg-zinc-100 pl-10 pr-4 text-sm outline-none transition-all focus:bg-white focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationPanel />
            <div className="h-6 w-px bg-zinc-200" />
            <div className="flex items-center gap-3">
              <div className="hidden text-right md:block">
                <p className="text-sm font-semibold text-zinc-900">{user?.name || 'Admin'}</p>
                <p className="text-xs text-zinc-500 capitalize">{user?.role || 'Administrator'}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-md">
                <User className="h-5 w-5" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
