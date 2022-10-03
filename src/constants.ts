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
 * ESM syntax regex.
 *
 * @const {RegExp} ESM_SYNTAX_REGEX
 */
export const ESM_SYNTAX_REGEX: RegExp =
  // eslint-disable-next-line unicorn/no-unsafe-regex
  /(?<!(?:\/\/|\*).*)((?:export|import)[\s\w*,{}]*(?=\sfrom)|export\b\s*(?:[*{]|async function|(?:abstract\s)?class|const|default|enum|function|interface|let|type|var)|await import|import\.meta\.(?:env(?:\.\w+)?|resolve|url))/gm
