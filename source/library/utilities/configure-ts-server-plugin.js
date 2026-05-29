import { TYPESCRIPT_SERVER_PLUGIN } from "../constants/index.js";

/**
 * @typedef {import("../../typedefs/index.js").TsExtensionApi} TsExtensionApi
 * @typedef {import("../../typedefs/index.js").PluginConfig} PluginConfig
 */

/* configureTsServerPlugin */

export const configureTsServerPlugin = (
  /** @type {TsExtensionApi} */ tsExtensionApi,
  /** @type {PluginConfig} */ pluginConfig,
) => {
  tsExtensionApi.configurePlugin(TYPESCRIPT_SERVER_PLUGIN, pluginConfig);
};
