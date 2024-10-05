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
import { fileURLToPath } from '@flex-development/pathe'
import { ok } from 'devlop'

/**
 * Create an {@linkcode ERR_INVALID_MODULE_SPECIFIER} error for an invalid
 * subpath pattern match.
 *
 * @see {@linkcode ErrInvalidModuleSpecifier}
 * @see {@linkcode ModuleId}
 *
 * @internal
 *
 * @param {string} subpath
 *  Subpath pattern
 * @param {string} patternMatch
 *  Subpath pattern match
 * @param {ModuleId} packageUrl
 *  URL of directory containing `package.json` file
 * @param {boolean | null | undefined} [isImports]
 *  Whether `target` is internal to the package
 * @param {ModuleId | null | undefined} [parent]
 *  URL of parent module
 * @return {ErrInvalidModuleSpecifier}
 *  New node error
 */
function invalidSubpath(
  subpath: string,
  patternMatch: string,
  packageUrl: ModuleId,
  isImports?: boolean | null | undefined,
  parent?: ModuleId | null | undefined
): ErrInvalidModuleSpecifier {
  ok(patternMatch, 'expected `patternMatch`')

  return new ERR_INVALID_MODULE_SPECIFIER(
    subpath.replace(chars.asterisk, () => patternMatch),
    `request is not a valid match in pattern "${subpath}" for the ` +
      `"${isImports ? 'imports' : 'exports'}" resolution of ` +
      `${fileURLToPath(new URL('package.json', packageUrl))}`,
    parent && fileURLToPath(parent)
  )
}

export default invalidSubpath
