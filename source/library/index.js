import * as vscode from "vscode";

import path from "path";

import { showVSCodeError } from "@lutherts/error-handling";
import {
  defaultConfigFileName,
  packageJsonFileName,
} from "@comvar/core-readonly";

import {
  noProjectRootError,
  noTsExtensionApiError,
  comvarReadonlyCouldntStartError,
} from "../constants/errors/index.js";

import { successfullyInitialized } from "./constants/index.js";

import { getTsExtensionApi } from "./utilities/get-ts-extension-api.js";
import { configureTsServerPlugin } from "./utilities/configure-ts-server-plugin.js";
import { refreshConfig } from "./utilities/refresh-config.js";

/**
 * @typedef {import("../typedefs/index.js").FileSystemWatcher} FileSystemWatcher
 */

export async function activate(/** @type {vscode.ExtensionContext} */ context) {
  // Uses the first workspace folder as current working directory.
  const rootDirectory = vscode.workspace.workspaceFolders?.[0];
  if (!rootDirectory) {
    showVSCodeError(vscode, noProjectRootError);
    showVSCodeError(vscode, comvarReadonlyCouldntStartError);
    return;
  }

  // Only acknowledges the expected default config file path.
  const rootDirectoryPath = rootDirectory.uri.fsPath;
  const configFilePath = path.join(rootDirectoryPath, defaultConfigFileName);

  // Gets and ensures the presence of the TS Extension API.
  const tsExtensionApi = await getTsExtensionApi();
  if (!tsExtensionApi || typeof tsExtensionApi.configurePlugin !== "function") {
    showVSCodeError(vscode, noTsExtensionApiError);
    showVSCodeError(vscode, comvarReadonlyCouldntStartError);
    return;
  }

  // Immediately initializes the TypeScript server plugin with `null` `libraries` data.
  configureTsServerPlugin(tsExtensionApi, {
    librariesData: null,
  });

  // Creates the watchers array for config imported paths, to bind it to `refreshConfig`.
  const jsonImportPathsWatchers = {
    watchers: /** @type {FileSystemWatcher[]} */ ([]),
  };

  // Creates the stable instance of `refreshConfig` bound to the immutable config file path and to the immutable TS Extension API.
  const refreshConfigBound = refreshConfig.bind(
    null,
    configFilePath,
    tsExtensionApi,
    jsonImportPathsWatchers,
    rootDirectory,
  );

  // Creates the sub-watchers for both the default config file path and the package.json file path, meant to react to their changes by firing `refreshConfigBound`.
  const watchGlob = `{${defaultConfigFileName},${packageJsonFileName}}`;
  const relativePattern = new vscode.RelativePattern(rootDirectory, watchGlob);
  const watcher = vscode.workspace.createFileSystemWatcher(relativePattern);

  watcher.onDidCreate(refreshConfigBound);
  watcher.onDidChange(refreshConfigBound);
  watcher.onDidDelete((uri) => {
    // If the user deletes their config path, their `libraries` data is also deleted.
    if (uri.fsPath === configFilePath) {
      configureTsServerPlugin(tsExtensionApi, {
        librariesData: null,
      });
    } // But if they delete their package.json path, their `libraries` data remains as it last was.
  });

  // Calls a first `refreshConfigBound` for initialization.
  const initialRefreshConfigBoundResults = await refreshConfigBound();

  if (!initialRefreshConfigBoundResults.success) {
    // refreshConfigBound error-showing handled in `refreshConfigBound`
    showVSCodeError(vscode, comvarReadonlyCouldntStartError);
    return;
  } else {
    vscode.window.showInformationMessage(successfullyInitialized);
  }

  // Refreshes the config every time the VS Code configuration changes. (Notably when changing the TypeScript version used for JavaScript and TypeScript language features.)
  const onDidChangeConfigurationListener =
    vscode.workspace.onDidChangeConfiguration(
      async () => await refreshConfigBound(),
    );

  // And for cleanups...
  context.subscriptions.push(watcher, onDidChangeConfigurationListener);
}

export function deactivate() {}
