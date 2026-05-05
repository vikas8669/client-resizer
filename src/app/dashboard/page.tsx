'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/api/api';
import { ENDPOINTS } from '@/api/endpoints';
import { getStoredUser } from '@/lib/auth';

interface HistoryItem {
  _id: string;
  action: string;
  createdAt: string;
  meta?: Record<string, unknown>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.role === 'admin') {
      router.replace('/admin');
      return;
    }
    setUserName(user.name);

    const load = async () => {
      try {
        const res = await apiClient.get(ENDPOINTS.HISTORY);
        setItems(res.data?.data || []);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-50 px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-zinc-500">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>
        <p className="mt-2 text-zinc-600">Welcome, {userName}. Your processing history appears only when logged in.</p>

        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">Activity History</h2>

          {items.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">No history yet. Start by uploading or processing an image.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li key={item._id} className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                  <p className="text-sm font-medium text-zinc-900">{item.action.replaceAll('_', ' ')}</p>
                  <p className="text-xs text-zinc-500">{new Date(item.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
