#!/bin/bash
# ========================================================
#   NATIVE APP PACKAGER FOR MAC & WINDOWS (.DMG / .EXE)
# ========================================================

APP_URL="${1:-http://localhost:3000}"
APP_NAME="Prasha Infotech Team Profile Builder"

echo "========================================================"
echo "  Packaging: $APP_NAME"
echo "  Target URL: $APP_URL"
echo "========================================================"

# Install nativefier if not present
if ! command -v nativefier &> /dev/null; then
    echo "Installing native app packager (nativefier)..."
    npm install -g nativefier
fi

# Detect Operating System
OS="$(uname -s)"
case "${OS}" in
    Darwin*)
        echo "🍎 Detected macOS. Building Mac .app..."
        nativefier --name "$APP_NAME" \
          --icon "./public/logo.png" \
          --width 1440 --height 900 \
          --min-width 1024 --min-height 768 \
          --title-bar-style "hiddenInset" \
          --single-instance \
          --enable-es3-apis \
          --internal-urls ".*" \
          "$APP_URL" ./dist-desktop/mac
        echo "✅ macOS App built in ./dist-desktop/mac"
        ;;
    Linux*|MINGW*|MSYS*|CYGWIN*)
        echo "🪟 Building Windows / Desktop executable..."
        nativefier --name "$APP_NAME" \
          --icon "./public/logo.png" \
          --width 1440 --height 900 \
          --min-width 1024 --min-height 768 \
          --single-instance \
          --internal-urls ".*" \
          "$APP_URL" ./dist-desktop/windows
        echo "✅ Desktop App built in ./dist-desktop/windows"
        ;;
esac
