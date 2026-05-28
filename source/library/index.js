import * as vscode from "vscode";

import path from "path";

import {
  defaultConfigFileName,
  // resolveConfigReadonly,
} from "@comvar/core-readonly";

export async function activate(/** @type {vscode.ExtensionContext} */ context) {
  console.debug("It begins."); // It works.

  // Uses the first workspace folder as current working directory.
  const rootDirectoryPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  console.debug("rootDirectoryPath is:", rootDirectoryPath);
  // Only acknowledges the expected default config file path.
  let rawConfigFilePath = path.join(rootDirectoryPath, defaultConfigFileName);
  console.debug("rawConfigFilePath is:", rawConfigFilePath);

  // const resolveConfigReadonlyResults =
  //   await resolveConfigReadonly(rawConfigFilePath);
  // console.debug(
  //   "resolveConfigReadonlyResults are:",
  //   resolveConfigReadonlyResults,
  // ); // It works.
}

export function deactivate() {}
