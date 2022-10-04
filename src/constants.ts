/**
 * @file Constants
 * @module mlly/constants
 */

/**
 * CommonJS syntax regex.
 *
 * @const {RegExp} CJS_SYNTAX_REGEX
 */
export const CJS_SYNTAX_REGEX: RegExp =
  /(?<!(?:\/\/|\*).*)((?:module\.)?exports(?:\.\w+|(?<!\s+=))|require(?=\(.)|require\.\w+|__dirname|__filename)/gm

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
 * Static import statement regex.
 *
 * @const {RegExp} STATIC_IMPORT_REGEX
 */
export const STATIC_IMPORT_REGEX: RegExp =
  /(?<!(?:\/\/|\*).*)import\s*(?:[\s"']*(?<imports>[\w\t\n\r $*,/{}]+)from\s*)?["']\s*(?<specifier>(?<="\s*)[^"']*[^\s"'](?=\s*")|(?<=["']\s*)[^']*[^\s'](?=\s*'))\s*["']\s*/gm
