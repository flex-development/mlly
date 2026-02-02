/**
 * @file Usage Example
 * @module example
 */

import {
  lookupPackageScope,
  readPackageJson,
  resolveModule,
  type FileSystem
} from '@flex-development/mlly'
import pkg from '@flex-development/mlly/package.json' with { type: 'json' }
import type { PackageJson } from '@flex-development/pkg-types'
import nfs from 'node:fs'

/**
 * A file system API with both asynchronous and synchronous methods.
 *
 * @const {FileSystem} fs
 */
const fs: FileSystem = {
  readFile: nfs.promises.readFile,
  realpath: nfs.promises.realpath,
  stat: nfs.statSync
}

/**
 * The URL of the package directory.
 *
 * @const {URL | null} scope
 */
const scope: URL | null = lookupPackageScope(import.meta.url, null, fs)

console.dir(scope) // file:///Users/lex/Projects/flex-development/mlly/

/**
 * The package manifest.
 *
 * @const {PackageJson | null} manifest
 */
const manifest: PackageJson | null = await readPackageJson(
  scope,
  null,
  import.meta.url,
  fs
)

console.dir(manifest?.name === pkg.name) // true
console.dir(manifest) // `pkg`

/**
 * A fully resolved URL.
 *
 * @const {URL} resolved
 */
const resolved: URL = await resolveModule(pkg.name, import.meta.url, {
  conditions: new Set(['mlly']),
  ext: null,
  fs
})

console.dir(resolved) // file:///Users/lex/Projects/flex-development/mlly/src/
