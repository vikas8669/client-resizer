import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/api';
import { ENDPOINTS } from '@/api/endpoints';
import { toast } from 'sonner';

export interface Feedback {
  _id: string;
  name?: string;
  email?: string;
  rating: number;
  comment: string;
  tags: string[];
  type: 'feedback' | 'suggestion';
  isResolved: boolean;
  adminReply?: string;
  createdAt: string;
  updatedAt: string;
}

export function useFeedback() {
  const queryClient = useQueryClient();

  const query = useQuery<Feedback[]>({
    queryKey: ['feedback'],
    queryFn: async () => {
      try {
        const res = await apiClient.get(ENDPOINTS.FEEDBACK);
        return res.data?.data || [];
      } catch (error: any) {
        const errorMsg = error.message || 'Failed to fetch feedback';
        console.warn('Feedback service unavailable:', errorMsg);
        return [];
      }
    },
    enabled: false,
    retry: 0,
  });

  const resolvedQuery = useQuery<Feedback[]>({
    queryKey: ['feedback', 'resolved'],
    queryFn: async () => {
      try {
        const res = await apiClient.get(ENDPOINTS.RESOLVED_FEEDBACK);
        return res.data?.data || [];
      } catch (error: any) {
        console.warn('Failed to fetch resolved feedback:', error.message);
        return [];
      }
    },
    retry: 0,
  });

  const submitFeedback = useMutation({
    mutationFn: async (newFeedback: Partial<Feedback>) => {
      try {
        const res = await apiClient.post(ENDPOINTS.FEEDBACK, newFeedback);
        return res.data?.data;
      } catch (error: any) {
        const errorMsg = error.message || 'Failed to submit feedback';
        toast.error(errorMsg);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Thank you! Your submission has been received.');
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });

  const resolveSuggestion = useMutation({
    mutationFn: async ({ id, adminReply }: { id: string; adminReply: string }) => {
      try {
        const res = await apiClient.patch(ENDPOINTS.RESOLVE_FEEDBACK(id), { adminReply });
        return res.data?.data;
      } catch (error: any) {
        const errorMsg = error.response?.data?.message || error.message || 'Failed to resolve suggestion';
        toast.error(errorMsg);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Suggestion resolved and published!');
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      queryClient.invalidateQueries({ queryKey: ['feedback', 'resolved'] });
    },
  });

  return {
    feedback: query.data || [],
    resolvedFeedback: resolvedQuery.data || [],
    isLoading: query.isLoading || resolvedQuery.isLoading,
    isError: query.isError || resolvedQuery.isError,
    error: query.error || resolvedQuery.error,
    refetch: query.refetch,
    refetchResolved: resolvedQuery.refetch,
    submitFeedback,
    resolveSuggestion,
  };
}
