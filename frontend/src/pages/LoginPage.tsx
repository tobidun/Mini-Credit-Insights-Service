import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useLogin, useIsAuthenticated } from "../hooks/useAuth";
import { LoginRequest } from "../types";

interface LoginFormData {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();
  const { isAuthenticated, isLoading: authLoading } = useIsAuthenticated();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<LoginFormData>();

  // Redirect if already authenticated
  if (isAuthenticated && !authLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync({
        username: data.username,
        password: data.password,
      });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const formData = watch();
  const isFormValid = formData.username && formData.password;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-gray-600">Please sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="card-elevated">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username or Email
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  className={`form-input ${
                    errors.username
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                  placeholder="Enter your username or email"
                  {...register("username", {
                    required: "Username or email is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                  })}
                />
                {errors.username && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.username && (
                <div className="form-error">
                  <ExclamationCircleIcon className="h-4 w-4" />
                  {errors.username.message}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`form-input pr-12 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="form-error">
                  <ExclamationCircleIcon className="h-4 w-4" />
                  {errors.password.message}
                </div>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  {...register("rememberMe")}
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Error Message */}
            {loginMutation.error && (
              <div className="alert alert-danger">
                <ExclamationCircleIcon className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Login failed</p>
                  <p className="text-sm">
                    {(loginMutation.error as any)?.response?.data?.message ||
                      "Invalid credentials. Please check your username and password."}
                  </p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {loginMutation.isSuccess && (
              <div className="alert alert-success">
                <CheckCircleIcon className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Login successful!</p>
                  <p className="text-sm">Redirecting to dashboard...</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting || loginMutation.isPending}
              className="btn btn-primary w-full"
            >
              {isSubmitting || loginMutation.isPending ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner h-5 w-5 mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don't have an account?
                </span>
              </div>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <Link to="/register" className="btn btn-secondary w-full">
              Create new account
            </Link>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="card bg-blue-50 border-blue-200">
          <div className="text-center">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              Demo Credentials
            </h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>
                <strong>Admin:</strong> admin / admin123
              </p>
              <p>
                <strong>User:</strong> user / user123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
