#!/bin/bash

# GitHub Pages Deployment Test Script
# This script helps verify that the GitHub Pages deployment will work correctly

echo "🚀 GitHub Pages Deployment Test"
echo "================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Clean and build
echo "🧹 Cleaning previous build..."
rm -rf dist/

echo "📦 Building for production..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix build errors before deploying."
    exit 1
fi

# Check critical files
echo "🔍 Verifying build output..."

# Check if index.html exists
if [ ! -f "dist/index.html" ]; then
    echo "❌ dist/index.html not found!"
    exit 1
fi

# Check if assets have correct base path
if grep -q "/digitalworkbench/assets/" dist/index.html; then
    echo "✅ Assets correctly prefixed with /digitalworkbench/"
else
    echo "❌ Assets not correctly prefixed! Check Vite base configuration."
    exit 1
fi

# Check if 404.html exists (required for SPA routing)
if [ -f "dist/404.html" ]; then
    echo "✅ 404.html found (SPA routing support)"
else
    echo "⚠️  404.html not found - SPA routing might not work"
fi

# Check bundle sizes
echo "📊 Bundle size analysis:"
main_js=$(find dist/assets -name "index-*.js" | head -1)
if [ -f "$main_js" ]; then
    size=$(stat -c%s "$main_js" 2>/dev/null || stat -f%z "$main_js")
    echo "   Main bundle: $size bytes"
    if [ $size -gt 1048576 ]; then
        echo "⚠️  Main bundle is large (>1MB)"
    fi
fi

echo ""
echo "🎯 Deployment Checklist:"
echo "✅ Build completed successfully"
echo "✅ Assets have correct base path (/digitalworkbench/)"
echo "✅ Ready for GitHub Pages deployment"
echo ""
echo "💡 Next steps:"
echo "1. Commit and push your changes to the main branch"
echo "2. GitHub Actions will automatically deploy to GitHub Pages"
echo "3. Your site will be available at: https://mrricardocarvalho.github.io/digitalworkbench/"
echo ""
echo "🔗 You can preview locally at: http://localhost:4173/digitalworkbench/"
echo "   Run: npm run preview"
