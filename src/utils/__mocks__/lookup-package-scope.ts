/**
 * @file Mock Utilities - lookupPackageScope
 * @module mlly/utils/mocks/lookupPackageScope
 */

import exports from '#fixtures/package-exports'
import imports from '#fixtures/package-imports'
import type { PackageScope } from '#src/interfaces'
import type { ModuleId } from '#src/types'
import type { Nullable } from '@flex-development/tutils'
import { pathToFileURL } from 'node:url'

/**
 * `lookupPackageScope` module type.
 */
type Actual = typeof import('../lookup-package-scope')

/**
 * `lookupPackageScope` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('../lookup-package-scope')

export default vi.fn(
  (
    id: ModuleId,
    stopdir?: ModuleId,
    specifier?: string,
    parent?: ModuleId
  ): Nullable<PackageScope> => {
    /**
     * Package scope result.
     *
     * @const {Nullable<PackageScope>} scope
     */
    const scope: Nullable<PackageScope> = actual.default(
      id,
      stopdir,
      specifier,
      parent
    )

    // replace package exports and imports if package dir is project dir
    if (scope?.pkg === pathToFileURL('package.json').href) {
      scope.pkgjson.exports = exports
      scope.pkgjson.imports = imports
    }

    return scope
  }
)
