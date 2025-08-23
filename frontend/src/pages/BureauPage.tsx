import React, { useState } from "react";
import {
  CreditCardIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ChartBarIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";
import { useBureauReports, useCheckCredit } from "../hooks/useBureau";

export const BureauPage: React.FC = () => {
  const { data: bureauReports, isLoading, refetch } = useBureauReports();
  const checkCreditMutation = useCheckCredit();
  const [selectedReport, setSelectedReport] = useState<number>(0);

  const handleCheckCredit = () => {
    checkCreditMutation.mutate(undefined, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon className="h-5 w-5 text-success-500" />;
      case "pending":
        return <ClockIcon className="h-5 w-5 text-warning-500" />;
      case "failed":
        return <ExclamationTriangleIcon className="h-5 w-5 text-danger-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-success-700 bg-success-100";
      case "pending":
        return "text-warning-700 bg-warning-100";
      case "failed":
        return "text-danger-700 bg-danger-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      case "failed":
        return "Failed";
      default:
        return "Unknown";
    }
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return "text-green-600";
    if (score >= 650) return "text-yellow-600";
    return "text-red-600";
  };

  const getCreditScoreBgGradient = (score: number) => {
    if (score >= 750) return "from-green-500 to-emerald-600";
    if (score >= 650) return "from-yellow-500 to-orange-600";
    return "from-red-500 to-pink-600";
  };

  const getCreditScoreRange = (score: number) => {
    if (score >= 800) return "Exceptional";
    if (score >= 740) return "Very Good";
    if (score >= 670) return "Good";
    if (score >= 580) return "Fair";
    return "Poor";
  };

  const getCreditScoreDescription = (score: number) => {
    if (score >= 800)
      return "You have excellent credit and qualify for the best rates";
    if (score >= 740)
      return "You have very good credit with favorable loan terms";
    if (score >= 670)
      return "You have good credit with competitive rates available";
    if (score >= 580)
      return "You have fair credit, some improvement recommended";
    return "Poor credit score, focus on improving your credit health";
  };

  const getRiskBandColor = (riskBand: string) => {
    switch (riskBand?.toLowerCase()) {
      case "low":
        return "text-green-700 bg-green-100 border-green-200";
      case "medium":
        return "text-yellow-700 bg-yellow-100 border-yellow-200";
      case "high":
        return "text-red-700 bg-red-100 border-red-200";
      default:
        return "text-gray-700 bg-gray-100 border-gray-200";
    }
  };

  const getRiskIcon = (riskBand: string) => {
    switch (riskBand?.toLowerCase()) {
      case "low":
        return <ShieldCheckIcon className="h-5 w-5" />;
      case "medium":
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      case "high":
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      default:
        return <ScaleIcon className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
              <CreditCardIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Credit Bureau</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Monitor your credit score and bureau information
          </p>
        </div>

        {/* Loading State */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16">
          <div className="text-center">
            <div className="loading-spinner h-16 w-16 mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Loading your credit information...
            </h3>
            <p className="text-gray-600">
              Please wait while we fetch your bureau reports
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
            <CreditCardIcon className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Credit Bureau</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Monitor your credit score and bureau information with comprehensive
          reports
        </p>
      </div>

      {/* Credit Check Action */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
              <DocumentTextIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Request Credit Check
              </h2>
              <p className="text-gray-600 mt-1">
                Get your latest credit score and bureau information
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="text-center">
            <div className="h-20 w-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
              <CreditCardIcon className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Check Your Credit Score
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Request a comprehensive credit check to get your latest credit
              score, risk assessment, and detailed bureau information
            </p>
            <button
              onClick={handleCheckCredit}
              disabled={checkCreditMutation.isPending}
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkCreditMutation.isPending ? (
                <>
                  <div className="loading-spinner h-5 w-5 mr-3"></div>
                  Checking Credit...
                </>
              ) : (
                <>
                  <ChartBarIcon className="h-5 w-5 mr-3" />
                  Check Credit Now
                </>
              )}
            </button>
          </div>

          {/* Status Messages */}
          {checkCreditMutation.isError && (
            <div className="mt-8 bg-red-50 rounded-xl border border-red-200 p-6">
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5 mr-4">
                  <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900">
                    Credit check failed
                  </h3>
                  <p className="text-red-800 mt-2">
                    {checkCreditMutation.error instanceof Error
                      ? checkCreditMutation.error.message
                      : "Failed to check credit. Please try again."}
                  </p>
                  <button
                    onClick={() => checkCreditMutation.reset()}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {checkCreditMutation.isSuccess && (
            <div className="mt-8 bg-green-50 rounded-xl border border-green-200 p-6">
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-4">
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-900">
                    Credit check initiated successfully!
                  </h3>
                  <p className="text-green-800 mt-2">
                    Your credit check has been initiated. Your results will
                    appear below once processing is complete.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Credit Reports */}
      {bureauReports && bureauReports.length > 0 ? (
        <div className="space-y-8">
          {/* Report Selection */}
          {bureauReports.length > 1 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Select Report
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bureauReports.map((report, index) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(index)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedReport === index
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">
                        Report #{report.id}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {getStatusText(report.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(report.requestedAt).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {(() => {
            const currentReport = bureauReports[selectedReport];

            if (currentReport.status === "completed") {
              return (
                <div className="space-y-8">
                  {/* Credit Score Display */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${getCreditScoreBgGradient(
                        currentReport.creditScore || 0
                      )} px-8 py-12 text-center`}
                    >
                      <div className="max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold text-white mb-2">
                          Your Credit Score
                        </h2>
                        <div className="text-8xl font-bold text-white mb-4">
                          {currentReport.creditScore || "N/A"}
                        </div>
                        <div className="text-xl font-semibold text-white opacity-90 mb-2">
                          {getCreditScoreRange(currentReport.creditScore || 0)}
                        </div>
                        <p className="text-white opacity-80 text-lg max-w-lg mx-auto">
                          {getCreditScoreDescription(
                            currentReport.creditScore || 0
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Credit Score Range Indicator */}
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium text-gray-600">
                          300
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          Credit Score Range
                        </span>
                        <span className="text-sm font-medium text-gray-600">
                          850
                        </span>
                      </div>
                      <div className="relative">
                        <div className="w-full h-3 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 to-green-600 rounded-full"></div>
                        <div
                          className="absolute top-0 h-3 w-1 bg-white border-2 border-gray-800 rounded-full transform -translate-x-1/2"
                          style={{
                            left: `${
                              (((currentReport.creditScore || 300) - 300) /
                                550) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
                        <span>Poor</span>
                        <span>Fair</span>
                        <span>Good</span>
                        <span>Very Good</span>
                        <span>Exceptional</span>
                      </div>
                    </div>
                  </div>

                  {/* Credit Details Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Risk Assessment */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gradient-to-r from-gray-600 to-slate-700 rounded-lg flex items-center justify-center mr-3">
                            <ScaleIcon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Risk Assessment
                            </h3>
                            <p className="text-sm text-gray-600">
                              Your lending risk profile
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="text-center">
                          <div
                            className={`inline-flex items-center px-6 py-3 rounded-2xl border-2 font-semibold text-lg ${getRiskBandColor(
                              currentReport.riskBand || ""
                            )}`}
                          >
                            {getRiskIcon(currentReport.riskBand || "")}
                            <span className="ml-2">
                              {currentReport.riskBand || "Unknown"} Risk
                            </span>
                          </div>
                          <p className="text-gray-600 mt-4 text-sm">
                            This assessment helps lenders evaluate your
                            creditworthiness
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Credit Activity */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                            <ChartBarIcon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Credit Activity
                            </h3>
                            <p className="text-sm text-gray-600">
                              Recent credit inquiries
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-purple-600 mb-2">
                            {currentReport.enquiries6m || "0"}
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            Credit Enquiries
                          </p>
                          <p className="text-xs text-gray-500">
                            in the last 6 months
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Credit Information */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                          <BuildingLibraryIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Credit Portfolio
                          </h3>
                          <p className="text-sm text-gray-600">
                            Your loan and credit history
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-gray-50 rounded-xl">
                          <div className="h-12 w-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                          </div>
                          <div className="text-3xl font-bold text-gray-900 mb-1">
                            {currentReport.defaults || "0"}
                          </div>
                          <p className="text-sm font-medium text-gray-600">
                            Defaults
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Payment defaults recorded
                          </p>
                        </div>

                        <div className="text-center p-6 bg-gray-50 rounded-xl">
                          <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <BanknotesIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="text-3xl font-bold text-gray-900 mb-1">
                            {currentReport.openLoans || "0"}
                          </div>
                          <p className="text-sm font-medium text-gray-600">
                            Open Loans
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Active loan accounts
                          </p>
                        </div>

                        <div className="text-center p-6 bg-gray-50 rounded-xl">
                          <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <CreditCardIcon className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="text-3xl font-bold text-gray-900 mb-1">
                            {currentReport.tradeLines || "0"}
                          </div>
                          <p className="text-sm font-medium text-gray-600">
                            Trade Lines
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Credit accounts on file
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Report Footer */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gradient-to-r from-gray-100 to-slate-100 rounded-lg flex items-center justify-center mr-3">
                          <ClockIcon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Credit Report #{currentReport.id}
                          </p>
                          <p className="text-sm text-gray-600">
                            Generated on{" "}
                            {new Date(
                              currentReport.requestedAt
                            ).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(
                              currentReport.requestedAt
                            ).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleCheckCredit}
                        disabled={checkCreditMutation.isPending}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {checkCreditMutation.isPending ? (
                          <>
                            <div className="loading-spinner h-4 w-4 mr-2"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <ArrowPathIcon className="h-4 w-4 mr-2" />
                            Refresh Report
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            } else if (currentReport.status === "failed") {
              return (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
                  <div className="text-center">
                    <div className="h-20 w-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-red-100 to-pink-100 flex items-center justify-center">
                      <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Credit Check Failed
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      {currentReport.errorMessage ||
                        "An error occurred while checking your credit. Please try again."}
                    </p>
                    <button
                      onClick={handleCheckCredit}
                      className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
                    >
                      <ArrowPathIcon className="h-5 w-5 mr-2" />
                      Try Again
                    </button>
                  </div>
                </div>
              );
            } else {
              return (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
                  <div className="text-center">
                    <div className="h-20 w-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-yellow-100 to-orange-100 flex items-center justify-center">
                      <ClockIcon className="h-10 w-10 text-yellow-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Credit Check In Progress
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Your credit check is being processed by the bureau. This
                      usually takes a few moments. Please check back shortly.
                    </p>
                    <button
                      onClick={() => refetch()}
                      className="inline-flex items-center px-6 py-3 bg-yellow-600 text-white font-medium rounded-xl hover:bg-yellow-700 transition-colors"
                    >
                      <ArrowPathIcon className="h-5 w-5 mr-2" />
                      Check Status
                    </button>
                  </div>
                </div>
              );
            }
          })()}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16">
          <div className="text-center">
            <div className="h-24 w-24 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
              <CreditCardIcon className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No credit reports yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Get started by requesting your first credit check to see your
              credit score, risk assessment, and detailed bureau information.
            </p>
            <button
              onClick={handleCheckCredit}
              disabled={checkCreditMutation.isPending}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Get Your First Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
