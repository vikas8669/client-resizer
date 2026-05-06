'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/api';
import { ENDPOINTS } from '@/api/endpoints';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Users, Image as ImageIcon, MessageSquare, CheckCircle2, Reply, Mail, Clock, RefreshCw } from 'lucide-react';
import { useFeedback } from '@/hooks/useFeedback';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const cardBase = `
group relative overflow-hidden rounded-2xl
border border-zinc-200/60 dark:border-zinc-800/60
bg-white/70 dark:bg-zinc-900/70
backdrop-blur-xl
shadow-sm hover:shadow-xl
transition-all duration-300
`;

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'suggestions';

  const [isMounted, setIsMounted] = useState(false);
  const { feedback, refetch, resolveSuggestion } = useFeedback();
  const [replyText, setReplyText] = useState('');
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await apiClient.get(ENDPOINTS.ANALYTICS);
      return res.data;
    },
    enabled: isMounted,
  });

  useEffect(() => {
    setIsMounted(true);
    refetch();
  }, []);

  if (!isMounted) return null;

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const stats = analytics?.stats || { totalImagesProcessed: 0, totalUsers: 0, averageRating: 0 };

  const suggestionItems = feedback.filter(f => f.type === 'suggestion');
  const feedbackItems = feedback.filter(f => f.type === 'feedback');

  const handleResolve = async () => {
    if (!selectedSuggestionId || !replyText.trim()) {
      toast.error('Enter reply');
      return;
    }

    await resolveSuggestion.mutateAsync({
      id: selectedSuggestionId,
      adminReply: replyText,
    });

    setReplyText('');
    setSelectedSuggestionId(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-8">

      {/* 🔥 STATS */}
      <div className="grid md:grid-cols-3 gap-6">

        {[
          { title: 'Processed', value: stats.totalImagesProcessed, icon: ImageIcon, color: 'indigo' },
          { title: 'Rating', value: stats.averageRating.toFixed(1), icon: Star, color: 'amber' },
          { title: 'Users', value: stats.totalUsers, icon: Users, color: 'emerald' },
        ].map((item, i) => (
          <motion.div key={i} whileHover={{ y: -6 }}>
            <Card className={cardBase}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-indigo-500/20 to-blue-500/20 blur-xl" />
              </div>

              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-sm text-zinc-500 dark:text-zinc-400">
                  {item.title}
                </CardTitle>
                <item.icon className="w-4 h-4 text-indigo-500" />
              </CardHeader>

              <CardContent>
                <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                  {item.value}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 🔥 TABS */}
      <Tabs value={defaultTab} onValueChange={(v) => router.push(`/admin?tab=${v}`)}>
        <TabsList className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur border rounded-xl p-1">

          <TabsTrigger value="suggestions">Suggestions ({suggestionItems.length})</TabsTrigger>
          <TabsTrigger value="feedback">Feedback ({feedbackItems.length})</TabsTrigger>

        </TabsList>

        {/* 🔥 SUGGESTIONS */}
        <TabsContent value="suggestions" className="mt-6 space-y-4">

          {suggestionItems.map(item => (
            <Card key={item._id} className={cardBase}>

              <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-indigo-500 to-purple-500" />

              <CardContent className="p-6 space-y-4">

                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white">
                      {item.name || 'Anonymous'}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {item.email}
                    </p>
                  </div>

                  {!item.isResolved && (
                    <Dialog open={isDialogOpen && selectedSuggestionId === item._id}>
                      <DialogTrigger
                        onClick={() => {
                          setSelectedSuggestionId(item._id);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Button size="sm">Reply</Button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reply</DialogTitle>
                        </DialogHeader>

                        <textarea
                          className="w-full border rounded-lg p-3"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />

                        <DialogFooter>
                          <Button onClick={handleResolve}>Send</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  {item.comment}
                </p>

                {item.isResolved && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl">
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                      {item.adminReply}
                    </p>
                  </div>
                )}

              </CardContent>
            </Card>
          ))}

        </TabsContent>

        {/* 🔥 FEEDBACK */}
        <TabsContent value="feedback" className="mt-6 grid md:grid-cols-2 gap-4">

          {feedbackItems.map(item => (
            <Card key={item._id} className={cardBase}>
              <CardContent className="p-6">

                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("w-4 h-4", i < item.rating ? "text-yellow-400" : "text-zinc-300")} />
                  ))}
                </div>

                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  {item.comment}
                </p>

              </CardContent>
            </Card>
          ))}

        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}