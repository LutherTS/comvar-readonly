import { resolveConfigReadonly } from "@comvar/core-readonly";

export const refreshConfig = async (/** @type {string} */ configFilePath) => {
  const resolveConfigReadonlyResults =
    await resolveConfigReadonly(configFilePath);
  console.debug(
    "resolveConfigReadonlyResults are:",
    resolveConfigReadonlyResults,
  ); // It works.
};
