/**
 * @file Internal - invalidPackageTarget
 * @module mlly/internal/invalidPackageTarget
 */

import chars from '#internal/chars'
import {
  ERR_INVALID_PACKAGE_TARGET,
  type ErrInvalidPackageTarget
} from '@flex-development/errnode'
import type { ModuleId } from '@flex-development/mlly'
import { fileURLToPath } from '@flex-development/pathe'

/**
 * Create an {@linkcode ERR_INVALID_PACKAGE_TARGET} error.
 *
 * @see {@linkcode ErrInvalidPackageTarget}
 * @see {@linkcode ModuleId}
 *
 * @internal
 *
 * @param {ModuleId} packageUrl
 *  URL of directory containing `package.json` file
 * @param {string} subpath
 *  Subpath pattern
 * @param {unknown} target
 *  The invalid package target
 * @param {boolean | null | undefined} [isImports]
 *  Whether `target` is internal to the package
 * @param {ModuleId | null | undefined} [parent]
 *  URL of parent module
 * @return {ErrInvalidPackageTarget}
 *  New node error
 */
function invalidPackageTarget(
  packageUrl: ModuleId,
  subpath: string,
  target: unknown,
  isImports?: boolean | null | undefined,
  parent?: ModuleId | null | undefined
): ErrInvalidPackageTarget {
  return new ERR_INVALID_PACKAGE_TARGET(
    fileURLToPath(packageUrl),
    subpath,
    typeof target === 'object' && target !== null
      ? JSON.stringify(target, null, '')
      : String(target) + (typeof target === 'bigint' ? 'n' : chars.empty),
    isImports,
    parent && fileURLToPath(parent)
  )
}

export default invalidPackageTarget
