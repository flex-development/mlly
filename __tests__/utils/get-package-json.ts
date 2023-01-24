/**
 * @file Test Utilities - getPackageJson
 * @module tests/utils/getPackageJson
 */

import type { ModuleId } from '#src/types'
import type { PackageJson } from '@flex-development/pkg-types'
import fs from 'node:fs'

/**
 * Retrieves a `package.json` object.
 *
 * @param {ModuleId} id - Location of `package.json` file
 * @return {PackageJson} `package.json` object
 */
const getPackageJson = (id: ModuleId): PackageJson => {
  return JSON.parse(fs.readFileSync(id, 'utf8')) as PackageJson
}

export default getPackageJson
