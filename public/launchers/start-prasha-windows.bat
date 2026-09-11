@echo off
TITLE Prasha Infotech - Team Profile Builder Launcher
COLOR 06
echo ========================================================
echo    PRASHA INFOTECH - TEAM PROFILE BUILDER LAUNCHER
echo ========================================================
echo.
echo Starting Prasha Infotech Team Profile Builder...
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed on this system.
    echo Please install Node.js from https://nodejs.org/ (LTS recommended)
    echo and run this launcher again.
    echo.
    pause
    exit /b 1
)

:: Install dependencies if node_modules does not exist
if not exist "node_modules" (
    echo [INFO] First time setup: Installing application packages...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Package installation failed. Please check your internet connection.
        pause
        exit /b 1
    )
)

echo [OK] Launching local desktop server on http://localhost:3000...
start http://localhost:3000
call npm run dev

pause
