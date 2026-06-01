/**
 * @typedef {typeof import("typescript/lib/tsserverlibrary")} TS
 * @typedef {import("typescript/lib/tsserverlibrary").server.PluginCreateInfo} PluginCreateInfo
 * @typedef {import("typescript/lib/tsserverlibrary").LanguageService} LanguageService
 */
/**
 * @template {unknown} T
 * @typedef {(modules: {typescript: TS}) => {create(info: PluginCreateInfo): LanguageService; onConfigurationChanged(config: T): void;}} Init
 */

/**
 * @typedef {import("../source/typedefs/index.js").PluginConfig} PluginConfig
 */
/**
 * @typedef {Init<PluginConfig>} Plugin
 */

/* constants and utilities */

/* utilities */

/* replacePlaceholders
Constants and utility from:
- "@lutherts/error-handling"
- "@comvar/core-readonly"
 */

const $COMMENT = "$COMMENT"; // from "@comvar/core-readonly"

const escapeRegex = (/** @type {string} */ string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // from "@lutherts/error-handling"

const flattenedConfigDataPlaceholderGlobalRegex = new RegExp(
  `${escapeRegex($COMMENT)}#(?!#)([\\p{Lu}\\p{Lo}\\p{N}_#]+)`,
  "gu",
); // from "@comvar/core-readonly"

const replacePlaceholders = (
  /** @type {string} */ text,
  /** @type {PluginConfig | undefined} */ freshPluginConfig,
) => {
  if (!freshPluginConfig) return text;
  const { librariesData } = freshPluginConfig;

  if (!librariesData) return text;
  else {
    return text.replace(flattenedConfigDataPlaceholderGlobalRegex, (match) => {
      const key = match.replace(`${$COMMENT}#`, "");
      const libraryPrefixKey = key.split("#")[0];
      const libraryData = librariesData[libraryPrefixKey];
      if (libraryData) {
        const libraryReplacement = libraryData[key];
        if (libraryReplacement !== undefined) return libraryReplacement;
        else return match;
      } else return match;
    });
  }
};

/* TypeScript server plugin */

const plugin = /** @type {Plugin} */ (
  (_modules) => {
    // const ts = _modules.typescript; // Enables the direct use of the TypeScript engine in the plugin.
    // As of TypeScript 7 (and its preview), Strada plugins are no longer supported. In fact, by activate the VS Code preview at this time, the entire TypeScript server is gone and replaced with typescript-native-preview and typescript-native-preview (LSP).
    // It is expected that a new Corsa API will arrive with TypeScript 7.1 or later to address this issue optimally, under this brand-new LSP-based architecture that could expand capabilities currently unique to VS Code extension TypeScript server plugins towards any LSP-compatible editor via a single Corsa plugin.
    // But in the meantime, this plugin and all TypeScript server plugins require the current TypeScript (Native Preview) in the editor to be disabled.
    // https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-beta/?nsl_bypass_cache=6d1297ab45c3d6baf164cfafaefc3844#upcoming-work
    // https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.native-preview&ssr=false#overview

    let freshPluginConfig = /** @type {PluginConfig | undefined} */ (undefined);

    return {
      // https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin
      create: (info) => {
        const logger = info.project.projectService.logger;
        logger.info("ComVar Readonly TypeScript server plugin connected.");

        // Creates a proxy languageService object.
        /** @type {LanguageService} */
        const proxyLanguageService = Object.create(null);
        // Copies all methods from the original languageService.
        for (const key of Object.keys(info.languageService)) {
          /** @type {Function} */
          const originalMethod = info.languageService[key];
          proxyLanguageService[key] = (...args) =>
            originalMethod.apply(info.languageService, args);
        }

        // Overrides `getQuickInfoAtPosition`. (Handles hovers.)
        proxyLanguageService.getQuickInfoAtPosition = (...args) => {
          // Gets the original `ts.QuickInfo` at hand.
          const quickInfo = info.languageService.getQuickInfoAtPosition(
            ...args,
          );

          // If there's no `quickInfo`, then terminates and returns the absence of `quickInfo`.
          if (!quickInfo) return quickInfo;

          // Proceeds to update every known text available through `quickInfo` with Comment Variables placeholders replacements.

          const newDisplayParts = quickInfo.displayParts?.map((e) => {
            return {
              ...e,
              text: replacePlaceholders(e.text, freshPluginConfig),
            };
          });
          if (newDisplayParts) quickInfo.displayParts = newDisplayParts;

          const newDocumentation = quickInfo.documentation?.map((e) => {
            return {
              ...e,
              text: replacePlaceholders(e.text, freshPluginConfig),
            };
          });
          if (newDocumentation) quickInfo.documentation = newDocumentation;

          const newTags = quickInfo.tags?.map((e) => {
            const innerSymbolDisplayParts = e.text?.map((e2) => {
              return {
                ...e2,
                text: replacePlaceholders(e2.text, freshPluginConfig),
              };
            });
            if (innerSymbolDisplayParts)
              return {
                ...e,
                text: innerSymbolDisplayParts,
              };
            else return e;
          });
          if (newTags) quickInfo.tags = newTags;

          // Returns the `quickInfo`, now updated.
          return quickInfo;
        };

        // Overrides `getSignatureHelpItems`. (Handles in-function, in-object completions, etc.)
        proxyLanguageService.getSignatureHelpItems = (...args) => {
          const signatureHelpItems = info.languageService.getSignatureHelpItems(
            ...args,
          );

          // If there's no `signatureHelpItems`, then terminates and returns the absence of `signatureHelpItems`.
          if (!signatureHelpItems) return signatureHelpItems;

          // Proceeds to update every known text available through `signatureHelpItems` with Comment Variables placeholders replacements.

          const newSignatureHelpItems = signatureHelpItems.items?.map((e) => {
            const newDocumentation = e.documentation?.map((e2) => {
              return {
                ...e2,
                text: replacePlaceholders(e2.text, freshPluginConfig),
              };
            });
            const newParameters = e.parameters?.map((e2) => {
              const newDisplayParts = e2.displayParts?.map((e3) => {
                return {
                  ...e3,
                  text: replacePlaceholders(e3.text, freshPluginConfig),
                };
              });
              const innerDocumentation = e2.documentation?.map((e3) => {
                return {
                  ...e3,
                  text: replacePlaceholders(e3.text, freshPluginConfig),
                };
              });
              return {
                ...e2,
                displayParts: newDisplayParts,
                documentation: innerDocumentation,
              };
            });
            const newPrefixDisplayParts = e.prefixDisplayParts?.map((e2) => {
              return {
                ...e2,
                text: replacePlaceholders(e2.text, freshPluginConfig),
              };
            });
            const newSeparatorDisplayParts = e.separatorDisplayParts?.map(
              (e2) => {
                return {
                  ...e2,
                  text: replacePlaceholders(e2.text, freshPluginConfig),
                };
              },
            );
            const newSuffixDisplayParts = e.suffixDisplayParts?.map((e2) => {
              return {
                ...e2,
                text: replacePlaceholders(e2.text, freshPluginConfig),
              };
            });
            const newTags = e.tags?.map((e2) => {
              const innerSymbolDisplayParts = e2.text?.map((e3) => {
                return {
                  ...e3,
                  text: replacePlaceholders(e3.text, freshPluginConfig),
                };
              });
              if (innerSymbolDisplayParts)
                return {
                  ...e2,
                  text: innerSymbolDisplayParts,
                };
              else return e2;
            });

            return {
              ...e,
              documentation: newDocumentation,
              parameters: newParameters,
              prefixDisplayParts: newPrefixDisplayParts,
              separatorDisplayParts: newSeparatorDisplayParts,
              suffixDisplayParts: newSuffixDisplayParts,
              tags: newTags,
            };
          });

          // Returns the `signatureHelpItems`, now updated.
          return { ...signatureHelpItems, items: newSignatureHelpItems };
        };

        // Overrides `getCompletionEntryDetails`. (Handles suggestions details.)
        proxyLanguageService.getCompletionEntryDetails = (...args) => {
          const completionsEntryDetails =
            info.languageService.getCompletionEntryDetails(...args);

          // If there's no `completionsEntryDetails`, then terminates and returns the absence of `completionsEntryDetails`.
          if (!completionsEntryDetails) return completionsEntryDetails;

          // Proceeds to update every known text available through `completionsEntryDetails` with Comment Variables placeholders replacements.

          const newDisplayParts = completionsEntryDetails.displayParts?.map(
            (e) => {
              return {
                ...e,
                text: replacePlaceholders(e.text, freshPluginConfig),
              };
            },
          );
          if (newDisplayParts)
            completionsEntryDetails.displayParts = newDisplayParts;

          const newDocumentation = completionsEntryDetails.documentation?.map(
            (e) => {
              return {
                ...e,
                text: replacePlaceholders(e.text, freshPluginConfig),
              };
            },
          );
          if (newDocumentation)
            completionsEntryDetails.documentation = newDocumentation;

          const newTags = completionsEntryDetails.tags?.map((e) => {
            const innerSymbolDisplayParts = e.text?.map((e2) => {
              return {
                ...e2,
                text: replacePlaceholders(e2.text, freshPluginConfig),
              };
            });
            if (innerSymbolDisplayParts)
              return {
                ...e,
                text: innerSymbolDisplayParts,
              };
            else return e;
          });
          if (newTags) completionsEntryDetails.tags = newTags;

          // Returns the `completionsEntryDetails`, now updated.
          return completionsEntryDetails;
        };

        // And returns the proxy, also now updated.
        return proxyLanguageService;
      },

      // https://code.visualstudio.com/api/references/contribution-points#Plugin-configuration
      onConfigurationChanged: (config) => {
        freshPluginConfig = config;
      },
    };
  }
);

module.exports = plugin; // TypeScript server plugins must be CommonJS. Also, `create` and `onConfigurationChanged` are both conventions that need to be followed.
