/**
 * Build script for React Compiler Marker
 *
 * Usage:
 *   node esbuild.js                           - Build VS Code (dev mode)
 *   node esbuild.js --production              - Build VS Code (production)
 *   BUILD_TARGET=nvim node esbuild.js --production  - Build for Neovim
 *   BUILD_TARGET=zed node esbuild.js --production   - Build for Zed
 *   node esbuild.js --watch                   - Watch mode for VS Code
 */
const esbuild = require("esbuild");
const path = require("path");

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");
const buildTarget = process.env.BUILD_TARGET || "vscode";

// Resolve paths relative to this file's location (repo root)
const rootDir = __dirname;

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
  name: "esbuild-problem-matcher",

  setup(build) {
    build.onStart(() => {
      console.log("[watch] build started");
    });
    build.onEnd((result) => {
      result.errors.forEach(({ text, location }) => {
        console.error(`✘ [ERROR] ${text}`);
        if (location) {
          console.error(
            `    ${location.file}:${location.line}:${location.column}:`
          );
        }
      });
      console.log("[watch] build finished");
    });
  },
};

/**
 * Shared build options
 */
const sharedOptions = {
  bundle: true,
  format: "cjs",
  minify: production,
  sourcemap: !production,
  sourcesContent: false,
  platform: "node",
  logLevel: "silent",
  plugins: [esbuildProblemMatcherPlugin],
};

async function main() {
  console.log(`Building for ${buildTarget}...`);

  const contexts = [];

  // Build the LSP server
  let serverOutfile;
  if (buildTarget === "nvim") {
    serverOutfile = path.join(rootDir, "packages/nvim-client/server/server.bundle.js");
  } else if (buildTarget === "zed") {
    serverOutfile = path.join(rootDir, "packages/zed-client/server/server.bundle.js");
  } else {
    serverOutfile = path.join(rootDir, "packages/vscode-client/dist/server.js");
  }

  const serverCtx = await esbuild.context({
    ...sharedOptions,
    entryPoints: [path.join(rootDir, "packages/server/src/server.ts")],
    outfile: serverOutfile,
    external: [],
  });
  contexts.push(serverCtx);

  // Build VS Code client extension if not nvim or zed
  if (buildTarget !== "nvim" && buildTarget !== "zed") {
    const clientCtx = await esbuild.context({
      ...sharedOptions,
      entryPoints: [path.join(rootDir, "packages/vscode-client/src/extension.ts")],
      outfile: path.join(rootDir, "packages/vscode-client/dist/extension.js"),
      external: ["vscode"],
    });
    contexts.push(clientCtx);
  }

  if (watch) {
    await Promise.all(contexts.map(ctx => ctx.watch()));
  } else {
    await Promise.all(contexts.map(ctx => ctx.rebuild()));
    await Promise.all(contexts.map(ctx => ctx.dispose()));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
