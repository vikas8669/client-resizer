'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/api';
import { ENDPOINTS } from '@/api/endpoints';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, Users, Image as ImageIcon, MessageSquare, CheckCircle2, Reply, Mail, Clock, RefreshCw } from 'lucide-react';
import { getDashboardPath, getStoredUser } from '@/lib/auth';
import { useFeedback } from '@/hooks/useFeedback';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AnalyticsData {
  stats: {
    totalImagesProcessed: number;
    totalUsers: number;
    averageRating: number;
  };
  recentFeedback: Array<{
    _id: string;
    name?: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
}

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'suggestions';
  
  const [isMounted, setIsMounted] = useState(false);
  const { feedback, refetch, resolveSuggestion } = useFeedback();
  const [replyText, setReplyText] = useState('');
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery<AnalyticsData>({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await apiClient.get(ENDPOINTS.ANALYTICS);
      return res.data;
    },
    enabled: isMounted,
    retry: 0,
  });

  useEffect(() => {
    setIsMounted(true);
    refetch();
  }, [refetch]);

  if (!isMounted) {
    return null;
  }

  const handleResolve = async () => {
    if (!selectedSuggestionId || !replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    try {
      await resolveSuggestion.mutateAsync({
        id: selectedSuggestionId,
        adminReply: replyText,
      });
      setReplyText('');
      setSelectedSuggestionId(null);
      setIsDialogOpen(false);
    } catch (error) {
      // toast handled in hook
    }
  };

  if (isAnalyticsLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <RefreshCw className="h-8 w-8 animate-spin text-orange-500" />
        <p className="text-sm text-zinc-500">Loading dashboard analytics...</p>
      </div>
    );
  }

  const stats = analytics?.stats || { totalImagesProcessed: 0, totalUsers: 0, averageRating: 0 };
  
  const feedbackItems = feedback.filter(item => item.type === 'feedback');
  const suggestionItems = feedback.filter(item => item.type === 'suggestion');

  const handleTabChange = (value: string) => {
    router.push(`/admin?tab=${value}`);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-white to-sky-50/50 border-sky-100 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Images Processed</CardTitle>
            <div className="rounded-lg bg-sky-100 p-2 text-sky-600">
              <ImageIcon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-zinc-900">{stats.totalImagesProcessed.toLocaleString()}</div>
            <p className="mt-1 text-xs text-sky-600 font-medium">+12% from last week</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-white to-amber-50/50 border-amber-100 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Average Rating</CardTitle>
            <div className="rounded-lg bg-amber-100 p-2 text-amber-600">
              <Star className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-zinc-900">{stats.averageRating.toFixed(1)} <span className="text-lg font-normal text-zinc-400">/ 5</span></div>
            <p className="mt-1 text-xs text-amber-600 font-medium">Based on {feedbackItems.length} reviews</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-indigo-50/50 border-indigo-100 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Active Users</CardTitle>
            <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-zinc-900">{stats.totalUsers.toLocaleString()}</div>
            <p className="mt-1 text-xs text-indigo-600 font-medium">Estimated unique sessions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={defaultTab} onValueChange={handleTabChange} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-zinc-100/80 p-1 rounded-xl">
            <TabsTrigger value="suggestions" className="flex items-center gap-2 px-6 py-2 rounded-lg data-active:bg-white data-active:shadow-sm">
              <MessageSquare className="w-4 h-4" /> Suggestions
              <span className="ml-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-600">
                {suggestionItems.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2 px-6 py-2 rounded-lg data-active:bg-white data-active:shadow-sm">
              <Star className="w-4 h-4" /> Feedback
              <span className="ml-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-600">
                {feedbackItems.length}
              </span>
            </TabsTrigger>
          </TabsList>
          
          <Button onClick={() => refetch()} variant="outline" size="sm" className="gap-2 rounded-full border-zinc-200 bg-white">
            <RefreshCw className={cn("h-3.5 w-3.5", resolveSuggestion.isPending && "animate-spin")} />
            Refresh Data
          </Button>
        </div>

        <TabsContent value="suggestions" className="mt-0 focus-visible:outline-none">
          <div className="space-y-4">
            {suggestionItems.length === 0 ? (
              <Card className="border-dashed py-12 text-center">
                <p className="text-zinc-500">No suggestions yet.</p>
              </Card>
            ) : (
              suggestionItems.map(item => (
                <Card key={item._id} className="overflow-hidden border-zinc-100 shadow-sm transition-all hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-50 bg-zinc-50/30 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-zinc-100 text-zinc-400 font-bold shadow-sm">
                        {item.name?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-900">{item.name || 'Anonymous'}</span>
                          {item.isResolved && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-100 uppercase">
                              <CheckCircle2 className="h-3 w-3" /> Resolved
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          {item.email && (
                            <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                              <Mail className="h-3 w-3" /> {item.email}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                            <Clock className="h-3 w-3" /> {new Date(item.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {!item.isResolved && (
                      <Dialog open={isDialogOpen && selectedSuggestionId === item._id} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (open) setSelectedSuggestionId(item._id);
                        else {
                           setSelectedSuggestionId(null);
                           setReplyText('');
                        }
                      }}>
                        <DialogTrigger
                          render={
                            <Button size="sm" className="mt-4 sm:mt-0 gap-2 rounded-full bg-zinc-900 hover:bg-zinc-800">
                              <Reply className="w-3.5 h-3.5" /> Reply & Resolve
                            </Button>
                          }
                        />
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Resolve Suggestion</DialogTitle>
                            <DialogDescription>
                              Provide a solution or response to show users that their feedback matters.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-6 py-4">
                            <div className="space-y-2">
                              <Label className="text-xs uppercase tracking-wider text-zinc-400">User's Suggestion</Label>
                              <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-sm text-zinc-600 italic">
                                "{item.comment}"
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="reply" className="text-xs uppercase tracking-wider text-zinc-400">Admin Response</Label>
                              <textarea
                                id="reply"
                                className="flex min-h-[140px] w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition-all focus:ring-1 focus:ring-orange-500"
                                placeholder="Explain how you addressed this or what the status is..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                              />
                            </div>
                          </div>
                          <DialogFooter className="gap-2">
                            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-full">Cancel</Button>
                            <Button onClick={handleResolve} disabled={resolveSuggestion.isPending} className="rounded-full bg-orange-500 hover:bg-orange-600 px-6">
                              {resolveSuggestion.isPending ? 'Publishing...' : 'Publish Solution'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      {item.comment}
                    </p>

                    {item.isResolved && item.adminReply && (
                      <div className="mt-6 rounded-2xl bg-emerald-50/50 p-4 border border-emerald-50">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="rounded-full bg-emerald-100 p-1 text-emerald-600">
                            <Reply className="h-3 w-3" />
                          </div>
                          <span className="text-xs font-bold text-emerald-700 uppercase tracking-tight">Admin Response</span>
                        </div>
                        <p className="text-sm text-emerald-800 font-medium">
                          {item.adminReply}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="mt-0 focus-visible:outline-none">
          <div className="grid gap-4 sm:grid-cols-2">
            {feedbackItems.length === 0 ? (
              <Card className="col-span-full border-dashed py-12 text-center">
                <p className="text-zinc-500">No feedback yet.</p>
              </Card>
            ) : (
              feedbackItems.map(item => (
                <Card key={item._id} className="border-zinc-100 shadow-sm transition-all hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("h-3.5 w-3.5", i < item.rating ? "fill-amber-400 text-amber-400" : "text-zinc-200")} />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-700 leading-relaxed mb-4">"{item.comment}"</p>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-500 uppercase">
                        {item.name?.charAt(0) || 'A'}
                      </div>
                      <span className="text-xs font-semibold text-zinc-900">{item.name || 'Anonymous'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
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
