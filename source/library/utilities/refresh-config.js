import * as vscode from "vscode";

import {
  successFalse,
  successTrue,
  showVSCodeError,
} from "@lutherts/error-handling";
import { resolveConfigReadonly } from "@comvar/core-readonly";

import { configureTsServerPlugin } from "./configure-ts-server-plugin.js";

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

  if (!resolveConfigReadonlyResults.success) {
    const { errors } = resolveConfigReadonlyResults;
    const twoErrorsMax = errors.slice(0, 2);

    for (const error of twoErrorsMax) {
      showVSCodeError(vscode, error);
    }
    return successFalse;
  }

  // Updates the TypeScript server plugin via the TS extension API, with the fresh `libraries` data.
  const { libraries: librariesData } = resolveConfigReadonlyResults;
  configureTsServerPlugin(tsExtensionApi, { librariesData });

  return successTrue;
};
