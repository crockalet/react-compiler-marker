#!/bin/bash

# Build and install script for Zed extension
# This script builds the bundled LSP server for the Zed extension

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$ROOT_DIR"

echo "Installing dependencies..."
npm install

echo "Building bundled LSP server for Zed..."
BUILD_TARGET=zed node esbuild.js --production

echo "Build complete!"
echo ""
echo "The bundled server is at: packages/zed-client/server/server.bundle.js"
echo ""
echo "To use with Zed:"
echo "1. Install the server command globally:"
echo "   sudo ln -s $(pwd)/packages/zed-client/react-compiler-marker-lsp /usr/local/bin/react-compiler-marker-lsp"
echo ""
echo "2. Install the Zed extension from packages/zed-client/"
echo "   - Open Zed > Extensions > Install Dev Extension"
echo "   - Select the packages/zed-client directory"
