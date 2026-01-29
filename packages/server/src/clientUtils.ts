export function isVSCodeClient(clientName?: string): boolean {
  return clientName?.toLowerCase().includes("visual studio code") ?? false;
}

export function isIntelliJClient(clientName?: string): boolean {
  return clientName?.toLowerCase().includes("intellij") ?? false;
}

export function isNVimClient(clientName?: string): boolean {
  return clientName?.toLowerCase().includes("neovim") ?? false;
}

export function isZedClient(clientName?: string): boolean {
  return clientName?.toLowerCase().includes("zed") ?? false;
}

export function supportsCommandLinks(clientName?: string): boolean {
  // Only VS Code and IntelliJ currently support clickable command links in markdown
  // Zed does not yet support this (tracked in https://github.com/zed-industries/zed/issues/13756)
  return isVSCodeClient(clientName) || isIntelliJClient(clientName);
}

export function shouldEnableHover(clientName?: string): boolean {
  // Neovim doesn't have native inlay hint hover, so we provide hover functionality
  // Other clients (VS Code, IntelliJ, Zed) have native inlay hint hover
  return isNVimClient(clientName);
}
