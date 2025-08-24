import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  LineElement,
  PointElement,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import { useInsights, useComputeInsights } from "../hooks/useInsights";
import {
  ChartBarIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartPieIcon,
  CurrencyDollarIcon,
  ClockIcon,
  SparklesIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useCurrentUser } from "../hooks/useAuth";
import { apiService } from "../services/api";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  LineElement,
  PointElement
);

export const InsightsPage: React.FC = () => {
  const { data: insights, isLoading } = useInsights();
  const computeInsights = useComputeInsights();
  const { data: user } = useCurrentUser();
  const [selectedInsight, setSelectedInsight] = useState<number>(0);
  const [adminInsights, setAdminInsights] = useState<any[]>([]);
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  // Fetch all users' insights if admin
  useEffect(() => {
    if (user?.role === "admin") {
      setIsAdminLoading(true);
      apiService
        .getAllUsersInsights()
        .then((data) => {
          setAdminInsights(data);
        })
        .catch((error) => {
          console.error("Error fetching admin insights:", error);
        })
        .finally(() => {
          setIsAdminLoading(false);
        });
    }
  }, [user]);

  // Use admin insights if user is admin, otherwise use regular insights
  const displayInsights = user?.role === "admin" ? adminInsights : insights;
  const displayLoading = user?.role === "admin" ? isAdminLoading : isLoading;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getSpendingChartData = (insight: any) => {
    const categories = Object.keys(insight.spendBuckets);
    const amounts = Object.values(insight.spendBuckets);

    return {
      labels: categories,
      datasets: [
        {
          data: amounts,
          backgroundColor: [
            "#3B82F6", // blue
            "#10B981", // emerald
            "#F59E0B", // amber
            "#EF4444", // red
            "#8B5CF6", // violet
            "#F97316", // orange
            "#EC4899", // pink
            "#06B6D4", // cyan
          ],
          borderWidth: 0,
          hoverBorderWidth: 2,
          hoverBorderColor: "#fff",
        },
      ],
    };
  };

  const getCashFlowChartData = (insight: any) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const inflows = Array(6)
      .fill(0)
      .map(() => Math.random() * insight.totalInflow);
    const outflows = Array(6)
      .fill(0)
      .map(() => Math.random() * insight.totalOutflow);

    return {
      labels: months,
      datasets: [
        {
          label: "Income",
          data: inflows,
          backgroundColor: "rgba(34, 197, 94, 0.8)",
          borderColor: "rgb(34, 197, 94)",
          borderWidth: 2,
        },
        {
          label: "Expenses",
          data: outflows,
          backgroundColor: "rgba(239, 68, 68, 0.8)",
          borderColor: "rgb(239, 68, 68)",
          borderWidth: 2,
        },
      ],
    };
  };

  const getRiskLevelColor = (riskFlags: string[]) => {
    if (riskFlags.length === 0) return "text-success-600 bg-success-100";
    if (riskFlags.length <= 2) return "text-warning-600 bg-warning-100";
    return "text-danger-600 bg-danger-100";
  };

  const getRiskLevelText = (riskFlags: string[]) => {
    if (riskFlags.length === 0) return "Low Risk";
    if (riskFlags.length <= 2) return "Medium Risk";
    return "High Risk";
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Financial Insights
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Analyze your spending patterns and financial health with
            comprehensive insights
          </p>
        </div>

        {/* Loading State */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16">
          <div className="text-center">
            <div className="loading-spinner h-16 w-16 mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {user?.role === "admin"
                ? "Loading all users' insights..."
                : "Loading your insights..."}
            </h3>
            <p className="text-gray-600">
              {user?.role === "admin"
                ? "Please wait while we gather insights from all users"
                : "Please wait while we analyze your financial data"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!insights || insights.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Financial Insights
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Analyze your spending patterns and financial health with
            comprehensive insights
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16">
          <div className="text-center">
            <div className="h-24 w-24 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center">
              <ChartPieIcon className="h-12 w-12 text-purple-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No insights available yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Upload a bank statement and compute insights to see your
              comprehensive financial analysis, spending patterns, and risk
              assessment.
            </p>
            <button
              onClick={() => {
                // For generating new insights, we need a statement ID
                // This would typically come from a selected statement or upload
                alert("Please upload a statement first to generate insights");
              }}
              disabled={computeInsights.isPending}
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {computeInsights.isPending ? (
                <>
                  <div className="loading-spinner h-5 w-5 mr-2"></div>
                  Computing Insights...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  Generate Insights
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentInsight = displayInsights?.[selectedInsight];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
            <ChartBarIcon className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            {user?.role === "admin"
              ? "All Users Financial Insights"
              : "Financial Insights"}
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {user?.role === "admin"
            ? "View and analyze all users' financial insights and spending patterns"
            : "Analyze your spending patterns and financial health with comprehensive insights"}
        </p>
        {user?.role === "admin" && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            <UserIcon className="h-4 w-4" />
            Admin View - Showing all users' insights
          </div>
        )}
      </div>

      {/* Insights Selection */}
      {insights.length > 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Select Statement
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayInsights?.map((insight, index) => (
              <button
                key={insight.id}
                onClick={() => setSelectedInsight(index)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedInsight === index
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/50"
                }`}
              >
                {user?.role === "admin" && (
                  <div className="mb-3 p-2 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center">
                      <UserIcon className="h-3 w-3 text-purple-600 mr-2" />
                      <span className="text-xs font-medium text-purple-800">
                        {insight.user?.username || "Unknown"}
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">
                    Statement #{insight.statementId}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(
                      insight.riskFlags
                    )}`}
                  >
                    {getRiskLevelText(insight.riskFlags)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Generated {new Date(insight.generatedAt).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
              <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">
                3-Month Average
              </p>
              <p className="text-lg font-semibold text-gray-900">Income</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(currentInsight.threeMonthAvgIncome)}
          </p>
          <p className="text-sm text-gray-500 mt-2">Monthly average</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-lg font-semibold text-gray-900">Inflow</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {formatCurrency(currentInsight.totalInflow)}
          </p>
          <p className="text-sm text-gray-500 mt-2">Money received</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-gradient-to-r from-red-100 to-pink-100 rounded-xl flex items-center justify-center">
              <ArrowTrendingDownIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-lg font-semibold text-gray-900">Outflow</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-red-600">
            {formatCurrency(currentInsight.totalOutflow)}
          </p>
          <p className="text-sm text-gray-500 mt-2">Money spent</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div
              className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                currentInsight.netAmount >= 0
                  ? "bg-gradient-to-r from-green-100 to-emerald-100"
                  : "bg-gradient-to-r from-red-100 to-pink-100"
              }`}
            >
              {currentInsight.netAmount >= 0 ? (
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
              ) : (
                <ArrowTrendingDownIcon className="h-6 w-6 text-red-600" />
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">Net</p>
              <p className="text-lg font-semibold text-gray-900">Flow</p>
            </div>
          </div>
          <p
            className={`text-3xl font-bold ${
              currentInsight.netAmount >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatCurrency(currentInsight.netAmount)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {currentInsight.netAmount >= 0 ? "Surplus" : "Deficit"}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending Categories */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <ChartPieIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Spending by Category
                </h3>
                <p className="text-sm text-gray-600">
                  Breakdown of your expenses
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="h-80 mb-6">
              <Pie
                data={getSpendingChartData(currentInsight)}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                          size: 12,
                        },
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || "";
                          const value = context.parsed;
                          const total = context.dataset.data.reduce(
                            (a: any, b: any) => a + b,
                            0
                          );
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${label}: ${formatCurrency(
                            value
                          )} (${percentage}%)`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="space-y-3">
              {Object.entries(currentInsight.spendBuckets)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .map(([category, amount], index) => (
                  <div
                    key={category}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-3"
                        style={{
                          backgroundColor: [
                            "#3B82F6",
                            "#10B981",
                            "#F59E0B",
                            "#EF4444",
                            "#8B5CF6",
                            "#F97316",
                            "#EC4899",
                            "#06B6D4",
                          ][index % 8],
                        }}
                      ></div>
                      <span className="font-medium text-gray-900">
                        {category}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(amount as number)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Cash Flow Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mr-3">
                <ChartBarIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Cash Flow Trend
                </h3>
                <p className="text-sm text-gray-600">
                  Income vs expenses over time
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="h-80">
              <Bar
                data={getCashFlowChartData(currentInsight)}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                      labels: {
                        usePointStyle: true,
                        padding: 20,
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          return `${context.dataset.label}: ${formatCurrency(
                            context.parsed.y
                          )}`;
                        },
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function (value) {
                          return formatCurrency(value as number);
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      {currentInsight.riskFlags.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Risk Assessment
                </h3>
                <p className="text-sm text-gray-600">
                  Identified financial risk factors
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentInsight.riskFlags.map((flag: string, index: number) => (
                <div
                  key={index}
                  className="bg-amber-50 border border-amber-200 rounded-xl p-4"
                >
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center mt-0.5 mr-3">
                      <ExclamationTriangleIcon className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-amber-900">{flag}</p>
                      <p className="text-sm text-amber-700 mt-1">
                        Review this pattern for financial health
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gradient-to-r from-gray-100 to-slate-100 rounded-lg flex items-center justify-center mr-3">
              <ClockIcon className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                Insights for Statement #{currentInsight.statementId}
              </p>
              <p className="text-sm text-gray-600">
                Generated on{" "}
                {new Date(currentInsight.generatedAt).toLocaleDateString()} at{" "}
                {new Date(currentInsight.generatedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => computeInsights.mutate(currentInsight.statementId)}
            disabled={computeInsights.isPending}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {computeInsights.isPending ? (
              <>
                <div className="loading-spinner h-4 w-4 mr-2"></div>
                Updating...
              </>
            ) : (
              <>
                <SparklesIcon className="h-4 w-4 mr-2" />
                Refresh Insights
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
