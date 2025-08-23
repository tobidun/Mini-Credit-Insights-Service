#!/bin/bash

echo "🚀 Starting Credit Insights Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "🌐 Starting development server on http://localhost:3001..."
echo "📱 Frontend will be available at http://localhost:3001"
echo "🔗 Backend API should be running on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start 