/**
 * @file Enums - Format
 * @module mlly/enums/Format
 */

/**
 * Module formats.
 *
 * @enum {Lowercase<string>}
 */
enum Format {
  BUILTIN = 'builtin',
  COMMONJS = 'commonjs',
  JSON = 'json',
  MODULE = 'module',
  WASM = 'wasm'
}

export default Format
