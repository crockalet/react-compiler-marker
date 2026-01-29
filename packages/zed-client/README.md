# React Compiler Marker - Zed

Zed editor extension that shows which React components are optimized by the [React Compiler](https://react.dev/learn/react-compiler). See at a glance which components get automatically memoized ✨ and which ones have issues preventing optimization 🚫

![Demo](https://github.com/blazejkustra/react-compiler-marker/raw/main/images/showcase.png)

## Features

- 🎯 **Inlay hints** with emoji markers next to React components
- 📝 **Hover tooltips** with detailed error messages and optimization details
- ⚡ **LSP-based** - Uses the React Compiler Marker Language Server
- 🔧 **Configurable** - Customize emojis and babel plugin path
- 💡 **Commands** - Activate, deactivate, check, preview compiled output, and generate reports

## Requirements

- **Zed editor** (latest version recommended)
- **Node.js**
- **@react-compiler-marker/server** - The LSP server (see installation below)
- **babel-plugin-react-compiler** installed in your project

## Installation

### Quick Install

1. **Clone and build:**
   ```bash
   git clone https://github.com/blazejkustra/react-compiler-marker.git
   cd react-compiler-marker
   
   # Install dependencies and build the bundled server for Zed
   npm install
   BUILD_TARGET=zed node esbuild.js --production
   ```

2. **Install the server command globally:**
   ```bash
   # Option A: Create a symlink (recommended)
   sudo ln -s "$(pwd)/packages/zed-client/react-compiler-marker-lsp" /usr/local/bin/react-compiler-marker-lsp
   
   # Option B: Copy the files
   # sudo cp packages/zed-client/react-compiler-marker-lsp /usr/local/bin/
   # sudo cp packages/zed-client/server/server.bundle.js /usr/local/bin/
   ```

3. **Install the Zed extension:**
   - Open Zed
   - Go to **Extensions** (Cmd+Shift+X / Ctrl+Shift+X)
   - Click **Install Dev Extension**
   - Select the `packages/zed-client` directory from the cloned repository

4. **Done!** Open a React file and the extension will start automatically.

### What Gets Installed

- **Bundled server**: A single `server.bundle.js` file (~3.4MB) with all dependencies included
- **Wrapper script**: `react-compiler-marker-lsp` executable that launches the bundled server
- **Zed extension**: WASM extension that connects to the server

### How It Works

The extension looks for the LSP server in this order:
1. **`react-compiler-marker-lsp` command in PATH** ← This is what we set up in step 2
2. `node_modules/@react-compiler-marker/server/bin/server.js` in your workspace (fallback)

### Alternative: Per-Project Installation

If you don't want to install the server globally, you can install it per-project:

```bash
# In your project directory
npm install github:blazejkustra/react-compiler-marker#workspace=packages/server
```

The server will automatically build itself during installation. This approach works but requires installing the server in every project.

### From Zed Extensions (Coming Soon)

The extension will be available in the Zed Extensions registry:

1. Open Zed
2. Go to **Extensions** (Cmd+Shift+X / Ctrl+Shift+X)
3. Search for "React Compiler Marker"
4. Click **Install**

## Usage

The extension automatically starts when you open a project containing React code. It analyzes your JavaScript/TypeScript files and shows inlay hints next to React components.

### Commands

Access these commands from the command palette (Cmd+Shift+P / Ctrl+Shift+P):

- **React Compiler Marker: Activate Extension** - Enable the extension
- **React Compiler Marker: Deactivate Extension** - Disable the extension
- **React Compiler Marker: Check Current File** - Manually refresh markers in the current file
- **React Compiler Marker: Preview Compiled Output** - View the compiled output of the current file
- **React Compiler Marker: Generate Report** - Generate a JSON report for the entire workspace

### Configuration

Configure the extension in your Zed settings (`settings.json`):

```json
{
  "lsp": {
    "react-compiler-marker": {
      "initialization_options": {
        "successEmoji": "✨",
        "errorEmoji": "🚫",
        "babelPluginPath": "node_modules/babel-plugin-react-compiler"
      }
    }
  }
}
```

#### Configuration Options

| Setting | Default | Description |
|---------|---------|-------------|
| `successEmoji` | `✨` | Emoji shown for optimized components |
| `errorEmoji` | `🚫` | Emoji shown for failed components |
| `babelPluginPath` | `node_modules/babel-plugin-react-compiler` | Path to babel-plugin-react-compiler |

### Example Configurations

**Custom Emojis:**

```json
{
  "lsp": {
    "react-compiler-marker": {
      "initialization_options": {
        "successEmoji": "✓",
        "errorEmoji": "✗"
      }
    }
  }
}
```

**Custom Babel Plugin Path:**

```json
{
  "lsp": {
    "react-compiler-marker": {
      "initialization_options": {
        "babelPluginPath": "../../custom-path/babel-plugin-react-compiler"
      }
    }
  }
}
```

## How It Works

The extension uses a Language Server Protocol (LSP) server that:

1. Monitors your React component files
2. Runs the React Compiler on each component
3. Reports success/failure with detailed information
4. Displays inlay hints in your editor
5. Provides hover tooltips with compilation details

The extension is written in Rust and compiled to WebAssembly for Zed. It first tries to find `react-compiler-marker-lsp` in your PATH, then falls back to looking for the server at `node_modules/@react-compiler-marker/server/bin/server.js` in your workspace.

## Troubleshooting

### LSP Server not found error

If you see an error about the LSP server not being found:

1. Ensure you've installed the server in your project:
   ```bash
   npm install https://github.com/blazejkustra/react-compiler-marker/tarball/main#workspace=packages/server
   ```

2. Verify the installation:
   ```bash
   ls node_modules/@react-compiler-marker/server/bin/server.js
   ```

3. If using a workspace/monorepo, ensure the server is installed in the correct workspace root

### Inlay hints not showing

1. Ensure `babel-plugin-react-compiler` is installed in your project:
   ```bash
   npm install babel-plugin-react-compiler
   ```

2. Ensure the LSP server is installed (see above)

3. Check that the LSP server is running:
   - Open Zed's LSP logs
   - Look for "React Compiler Marker" server status

4. Try manually refreshing:
   - Open command palette (Cmd+Shift+P / Ctrl+Shift+P)
   - Run **React Compiler Marker: Check Current File**

### LSP Server not starting

1. Verify Node.js is installed and in your PATH:
   ```bash
   node --version
   ```

2. Ensure the LSP server is installed (see "LSP Server not found error" above)

3. Check Zed's LSP logs for error messages

4. Ensure the extension is activated:
   - Open command palette
   - Run **React Compiler Marker: Activate Extension**

### babel-plugin-react-compiler not found

Install it in your project:

```bash
npm install babel-plugin-react-compiler
```

Or configure a custom path in settings:

```json
{
  "lsp": {
    "react-compiler-marker": {
      "initialization_options": {
        "babelPluginPath": "path/to/babel-plugin-react-compiler"
      }
    }
  }
}
```

## Building from Source

```bash
cd packages/zed-client
cargo build --release --target wasm32-wasip1
```

The compiled extension will be in `target/wasm32-wasip1/release/`.

## Links

- [Main Repository](https://github.com/blazejkustra/react-compiler-marker)
- [React Compiler Documentation](https://react.dev/learn/react-compiler)
- [Report Issues](https://github.com/blazejkustra/react-compiler-marker/issues)
- [Zed Extensions Documentation](https://zed.dev/docs/extensions)

## License

MIT License - see [LICENSE](../../LICENSE) file for details

## Author

Błażej Kustra - [kustrablazej@gmail.com](mailto:kustrablazej@gmail.com)
