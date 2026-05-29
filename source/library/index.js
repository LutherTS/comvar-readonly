import * as vscode from "vscode";

import path from "path";

import { showVSCodeError } from "@lutherts/error-handling";
import {
  defaultConfigFileName,
  packageJsonFileName,
} from "@comvar/core-readonly";

import { refreshConfig } from "./utilities/refresh-config.js";

export async function activate(/** @type {vscode.ExtensionContext} */ context) {
  console.debug("It begins."); // It works.

  // Uses the first workspace folder as current working directory.
  const rootDirectoryPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  console.debug("rootDirectoryPath is:", rootDirectoryPath);

  if (!rootDirectoryPath) {
    // Next will need its own error messages system with readonly objects.
    showVSCodeError(vscode, {
      type: "error",
      message:
        "ERROR. No opened workspace folders found to obtain the project's root directory.",
      status: "NO_WORKSPACE_FOLDERS",
    });
    return;
  }

  // Only acknowledges the expected default config file path.
  let rawConfigFilePath = path.join(rootDirectoryPath, defaultConfigFileName);
  console.debug("rawConfigFilePath is:", rawConfigFilePath);

  // Computes the expected package.json file path to watch for `libraries`.
  const packageJsonFilePath = path.join(rootDirectoryPath, packageJsonFileName);
  console.debug("packageJsonFilePath is:", packageJsonFilePath);

  const refreshConfigBound = refreshConfig.bind(null, rawConfigFilePath); // Don't forget the TS Server Plugins API will also need to be bound.
  await refreshConfigBound(); // Just demoing for now.
}

export function deactivate() {}
