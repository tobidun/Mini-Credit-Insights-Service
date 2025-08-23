const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Simulate API key validation
const API_KEY =
  process.env.API_KEY || process.env.BUREAU_API_KEY || "test-api-key";

// Mock data generator
function generateMockBureauData() {
  const riskBands = ["Excellent", "Good", "Fair", "Poor", "Very Poor"];
  const riskBand = riskBands[Math.floor(Math.random() * riskBands.length)];

  return {
    score: Math.floor(Math.random() * 300) + 300, // 300-600
    risk_band: riskBand,
    enquiries_6m: Math.floor(Math.random() * 10),
    defaults: Math.floor(Math.random() * 3),
    open_loans: Math.floor(Math.random() * 5),
    trade_lines: Math.floor(Math.random() * 15) + 5,
  };
}

// Simulate processing delay
function simulateProcessing() {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 2000 + 500); // 0.5-2.5 seconds
  });
}

// Simulate occasional errors
function shouldSimulateError() {
  return Math.random() < 0.1; // 10% chance of error
}

// Routes
app.post("/v1/credit/check", async (req, res) => {
  const apiKey = req.headers["x-api-key"];

  // Validate API key
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({
      error: "Invalid API key",
      message: "Please provide a valid X-API-KEY header",
    });
  }

  try {
    // Simulate processing delay
    await simulateProcessing();

    // Simulate occasional errors
    if (shouldSimulateError()) {
      const errorTypes = [400, 429, 500, 502, 503];
      const errorType =
        errorTypes[Math.floor(Math.random() * errorTypes.length)];

      if (errorType === 429) {
        return res.status(429).json({
          error: "Rate limit exceeded",
          message: "Too many requests, please try again later",
          retry_after: 60,
        });
      }

      return res.status(errorType).json({
        error: "Service temporarily unavailable",
        message: "Please try again later",
      });
    }

    // Generate mock response
    const bureauData = generateMockBureauData();

    res.json(bureauData);
  } catch (error) {
    console.error("Error in credit check:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "An unexpected error occurred",
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock Credit Bureau API running on port ${PORT}`);
  console.log(`API Key: ${API_KEY}`);
});
