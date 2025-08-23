import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/api";
import { LoginRequest, RegisterRequest, User } from "../types";

// Query key factory for auth-related queries
const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) throw new Error("No user found");

      try {
        return JSON.parse(userStr) as User;
      } catch {
        throw new Error("Invalid user data");
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => apiService.login(credentials),
    onSuccess: (data) => {
      // Store tokens and user data
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Update query cache immediately
      queryClient.setQueryData(authKeys.user(), data.user);

      // Invalidate all related queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: authKeys.all });

      // Prefetch initial data for better UX
      queryClient.prefetchQuery({
        queryKey: ["statements"],
        queryFn: () => apiService.getStatements(),
        staleTime: 1000 * 60 * 2, // 2 minutes
      });

      queryClient.prefetchQuery({
        queryKey: ["insights"],
        queryFn: () => apiService.getInsights(),
        staleTime: 1000 * 60 * 2, // 2 minutes
      });

      navigate("/dashboard");
    },
    onError: (error: any) => {
      // Clear any stale auth data on login failure
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (userData: RegisterRequest) => apiService.register(userData),
    onSuccess: (data) => {
      // Store tokens and user data
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Update query cache immediately
      queryClient.setQueryData(authKeys.user(), data.user);

      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: authKeys.all });

      navigate("/dashboard");
    },
    onError: (error: any) => {
      // Clear any stale auth data on register failure
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      // Could call a logout endpoint here if needed
      await Promise.resolve();
    },
    onSuccess: () => {
      // Clear storage
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");

      // Clear all cached data
      queryClient.clear();

      navigate("/login");
    },
    onError: () => {
      // Even if logout fails, clear local data
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      queryClient.clear();
      navigate("/login");
    },
  });
};

// Hook to check if user is authenticated
export const useIsAuthenticated = () => {
  const { data: user, isLoading, error } = useCurrentUser();

  return {
    isAuthenticated: !!user && !error,
    isLoading,
    user,
  };
};

// Hook to check user permissions
export const useUserPermissions = () => {
  const { data: user } = useCurrentUser();

  return {
    isAdmin: user?.role === "admin",
    isUser: user?.role === "user",
    canViewAuditLogs: user?.role === "admin",
    canDeleteData: user?.role === "admin",
  };
};
