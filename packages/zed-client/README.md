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

4. **Enable inlay hints in Zed settings:**
   - Open Zed settings: `Cmd+,` (macOS) or `Ctrl+,` (Linux/Windows)
   - Add this configuration:
   ```json
   {
     "inlay_hints": {
       "enabled": true
     }
   }
   ```
   - Restart Zed for the setting to take effect

5. **Done!** Open a React file and you'll see emoji markers next to your components.

### Updating to Latest Version

If you already installed the extension and need to update to get the latest fixes:

```bash
cd react-compiler-marker
git pull
npm install
BUILD_TARGET=zed node esbuild.js --production
# Restart Zed to reload the extension
```

If you used a symlink (Option A above), the update is automatic. If you copied files (Option B), you'll need to copy them again.

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

**Important**: Inlay hints are disabled by default in Zed. You must enable them in your settings to see the emoji markers.

### Enabling Inlay Hints

To see the success ✨ and error 🚫 emoji markers, add this to your Zed settings:

```json
{
  "inlay_hints": {
    "enabled": true
  }
}
```

You can also enable them per-language:

```json
{
  "languages": {
    "JavaScript": {
      "inlay_hints": {
        "enabled": true
      }
    },
    "TypeScript": {
      "inlay_hints": {
        "enabled": true
      }
    },
    "TSX": {
      "inlay_hints": {
        "enabled": true
      }
    },
    "JSX": {
      "inlay_hints": {
        "enabled": true
      }
    }
  }
}
```

After enabling inlay hints and restarting Zed, you'll see emoji markers appear next to React components showing optimization status.

### Commands

**Note**: Zed does not currently support exposing LSP commands in the command palette via extensions. This is a [known limitation](https://github.com/zed-industries/zed/issues/13756) being tracked by the Zed team.

The LSP server provides these commands, but they cannot be accessed through Zed's command palette yet:

- `react-compiler-marker/activate` - Enable the extension
- `react-compiler-marker/deactivate` - Disable the extension  
- `react-compiler-marker/checkOnce` - Manually refresh markers in the current file
- `react-compiler-marker/getCompiledOutput` - View the compiled output of the current file
- `react-compiler-marker/generateReport` - Generate a JSON report for the entire workspace

**Workaround**: The extension is activated by default when you open React files, so you'll see the inlay hints automatically (once you've enabled inlay hints in settings).

### Configuration

Configure the extension in your Zed settings (`settings.json`). You can also use the [example settings file](settings.example.json) as a reference.

```json
{
  "inlay_hints": {
    "enabled": true
  },
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
| `inlay_hints.enabled` | `false` | **Required**: Enable inlay hints to see emoji markers |
| `successEmoji` | `✨` | Emoji shown for optimized components |
| `errorEmoji` | `🚫` | Emoji shown for failed components |
| `babelPluginPath` | `node_modules/babel-plugin-react-compiler` | Path to babel-plugin-react-compiler |

### Example Configurations

**Custom Emojis:**

```json
{
  "inlay_hints": {
    "enabled": true
  },
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
  "inlay_hints": {
    "enabled": true
  },
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

**Most common issue**: Inlay hints are disabled by default in Zed.

1. **Enable inlay hints in your Zed settings** (required):
   ```json
   {
     "inlay_hints": {
       "enabled": true
     }
   }
   ```

2. **Restart Zed** after adding this setting (reloading the workspace may not be enough)

3. **Check LSP server logs** to see what's happening:
   - In Zed: **View → Debug → Open Language Server Logs**
   - Look for "React Compiler Marker" section
   - You should see messages like:
     - `Inlay hint request for file://...`
     - `Document language ID: typescript` (or javascript, etc.)
     - `Generated X inlay hints`
   - If you see `Language <id> not supported`, the language ID might not match

4. Ensure `babel-plugin-react-compiler` is installed in your project:
   ```bash
   npm install babel-plugin-react-compiler
   ```

5. Ensure the LSP server is installed (see "LSP Server not found error" above)

6. Check that the LSP server is running:
   - View → Debug → Open Language Server Logs
   - Look for "React Compiler Marker" server status
   - Verify it says "initialized" without errors

6. Open a React component file (`.jsx`, `.tsx`, `.js`, `.ts` with React components)
   - The server only shows hints for React function components and memo/forwardRef usage
   - Try a simple component like `function MyComponent() { return <div>Test</div>; }`

### LSP Server not starting

1. Verify Node.js is installed and in your PATH:
   ```bash
   node --version
   ```

2. Ensure the LSP server is installed (see "LSP Server not found error" above)

3. Check Zed's LSP logs for error messages:
   - View → Debug → Open Language Server Logs

4. Verify the server command works manually:
   ```bash
   react-compiler-marker-lsp --stdio
   # Or if using workspace installation:
   node node_modules/@react-compiler-marker/server/bin/server.js --stdio
   ```

### Commands not in command palette

This is a known limitation of Zed. LSP `executeCommand` commands are not yet exposed in the command palette through extensions. See [Zed issue #13756](https://github.com/zed-industries/zed/issues/13756).

The extension is activated by default, so you don't need to manually activate it. Inlay hints will appear automatically once enabled in settings.

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
