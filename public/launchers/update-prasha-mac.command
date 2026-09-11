#!/bin/bash
# ========================================================
#    PRASHA INFOTECH - AUTO-UPDATE FROM GITHUB (macOS)
# ========================================================

# Navigate to script directory or project root
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

if [ -f "../package.json" ]; then
    cd ..
fi

echo "========================================================"
echo "   PRASHA INFOTECH — GITHUB UPDATE SYNC (macOS)"
echo "========================================================"
echo ""

# 1. Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not found on your Mac."
    echo "Please install Git or Xcode Command Line Tools (run: xcode-select --install)."
    read -p "Press Enter to exit..."
    exit 1
fi

# 2. Check if this is a git repo; if not, link automatically to user's repo
if [ ! -d ".git" ]; then
    echo "🔗 Linking this folder to GitHub repository: https://github.com/Khushi91981/prasha-team-builder.git..."
    git init
    git remote add origin "https://github.com/Khushi91981/prasha-team-builder.git"
    git branch -M main
fi

# 3. Pull latest changes from GitHub
echo "🔄 Connecting to GitHub and pulling latest updates..."
git fetch origin

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ -z "$CURRENT_BRANCH" ]; then
    CURRENT_BRANCH="main"
fi

echo "📥 Pulling latest code from branch: $CURRENT_BRANCH..."
git pull origin "$CURRENT_BRANCH"

if [ $? -ne 0 ]; then
    echo "❌ git pull failed. Please check your internet connection or branch permissions."
    read -p "Press Enter to exit..."
    exit 1
fi

# 4. Update dependencies & build
echo ""
echo "📦 Installing any newly added dependencies..."
npm install

echo "🔨 Building latest optimized production assets..."
npm run build

echo ""
echo "========================================================"
echo "   ✅ UPDATE COMPLETE! YOUR PC APP IS NOW FULLY UPDATED"
echo "========================================================"
echo ""
echo "Restarting application on http://localhost:3000..."
open "http://localhost:3000"
npm run dev
