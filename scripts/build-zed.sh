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
echo "1. Install the Zed extension from packages/zed-client/"
echo "2. The bundled server will be included with the extension"
echo ""
echo "Optional: To make the server available globally, create a symlink:"
echo "  sudo ln -s $(pwd)/packages/zed-client/server/server.bundle.js /usr/local/bin/react-compiler-marker-lsp"
echo "  sudo chmod +x /usr/local/bin/react-compiler-marker-lsp"
