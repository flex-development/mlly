/**
 * @file Internals - Constants
 * @module mlly/internal/constants
 */

/**
 * CommonJS syntax regex.
 *
 * @internal
 *
 * @const {RegExp} CJS_SYNTAX_REGEX
 */
export const CJS_SYNTAX_REGEX: RegExp =
  /(?<!(?:\/\/|\*).*)((?:module\.)?exports(?:\.\w+|(?<!\s+=))|require(?=\(.)|require\.\w+|__dirname|__filename|await import)/gm

/**
 * Dynamic import statement regex.
 *
 * @internal
 *
 * @const {RegExp} DYNAMIC_IMPORT_REGEX
 */
export const DYNAMIC_IMPORT_REGEX: RegExp =
  /(?<!(?:\/\/|\*).*)(?:(?:const|let|var)(?:(?<name>\s+\w+\s*)|\s*{\s*(?<names>\w+(?:,\s*\w+)*)\s*}\s*)(?:\s*=\s*?)?.)?(?:await)?\s+import\s*\((?<expression>(?:[^()]+|\((?:[^()]+|\([^()]*\))*\))*)\)/gm

/**
 * ESM syntax regex.
 *
 * @internal
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
 * @internal
 *
 * @const {RegExp} EXPORT_NAMED_REGEX
 */
export const EXPORT_NAMED_REGEX: RegExp =
  /(?<!(?:\/\/|\*).*)\bexport(?:\s+type)?\s+{(?<exports>[^}]+?)[\s,]*}(?:\s*from\s*["']\s*(?<specifier>(?<="\s*)[^"]*[^\s"](?=\s*")|(?<='\s*)[^']*[^\s'](?=\s*'))\s*["'][^\n;]*)?/gm

/**
 * Aggregate export statement (`export * ...`) regex.
 *
 * @internal
 *
 * @const {RegExp} EXPORT_STAR_REGEX
 */
export const EXPORT_STAR_REGEX: RegExp =
  /(?<!(?:\/\/|\*).*)\bexport\s*\*(?:\s*as\s+(?<name>[\w$]+)\s+)?\s*(?:\s*from\s*["']\s*(?<specifier>(?<="\s*)[^"]*[^\s"](?=\s*")|(?<='\s*)[^']*[^\s'](?=\s*'))\s*["'][^\n;]*)?/gm

/**
 * Require statement regex.
 *
 * @internal
 *
 * @const {RegExp} REQUIRE_STATEMENT_REGEX
 */
export const REQUIRE_STATEMENT_REGEX: RegExp =
  /(?<!(?:\/\/|\*).*)(?:\bconst[ {]+(?<imports>[\w\t\n\r $*,/]+)[ =}]+)?(?<type>\brequire(?:\.resolve)?)\(["'] *(?<specifier>(?<="\s*)[^"']*[^\s"'](?=\s*")|(?<=["']\s*)[^']*[^\s'](?=\s*')) *["']\)/gm

/**
 * Static import statement regex.
 *
 * @internal
 *
 * @const {RegExp} STATIC_IMPORT_REGEX
 */
export const STATIC_IMPORT_REGEX: RegExp =
  /(?<!(?:\/\/|\*).*)import\s*(?:[\s"']*(?<imports>[\w\t\n\r $*,/{}]+)from\s*)?["']\s*(?<specifier>(?<="\s*)[^"]*[^\s":](?=\s*")|(?<=["']\s*)[^']*[^\s':](?=\s*'))\s*["']\s*/gm
