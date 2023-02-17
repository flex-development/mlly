/**
 * @file Test Utilities - getPackageJson
 * @module tests/utils/getPackageJson
 */

import type { ModuleId } from '#src/types'
import type { PackageJson } from '@flex-development/pkg-types'
import fs from 'node:fs'
import { URL } from 'node:url'

/**
 * Retrieves a `package.json` object.
 *
 * @param {ModuleId} id - Module id of `package.json` file or id of directory
 * containing relevant `package.json` file
 * @return {PackageJson} `package.json` object
 */
const getPackageJson = (id: ModuleId): PackageJson => {
  if (id instanceof URL) id = id.pathname
  if (!id.endsWith('package.json')) id = id.replace(/\/$/, '') + '/package.json'
  return JSON.parse(fs.readFileSync(id, 'utf8')) as PackageJson
}

export default getPackageJson
