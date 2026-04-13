#!/bin/bash
# Quick Start Script for Computer Object Identification AI

echo "🎨 Computer Object Identification AI - Quick Start"
echo "=================================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16+ first."
    exit 1
fi

echo "✓ Node.js $(node -v) is installed"
echo ""

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

echo ""
echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start development:"
echo ""
echo "Terminal 1 (Backend):"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd client"
echo "  npm start"
echo ""
echo "🌐 Open http://localhost:3000 in your browser"
echo ""
