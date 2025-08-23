import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  UserIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useRegister, useIsAuthenticated } from "../hooks/useAuth";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "user" | "admin";
  agreeToTerms: boolean;
}

export const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const registerMutation = useRegister();
  const { isAuthenticated, isLoading: authLoading } = useIsAuthenticated();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterFormData>({
    defaultValues: {
      role: "user",
    },
  });

  // Redirect if already authenticated
  if (isAuthenticated && !authLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync({
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
      });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const formData = watch();
  const password = watch("password");

  const getPasswordStrength = (
    password: string
  ): { strength: number; label: string; color: string } => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { label: "Very Weak", color: "bg-red-500" },
      { label: "Weak", color: "bg-orange-500" },
      { label: "Fair", color: "bg-yellow-500" },
      { label: "Good", color: "bg-blue-500" },
      { label: "Strong", color: "bg-green-500" },
    ];

    return {
      strength,
      label: levels[strength - 1]?.label || "",
      color: levels[strength - 1]?.color || "",
    };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
              <UserIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create account
          </h2>
          <p className="text-gray-600">
            Join us to start tracking your financial insights
          </p>
        </div>

        {/* Register Form */}
        <div className="card-elevated">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                className={`form-input ${
                  errors.username
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : ""
                }`}
                placeholder="Choose a username"
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message:
                      "Username can only contain letters, numbers, and underscores",
                  },
                })}
              />
              {errors.username && (
                <div className="form-error">
                  <ExclamationCircleIcon className="h-4 w-4" />
                  {errors.username.message}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`form-input ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : ""
                }`}
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <div className="form-error">
                  <ExclamationCircleIcon className="h-4 w-4" />
                  {errors.email.message}
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
                  autoComplete="new-password"
                  className={`form-input pr-12 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                  placeholder="Create a password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
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

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">
                      Password strength
                    </span>
                    <span className="text-xs font-medium">
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${passwordStrength.color}`}
                      style={{
                        width: `${(passwordStrength.strength / 5) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {errors.password && (
                <div className="form-error">
                  <ExclamationCircleIcon className="h-4 w-4" />
                  {errors.password.message}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={`form-input pr-12 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                  placeholder="Confirm your password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="form-error">
                  <ExclamationCircleIcon className="h-4 w-4" />
                  {errors.confirmPassword.message}
                </div>
              )}
            </div>

            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative">
                  <input
                    type="radio"
                    value="user"
                    className="sr-only peer"
                    {...register("role")}
                  />
                  <div className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50 transition-all">
                    <UserIcon className="h-6 w-6 text-gray-400 peer-checked:text-blue-600 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-900">User</p>
                      <p className="text-xs text-gray-500">Standard account</p>
                    </div>
                  </div>
                </label>
                <label className="relative">
                  <input
                    type="radio"
                    value="admin"
                    className="sr-only peer"
                    {...register("role")}
                  />
                  <div className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer peer-checked:border-purple-500 peer-checked:bg-purple-50 hover:bg-gray-50 transition-all">
                    <ShieldCheckIcon className="h-6 w-6 text-gray-400 peer-checked:text-purple-600 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-900">Admin</p>
                      <p className="text-xs text-gray-500">Full access</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="form-group">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
                  {...register("agreeToTerms", {
                    required: "You must agree to the terms and conditions",
                  })}
                />
                <span className="ml-2 text-sm text-gray-700">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-purple-600 hover:text-purple-500"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-purple-600 hover:text-purple-500"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreeToTerms && (
                <div className="form-error">
                  <ExclamationCircleIcon className="h-4 w-4" />
                  {errors.agreeToTerms.message}
                </div>
              )}
            </div>

            {/* Error Message */}
            {registerMutation.error && (
              <div className="alert alert-danger">
                <ExclamationCircleIcon className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Registration failed</p>
                  <p className="text-sm">
                    {(registerMutation.error as any)?.response?.data?.message ||
                      "Something went wrong. Please try again."}
                  </p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {registerMutation.isSuccess && (
              <div className="alert alert-success">
                <CheckCircleIcon className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Account created successfully!</p>
                  <p className="text-sm">Redirecting to dashboard...</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                isSubmitting ||
                registerMutation.isPending ||
                !formData.agreeToTerms
              }
              className="btn btn-primary w-full"
            >
              {isSubmitting || registerMutation.isPending ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner h-5 w-5 mr-2"></div>
                  Creating account...
                </div>
              ) : (
                "Create account"
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
                  Already have an account?
                </span>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <Link to="/login" className="btn btn-secondary w-full">
              Sign in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
