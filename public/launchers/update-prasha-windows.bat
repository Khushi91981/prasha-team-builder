@echo off
TITLE Prasha Infotech - Auto-Update from GitHub
COLOR 0A
echo ========================================================
echo    PRASHA INFOTECH - AUTO-UPDATE FROM GITHUB (WINDOWS)
echo ========================================================
echo.

:: 1. Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed on this PC.
    echo Please install Git for Windows from https://git-scm.com/
    pause
    exit /b 1
)

:: 2. Check if .git exists; if not, link automatically
if not exist ".git" (
    echo [INFO] Linking this folder to GitHub repository: https://github.com/Khushi91981/prasha-team-builder.git
    git init
    git remote add origin https://github.com/Khushi91981/prasha-team-builder.git
    git branch -M main
)

:: 3. Pull latest code from GitHub
echo [1/3] Pulling latest code changes from GitHub repository...
git pull origin main
if %errorlevel% neq 0 (
    echo [ERROR] Failed to pull updates from GitHub. Check your internet connection.
    pause
    exit /b 1
)

:: 4. Install dependencies if changed
echo [2/3] Checking dependencies...
call npm install

:: 5. Build assets
echo [3/3] Building updated application assets...
call npm run build

echo.
echo ========================================================
echo    [SUCCESS] APP SUCCESSFULLY UPDATED ON YOUR PC!
echo ========================================================
echo.
echo Starting updated app...
start http://localhost:3000
call npm run dev
pause
