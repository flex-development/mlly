/**
 * @file Internal - PACKAGE_PATH_REGEX
 * @module mlly/internal/PACKAGE_PATH_REGEX
 */

/**
 * Regex pattern matching bare specifiers beginning with valid package names.
 *
 * **Note**: Does **not** match specifiers beginning with `'node_modules'`.
 *
 * @see https://regex101.com/r/z0MPgj
 *
 * @internal
 *
 * @const {RegExp} PACKAGE_PATH_REGEX
 */
const PACKAGE_PATH_REGEX: RegExp =
  /^(?!\S+:|node_modules)(?<pkg>(?:(?:(?<scope>@[\d*a-z~-][\w*.~-]*)\/)?[\da-z~-][\w.~-]*))@?(?<version_prefix>v)?(?<version>(?:(?:0|[1-9]\d*)\.){2}(?:0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[a-z-][\da-z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-z-][\da-z-]*))*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?)?(?<subpath>\/.*)?(?<!.*(?:%2[Ff]|%5[Cc]))/

export default PACKAGE_PATH_REGEX
