import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../services/api";

// Query key factory for statements
const statementsKeys = {
  all: ["statements"] as const,
  lists: () => [...statementsKeys.all, "list"] as const,
  list: (filters: Record<string, any> = {}) =>
    [...statementsKeys.lists(), filters] as const,
  details: () => [...statementsKeys.all, "detail"] as const,
  detail: (id: number) => [...statementsKeys.details(), id] as const,
};

export const useStatements = () => {
  return useQuery({
    queryKey: statementsKeys.lists(),
    queryFn: () => apiService.getStatements(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const useStatement = (id: number) => {
  return useQuery({
    queryKey: statementsKeys.detail(id),
    queryFn: () => apiService.getStatement(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useUploadStatement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => apiService.uploadStatement(file),
    onSuccess: (newStatement) => {
      // Immediately update the statements list cache
      queryClient.setQueryData(
        statementsKeys.lists(),
        (oldData: any[] = []) => {
          return [newStatement, ...oldData];
        }
      );

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: statementsKeys.all });

      // Also invalidate insights since they depend on statements
      queryClient.invalidateQueries({ queryKey: ["insights"] });

      // Prefetch the new statement details
      if (newStatement?.id) {
        queryClient.prefetchQuery({
          queryKey: statementsKeys.detail(newStatement.id),
          queryFn: () => apiService.getStatement(newStatement.id),
        });
      }
    },
    onError: (error) => {
      console.error("Failed to upload statement:", error);
    },
  });
};
