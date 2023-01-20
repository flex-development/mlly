/**
 * @file Internal - INTERNAL_SPECIFIER_REGEX
 * @module mlly/internal/INTERNAL_SPECIFIER_REGEX
 */

/**
 * Regex pattern matching subpath imports.
 *
 * @see https://regex101.com/r/ppVRw7
 * @see https://nodejs.org/api/packages.html#subpath-imports
 *
 * @const {RegExp} INTERNAL_SPECIFIER_REGEX
 */
const INTERNAL_SPECIFIER_REGEX: RegExp =
  /^(?!.*(?:%2[Ff]|%5[Cc]))(?<root>#[^\s/]+?(?=\s|$|\/))(?<path>\/.+[^/](?=\s|$))?(?!\/)/

export default INTERNAL_SPECIFIER_REGEX
