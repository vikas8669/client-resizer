import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/api';
import { ENDPOINTS } from '@/api/endpoints';
import { toast } from 'sonner';

export interface Feedback {
  _id: string;
  name?: string;
  rating: number;
  comment: string;
  tags: string[];
  createdAt: string;
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
        // Return empty array instead of throwing - graceful fallback
        return [];
      }
    },
    enabled: false, // Don't fetch automatically - optional/lazy loading
    retry: 0, // Don't retry - server likely isn't running
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
      toast.success('Thank you for your feedback!');
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] }); // Invalidate analytics too
    },
    onError: (error: any) => {
      // Error already shown in mutationFn
    },
  });

  return {
    feedback: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    submitFeedback,
  };
}
