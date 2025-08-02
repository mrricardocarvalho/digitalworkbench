# GitHub Pages Deployment Test Script (PowerShell)
# This script helps verify that the GitHub Pages deployment will work correctly

Write-Host "🚀 GitHub Pages Deployment Test" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

# Clean and build
Write-Host "🧹 Cleaning previous build..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
}

Write-Host "📦 Building for production..." -ForegroundColor Yellow
& npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Please fix build errors before deploying." -ForegroundColor Red
    exit 1
}

# Check critical files
Write-Host "🔍 Verifying build output..." -ForegroundColor Yellow

# Check if index.html exists
if (-not (Test-Path "dist/index.html")) {
    Write-Host "❌ dist/index.html not found!" -ForegroundColor Red
    exit 1
}

# Check if assets have correct base path
$indexContent = Get-Content "dist/index.html" -Raw
if ($indexContent -match "/digitalworkbench/assets/") {
    Write-Host "✅ Assets correctly prefixed with /digitalworkbench/" -ForegroundColor Green
} else {
    Write-Host "❌ Assets not correctly prefixed! Check Vite base configuration." -ForegroundColor Red
    exit 1
}

# Check if 404.html exists (required for SPA routing)
if (Test-Path "dist/404.html") {
    Write-Host "✅ 404.html found (SPA routing support)" -ForegroundColor Green
} else {
    Write-Host "⚠️  404.html not found - SPA routing might not work" -ForegroundColor Yellow
}

# Check bundle sizes
Write-Host "📊 Bundle size analysis:" -ForegroundColor Yellow
$mainJs = Get-ChildItem "dist/assets" -Filter "index-*.js" | Select-Object -First 1
if ($mainJs) {
    $size = $mainJs.Length
    Write-Host "   Main bundle: $size bytes" -ForegroundColor Gray
    if ($size -gt 1048576) {
        Write-Host "⚠️  Main bundle is large (>1MB)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎯 Deployment Checklist:" -ForegroundColor Cyan
Write-Host "✅ Build completed successfully" -ForegroundColor Green
Write-Host "✅ Assets have correct base path (/digitalworkbench/)" -ForegroundColor Green
Write-Host "✅ Ready for GitHub Pages deployment" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Next steps:" -ForegroundColor Cyan
Write-Host "1. Commit and push your changes to the main branch" -ForegroundColor Gray
Write-Host "2. GitHub Actions will automatically deploy to GitHub Pages" -ForegroundColor Gray
Write-Host "3. Your site will be available at: https://mrricardocarvalho.github.io/digitalworkbench/" -ForegroundColor Gray
Write-Host ""
Write-Host "🔗 You can preview locally at: http://localhost:4173/digitalworkbench/" -ForegroundColor Cyan
Write-Host "   Run: npm run preview" -ForegroundColor Gray
