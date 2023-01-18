/**
 * @file Internal - PACKAGE_NAME_REGEX
 * @module mlly/internal/PACKAGE_NAME_REGEX
 */

/**
 * Regex pattern matching package names.
 *
 * @see https://regex101.com/r/BHcJfc
 *
 * @const {RegExp} PACKAGE_NAME_REGEX
 */
const PACKAGE_NAME_REGEX: RegExp =
  /^(?:(?<scope>@[\d*a-z~-][\w*.~-]*)\/)?[\da-z~-][\w.~-]*$/

export default PACKAGE_NAME_REGEX
