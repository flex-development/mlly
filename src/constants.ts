/**
 * @file Constants
 * @module mlly/constants
 */

import type { Ext } from './types'

/**
 * CommonJS syntax regex.
 *
 * @const {RegExp} CJS_SYNTAX_REGEX
 */
export const CJS_SYNTAX_REGEX: RegExp =
  /(?<!(?:\/\/|\*).*)((?:module\.)?exports(?:\.\w+|(?<!\s+=))|require(?=\(.)|require\.\w+|__dirname|__filename)/gm

/**
 * Default export conditions.
 *
 * @see https://nodejs.org/api/packages.html#conditional-exports
 *
 * @const {Readonly<Set<string>>} CONDITIONS
 */
export const CONDITIONS: Readonly<Set<string>> = Object.freeze(
  new Set(['node', 'import'])
)

/**
 * Dynamic import statement regex.
 *
 * @const {RegExp} DYNAMIC_IMPORT_REGEX
 */
export const DYNAMIC_IMPORT_REGEX: RegExp =
  /(?<!(?:\/\/|\*).*)(?:(?:const|let|var)(?:(?<name>\s+\w+\s*)|\s*{\s*(?<names>\w+(?:,\s*\w+)*)\s*}\s*)(?:\s*=\s*?)?.)?(?:await)?\s+import\s*\((?<expression>(?:[^()]+|\((?:[^()]+|\([^()]*\))*\))*)\)/gm

/**
 * ESM syntax regex.
 *
 * @const {RegExp} ESM_SYNTAX_REGEX
 */
export const ESM_SYNTAX_REGEX: RegExp =
  /(?<!(?:\/\/|\*).*)((?:export|import)[\s\w*,{}]*(?=\sfrom)|export\b\s*(?:[*{]|async function|(?:abstract\s)?class|const|default|enum|function|interface|let|type|var)|await import|import\.meta\.(?:env(?:\.\w+)?|resolve|url))/gm

/**
 * Declaration export statement regex.
 *
 * **Note**: Captures [declaration type][1] and export name only.
 *
 * [1]: ./types/declaration.ts
 *
 * @const {RegExp} EXPORT_DECLARATION_REGEX
 */
export const EXPORT_DECLARATION_REGEX: RegExp =
  /(?<!(?:\/\/|\*).*)\bexport(?: +declare)? +(?<declaration>(?:(?:abstract +)?class|(?:default +)?async +function\*?|(?:default +)?function\*?|default +async|default(?!(?: +async)? +function\*?)|(?:const +)?enum|const|interface|let|namespace|type(?! *{)|var)) +(?<name>[\w$]+(?!.*\b +=>))?/gm

/**
 * Named export statement regex.
 *
 * @const {RegExp} EXPORT_NAMED_REGEX
 */
export const EXPORT_NAMED_REGEX: RegExp =
  /(?<!(?:\/\/|\*).*)\bexport(?:\s+type)?\s+{(?<exports>[^}]+?)[\s,]*}(?:\s*from\s*["']\s*(?<specifier>(?<="\s*)[^"]*[^\s"](?=\s*")|(?<='\s*)[^']*[^\s'](?=\s*'))\s*["'][^\n;]*)?/gm

/**
 * Aggregate export statement (`export * ...`) regex.
 *
 * @const {RegExp} EXPORT_STAR_REGEX
 */
export const EXPORT_STAR_REGEX: RegExp =
  /(?<!(?:\/\/|\*).*)\bexport\s*\*(?:\s*as\s+(?<name>[\w$]+)\s+)?\s*(?:\s*from\s*["']\s*(?<specifier>(?<="\s*)[^"]*[^\s"](?=\s*")|(?<='\s*)[^']*[^\s'](?=\s*'))\s*["'][^\n;]*)?/gm

/**
 * Require statement regex.
 *
 * @const {RegExp} REQUIRE_STATEMENT_REGEX
 */
export const REQUIRE_STATEMENT_REGEX: RegExp =
  /(?<!(?:\/\/|\*).*)(?:\bconst[ {]+(?<imports>[\w\t\n\r $*,/]+)[ =}]+)?(?<type>\brequire(?:\.resolve)?)\(["'] *(?<specifier>(?<="\s*)[^"']*[^\s"'](?=\s*")|(?<=["']\s*)[^']*[^\s'](?=\s*')) *["']\)/gm

/**
 * Default resolvable file extensions.
 *
 * @const {ReadonlyArray<Ext>} RESOLVE_EXTENSIONS
 */
export const RESOLVE_EXTENSIONS: readonly Ext[] = Object.freeze([
  '.cjs',
  '.css',
  '.cts',
  '.js',
  '.json',
  '.jsx',
  '.mjs',
  '.mts',
  '.ts',
  '.tsx'
])

/**
 * Static import statement regex.
 *
 * @const {RegExp} STATIC_IMPORT_REGEX
 */
export const STATIC_IMPORT_REGEX: RegExp =
  /(?<!(?:\/\/|\*).*)import\s*(?:[\s"']*(?<imports>[\w\t\n\r $*,/{}]+)from\s*)?["']\s*(?<specifier>(?<="\s*)[^"']*[^\s"'](?=\s*")|(?<=["']\s*)[^']*[^\s'](?=\s*'))\s*["']\s*/gm
