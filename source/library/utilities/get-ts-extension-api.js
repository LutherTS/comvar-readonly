import * as vscode from "vscode";

/**
 * @typedef {import("../../typedefs/index.js").TsExtensionApi} TsExtensionApi
 */

/* getTsExtensionApi */

// https://code.visualstudio.com/api/references/contribution-points#Plugin-configuration
export const getTsExtensionApi = async () => {
  // Gets the TS extension.
  const tsExtension = vscode.extensions.getExtension(
    "vscode.typescript-language-features",
  );
  if (!tsExtension) {
    return;
  }

  await tsExtension.activate();

  // Gets the API from the TS extension.
  if (!tsExtension.exports || !tsExtension.exports.getAPI) {
    return;
  }

  const api = tsExtension.exports.getAPI(0);
  if (!api) {
    return;
  }

  return /** @type {TsExtensionApi} */ (api);
};
