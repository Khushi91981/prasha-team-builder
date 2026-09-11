#!/bin/bash
# ==============================================================================
# PRASHA INFOTECH — PUSH CODE TO GITHUB REPOSITORY (macOS)
# Target Repository: https://github.com/Khushi91981/prasha-team-builder.git
# ==============================================================================

# Change working directory to project root (parent directory of /public/launchers or current dir)
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
if [ -f "$DIR/../../package.json" ]; then
    cd "$DIR/../.."
elif [ -f "$DIR/../package.json" ]; then
    cd "$DIR/.."
elif [ -f "$DIR/package.json" ]; then
    cd "$DIR"
fi

clear
echo "================================================================================"
echo "    PRASHA INFOTECH • PUSH LOCAL PROJECT TO GITHUB"
echo "    Target: https://github.com/Khushi91981/prasha-team-builder.git"
echo "================================================================================"
echo ""

# Verify git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed on this Mac."
    echo "Please install Xcode Command Line Tools by running: xcode-select --install"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

echo "📦 1. Initializing Git repository..."
if [ ! -d ".git" ]; then
    git init
fi

echo "🔗 2. Setting remote origin to Khushi91981/prasha-team-builder..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/Khushi91981/prasha-team-builder.git"
git branch -M main

echo "📝 3. Staging all files..."
git add .

echo "💾 4. Committing files..."
git commit -m "feat: Initial commit of PRASHA INFOTECH Team Profile Builder" || echo "Note: No new changes to commit."

echo "🚀 5. Pushing to GitHub (main branch)..."
echo "Note: If prompted, enter your GitHub Username (Khushi91981) and Personal Access Token."
echo ""
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "================================================================================"
    echo "  ✅ SUCCESS! Code successfully pushed to GitHub!"
    echo "  Visit: https://github.com/Khushi91981/prasha-team-builder"
    echo "================================================================================"
else
    echo ""
    echo "⚠️ Git push encountered an issue."
    echo "Common reasons:"
    echo "  1. GitHub requires a Personal Access Token instead of your password."
    echo "     Create one here: https://github.com/settings/tokens (select 'repo' scope)"
    echo "  2. You can also export directly from Google AI Studio settings menu."
fi

echo ""
read -p "Press Enter to close this window..."
