import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";
import {
  DocumentTextIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ChartBarIcon,
  TrashIcon,
  FolderOpenIcon,
  DocumentArrowUpIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useStatements, useUploadStatement } from "../hooks/useStatements";
import { useCurrentUser } from "../hooks/useAuth";
import { apiService } from "../services/api";

export const StatementsPage: React.FC = () => {
  const { data: statements, isLoading } = useStatements();
  const uploadStatement = useUploadStatement();
  const { data: user } = useCurrentUser();
  const [draggedFile, setDraggedFile] = useState<File | null>(null);
  const [adminStatements, setAdminStatements] = useState<any[]>([]);
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  // Fetch all users' statements if admin
  useEffect(() => {
    if (user?.role === "admin") {
      setIsAdminLoading(true);
      apiService
        .getAllUsersStatements()
        .then((data) => {
          setAdminStatements(data);
        })
        .catch((error) => {
          console.error("Error fetching admin statements:", error);
        })
        .finally(() => {
          setIsAdminLoading(false);
        });
    }
  }, [user]);

  // Use admin statements if user is admin, otherwise use regular statements
  const displayStatements =
    user?.role === "admin" ? adminStatements : statements;
  const displayLoading = user?.role === "admin" ? isAdminLoading : isLoading;

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setDraggedFile(file);
      uploadStatement.mutate(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB limit
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon className="h-5 w-5 text-success-500" />;
      case "processing":
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
        return "text-success-700 bg-success-100 border-success-200";
      case "processing":
        return "text-warning-700 bg-warning-100 border-warning-200";
      case "failed":
        return "text-danger-700 bg-danger-100 border-danger-200";
      default:
        return "text-gray-700 bg-gray-100 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "processing":
        return "Processing";
      case "failed":
        return "Failed";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
            <DocumentTextIcon className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            {user?.role === "admin"
              ? "All Users Bank Statements"
              : "Bank Statements"}
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {user?.role === "admin"
            ? "View and manage all users' bank statements and financial data"
            : "Upload and manage your bank statements to generate comprehensive financial insights and track your spending patterns"}
        </p>
        {user?.role === "admin" && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            <UserIcon className="h-4 w-4" />
            Admin View - Showing all users' data
          </div>
        )}
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
              <DocumentArrowUpIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Upload New Statement
              </h2>
              <p className="text-gray-600 mt-1">
                Import your bank statement to start analyzing your finances
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group ${
              isDragActive
                ? "border-blue-400 bg-blue-50 scale-[1.02]"
                : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
            }`}
          >
            <input {...getInputProps()} />

            {/* Upload Icon */}
            <div
              className={`mx-auto mb-6 transition-all duration-300 ${
                isDragActive ? "scale-110" : "group-hover:scale-105"
              }`}
            >
              <div className="h-20 w-20 mx-auto bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                <CloudArrowUpIcon
                  className={`h-10 w-10 transition-colors ${
                    isDragActive ? "text-blue-600" : "text-blue-500"
                  }`}
                />
              </div>
            </div>

            {/* Upload Text */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-900">
                {isDragActive
                  ? "Drop your file here"
                  : "Drop your statement here"}
              </h3>
              <p className="text-gray-600">
                Or{" "}
                <span className="text-blue-600 font-medium">
                  click to browse
                </span>{" "}
                your files
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center">
                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                  CSV
                </span>
                <span className="flex items-center">
                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                  XLS
                </span>
                <span className="flex items-center">
                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                  XLSX
                </span>
              </div>
              <p className="text-xs text-gray-400">Maximum file size: 10MB</p>
            </div>

            {/* Selected File Preview */}
            {draggedFile && !uploadStatement.isPending && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-center">
                  <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-900">
                    {draggedFile.name}
                  </span>
                  <span className="text-xs text-blue-600 ml-2">
                    ({(draggedFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upload Status Messages */}
        {uploadStatement.isPending && (
          <div className="px-8 pb-8">
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <div className="flex items-center">
                <div className="loading-spinner h-6 w-6 mr-4"></div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    Uploading your statement...
                  </h3>
                  <p className="text-blue-700 mt-1">
                    Please wait while we process your file
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {uploadStatement.isSuccess && (
          <div className="px-8 pb-8">
            <div className="bg-green-50 rounded-xl border border-green-200 p-6">
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-4">
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-900">
                    Statement uploaded successfully!
                  </h3>
                  <p className="text-green-800 mt-2">
                    Your statement is being processed. You'll be able to
                    generate insights once processing is complete.
                  </p>
                  <div className="mt-4">
                    <Link
                      to="/insights"
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <ChartBarIcon className="h-4 w-4 mr-2" />
                      View Insights
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {uploadStatement.isError && (
          <div className="px-8 pb-8">
            <div className="bg-red-50 rounded-xl border border-red-200 p-6">
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5 mr-4">
                  <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900">
                    Upload failed
                  </h3>
                  <p className="text-red-800 mt-2">
                    {uploadStatement.error?.message ||
                      "Failed to upload statement. Please try again."}
                  </p>
                  <button
                    onClick={() => {
                      uploadStatement.reset();
                      setDraggedFile(null);
                    }}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statements List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-gradient-to-r from-gray-600 to-slate-700 rounded-xl flex items-center justify-center mr-4">
                <FolderOpenIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Statements
                </h2>
                <p className="text-gray-600 mt-1">
                  {statements && statements.length > 0
                    ? `${statements.length} statement${
                        statements.length === 1 ? "" : "s"
                      } uploaded`
                    : "Manage and analyze your uploaded statements"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="loading-spinner h-12 w-12 mx-auto mb-6"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Loading statements...
              </h3>
              <p className="text-gray-600">
                Please wait while we fetch your data
              </p>
            </div>
          ) : statements && statements.length > 0 ? (
            <div className="space-y-4">
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-hidden bg-gray-50 rounded-xl">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-100">
                      {user?.role === "admin" && (
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          User
                        </th>
                      )}
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        File Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Transactions
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Success Rate
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Upload Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {displayStatements?.map((statement) => (
                      <tr
                        key={statement.id}
                        className="hover:bg-blue-50/50 transition-colors"
                      >
                        {user?.role === "admin" && (
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                <UserIcon className="h-4 w-4 text-purple-600" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {statement.user?.username || "Unknown"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {statement.user?.email || "No email"}
                                </div>
                              </div>
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                              <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {statement.filename}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {statement.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              statement.status
                            )}`}
                          >
                            {getStatusIcon(statement.status)}
                            <span className="ml-2">
                              {getStatusText(statement.status)}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {statement.totalTransactions}
                          </div>
                          <div className="text-xs text-gray-500">
                            transactions
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${statement.parsingSuccessRate}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                              {statement.parsingSuccessRate}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {new Date(
                              statement.uploadDate
                            ).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(
                              statement.uploadDate
                            ).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {statement.status === "completed" && (
                              <Link
                                to={`/insights?statementId=${statement.id}`}
                                className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <ChartBarIcon className="h-4 w-4 mr-1" />
                                Insights
                              </Link>
                            )}
                            <button className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors">
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {displayStatements?.map((statement) => (
                  <div
                    key={statement.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                  >
                    {user?.role === "admin" && (
                      <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 text-purple-600 mr-2" />
                          <span className="text-sm font-medium text-purple-800">
                            {statement.user?.username || "Unknown"} (
                            {statement.user?.email || "No email"})
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {statement.filename}
                          </h3>
                          <p className="text-sm text-gray-500">
                            ID: {statement.id}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          statement.status
                        )}`}
                      >
                        {getStatusIcon(statement.status)}
                        <span className="ml-1">
                          {getStatusText(statement.status)}
                        </span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transactions
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {statement.totalTransactions}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Success Rate
                        </p>
                        <div className="flex items-center mt-1">
                          <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{
                                width: `${statement.parsingSuccessRate}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold">
                            {statement.parsingSuccessRate}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Upload Date
                        </p>
                        <p className="text-sm text-gray-900">
                          {new Date(statement.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {statement.status === "completed" && (
                          <Link
                            to={`/insights?statementId=${statement.id}`}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg"
                          >
                            <ChartBarIcon className="h-4 w-4 mr-1" />
                            Insights
                          </Link>
                        )}
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="h-24 w-24 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                <DocumentTextIcon className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No statements yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                Upload your first bank statement to start generating
                comprehensive financial insights and track your spending
                patterns.
              </p>
              <button
                onClick={() => document.getElementById("file-upload")?.click()}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                Upload Your First Statement
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
