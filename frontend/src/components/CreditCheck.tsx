import React, { useState } from "react";
import {
  CreditCard,
  Search,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  X,
  Loader2,
  User,
  Calendar,
} from "lucide-react";

interface CreditCheckRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  bvn: string;
  phoneNumber: string;
}

interface CreditCheckResponse {
  score: number;
  risk_band: string;
  enquiries_6m: number;
  defaults: number;
  open_loans: number;
  trade_lines: number;
  credit_limit: number;
  utilization_rate: number;
}

const CreditCheck: React.FC = () => {
  const [formData, setFormData] = useState<CreditCheckRequest>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    bvn: "",
    phoneNumber: "",
  });

  const [creditResult, setCreditResult] = useState<CreditCheckResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSSN, setShowSSN] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCreditResult(null);

    try {
      const response = await fetch("http://localhost:4000/v1/credit/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "test-api-key",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setCreditResult(result);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to check credit");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (riskBand: string) => {
    switch (riskBand) {
      case "excellent":
        return "text-green-600 bg-green-100 border-green-200";
      case "good":
        return "text-blue-600 bg-blue-100 border-blue-200";
      case "fair":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "poor":
        return "text-orange-600 bg-orange-100 border-orange-200";
      case "very poor":
        return "text-red-600 bg-red-100 border-red-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 450) return "text-green-600";
    if (score >= 380) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <CreditCard className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">Credit Score Check</h1>
          </div>
          <p className="text-blue-100">
            Check your Nigerian credit score and get financial insights using
            our secure credit bureau API
          </p>
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
            <p className="text-yellow-800 text-sm">
              ⚠️ <strong>DEMO ONLY:</strong> This is a mock credit check system
              for testing purposes. Use fake/demo data only - never enter real
              personal information!
            </p>
          </div>
        </div>

        <div className="p-6">
          {/* Credit Check Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Personal Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., John (Demo data only)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use demo/fake names only
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Smith (Demo data only)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use demo/fake names only
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use any demo date (e.g., 1990-01-01)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Verification Number (BVN)
                  </label>
                  <div className="relative">
                    <input
                      type={showSSN ? "text" : "password"}
                      required
                      value={formData.bvn}
                      onChange={(e) =>
                        setFormData({ ...formData, bvn: e.target.value })
                      }
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="12345678901 (Demo only)"
                      maxLength={11}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSSN(!showSSN)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                    >
                      {showSSN ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-red-500 mt-1">
                    ⚠️ Use fake BVN only (e.g., 12345678901) - NEVER real data!
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="+234 801 234 5678 (Demo only)"
                    maxLength={15}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use demo phone number (e.g., +234 801 234 5678)
                  </p>
                </div>
              </div>
            </div>

            {/* Demo Data & Submit Buttons */}
            <div className="flex justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    firstName: "John",
                    lastName: "Doe",
                    dateOfBirth: "1990-01-01",
                    bvn: "12345678901",
                    phoneNumber: "+234 801 234 5678",
                  })
                }
                className="px-6 py-4 bg-gray-600 text-white font-medium rounded-xl hover:bg-gray-700 transition-colors border border-gray-500"
              >
                Fill Demo Data
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Checking Credit...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    Check Credit Score
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-3 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Credit Result Display */}
          {creditResult && (
            <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Credit Check Results
                </h3>
                <p className="text-gray-600">
                  Your credit information has been retrieved successfully
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Credit Score */}
                <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold mb-2">
                    <span className={getScoreColor(creditResult.score)}>
                      {creditResult.score}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Credit Score</p>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(
                        creditResult.risk_band.toLowerCase()
                      )}`}
                    >
                      {creditResult.risk_band}
                    </span>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
                  <div className="text-2xl font-bold mb-2 text-gray-900">
                    <TrendingUp className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                  </div>
                  <p className="text-sm text-gray-600">Risk Assessment</p>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(
                        creditResult.risk_band.toLowerCase()
                      )}`}
                    >
                      {creditResult.risk_band}
                    </span>
                  </div>
                </div>

                {/* Enquiries */}
                <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
                  <div className="text-2xl font-bold mb-2 text-gray-900">
                    <Search className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                  </div>
                  <p className="text-sm text-gray-600">Enquiries (6m)</p>
                  <p className="text-sm font-medium text-gray-900">
                    {creditResult.enquiries_6m}
                  </p>
                </div>
              </div>

              {/* Additional Credit Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Additional Credit Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600 mb-1">
                      {creditResult.defaults}
                    </div>
                    <p className="text-sm text-gray-600">Defaults</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {creditResult.open_loans}
                    </div>
                    <p className="text-sm text-gray-600">Open Loans</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {creditResult.trade_lines}
                    </div>
                    <p className="text-sm text-gray-600">Trade Lines</p>
                  </div>
                </div>
              </div>

              {/* Nigerian Credit Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Nigerian Credit Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      ₦{(creditResult.credit_limit / 1000000).toFixed(1)}M
                    </div>
                    <p className="text-sm text-gray-600">Credit Limit</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {creditResult.utilization_rate}%
                    </div>
                    <p className="text-sm text-gray-600">Credit Utilization</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditCheck;
