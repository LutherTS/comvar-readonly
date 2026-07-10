/* data */

import { data } from "./comment-variables/data/index.js";

/* myIgnoresOnly */

const myIgnoresOnly = false; // can be omitted

/* ignores */

const ignores = ["**/typedefs/**"]; // can be omitted

/* lintConfigImports */

const lintConfigImports = false; // can be omitted

/* composedVariablesExclusives */

import { enComposedVariablesExclusives } from "./comment-variables/data/en/index.js";
import { frComposedVariablesExclusives } from "./comment-variables/data/fr/index.js";

const composedVariablesExclusives = /** @type {const} */ ([
  ...enComposedVariablesExclusives,
  ...frComposedVariablesExclusives,
]);

/* variations */

import { EN, ENGLISH, FR, FRANÇAIS } from "./comment-variables/index.js";
import { enData } from "./comment-variables/data/en/index.js";

const variations = Object.freeze({
  variants: Object.freeze({
    [EN]: Object.freeze({ label: ENGLISH }),
    [FR]: Object.freeze({ label: FRANÇAIS }),
  }),
  variant: EN,
  referenceData: enData,
  referenceVariant: EN,
  allowIncompleteVariations: true,
});

/* libraries */

import { commentVariablesData as errorHandlingCommentVariablesData } from "@lutherts/error-handling";
import { commentVariablesData as coreReadonlyCommentVariablesData } from "@comvar/core-readonly";
import coreReadonlyCommentVariablesDataIntl from "./comment-variables/miscellaneous/librairies/core-readonly.intl.json" with { type: "json" };

const libraries = {
  [errorHandlingCommentVariablesData.libraryKey]:
    errorHandlingCommentVariablesData.libraryVariations.EN,
  [coreReadonlyCommentVariablesData.libraryKey]:
    // coreReadonlyCommentVariablesData.libraryVariations.EN,
    coreReadonlyCommentVariablesDataIntl.EN,
}; // can be omitted

/* config */

const config = {
  data,
  myIgnoresOnly,
  ignores,
  lintConfigImports,
  composedVariablesExclusives,
  variations,
  libraries,
};

export default config;
