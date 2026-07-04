/* data */

import { data } from "./comment-variables/data/index.js";

/* myIgnoresOnly */

const myIgnoresOnly = false; // can be omitted

/* lintConfigImports */

const lintConfigImports = false; // can be omitted

/* ignores */

const ignores = [];

/* composedVariablesExclusives */

import { enComposedVariablesExclusives } from "./comment-variables/data/en/index.js";
import { frComposedVariablesExclusives } from "./comment-variables/data/fr/index.js";

const composedVariablesExclusives = /** @type {const} */ ([
  ...enComposedVariablesExclusives,
  ...frComposedVariablesExclusives,
]); // composed variables allowed, Comment Variables that include `#COMPOSEDVARIABLESEXCLUSIVES#` are implicitly added

/* variations */

import { EN, ENGLISH, FR, FRANÇAIS } from "./comment-variables/index.js";
import { enData } from "./comment-variables/data/en/index.js";

const variations = Object.freeze({
  // Defines all variants that have matching variations duly defined within the top-level keys of `data`.
  variants: Object.freeze({
    [EN]: Object.freeze({ label: ENGLISH }),
    [FR]: Object.freeze({ label: FRANÇAIS }),
  }),
  // Defines the current variant that Comment Variables currently resolves to.
  variant: EN,
  // Defines the reference variation that all other variations need to have (or aim to have) matching keys with. Requires a JavaScript variable as it needs to be the exact same object as the one referenced at `data[variations.referenceVariant]`.
  referenceData: enData,
  // Defines the variant of the reference variation.
  referenceVariant: EN,
  // Defines the behavior of the error handling in case of variations that do not match one-to-one with the reference variation. If `true`, allows incomplete variations data to remain. If `false`, errors and guides the fixing of missing variations data (while ignoring composed variables exclusives).
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
}; // can be omitted // v3

const config = {
  data,
  myIgnoresOnly,
  ignores,
  lintConfigImports,
  composedVariablesExclusives,
  variations,
  libraries, // v3
};

export default config;
