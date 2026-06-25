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
  } = resolveConfigReadonlyResults;
  const librariesData = Object.fromEntries(
    libraryVariationKeys_libraryVariationValues,
  );

  configureTsServerPlugin(tsExtensionApi, { librariesData });

  return successTrue;
};
