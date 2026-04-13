# Computer Object Identification AI - Start Script for PowerShell
# Run with: powershell -ExecutionPolicy Bypass -File start.ps1

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host " Computer Object Identification AI - Startup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js $nodeVersion is installed" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "[OK] npm $npmVersion is installed" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] npm is not found!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Install backend dependencies
if (-Not (Test-Path "node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Install frontend dependencies
if (-Not (Test-Path "client/node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    Push-Location client
    npm install
    Pop-Location
    Write-Host ""
}

# Success
Write-Host "================================================" -ForegroundColor Green
Write-Host " SETUP COMPLETE!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open TWO new PowerShell windows" -ForegroundColor White
Write-Host ""
Write-Host "2. In FIRST window (Backend server):" -ForegroundColor Green
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "3. In SECOND window (Frontend app):" -ForegroundColor Green
Write-Host "   cd client" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor White
Write-Host ""
Write-Host "4. Frontend will open in your browser at http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
