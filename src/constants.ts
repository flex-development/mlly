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
