import * as vscode from "vscode";

import {
  successFalse,
  successTrue,
  showVSCodeError,
} from "@lutherts/error-handling";
import { resolveConfigReadonly } from "@comvar/core-readonly";

/**
 * @typedef {import("../../typedefs/index.js").TsExtensionApi} TsExtensionApi
 */

/* refreshConfig */

export const refreshConfig = async (
  /** @type {string} */ configFilePath,
  /** @type {TsExtensionApi} */ tsExtensionApi,
) => {
  const resolveConfigReadonlyResults =
    await resolveConfigReadonly(configFilePath);
  // console.debug(
  //   "resolveConfigReadonlyResults are:",
  //   resolveConfigReadonlyResults,
  // ); // It works.

  if (!resolveConfigReadonlyResults.success) {
    const { errors } = resolveConfigReadonlyResults;
    const twoErrorsMax = errors.slice(0, 2);

    for (const error of twoErrorsMax) {
      showVSCodeError(vscode, error);
    }

    return successFalse;
  }

  const { libraries: librariesData } = resolveConfigReadonlyResults;
  // console.debug("librariesData is:", librariesData)

  // Updates the TypeScript server plugin via the TS extension API, with the fresh `libraries` data.
  // tsExtensionApi.configurePlugin() // { librariesData }
  // console.debug("tsExtensionApi after:", tsExtensionApi);

  return successTrue;
};
