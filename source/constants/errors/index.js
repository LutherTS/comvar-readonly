import { typeError } from "@lutherts/error-handling";

import {
  noProjectRoot,
  noTsExtensionApi,
  comvarReadonlyCouldntStart,
} from "./messages.js";
import {
  NO_WORKSPACE_FOLDERS,
  NO_TS_EXTENSION_API,
  COMVAR_READONLY_NOT_INITIALIZED,
} from "./statuses.js";

/* extension error objects */

export const noProjectRootError = Object.freeze({
  message: noProjectRoot,
  status: NO_WORKSPACE_FOLDERS,
  ...typeError,
});

export const noTsExtensionApiError = Object.freeze({
  message: noTsExtensionApi,
  status: NO_TS_EXTENSION_API,
  ...typeError,
});

export const comvarReadonlyCouldntStartError = Object.freeze({
  message: comvarReadonlyCouldntStart,
  status: COMVAR_READONLY_NOT_INITIALIZED,
  ...typeError,
});
