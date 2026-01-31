/**
 * @file Internal - invalidSubpath
 * @module mlly/internal/invalidSubpath
 */

import chars from '#internal/chars'
import {
  ERR_INVALID_MODULE_SPECIFIER,
  type ErrInvalidModuleSpecifier
} from '@flex-development/errnode'
import type { ModuleId } from '@flex-development/mlly'
import pathe from '@flex-development/pathe'

/**
 * Create an {@linkcode ERR_INVALID_MODULE_SPECIFIER} error for an invalid
 * subpath pattern match.
 *
 * @see {@linkcode ErrInvalidModuleSpecifier}
 * @see {@linkcode ModuleId}
 *
 * @internal
 *
 * @this {void}
 *
 * @param {string} subpath
 *  The subpath pattern
 * @param {string} patternMatch
 *  The subpath pattern match
 * @param {ModuleId} packageUrl
 *  The URL of the directory containing the `package.json` file
 * @param {boolean | null | undefined} [isImports]
 *  Whether `target` is internal to the package
 * @param {ModuleId | null | undefined} [parent]
 *  The URL of the parent module
 * @return {ErrInvalidModuleSpecifier}
 *  New node error
 */
function invalidSubpath(
  this: void,
  subpath: string,
  patternMatch: string,
  packageUrl: ModuleId,
  isImports?: boolean | null | undefined,
  parent?: ModuleId | null | undefined
): ErrInvalidModuleSpecifier {
  return new ERR_INVALID_MODULE_SPECIFIER(
    subpath.replace(chars.asterisk, () => patternMatch),
    `request is not a valid match in pattern "${subpath}" for the ` +
      `"${isImports ? 'imports' : 'exports'}" resolution of ` +
      `${pathe.fileURLToPath(new URL('package.json', packageUrl))}`,
    parent && pathe.fileURLToPath(parent)
  )
}

export default invalidSubpath
