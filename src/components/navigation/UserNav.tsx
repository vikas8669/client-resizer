"use client";

import * as React from "react";
import Link from "next/link";
import { UserCircle2, LogOut, LayoutDashboard, Settings, KeyRound, HelpCircle, Shield } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AuthUser } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface UserNavProps {
  user: AuthUser | null;
}

export function UserNav({ user }: UserNavProps) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
    } catch {
      // Handled in auth hook
    }
  };

  if (!user) {
    return (
      <div className="hidden md:flex items-center gap-3">
        <Link
          href="/login"
          className="text-sm font-semibold text-zinc-600 hover:text-black dark:text-zinc-300 dark:hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/10"
        >
          Log in
        </Link>
        <Link href="/product">
          <Button className="rounded-full px-5 py-5 text-sm font-semibold shadow-lg hover:shadow-indigo-500/20 transition-all">
            Get Started
          </Button>
        </Link>
      </div>
    );
  }

  const isAdmin = user.role === "admin";

  return (
    <div className="hidden md:flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger
          openOnHover
          delay={80}
          closeDelay={120}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/90 px-3.5 py-1.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900/90 dark:border-white/10 dark:text-zinc-200 transition-all outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/40 shadow-xs"
          aria-label="User account menu"
        >
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
            <UserCircle2 className="h-4 w-4" />
          </div>
          <span className="max-w-[120px] truncate">{user.name}</span>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="bottom"
          align="end"
          sideOffset={8}
          className="w-64 p-2 rounded-2xl shadow-2xl border-zinc-200/90 dark:border-white/10 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl"
        >
          <div className="px-3 py-2.5 bg-zinc-50 dark:bg-white/5 rounded-xl mb-1.5">
            <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
              {user.name}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
              {user.email}
            </p>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                <Shield className="w-3 h-3" /> Admin
              </span>
            )}
          </div>

          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuItem
            render={<Link href="/dashboard" />}
            className="w-full p-2.5 rounded-xl cursor-pointer flex items-center gap-2.5 hover:bg-zinc-100 dark:hover:bg-white/10"
          >
            <LayoutDashboard className="h-4 w-4 text-zinc-500" />
            <span className="text-sm font-medium">Dashboard</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            render={<Link href="/dashboard/settings" />}
            className="w-full p-2.5 rounded-xl cursor-pointer flex items-center gap-2.5 hover:bg-zinc-100 dark:hover:bg-white/10"
          >
            <Settings className="h-4 w-4 text-zinc-500" />
            <span className="text-sm font-medium">Account Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            render={<Link href="/change-password" />}
            className="w-full p-2.5 rounded-xl cursor-pointer flex items-center gap-2.5 hover:bg-zinc-100 dark:hover:bg-white/10"
          >
            <KeyRound className="h-4 w-4 text-zinc-500" />
            <span className="text-sm font-medium">Change Password</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => toast.info('This feature is coming soon!')}
            className="w-full p-2.5 rounded-xl cursor-pointer flex items-center gap-2.5 hover:bg-zinc-100 dark:hover:bg-white/10"
          >
            <HelpCircle className="h-4 w-4 text-zinc-500" />
            <span className="text-sm font-medium">Reset Password Help</span>
          </DropdownMenuItem>

          {isAdmin && (
            <>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                render={<Link href="/admin" />}
                className="w-full p-2.5 rounded-xl cursor-pointer flex items-center gap-2.5 hover:bg-zinc-100 dark:hover:bg-white/10"
              >
                <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  Admin Panel
                </span>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuItem
            onClick={handleLogout}
            disabled={logout.isPending}
            className="w-full p-2.5 rounded-xl cursor-pointer flex items-center gap-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 focus:bg-red-50 focus:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-medium">
              {logout.isPending ? "Logging out..." : "Log out"}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link href="/product">
        <Button className="rounded-full px-5 py-5 text-sm font-semibold shadow-lg hover:shadow-indigo-500/20 transition-all">
          Get Started
        </Button>
      </Link>
    </div>
  );
}
