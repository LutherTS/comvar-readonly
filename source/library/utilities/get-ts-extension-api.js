import * as vscode from "vscode";

/**
 * @typedef {import("../../typedefs/index.js").TsExtensionApi} TsExtensionApi
 */

/* getTsExtensionApi */

// https://code.visualstudio.com/api/references/contribution-points#Plugin-configuration
export const getTsExtensionApi = async () => {
  // Gets the TS extension from VS Code.
  const tsExtension = vscode.extensions.getExtension(
    "vscode.typescript-language-features",
  );
  if (!tsExtension) {
    return;
  }

  // Activates the TS extension from VS Code.
  await tsExtension.activate();

  // Gets the API from the TS extension from VS Code.
  if (!tsExtension.exports || !tsExtension.exports.getAPI) {
    return;
  }

  const api = tsExtension.exports.getAPI(0);
  if (!api) {
    return;
  }

  return /** @type {TsExtensionApi} */ (api);
};
