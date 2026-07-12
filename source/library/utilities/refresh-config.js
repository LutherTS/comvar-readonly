import * as vscode from "vscode";

import {
  successFalse,
  successTrue,
  showVSCodeError,
} from "@lutherts/error-handling";
import { resolveConfigReadonly } from "@comvar/core-readonly";

import { createRelativeWatcher } from "./index.js";
import { configureTsServerPlugin } from "./configure-ts-server-plugin.js";

/**
 * @typedef {import("../../typedefs/index.js").TsExtensionApi} TsExtensionApi
 * @typedef {import("../../typedefs/index.js").FileSystemWatcher} FileSystemWatcher
 * @typedef {import("../../typedefs/index.js").WorkspaceFolder} WorkspaceFolder
 */

/* refreshConfig */

export const refreshConfig = async (
  /** @type {string} */ configFilePath,
  /** @type {TsExtensionApi} */ tsExtensionApi,
  /** @type {{watchers: FileSystemWatcher[]}} */ jsonImportPathsWatchers,
  /** @type {WorkspaceFolder} */ rootDirectory,
) => {
  const resolveConfigReadonlyResults =
    await resolveConfigReadonly(configFilePath);

  if (!resolveConfigReadonlyResults.success) {
    const { errors } = resolveConfigReadonlyResults;
    const threeErrorsMax = errors.slice(0, 3);

    for (const error of threeErrorsMax) {
      showVSCodeError(vscode, error);
    }
    return successFalse;
  }

  // Updates the TypeScript server plugin via the TS extension API, with the fresh `libraries` data.
  const {
    // libraries: librariesData,
    libraryVariationKeys_libraryVariationValues,
    // userlandJsonImports__Absolute,
    userlandJsonImports__Relative,
  } = resolveConfigReadonlyResults;
  const librariesData = Object.fromEntries(
    libraryVariationKeys_libraryVariationValues,
  );

  // HANDLES WATCHERS

  // Cleans up previous jsonImportPathsWatchers.
  for (const previousWatcher of jsonImportPathsWatchers.watchers) {
    previousWatcher.dispose();
  }
  // Reinitializes the `jsonImportPathsWatchers` array.
  jsonImportPathsWatchers.watchers = [];

  // Creates new jsonImportPathsWatchers from `userlandJsonImports__Relative`.
  for (const jsonImportPath of userlandJsonImports__Relative.values()) {
    const watchGlob = `{${jsonImportPath}}`;
    const watcher = createRelativeWatcher(rootDirectory, watchGlob);

    // Tells each watcher to activate refreshConfig after a change, passing it its own arguments.
    watcher.onDidChange(() => {
      refreshConfig(
        configFilePath,
        tsExtensionApi,
        jsonImportPathsWatchers,
        rootDirectory,
      );
    });
    // Also activates refreshConfig after a deletion.
    watcher.onDidDelete(() => {
      refreshConfig(
        configFilePath,
        tsExtensionApi,
        jsonImportPathsWatchers,
        rootDirectory,
      );
    });

    // Updates the `jsonImportPathsWatchers` array with the fresh new watchers.
    jsonImportPathsWatchers.watchers.push(watcher);
  }

  configureTsServerPlugin(tsExtensionApi, { librariesData });

  return successTrue;
};
