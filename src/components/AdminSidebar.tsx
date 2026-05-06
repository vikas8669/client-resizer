'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Star, 
  Settings, 
  Users, 
  Image as ImageIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { name: 'Suggestions', icon: MessageSquare, href: '/admin?tab=suggestions' },
  { name: 'Feedback', icon: Star, href: '/admin?tab=feedback' },
  { name: 'Processed Images', icon: ImageIcon, href: '/admin/images' },
  { name: 'Manage Users', icon: Users, href: '/admin/users' },
  { name: 'Settings', icon: Settings, href: '/admin/settings' },
];

export function AdminSidebar({ 
  isMobileOpen, 
  onMobileClose 
}: { 
  isMobileOpen?: boolean; 
  onMobileClose?: () => void; 
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-[150] flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all duration-300 ease-in-out md:relative h-screen",
        isCollapsed ? "w-20" : "w-64",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-zinc-100 dark:border-zinc-800 px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white shadow-lg shadow-orange-200">
            <Sparkles className="h-5 w-5" />
          </div>
          {!isCollapsed && <span className="text-xl tracking-tight">PrintPix<span className="text-orange-500">Admin</span></span>}
        </Link>
        
        {/* Mobile close button */}
        <button 
          onClick={onMobileClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 md:hidden"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          
          // Improved active state logic to handle query params
          const [itemPath, itemQuery] = item.href.split('?');
          const isActive = itemQuery 
            ? pathname === itemPath && typeof window !== 'undefined' && window.location.search.includes(itemQuery)
            : pathname === item.href && (typeof window !== 'undefined' ? window.location.search === '' : true);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                isActive 
                  ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 shadow-sm" 
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-orange-500" : "text-zinc-400 group-hover:text-zinc-600")} />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-100 dark:border-zinc-800 p-4">
        <button
          onClick={handleLogout}
          className={cn(
            "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 transition-all hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400",
          )}
        >
          <LogOut className="h-5 w-5 shrink-0 text-zinc-400 group-hover:text-red-500" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 hidden lg:flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-400 shadow-sm transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}
