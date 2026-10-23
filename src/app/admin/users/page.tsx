"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Search, 
  Trash2, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  UserCheck,
  UserX,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import apiClient from '@/api/api';
import { ENDPOINTS } from '@/api/endpoints';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getStoredUser } from '@/lib/auth';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  authProvider?: string;
  isActive?: boolean;
  createdAt: string;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const currentUser = getStoredUser();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(ENDPOINTS.USERS);
      setUsers(res.data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user: User) => {
    if (user._id === currentUser?.id) {
      toast.error('You cannot deactivate your own admin account');
      return;
    }

    const currentStatus = user.isActive !== false;
    const nextStatus = !currentStatus;

    try {
      setUpdatingUserId(user._id);
      const res = await apiClient.patch(ENDPOINTS.UPDATE_USER_STATUS(user._id), {
        isActive: nextStatus,
      });

      if (res.data?.success) {
        toast.success(
          `User "${user.name}" ${nextStatus ? 'activated' : 'deactivated'} successfully`
        );
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, isActive: nextStatus } : u))
        );
      } else {
        toast.error(res.data?.message || 'Failed to update user status');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error updating user status');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (id === currentUser?.id) {
      toast.error('You cannot delete your own admin account');
      return;
    }

    if (!confirm(`Are you sure you want to delete user "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiClient.delete(ENDPOINTS.DELETE_USER(id));
      toast.success('User deleted successfully');
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter((u) => {
    const isUserActive = u.isActive !== false;
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? isUserActive
        : !isUserActive;

    const matchesRole =
      roleFilter === 'all'
        ? true
        : roleFilter === 'admin'
        ? u.role === 'admin'
        : u.role !== 'admin';

    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term);

    return matchesStatus && matchesRole && matchesSearch;
  });

  const totalUsers = users.length;
  const activeCount = users.filter((u) => u.isActive !== false).length;
  const inactiveCount = users.filter((u) => u.isActive === false).length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Manage Users</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            View and manage user accounts, permissions, and active statuses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            disabled={loading}
            className="rounded-xl gap-2 font-semibold cursor-pointer"
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
              Total Users
            </span>
            <div className="text-2xl font-black text-zinc-900 dark:text-white">
              {totalUsers}
            </div>
            <span className="text-[11px] text-zinc-400">Registered accounts</span>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
              Active Users
            </span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <span>{activeCount}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">Can login & use app</span>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
              Deactivated
            </span>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {inactiveCount}
            </div>
            <span className="text-[11px] text-zinc-400">Blocked by admin</span>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
              Administrators
            </span>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {adminCount}
            </div>
            <span className="text-[11px] text-zinc-400">Full platform access</span>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="rounded-3xl border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        {/* Filters and Search Bar */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
            <Input
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl text-xs font-bold">
              {(['all', 'active', 'inactive'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer',
                    statusFilter === s
                      ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                  )}
                >
                  {s === 'active' ? 'Active' : s === 'inactive' ? 'Deactivated' : 'All Status'}
                </button>
              ))}
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl text-xs font-bold">
              {(['all', 'admin', 'user'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRoleFilter(r)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer',
                    roleFilter === r
                      ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                  )}
                >
                  {r === 'all' ? 'All Roles' : r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Table */}
        <CardContent className="p-0">
          {loading && users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <RefreshCw className="h-8 w-8 animate-spin text-orange-500" />
              <span className="text-sm text-zinc-500 font-medium">Loading user accounts...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-16 text-center px-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 mb-3">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                No users found
              </h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                {search || statusFilter !== 'all' || roleFilter !== 'all'
                  ? 'No users match your active filters. Try clearing the search or filters.'
                  : 'Registered users will be listed here.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-800/30 text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    <th className="py-3.5 px-6">User</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Auth Method</th>
                    <th className="py-3.5 px-4">Account Status</th>
                    <th className="py-3.5 px-4">Joined Date</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-sm">
                  {filteredUsers.map((user) => {
                    const isUserActive = user.isActive !== false;
                    const isSelf = user._id === currentUser?.id;
                    const isUpdating = updatingUserId === user._id;

                    return (
                      <tr
                        key={user._id}
                        className={cn(
                          'hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors',
                          !isUserActive && 'opacity-65 bg-zinc-50/30 dark:bg-zinc-900/40'
                        )}
                      >
                        {/* USER DETAILS */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                              {user.name ? user.name[0].toUpperCase() : 'U'}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                                  {user.name}
                                </span>
                                {isSelf && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate flex items-center gap-1.5 mt-0.5">
                                <Mail className="h-3 w-3 text-zinc-400 shrink-0" />
                                <span>{user.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* ROLE */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {user.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50">
                              <Shield className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                              User
                            </span>
                          )}
                        </td>

                        {/* AUTH PROVIDER */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 capitalize">
                            {user.authProvider || 'Local / Email'}
                          </span>
                        </td>

                        {/* ACTIVE STATUS TOGGLE (Admin Only) */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(user)}
                              disabled={isSelf || isUpdating}
                              title={
                                isSelf
                                  ? 'You cannot deactivate your own account'
                                  : isUserActive
                                  ? 'Click to Deactivate'
                                  : 'Click to Activate'
                              }
                              className={cn(
                                'w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none shrink-0',
                                isUserActive ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-700',
                                (isSelf || isUpdating) && 'opacity-50 cursor-not-allowed'
                              )}
                            >
                              <div
                                className={cn(
                                  'w-4 h-4 rounded-full bg-white transition-transform absolute top-1',
                                  isUserActive ? 'right-1' : 'left-1'
                                )}
                              />
                            </button>

                            <span
                              className={cn(
                                'inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md',
                                isUserActive
                                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40'
                                  : 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40'
                              )}
                            >
                              {isUpdating ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : isUserActive ? (
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <XCircle className="h-3 w-3 text-rose-500" />
                              )}
                              <span>{isUserActive ? 'Active' : 'Deactivated'}</span>
                            </span>
                          </div>
                        </td>

                        {/* JOINED DATE */}
                        <td className="py-4 px-4 whitespace-nowrap text-xs text-zinc-500 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                            <span>{new Date(user.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}</span>
                          </div>
                        </td>

                        {/* ACTIONS */}
                        <td className="py-4 px-6 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(user)}
                              disabled={isSelf || isUpdating}
                              className={cn(
                                'h-8 px-2.5 text-xs font-semibold rounded-lg gap-1.5 cursor-pointer',
                                isUserActive
                                  ? 'text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 dark:border-rose-900/40'
                                  : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200 dark:border-emerald-900/40'
                              )}
                            >
                              {isUserActive ? (
                                <>
                                  <UserX className="h-3.5 w-3.5" />
                                  <span>Deactivate</span>
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-3.5 w-3.5" />
                                  <span>Activate</span>
                                </>
                              )}
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(user._id, user.name)}
                              disabled={isSelf}
                              title={isSelf ? 'Cannot delete self' : 'Delete user'}
                              className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
