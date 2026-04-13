@echo off
REM Computer Object Identification AI - Start Script for Windows

echo.
echo ================================================
echo  Computer Object Identification AI - Startup
echo ================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js is installed
echo.

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not found!
    pause
    exit /b 1
)

echo [OK] npm is installed
echo.

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)

if not exist "client\node_modules" (
    echo Installing frontend dependencies...
    cd client
    call npm install
    cd ..
)

echo.
echo ================================================
echo  SETUP COMPLETE!
echo ================================================
echo.
echo Next steps:
echo.
echo 1. Open TWO new Command Prompt windows
echo.
echo 2. In FIRST window (Backend):
echo    npm run dev
echo.
echo 3. In SECOND window (Frontend):
echo    cd client
echo    npm start
echo.
echo 4. Frontend will open in your browser at http://localhost:3000
echo.
echo Press any key to close this window...
pause
