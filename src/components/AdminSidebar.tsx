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

export function AdminSidebar() {
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
        "relative flex flex-col border-r border-zinc-200 bg-white transition-all duration-300 ease-in-out h-screen",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-16 items-center border-b border-zinc-100 px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-zinc-900 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white shadow-lg shadow-orange-200">
            <Sparkles className="h-5 w-5" />
          </div>
          {!isCollapsed && <span className="text-xl tracking-tight">PrintPix<span className="text-orange-500">Admin</span></span>}
        </Link>
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
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-zinc-50",
                isActive 
                  ? "bg-orange-50 text-orange-600 shadow-sm" 
                  : "text-zinc-600 hover:text-zinc-900"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-orange-500" : "text-zinc-400 group-hover:text-zinc-600")} />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-100 p-4">
        <button
          onClick={handleLogout}
          className={cn(
            "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition-all hover:bg-red-50 hover:text-red-600",
          )}
        >
          <LogOut className="h-5 w-5 shrink-0 text-zinc-400 group-hover:text-red-500" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-400 shadow-sm transition-all hover:bg-zinc-50 hover:text-zinc-900"
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}
