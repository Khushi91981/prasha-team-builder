#!/bin/bash
# ========================================================
#    PRASHA INFOTECH - TEAM PROFILE BUILDER LAUNCHER (MAC)
# ========================================================

# Locate script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

# If script was placed in /launchers, go up one directory to project root
if [ -f "../package.json" ]; then
    cd ..
fi

echo "========================================================"
echo "   PRASHA INFOTECH — TEAM PROFILE BUILDER (macOS)"
echo "========================================================"
echo ""

# 1. Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "⚠️ NOTICE: Project files not found in the current folder."
    echo "To run from source code:"
    echo "  1. In AI Studio, click top-right Settings > Export / Download ZIP"
    echo "  2. Extract the ZIP folder on your Mac"
    echo "  3. Place this start-prasha-mac.command inside that extracted folder and run it."
    echo ""
    echo "🌐 Would you like to open the web version directly in your browser? (y/n)"
    read -r OPEN_WEB
    if [[ "$OPEN_WEB" =~ ^[Yy]$ ]]; then
        open "https://ais-dev-sefm2ysyalgkohigb4a2ux-624114784327.asia-southeast1.run.app"
    fi
    exit 0
fi

# 2. Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not yet installed on your Mac."
    echo "   (This is why 'npx' or 'node' gave a 'command not found' error in Terminal)."
    echo ""
    echo "Opening https://nodejs.org/ so you can install it..."
    open "https://nodejs.org/"
    echo ""
    echo "Once Node.js is installed, double-click this launcher again!"
    read -p "Press Enter to exit..."
    exit 1
fi

# 3. Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 First-time initialization: Installing packages..."
    npm install
fi

echo "🚀 Starting Prasha Infotech Desktop Server..."
(sleep 2 && open "http://localhost:3000") &
npm run dev
