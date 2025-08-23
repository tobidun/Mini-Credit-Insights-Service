import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../services/api";

// Query key factory for insights
const insightsKeys = {
  all: ["insights"] as const,
  lists: () => [...insightsKeys.all, "list"] as const,
  list: (filters: Record<string, any> = {}) =>
    [...insightsKeys.lists(), filters] as const,
  details: () => [...insightsKeys.all, "detail"] as const,
  detail: (id: number) => [...insightsKeys.details(), id] as const,
};

export const useInsights = () => {
  return useQuery({
    queryKey: insightsKeys.lists(),
    queryFn: () => apiService.getInsights(),
    staleTime: 1000 * 60 * 10, // 10 minutes (insights don't change frequently)
    gcTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false, // Insights are relatively static
    refetchOnReconnect: true,
  });
};

export const useInsight = (id: number) => {
  return useQuery({
    queryKey: insightsKeys.detail(id),
    queryFn: () => apiService.getInsight(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useComputeInsights = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (statementId: number) =>
      apiService.computeInsights(statementId),
    onMutate: async (statementId) => {
      // Cancel any outgoing refetches to avoid optimistic update conflicts
      await queryClient.cancelQueries({ queryKey: insightsKeys.all });

      // Snapshot the previous value for rollback
      const previousInsights = queryClient.getQueryData(insightsKeys.lists());

      return { previousInsights };
    },
    onSuccess: (newInsight, statementId) => {
      // Update the insights list cache
      queryClient.setQueryData(insightsKeys.lists(), (oldData: any[] = []) => {
        // Remove any existing insight for this statement and add the new one
        const filtered = oldData.filter(
          (insight) => insight.statementId !== statementId
        );
        return [newInsight, ...filtered];
      });

      // Update the individual insight cache
      if (newInsight?.id) {
        queryClient.setQueryData(
          insightsKeys.detail(newInsight.id),
          newInsight
        );
      }

      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: insightsKeys.all });

      // Prefetch the insight details for quick access
      if (newInsight?.id) {
        queryClient.prefetchQuery({
          queryKey: insightsKeys.detail(newInsight.id),
          queryFn: () => apiService.getInsight(newInsight.id),
        });
      }
    },
    onError: (error, statementId, context) => {
      // Rollback on error
      if (context?.previousInsights) {
        queryClient.setQueryData(
          insightsKeys.lists(),
          context.previousInsights
        );
      }
      console.error("Failed to compute insights:", error);
    },
    onSettled: () => {
      // Always refetch after mutation settles
      queryClient.invalidateQueries({ queryKey: insightsKeys.all });
    },
  });
};
