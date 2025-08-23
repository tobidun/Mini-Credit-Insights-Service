import React from "react";
import { Link } from "react-router-dom";
import {
  DocumentTextIcon,
  ChartBarIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { useStatements } from "../hooks/useStatements";
import { useInsights } from "../hooks/useInsights";
import { useBureauReports } from "../hooks/useBureau";
import { HealthStatus } from "../components/HealthStatus";

export const DashboardPage: React.FC = () => {
  const { data: statements, isLoading: statementsLoading } = useStatements();
  const { data: insights, isLoading: insightsLoading } = useInsights();
  const { data: bureauReports, isLoading: bureauLoading } = useBureauReports();

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircleIcon className="h-5 w-5 text-emerald-600" />;
      case "processing":
        return <ClockIcon className="h-5 w-5 text-amber-600" />;
      case "failed":
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "status-badge status-success";
      case "processing":
        return "status-badge status-warning";
      case "failed":
        return "status-badge status-danger";
      default:
        return "status-badge status-info";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const completedStatements =
    statements?.filter((s) => s.status === "completed") || [];
  const latestInsight = insights?.[0];
  const latestBureauReport = bureauReports?.[0];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-8 text-white">
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-3xl font-bold mb-3 text-white">Welcome back!</h1>
          <p className="text-slate-200 text-lg leading-relaxed">
            Here's what's happening with your financial insights today. Track
            your spending, analyze patterns, and monitor your credit health.
          </p>
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-24 w-24 rounded-full bg-white/5"></div>
      </div>

      {/* System Health Status */}
      <HealthStatus />

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Statements</p>
              <p className="text-3xl font-bold text-gray-900">
                {statementsLoading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  statements?.length || 0
                )}
              </p>
              <div className="flex items-center text-sm text-emerald-600 font-medium">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                {completedStatements.length} completed
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Insights Generated</p>
              <p className="text-3xl font-bold text-gray-900">
                {insightsLoading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  insights?.length || 0
                )}
              </p>
              <div className="flex items-center text-sm text-purple-600 font-medium">
                <ChartBarIcon className="h-4 w-4 mr-1" />
                Financial analysis
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Credit Score</p>
              <p className="text-3xl font-bold text-gray-900">
                {bureauLoading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  latestBureauReport?.creditScore || "N/A"
                )}
              </p>
              <div className="flex items-center text-sm text-amber-600 font-medium">
                <CreditCardIcon className="h-4 w-4 mr-1" />
                {latestBureauReport?.riskBand || "No data"}
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
              <CreditCardIcon className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Monthly Income</p>
              <p className="text-3xl font-bold text-gray-900">
                {insightsLoading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : latestInsight?.threeMonthAvgIncome ? (
                  formatCurrency(latestInsight.threeMonthAvgIncome)
                ) : (
                  "N/A"
                )}
              </p>
              <div className="flex items-center text-sm text-emerald-600 font-medium">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                3-month average
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
              <BanknotesIcon className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      {latestInsight && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Financial Overview
              </h3>
              <p className="text-gray-600 text-lg">Based on your latest insights</p>
            </div>
            <Link 
              to="/insights" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              <EyeIcon className="h-5 w-5 mr-2" />
              View Details
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-emerald-100 rounded-2xl">
                  <ArrowUpIcon className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
              <p className="text-sm font-semibold text-emerald-800 mb-2 uppercase tracking-wide">
                Total Inflow
              </p>
              <p className="text-3xl font-bold text-emerald-900">
                {formatCurrency(latestInsight.totalInflow)}
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl border border-red-200">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-red-100 rounded-2xl">
                  <ArrowDownIcon className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <p className="text-sm font-semibold text-red-800 mb-2 uppercase tracking-wide">
                Total Outflow
              </p>
              <p className="text-3xl font-bold text-red-900">
                {formatCurrency(latestInsight.totalOutflow)}
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-100 rounded-2xl">
                  <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <p className="text-sm font-semibold text-blue-800 mb-2 uppercase tracking-wide">
                Net Flow
              </p>
              <p className="text-3xl font-bold text-blue-900">
                {formatCurrency(latestInsight.netAmount)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Statements */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Recent Statements
              </h3>
              <p className="text-gray-600 text-lg">Your latest uploaded documents</p>
            </div>
            <Link 
              to="/statements" 
              className="inline-flex items-center px-4 py-2 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              View All
            </Link>
          </div>

          {statementsLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : statements?.length ? (
            <div className="space-y-3">
              {statements.slice(0, 6).map((statement) => (
                <div
                  key={statement.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow">
                      {getStatusIcon(statement.status)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {statement.filename}
                      </p>
                      <p className="text-xs text-gray-500">
                        {statement.totalTransactions || 0} transactions •{" "}
                        {new Date(statement.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={getStatusBadge(statement.status)}>
                    {statement.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <DocumentTextIcon className="empty-state-icon" />
              <h3 className="empty-state-title">No statements yet</h3>
              <p className="empty-state-description">
                Upload your first bank statement to start analyzing your
                financial data.
              </p>
              <Link to="/statements" className="btn btn-primary">
                <PlusIcon className="h-4 w-4 mr-2" />
                Upload Statement
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Quick Actions</h3>
            <p className="text-gray-600 text-lg">Get started with these common tasks</p>
          </div>

          <div className="space-y-4">
            <Link
              to="/statements"
              className="group block p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 group-hover:bg-blue-700 transition-colors">
                  <PlusIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-lg font-semibold text-blue-900 group-hover:text-blue-800">
                    Upload Statement
                  </p>
                  <p className="text-sm text-blue-700">
                    Add a new bank statement for analysis
                  </p>
                </div>
                <ArrowUpIcon className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/insights"
              className="group block p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 group-hover:bg-purple-700 transition-colors">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-lg font-semibold text-purple-900 group-hover:text-purple-800">
                    View Insights
                  </p>
                  <p className="text-sm text-purple-700">
                    Analyze spending patterns and trends
                  </p>
                </div>
                <ArrowUpIcon className="h-5 w-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/bureau"
              className="group block p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-100 hover:border-amber-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600 group-hover:bg-amber-700 transition-colors">
                  <CreditCardIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-lg font-semibold text-amber-900 group-hover:text-amber-800">
                    Check Credit
                  </p>
                  <p className="text-sm text-amber-700">
                    Run a comprehensive credit bureau check
                  </p>
                </div>
                <ArrowUpIcon className="h-5 w-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
