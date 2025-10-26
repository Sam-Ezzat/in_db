#!/bin/bash
echo "================================"
echo "Church Management System Setup"
echo "================================"
echo

echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo
    echo "❌ Error: Failed to install dependencies"
    exit 1
fi

echo
echo "✅ Dependencies installed successfully!"
echo
echo "🚀 Starting development server..."
echo "   Navigate to http://localhost:3000 when ready"
echo

npm run dev