import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../services/api";

// Query key factory for bureau
const bureauKeys = {
  all: ["bureau"] as const,
  reports: () => [...bureauKeys.all, "reports"] as const,
  reportsList: (filters: Record<string, any> = {}) =>
    [...bureauKeys.reports(), "list", filters] as const,
  reportDetail: (id: number) =>
    [...bureauKeys.reports(), "detail", id] as const,
};

export const useBureauReports = () => {
  return useQuery({
    queryKey: bureauKeys.reportsList(),
    queryFn: () => apiService.getBureauReports(),
    staleTime: 1000 * 60 * 30, // 30 minutes (bureau reports are expensive, cache longer)
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    refetchOnWindowFocus: false, // Don't auto-refetch expensive bureau data
    refetchOnReconnect: true,
  });
};

export const useBureauReport = (id: number) => {
  return useQuery({
    queryKey: bureauKeys.reportDetail(id),
    queryFn: () => apiService.getBureauReport(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });
};

export const useCheckCredit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiService.checkCredit(),
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: bureauKeys.all });

      // Snapshot the previous value
      const previousReports = queryClient.getQueryData(
        bureauKeys.reportsList()
      );

      // Optimistically add a pending report
      const optimisticReport = {
        id: `temp-${Date.now()}`,
        status: "processing",
        requestedAt: new Date().toISOString(),
        creditScore: null,
        riskBand: null,
      };

      queryClient.setQueryData(
        bureauKeys.reportsList(),
        (oldData: any[] = []) => {
          return [optimisticReport, ...oldData];
        }
      );

      return { previousReports };
    },
    onSuccess: (newReport) => {
      // Remove the optimistic update and add the real report
      queryClient.setQueryData(
        bureauKeys.reportsList(),
        (oldData: any[] = []) => {
          // Remove any temporary/optimistic entries
          const filtered = oldData.filter(
            (report) => !report.id.toString().startsWith("temp-")
          );
          return [newReport, ...filtered];
        }
      );

      // Update the individual report cache
      if (newReport?.id) {
        queryClient.setQueryData(
          bureauKeys.reportDetail(newReport.id),
          newReport
        );
      }

      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: bureauKeys.all });

      // Prefetch the report details
      if (newReport?.id) {
        queryClient.prefetchQuery({
          queryKey: bureauKeys.reportDetail(newReport.id),
          queryFn: () => apiService.getBureauReport(newReport.id),
        });
      }
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update on error
      if (context?.previousReports) {
        queryClient.setQueryData(
          bureauKeys.reportsList(),
          context.previousReports
        );
      }
      console.error("Failed to check credit:", error);
    },
    onSettled: () => {
      // Always refetch after mutation settles
      queryClient.invalidateQueries({ queryKey: bureauKeys.all });
    },
  });
};
