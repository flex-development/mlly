declare module 'module' {
  global {
    /**
     * Filename resolver.
     *
     * @param {string} specifier - Module specifier
     * @param {NodeJS.Module | null} parent - Module that imported `specifier`
     * @return {string} Resolved file URL
     */
    export type ResolveFilename = (
      specifier: string,
      parent: NodeJS.Module | null
    ) => string
  }
}
