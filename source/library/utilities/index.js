import * as vscode from "vscode";

/**
 * @typedef {import("../../typedefs/index.js").WorkspaceFolder} WorkspaceFolder
 */

/* createRelativeWatcher */

export const createRelativeWatcher = (
  /** @type {WorkspaceFolder} */ rootDirectory,
  /** @type {string} */ watchGlob,
) => {
  const relativePattern = new vscode.RelativePattern(rootDirectory, watchGlob);
  const watcher = vscode.workspace.createFileSystemWatcher(relativePattern);

  return watcher;
};
