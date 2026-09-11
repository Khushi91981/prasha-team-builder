@echo off
:: ==============================================================================
:: PRASHA INFOTECH — PUSH CODE TO GITHUB REPOSITORY (Windows)
:: Target Repository: https://github.com/Khushi91981/prasha-team-builder.git
:: ==============================================================================
title PRASHA INFOTECH - Push to GitHub
cls
echo ================================================================================
echo    PRASHA INFOTECH - PUSH LOCAL PROJECT TO GITHUB
echo    Target: https://github.com/Khushi91981/prasha-team-builder.git
echo ================================================================================
echo.

:: Detect root directory
if exist "..\..\package.json" (
    cd ..\..
) else if exist "..\package.json" (
    cd ..
)

:: 1. Check git
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in PATH.
    echo Download and install Git for Windows from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

:: 2. Initialize Git if needed
if not exist ".git" (
    echo [1/5] Initializing Git repository...
    git init
)

:: 3. Configure Remote
echo [2/5] Configuring remote origin to Khushi91981/prasha-team-builder...
git remote remove origin >nul 2>nul
git remote add origin https://github.com/Khushi91981/prasha-team-builder.git
git branch -M main

:: 4. Add & Commit
echo [3/5] Staging files...
git add .
echo [4/5] Committing files...
git commit -m "feat: Initial commit of PRASHA INFOTECH Team Profile Builder"

:: 5. Push to GitHub
echo [5/5] Pushing to GitHub (main branch)...
echo If prompted, enter your GitHub Username (Khushi91981) and Personal Access Token.
echo.
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ================================================================================
    echo   [SUCCESS] Code successfully pushed to GitHub!
    echo   Visit: https://github.com/Khushi91981/prasha-team-builder
    echo ================================================================================
) else (
    echo.
    echo [WARNING] Git push encountered an issue.
    echo Make sure you use a GitHub Personal Access Token (classic 'repo' scope) if prompted for a password.
)

echo.
pause
