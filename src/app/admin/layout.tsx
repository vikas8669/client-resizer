'use client';

import React from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { NotificationPanel } from '@/components/NotificationPanel';
import { User, Search, Menu, X } from 'lucide-react';
import { getDashboardPath, getStoredUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthorized, setIsAuthorized] = React.useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
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
    <div className="flex h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.10),_transparent_32%),#fafafa] dark:bg-[radial-gradient(circle_at_top_right,_rgba(234,88,12,0.14),_transparent_32%),#09090b] transition-colors duration-300">
      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-[140] bg-zinc-900/40 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <AdminSidebar 
        isMobileOpen={isMobileSidebarOpen} 
        onMobileClose={() => setIsMobileSidebarOpen(false)} 
      />
      
      <div className="flex flex-1 flex-col h-screen overflow-y-auto overflow-x-hidden min-w-0">
        {/* ... header and main code ... */}
        <header className="sticky top-0 z-[100] flex h-[72px] items-center justify-between border-b border-zinc-200/80 bg-white/80 px-4 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/70 md:px-8 transition-colors">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search analytics, suggestions..." 
                className="h-10 w-full rounded-xl border border-transparent bg-zinc-100/80 pl-10 pr-4 text-sm outline-none transition-all focus:border-orange-200 focus:bg-white focus:ring-4 focus:ring-orange-100 dark:bg-zinc-900 dark:focus:border-orange-500/30 dark:focus:bg-zinc-800 dark:focus:ring-orange-500/10 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationPanel />
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{user?.name || 'Admin'}</p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 capitalize">{user?.role || 'Administrator'}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-md">
                <User className="h-5 w-5" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
