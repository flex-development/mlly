/**
 * @file resolver
 * @module mlly/lib/resolver
 */

import chainOrCall from '#internal/chain-or-call'
import chars from '#internal/chars'
import checkInvalidSegments from '#internal/check-invalid-segments'
import constant from '#internal/constant'
import dfs from '#internal/fs'
import invalidPackageTarget from '#internal/invalid-package-target'
import invalidSubpath from '#internal/invalid-subpath'
import isPromise from '#internal/is-promise'
import canParseUrl from '#lib/can-parse-url'
import defaultConditions from '#lib/default-conditions'
import defaultMainFields from '#lib/default-main-fields'
import isArrayIndex from '#lib/is-array-index'
import isDirectory from '#lib/is-directory'
import isFile from '#lib/is-file'
import isImportsSubpath from '#lib/is-imports-subpath'
import isModuleId from '#lib/is-module-id'
import isRelativeSpecifier from '#lib/is-relative-specifier'
import lookupPackageScope from '#lib/lookup-package-scope'
import patternMatch from '#lib/pattern-match'
import readPackageJson from '#lib/read-package-json'
import root from '#lib/root'
import toUrl from '#lib/to-url'
import {
  codes,
  ERR_INVALID_MODULE_SPECIFIER,
  ERR_INVALID_PACKAGE_CONFIG,
  ERR_MODULE_NOT_FOUND,
  ERR_PACKAGE_IMPORT_NOT_DEFINED,
  ERR_PACKAGE_PATH_NOT_EXPORTED,
  ERR_UNSUPPORTED_DIR_IMPORT,
  ERR_UNSUPPORTED_RESOLVE_REQUEST,
  type ErrInvalidModuleSpecifier,
  type ErrInvalidPackageConfig,
  type ErrInvalidPackageTarget,
  type ErrModuleNotFound,
  type ErrPackageImportNotDefined,
  type ErrPackagePathNotExported,
  type ErrUnsupportedDirImport,
  type ErrUnsupportedResolveRequest,
  type NodeError
} from '@flex-development/errnode'
import { isBuiltin } from '@flex-development/is-builtin'
import type {
  Awaitable,
  Condition,
  FileSystem,
  List,
  MainField,
  ModuleId,
  PatternMatch
} from '@flex-development/mlly'
import pathe from '@flex-development/pathe'
import type {
  ConditionalTargets,
  Exports,
  ExportsObject,
  Imports,
  JsonValue,
  PackageJson,
  Target,
  TargetList
} from '@flex-development/pkg-types'
import { ok } from 'devlop'

declare module '@flex-development/errnode' {
  interface ErrUnsupportedDirImport {
    /**
     * The directory URL.
     */
    url?: string | null | undefined
  }
}

export {
  legacyMainResolve,
  moduleResolve,
  packageExportsResolve,
  packageImportsExportsResolve,
  packageImportsResolve,
  packageResolve,
  packageSelfResolve,
  packageTargetResolve
}

/**
 * Resolve the [`main`][main] package entry point
 * using the legacy CommonJS resolution algorithm.
 *
 * > 👉 **Note**: Returns a promise if `fs.stat` is async.
 *
 * [main]: https://github.com/nodejs/node/blob/v22.9.0/doc/api/packages.md#main
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode ErrModuleNotFound}
 * @see {@linkcode FileSystem}
 * @see {@linkcode List}
 * @see {@linkcode MainField}
 * @see {@linkcode ModuleId}
 * @see {@linkcode PackageJson}
 *
 * @template {Awaitable<URL>} T
 *  The resolved entry point URL
 *
 * @this {void}
 *
 * @param {ModuleId} packageUrl
 *  The URL of the package directory, the `package.json` file,
 *  or a module in the same directory as a `package.json`
 * @param {PackageJson | null | undefined} [manifest]
 *  The package manifest
 * @param {List<MainField> | null | undefined} [mainFields]
 *  The list of legacy main fields
 * @param {ModuleId | null | undefined} [parent]
 *  The URL of the parent module
 * @param {FileSystem | null | undefined} [fs]
 *  The file system API
 * @return {Awaitable<URL>}
 *  The resolved entry point URL
 * @throws {ErrModuleNotFound}
 */
function legacyMainResolve<T extends Awaitable<URL>>(
  this: void,
  packageUrl: ModuleId,
  manifest?: PackageJson | null | undefined,
  mainFields?: List<MainField> | null | undefined,
  parent?: ModuleId | null | undefined,
  fs?: FileSystem | null | undefined
): T

/**
 * Resolve the [`main`][main] package entry point
 * using the legacy CommonJS resolution algorithm.
 *
 * > 👉 **Note**: Returns a promise if `fs.stat` is async.
 *
 * [main]: https://github.com/nodejs/node/blob/v22.9.0/doc/api/packages.md#main
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode ErrModuleNotFound}
 * @see {@linkcode FileSystem}
 * @see {@linkcode List}
 * @see {@linkcode MainField}
 * @see {@linkcode ModuleId}
 * @see {@linkcode PackageJson}
 *
 * @this {void}
 *
 * @param {ModuleId} packageUrl
 *  The URL of the package directory, the `package.json` file,
 *  or a module in the same directory as a `package.json`
 * @param {PackageJson | null | undefined} [manifest]
 *  The package manifest
 * @param {List<MainField> | null | undefined} [mainFields]
 *  The list of legacy main fields
 * @param {ModuleId | null | undefined} [parent]
 *  The URL of the parent module
 * @param {FileSystem | null | undefined} [fs]
 *  The file system API
 * @return {Awaitable<URL>}
 *  The resolved entry point URL
 * @throws {ErrModuleNotFound}
 */
function legacyMainResolve(
  this: void,
  packageUrl: ModuleId,
  manifest?: PackageJson | null | undefined,
  mainFields?: List<MainField> | null | undefined,
  parent?: ModuleId | null | undefined,
  fs?: FileSystem | null | undefined
): Awaitable<URL> {
  if (manifest) {
    /**
     * The promise context.
     *
     * > 👉 **Note**: Only used if {@linkcode isFile} returns a promise.
     *
     * @const {{ scope: URL | null }} context
     */
    const context: { url: URL | null } = { url: null }

    /**
     * The promises to resolve.
     *
     * > 👉 **Note**: Only used if {@linkcode isFile} returns a promise.
     *
     * @const {Awaitable<undefined>[]} promises
     */
    const promises: Awaitable<undefined>[] = []

    for (const field of mainFields ?? defaultMainFields) {
      /**
       * Possible inputs for the entry point URL.
       *
       * @const {string[]} tries
       */
      const tries: string[] = []

      /**
       * The main field value.
       *
       * @const {JsonValue} value
       */
      const value: JsonValue | undefined = manifest[field]

      /**
       * Whether the current try exists.
       *
       * @var {Awaitable<boolean>} exists
       */
      let exists: Awaitable<boolean>

      if (typeof value === 'string') {
        tries.push(
          value,
          `./${value}.js`,
          `./${value}.json`,
          `./${value}.node`,
          `./${value}/index.js`,
          `./${value}/index.json`,
          `./${value}/index.node`
        )
      }

      tries.push('./index.js', './index.json', './index.node')

      for (let url of tries.map(input => new URL(input, packageUrl))) {
        exists = isFile(url, fs) // check if entry point exists.

        // collect promises, or return url if entry point exists.
        if (isPromise<boolean>(exists)) {
          promises.push(exists.then(isFile => {
            if (!isFile || context.url) return
            return context.url = url, void 0
          }))
        } else if (exists) {
          return url
        }
      }
    }

    // resolve entry point url.
    if (promises.length) {
      return Promise.all(promises).then(() => check(context.url))
    }
  }

  return check(null)

  /**
   * @this {void}
   *
   * @param {URL | null} url
   *  The url to check
   * @return {URL}
   *  The resolved entry point URL
   * @throws {ErrModuleNotFound}
   */
  function check(this: void, url: URL | null): URL {
    if (url) return url

    throw new ERR_MODULE_NOT_FOUND(
      pathe.fileURLToPath(packageUrl),
      parent && pathe.fileURLToPath(parent)
    )
  }
}

/**
 * Resolve a module `specifier`.
 *
 * Implements the `ESM_RESOLVE` algorithm.
 *
 * > 👉 **Note**: Returns a promise if {@linkcode packageImportsResolve}
 * > or {@linkcode packageResolve} returns a promise.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode Condition}
 * @see {@linkcode ErrInvalidModuleSpecifier}
 * @see {@linkcode ErrModuleNotFound}
 * @see {@linkcode ErrUnsupportedDirImport}
 * @see {@linkcode FileSystem}
 * @see {@linkcode List}
 * @see {@linkcode ModuleId}
 * @see https://github.com/nodejs/node/blob/v22.9.0/doc/api/esm.md#resolution-algorithm
 *
 * @template {Awaitable<URL>} T
 *  The resolved URL
 *
 * @this {void}
 *
 * @param {string} specifier
 *  The module specifier to resolve
 * @param {ModuleId} parent
 *  The URL of the parent module
 * @param {List<Condition> | null | undefined} [conditions]
 *  The list of export/import conditions
 * @param {List<MainField> | null | undefined} [mainFields]
 *  The list of legacy main fields
 * @param {boolean | null | undefined} [preserveSymlinks]
 *  Whether to keep symlinks instead of resolving them
 * @param {FileSystem | null | undefined} [fs]
 *  The file system API
 * @return {T}
 *  The resolved URL
 * @throws {ErrInvalidModuleSpecifier}
 * @throws {ErrModuleNotFound}
 * @throws {ErrUnsupportedDirImport}
 */
function moduleResolve<T extends Awaitable<URL>>(
  this: void,
  specifier: string,
  parent: ModuleId,
  conditions?: List<Condition> | null | undefined,
  mainFields?: List<MainField> | null | undefined,
  preserveSymlinks?: boolean | null | undefined,
  fs?: FileSystem | null | undefined
): T

/**
 * Resolve a module `specifier`.
 *
 * Implements the `ESM_RESOLVE` algorithm.
 *
 * > 👉 **Note**: Returns a promise if {@linkcode packageImportsResolve}
 * > or {@linkcode packageResolve} returns a promise.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode Condition}
 * @see {@linkcode ErrInvalidModuleSpecifier}
 * @see {@linkcode ErrModuleNotFound}
 * @see {@linkcode ErrUnsupportedDirImport}
 * @see {@linkcode FileSystem}
 * @see {@linkcode List}
 * @see {@linkcode ModuleId}
 * @see https://github.com/nodejs/node/blob/v22.9.0/doc/api/esm.md#resolution-algorithm
 *
 * @this {void}
 *
 * @param {string} specifier
 *  The module specifier to resolve
 * @param {ModuleId} parent
 *  The URL of the parent module
 * @param {List<Condition> | null | undefined} [conditions]
 *  The list of export/import conditions
 * @param {List<MainField> | null | undefined} [mainFields]
 *  The list of legacy main fields
 * @param {boolean | null | undefined} [preserveSymlinks]
 *  Whether to keep symlinks instead of resolving them
 * @param {FileSystem | null | undefined} [fs]
 *  The file system API
 * @return {Awaitable<URL>}
 *  The resolved URL
 * @throws {ErrInvalidModuleSpecifier}
 * @throws {ErrModuleNotFound}
 * @throws {ErrUnsupportedDirImport}
 */
function moduleResolve(
  this: void,
  specifier: string,
  parent: ModuleId,
  conditions?: List<Condition> | null | undefined,
  mainFields?: List<MainField> | null | undefined,
  preserveSymlinks?: boolean | null | undefined,
  fs?: FileSystem | null | undefined
): Awaitable<URL> {
  /**
   * The URL protocol of the parent module.
   *
   * @const {string} parentProtocol
   */
  const parentProtocol: string = typeof parent === 'string'
    ? parent.slice(0, parent.indexOf(':') + 1)
    : parent.protocol

  /**
   * The resolved URL.
   *
   * @var {Awaitable<URL>} resolved
   */
  let resolved!: Awaitable<URL>

  if (pathe.isAbsolute(specifier) || isRelativeSpecifier(specifier)) {
    try {
      resolved = new URL(specifier, parent)
    } catch (e: unknown) {
      /**
       * The node error.
       *
       * @var {ErrUnsupportedResolveRequest} error
       */
      let error: ErrUnsupportedResolveRequest

      error = new ERR_UNSUPPORTED_RESOLVE_REQUEST(specifier, parent)
      error.cause = e

      throw error
    }
  } else if (parentProtocol === 'file:' && isImportsSubpath(specifier)) {
    resolved = packageImportsResolve(
      specifier,
      parent,
      conditions,
      mainFields,
      fs
    )
  } else {
    try {
      resolved = new URL(specifier)
    } catch (e: unknown) {
      if (parentProtocol === 'data:' && !isBuiltin(specifier)) {
        /**
         * The node error.
         *
         * @var {ErrUnsupportedResolveRequest} error
         */
        let error: ErrUnsupportedResolveRequest

        error = new ERR_UNSUPPORTED_RESOLVE_REQUEST(String(specifier), parent)
        error.cause = e

        throw error
      }

      resolved = packageResolve(specifier, parent, conditions, mainFields, fs)
    }
  }

  if (isPromise<URL>(resolved)) {
    void resolved.then(url => (resolved = url), constant(null))
  }

  return chainOrCall(resolved, (): Awaitable<URL> => {
    ok(isModuleId(resolved), 'expected `resolved` to be a URL')
    if (resolved.protocol !== 'file:') return resolved

    /**
     * The path to the parent module.
     *
     * @const {string} parentPath
     */
    const parentPath: string = pathe.fileURLToPath(parent)

    /**
     * The resolved URL.
     *
     * @var {URL} url
     */
    let url: URL = resolved

    // check for encoded separators.
    if (/%2f|%5c/i.test(url.pathname)) {
      /**
       * The reason for the invalid module specifier error.
       *
       * @const {string} reason
       */
      const reason: string = 'must not include encoded "/" or "\\" characters'

      throw new ERR_INVALID_MODULE_SPECIFIER(url.pathname, reason, parentPath)
    }

    /**
     * Whether the resolved URL points to a directory.
     *
     * @const {Awaitable<boolean>} directory
     */
    const directory: Awaitable<boolean> = isDirectory(url, fs)

    return chainOrCall(directory, (isDirectory?: boolean): Awaitable<URL> => {
      if (isDirectory ?? directory) {
        /**
         * The node error.
         *
         * @var {ErrUnsupportedDirImport} error
         */
        let error: ErrUnsupportedDirImport

        error = new ERR_UNSUPPORTED_DIR_IMPORT(url.pathname, parentPath)
        error.url = String(url)

        throw error
      }

      /**
       * Whether the resolved URL points to a file.
       *
       * @const {Awaitable<boolean>} file
       */
      const file: Awaitable<boolean> = isFile(url, fs)

      return chainOrCall(file, (isFile?: boolean): Awaitable<URL> => {
        if (isFile ?? file) {
          if (preserveSymlinks) return url

          /**
           * The canonical pathname of the resolved URL.
           *
           * @const {Awaitable<string>} canonical
           */
          const canonical: Awaitable<string> = (fs ?? dfs).realpath(url)

          return chainOrCall(canonical, (realpath?: string): Awaitable<URL> => {
            const { hash, search } = url
            url = new URL(pathe.pathToFileURL(realpath ?? canonical as string))
            return url.hash = hash, url.search = search, url
          })
        }

        throw new ERR_MODULE_NOT_FOUND(url.pathname, parentPath, url)
      })
    })
  })
}

/**
 * Resolve a package export.
 *
 * Implements the `PACKAGE_EXPORTS_RESOLVE` algorithm.
 *
 * > 👉 **Note**: Never returns a promise.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode Condition}
 * @see {@linkcode ErrInvalidPackageConfig}
 * @see {@linkcode ErrPackagePathNotExported}
 * @see {@linkcode Exports}
 * @see {@linkcode FileSystem}
 * @see {@linkcode Imports}
 * @see {@linkcode List}
 * @see {@linkcode ModuleId}
 * @see https://github.com/nodejs/node/blob/v22.9.0/doc/api/esm.md#resolution-algorithm
 *
 * @template {Awaitable<URL>} T
 *  The resolved package export URL
 *
 * @this {void}
 *
 * @param {ModuleId} packageUrl
 *  The URL of the package directory, the `package.json` file,
 *  or a module in the same directory as a `package.json`
 * @param {string} subpath
 *  The package subpath to resolve
 * @param {Exports | undefined} exports
 *  The package exports
 * @param {List<Condition> | null | undefined} [conditions]
 *  The list of export/import conditions
 * @param {ModuleId | null | undefined} [parent]
 *  The URL of the parent module
 * @param {FileSystem | null | undefined} [fs]
 *  The file system API
 * @return {Awaitable<URL>}
 *  The resolved package export URL
 * @throws {ErrInvalidPackageConfig}
 * @throws {ErrPackagePathNotExported}
 */
function packageExportsResolve<T extends Awaitable<URL>>(
  this: void,
  packageUrl: ModuleId,
  subpath: string, // eslint-disable-next-line unicorn/prefer-module
  exports: Exports | undefined,
  conditions?: List<Condition> | null | undefined,
  parent?: ModuleId | null | undefined,
  fs?: FileSystem | null | undefined
): T

/**
 * Resolve a package export.
 *
 * Implements the `PACKAGE_EXPORTS_RESOLVE` algorithm.
 *
 * > 👉 **Note**: Never returns a promise.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode Condition}
 * @see {@linkcode ErrInvalidPackageConfig}
 * @see {@linkcode ErrPackagePathNotExported}
 * @see {@linkcode Exports}
 * @see {@linkcode FileSystem}
 * @see {@linkcode Imports}
 * @see {@linkcode List}
 * @see {@linkcode ModuleId}
 * @see https://github.com/nodejs/node/blob/v22.9.0/doc/api/esm.md#resolution-algorithm
 *
 * @this {void}
 *
 * @param {ModuleId} packageUrl
 *  The URL of the package directory, the `package.json` file,
 *  or a module in the same directory as a `package.json`
 * @param {string} subpath
 *  The package subpath to resolve
 * @param {Exports | undefined} exports
 *  The package exports
 * @param {List<Condition> | null | undefined} [conditions]
 *  The list of export/import conditions
 * @param {ModuleId | null | undefined} [parent]
 *  The URL of the parent module
 * @param {FileSystem | null | undefined} [fs]
 *  The file system API
 * @return {Awaitable<URL>}
 *  The resolved package export URL
 * @throws {ErrInvalidPackageConfig}
 * @throws {ErrPackagePathNotExported}
 */
function packageExportsResolve(
  this: void,
  packageUrl: ModuleId,
  subpath: string,
  exports: Exports | undefined,
  conditions?: List<Condition> | null | undefined,
  parent?: ModuleId | null | undefined,
  fs?: FileSystem | null | undefined
): Awaitable<URL> {
  if (exports) {
    /**
     * Whether all keys in {@linkcode exports} must begin with a dot (`'.'`).
     *
     * @var {boolean} dot
     */
    let dot: boolean = false

    if (!Array.isArray(exports) && typeof exports === 'object') {
      for (const [i, key] of Object.getOwnPropertyNames(exports).entries()) {
        /**
         * Whether the current {@linkcode exports} object key
         * begins with a dot (`'.'`).
         *
         * @var {boolean} dotStart
         */
        let dotStart: boolean = key[0] === pathe.dot

        if (i === 0) {
          dot = dotStart
          continue
        }

        // `exports` can contain all conditions or subpaths, but not both.
        if (dot !== dotStart) {
          throw new ERR_INVALID_PACKAGE_CONFIG(
            pathe.fileURLToPath(new URL('package.json', packageUrl)),
            parent,
            `"exports" cannot contain some keys starting with '.' and some not. The exports object must either be an object of package subpath keys or an object of main entry condition name keys only.`
          )
        }
      }
    }

    /**
     * The resolved URL.
     *
     * > 👉 **Note**: {@linkcode packageTargetResolve}, called both
     * > directly and indirectly below, only only returns a promise
     * > if {@linkcode packageResolve} also returns a promise.
     * > `packageResolve` is only called, however, when resolving imports.
     *
     * @var {URL | null | undefined} resolved
     */
    let resolved: URL | null | undefined = null

    // resolve main entry point or package subpath.
    if (subpath === pathe.dot) {
      /**
       * The main export.
       *
       * @var {Exports | undefined} mainExport
       */
      let mainExport: Exports | undefined

      if (Array.isArray(exports) || typeof exports === 'string' || !dot) {
        mainExport = exports
      } else if (Object.prototype.hasOwnProperty.call(exports, subpath)) {
        mainExport = exports[subpath]
      }

      if (mainExport !== undefined) {
        resolved = packageTargetResolve(
          packageUrl,
          mainExport,
          subpath,
          null,
          false,
          conditions,
          null,
          parent,
          fs
        )
      }
    } else if (!Array.isArray(exports) && typeof exports === 'object' && dot) {
      ok(subpath.startsWith('./'), 'expected `subpath` to start with "./"')

      resolved = packageImportsExportsResolve(
        subpath,
        exports,
        packageUrl,
        false,
        conditions,
        null,
        parent,
        fs
      )
    }

    ok(!isPromise(resolved), 'expected `resolved` not to be a promise')
    if (resolved) return resolved
  }

  throw new ERR_PACKAGE_PATH_NOT_EXPORTED(
    pathe.fileURLToPath(packageUrl),
    subpath,
    parent && pathe.fileURLToPath(parent)
  )
}

/**
 * Resolve a package export or import.
 *
 * Implements the `PACKAGE_IMPORTS_EXPORTS_RESOLVE` algorithm.
 *
 * > 👉 **Note**: Returns a promise if {@linkcode packageTargetResolve}
 * > returns a promise.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode Condition}
 * @see {@linkcode ExportsObject}
 * @see {@linkcode FileSystem}
 * @see {@linkcode Imports}
 * @see {@linkcode List}
 * @see {@linkcode ModuleId}
 * @see https://github.com/nodejs/node/blob/v22.9.0/doc/api/esm.md#resolution-algorithm
 *
 * @template {Awaitable<URL | null | undefined>} T
 *  The resolved package export or import URL
 *
 * @this {void}
 *
 * @param {string} matchKey
 *  The package subpath extracted from a module specifier,
 *  or a dot character (`.`)
 * @param {ExportsObject | Imports | null | undefined} matchObject
 *  The package exports or imports
 * @param {ModuleId} packageUrl
 *  The URL of the directory containing the `package.json` file
 * @param {boolean | null | undefined} [isImports]
 *  Whether `matchObject` is internal to the package
 * @param {List<Condition> | null | undefined} [conditions]
 *  The list of export/import conditions
 * @param {List<MainField> | null | undefined} [mainFields]
 *  The list of legacy main fields
 * @param {ModuleId | null | undefined} [parent]
 *  The URL of the parent module
 * @param {FileSystem | null | undefined} [fs]
 *  The file system API
 * @return {T}
 *  The resolved package export or import URL
 */
function packageImportsExportsResolve<
  T extends Awaitable<URL | null | undefined>
>(
  this: void,
  matchKey: string,
  matchObject: ExportsObject | Imports | null | undefined,
  packageUrl: ModuleId,
  isImports?: boolean | null | undefined,
  conditions?: List<Condition> | null | undefined,
  mainFields?: List<MainField> | null | undefined,
  parent?: ModuleId | null | undefined,
  fs?: FileSystem | null | undefined
): T

/**
 * Resolve a package export or import.
 *
 * Implements the `PACKAGE_IMPORTS_EXPORTS_RESOLVE` algorithm.
 *
 * > 👉 **Note**: Returns a promise if {@linkcode packageTargetResolve}
 * > returns a promise.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode Condition}
 * @see {@linkcode ExportsObject}
 * @see {@linkcode FileSystem}
 * @see {@linkcode Imports}
 * @see {@linkcode List}
 * @see {@linkcode ModuleId}
 * @see https://github.com/nodejs/node/blob/v22.9.0/doc/api/esm.md#resolution-algorithm
 *
 * @this {void}
 *
 * @param {string} matchKey
 *  The package subpath extracted from a module specifier,
 *  or a dot character (`.`)
 * @param {ExportsObject | Imports | null | undefined} matchObject
 *  The package exports or imports
 * @param {ModuleId} packageUrl
 *  The URL of the directory containing the `package.json` file
 * @param {boolean | null | undefined} [isImports]
 *  Whether `matchObject` is internal to the package
 * @param {List<Condition> | null | undefined} [conditions]
 *  The list of export/import conditions
 * @param {List<MainField> | null | undefined} [mainFields]
 *  The list of legacy main fields
 * @param {ModuleId | null | undefined} [parent]
 *  The URL of the parent module
 * @param {FileSystem | null | undefined} [fs]
 *  The file system API
 * @return {Awaitable<URL | null | undefined>}
 *  The resolved package export or import URL
 */
function packageImportsExportsResolve(
  this: void,
  matchKey: string,
  matchObject: ExportsObject | Imports | null | undefined,
  packageUrl: ModuleId,
  isImports?: boolean | null | undefined,
  conditions?: List<Condition> | null | undefined,
  mainFields?: List<MainField> | null | undefined,
  parent?: ModuleId | null | undefined,
  fs?: FileSystem | null | undefined
): Awaitable<URL | null | undefined> {
  /**
   * The expansion key and subpath pattern match.
   *
   * @const {PatternMatch | null} match
   */
  const match: PatternMatch | null = patternMatch(matchKey, matchObject)

  if (!match) return match
  ok(matchObject, 'expected `matchObject`')

  return packageTargetResolve(
    packageUrl,
    matchObject[match[0]],
    ...match,
    isImports,
    conditions,
    mainFields,
    parent,
    fs
  )
}

/**
 * Resolve a package import.
 *
 * Implements the `PACKAGE_IMPORTS_RESOLVE` algorithm.
 *
 * > 👉 **Note**: Returns a promise if {@linkcode lookupPackageScope},
 * > {@linkcode packageImportsExportsResolve}, or {@linkcode readPackageJson}
 * > returns a promise.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode Condition}
 * @see {@linkcode ErrInvalidModuleSpecifier}
 * @see {@linkcode ErrPackageImportNotDefined}
 * @see {@linkcode FileSystem}
 * @see {@linkcode List}
 * @see {@linkcode ModuleId}
 * @see https://github.com/nodejs/node/blob/v22.9.0/doc/api/esm.md#resolution-algorithm
 *
 * @template {Awaitable<URL>} T
 *  The resolved package import URL
 *
 * @this {void}
 *
 * @param {string} specifier
 *  The import specifier to resolve
 * @param {ModuleId} parent
 *  The URL of the parent module
 * @param {List<Condition> | null | undefined} [conditions]
 *  The list of export/import conditions
 * @param {List<MainField> | null | undefined} [mainFields]
 *  The list of legacy main fields
 * @param {FileSystem | null | undefined} [fs]
 *  The file system API
 * @return {T}
 *  The resolved package import URL
 * @throws {ErrInvalidModuleSpecifier}
 * @throws {ErrPackageImportNotDefined}
 */
function packageImportsResolve<T extends Awaitable<URL>>(
  this: void,
  specifier: string,
  parent: ModuleId,
  conditions?: List<Condition> | null | undefined,
  mainFields?: List<MainField> | null | undefined,
  fs?: FileSystem | null | undefined
): T

/**
 * Resolve a package import.
 *
 * Implements the `PACKAGE_IMPORTS_RESOLVE` algorithm.
 *
 * > 👉 **Note**: Returns a promise if {@linkcode lookupPackageScope},
 * > {@linkcode packageImportsExportsResolve}, or {@linkcode readPackageJson}
 * > returns a promise.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode Condition}
 * @see {@linkcode ErrInvalidModuleSpecifier}
 * @see {@linkcode ErrPackageImportNotDefined}
 * @see {@linkcode FileSystem}
 * @see {@linkcode List}
 * @see {@linkcode ModuleId}
 * @see https://github.com/nodejs/node/blob/v22.9.0/doc/api/esm.md#resolution-algorithm
 *
 * @this {void}
 *
 * @param {string} specifier
 *  The import specifier to resolve
 * @param {ModuleId} parent
 *  The URL of the parent module
 * @param {List<Condition> | null | undefined} [conditions]
 *  The list of export/import conditions
 * @param {List<MainField> | null | undefined} [mainFields]
 *  The list of legacy main fields
 * @param {FileSystem | null | undefined} [fs]
 *  The file system API
 * @return {Awaitable<URL>}
 *  The resolved package import URL
 * @throws {ErrInvalidModuleSpecifier}
 * @throws {ErrPackageImportNotDefined}
 */
function packageImportsResolve(
  this: void,
  specifier: string,
  parent: ModuleId,
  conditions?: List<Condition> | null | undefined,
  mainFields?: List<MainField> | null | undefined,
  fs?: FileSystem | null | undefined
): Awaitable<URL> {
  if (
    !specifier.startsWith(chars.hash) ||
    specifier === chars.hash ||
    specifier.startsWith(chars.hash + pathe.sep)
  ) {
    throw new ERR_INVALID_MODULE_SPECIFIER(
      specifier,
      'is not a valid internal imports specifier name',
      pathe.fileURLToPath(parent)
    )
  }

  /**
   * The package scope URL.
   *
   * @var {Awaitable<URL | null>} scope
   */
  let scope: Awaitable<URL | null> = lookupPackageScope(parent, null, fs)

  // capture resolved scope url.
  if (isPromise(scope)) {
    void scope.then(resolved => (scope = resolved), constant(null))
  }

  return chainOrCall(scope, (): Awaitable<URL> => {
    ok(!isPromise(scope), 'expected `scope` to be resolved')

    /**
     * The package manifest.
     *
     * @const {Awaitable<PackageJson | null>} pjson
     */
    const pjson: Awaitable<PackageJson | null> = readPackageJson(
      scope,
      specifier,
      parent,
      fs
    )

    return chainOrCall(pjson, (pkg?: PackageJson | null): Awaitable<URL> => {
      if ((pkg = pkg === undefined ? pjson as PackageJson | null : pkg)) {
        ok(scope instanceof URL, 'expected `scope` to be a URL')

        /**
         * The resolved URL.
         *
         * @var {Awaitable<URL | null | undefined>} url
         */
        let url: Awaitable<URL | null | undefined>

        url = packageImportsExportsResolve(
          specifier,
          pkg.imports,
          scope,
          true,
          conditions,
          mainFields,
          parent,
          fs
        )

        if (isPromise(url)) return url.then(check)
        if (url) return url
      }

      return check(null)
    })

    /**
     * @this {void}
     *
     * @param {URL | null | undefined} url
     *  The url to check
     * @return {URL}
     *  The resolved URL
     * @throws {ErrPackagePathNotExported}
     */
    function check(this: void, url: URL | null | undefined): URL {
      ok(!isPromise(scope), 'expected `scope` to be resolved')

      if (url) return url

      throw new ERR_PACKAGE_IMPORT_NOT_DEFINED(
        specifier,
        scope && pathe.fileURLToPath(scope),
        parent && pathe.fileURLToPath(parent)
      )
    }
  })
}

/**
 * Resolve a *bare specifier*.
 *
 * > *Bare specifiers* like `'some-package'` or `'some-package/shuffle'` refer
 * > to the main entry point of a package by package name, or a specific feature
 * > module within a package prefixed by the package name. Including the file
 * > extension is only necessary for packages without an [`"exports"`][exports]
 * > field.
 *
 * Implements the `PACKAGE_RESOLVE` algorithm.
 *
 * > 👉 **Note**: Returns a promise if `fs.stat` is async or one of the
 * > following methods returns a promise: {@linkcode legacyMainResolve},
 * > {@linkcode packageExportsResolve}, {@linkcode packageSelfResolve},
 * > {@linkcode readPackageJson}.
 *
 * [exports]: https://nodejs.org/api/packages.html#exports
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode Condition}
 * @see {@linkcode ErrInvalidModuleSpecifier}
 * @see {@linkcode ErrModuleNotFound}
 * @see {@linkcode FileSystem}
 * @see {@linkcode List}
 * @see {@linkcode MainField}
 * @see {@linkcode ModuleId}
 * @see https://github.com/nodejs/node/blob/v22.9.0/doc/api/esm.md#resolution-algorithm
 *
 * @template {Awaitable<URL>} T
 *  The resolved package URL
 *
 * @this {void}
 *
 * @param {string} specifier
 *  The package specifier to resolve
 * @param {ModuleId} parent
 *  The id of the module to resolve `packageSpecifier` against
 * @param {List<Condition> | null | undefined} [conditions]
 *  The list of export/import conditions
 * @param {List<MainField> | null | undefined} [mainFields]
 *  The list of legacy main fields
 * @param {FileSystem | null | undefined} [fs]
 *  The file system API
 * @return {T}
 *  The resolved package URL
 * @throws {ErrInvalidModuleSpecifier}
 * @throws {ErrModuleNotFound}
 */
function packageResolve<T extends Awaitable<URL>>(
  this: void,
  specifier: string,
  parent: ModuleId,
  conditions?: List<Condition> | null | undefined,
  mainFields?: List<MainField> | null | undefined,
  fs?: FileSystem | null | undefined
): T

/**
 * Resolve a *bare specifier*.
 *
 * > *Bare specifiers* like `'some-package'` or `'some-package/shuffle'` refer
 * > to the main entry point of a package by package name, or a specific feature
 * > module within a package prefixed by the package name. Including the file
 * > extension is only necessary for packages without an [`"exports"`][exports]
 * > field.
 *
 * Implements the `PACKAGE_RESOLVE` algorithm.
 *
 * > 👉 **Note**: Returns a promise if `fs.stat` is async or one of the
 * > following methods returns a promise: {@linkcode legacyMainResolve},
 * > {@linkcode packageExportsResolve}, {@linkcode packageSelfResolve},
 * > {@linkcode readPackageJson}.
 *
 * [exports]: https://nodejs.org/api/packages.html#exports
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode Condition}
 * @see {@linkcode ErrInvalidModuleSpecifier}
 * @see {@linkcode ErrModuleNotFound}
 * @see {@linkcode FileSystem}
 * @see {@linkcode List}
 * @see {@linkcode MainField}
 * @see {@linkcode ModuleId}
 * @see https://github.com/nodejs/node/blob/v22.9.0/doc/api/esm.md#resolution-algorithm
 *
 * @this {void}
 *
 * @param {string} specifier
 *  The package specifier to resolve
 * @param {ModuleId} parent
 *  The id of the module to resolve `packageSpecifier` against
 * @param {List<Condition> | null | undefined} [conditions]
 *  The list of export/import conditions
 * @param {List<MainField> | null | undefined} [mainFields]
 *  The list of legacy main fields
 * @param {FileSystem | null | undefined} [fs]
 *  The file system API
 * @return {Awaitable<URL>}
 *  The resolved package URL
 * @throws {ErrInvalidModuleSpecifier}
 * @throws {ErrModuleNotFound}
 */
function packageResolve(
  this: void,
  specifier: string,
  parent: ModuleId,
  conditions?: List<Condition> | null | undefined,
  mainFields?: List<MainField> | null | undefined,
  fs?: FileSystem | null | undefined
): Awaitable<URL> {
  if (isBuiltin(specifier)) return toUrl(specifier)

  /**
   * Index of separator in {@linkcode specifier}.
   *
   * @var {number} separatorIndex
   */
  let separatorIndex: number = specifier.indexOf(pathe.sep)

  /**
   * Whether the package name is valid.
   *
   * @var {boolean} validPackageName
   */
  let validPackageName: boolean = !!specifier

  if (specifier[0] === chars.at) {
    if (separatorIndex === -1) {
      validPackageName = false
    } else {
      separatorIndex = specifier.indexOf(pathe.sep, separatorIndex + 1)
    }
  }

  /**
   * The package name.
   *
   * @const {string} packageName
   */
  const packageName: string = separatorIndex === -1
    ? specifier
    : specifier.slice(0, separatorIndex)

  // package names cannot start with dot characters.
  // they also cannot contain percent-encoded or \\ (`\`) separators.
  if (/^\.|%|\\/.exec(packageName) !== null) validPackageName = false

  // throw on invalid package name.
  if (!validPackageName) {
    /**
     * The reason for the invalid specifier error.
     *
     * @const {string} reason
     */
    const reason: string = 'is not a valid package name'

    throw new ERR_INVALID_MODULE_SPECIFIER(specifier, reason, parent)
  }

  /**
   * The package subpath.
   *
   * @const {string} packageSubpath
   */
  const packageSubpath: string = pathe.dot + (separatorIndex === -1
    ? chars.empty
    : specifier.slice(separatorIndex))

  /**
   * The resolved self-import URL.
   *
   * @var {Awaitable<URL | undefined>} self
   */
  let self: Awaitable<URL | undefined> = packageSelfResolve(
    packageName,
    packageSubpath,
    parent,
    conditions,
    fs
  )

  // capture resolved self-import url.
  if (isPromise(self)) {
    void self.then(resolved => (self = resolved), constant(null))
  }

  return chainOrCall(self, (): Awaitable<URL> => {
    ok(!isPromise(self), 'expected `self` to be resolved')
    if (self) return self

    /**
     * The promise context.
     *
     * > 👉 **Note**: Only used if {@linkcode isDirectory} returns a promise.
     *
     * @const {{ url: Awaitable<URL | null> }} context
     */
    const context: { url: Awaitable<URL | null> } = { url: null }

    /**
     * The promises to resolve.
     *
     * > 👉 **Note**: Only used if {@linkcode isDirectory} returns a promise.
     *
     * @const {Awaitable<undefined>[]} promises
     */
    const promises: Awaitable<undefined>[] = []

    /**
     * Whether the current package directory exists.
     *
     * @var {Awaitable<boolean>} exists
     */
    let exists: Awaitable<boolean>

    /**
     * The URL of the parent module.
     *
     * @var {URL} parentUrl
     */
    let parentUrl: URL = new URL(parent)

    while (String(parentUrl) !== String(root)) {
      /**
       * The URL of the package directory.
       *
       * @const {URL} scope
       */
      const scope: URL = new URL(`node_modules/${packageName}/`, parentUrl)

      // check if package directory exists.
      exists = isDirectory(scope, fs)

      // chain `isDirectory` promises,
      // or return resolved url if package directory exists.
      if (isPromise(exists)) {
        promises.push(exists.then(isDirectory => {
          if (!isDirectory || context.url) return
          return context.url = resolve(scope), void 0
        }))
      } else if (exists) {
        return resolve(scope)
      }

      // move onto next package directory.
      parentUrl = new URL(pathe.dirname(parentUrl.href))
    }

    if (promises.length) {
      return chainOrCall(Promise.all(promises), (): Awaitable<URL> => {
        if (isPromise(context.url)) return context.url.then(check)
        return check(context.url)
      })
    }

    return check(null)
  })

  /**
   * @this {void}
   *
   * @param {URL | null} url
   *  The url to check
   * @return {URL}
   *  The resolved URL
   * @throws {ErrModuleNotFound}
   */
  function check(this: void, url: URL | null): URL {
    if (url) return url

    throw new ERR_MODULE_NOT_FOUND(
      packageName,
      parent && pathe.fileURLToPath(parent)
    )
  }

  /**
   * @this {void}
   *
   * @param {URL} packageUrl
   *  The URL of the package directory
   * @return {Awaitable<URL>}
   *  The resolved URL
   */
  function resolve(this: void, packageUrl: URL): Awaitable<URL> {
    /**
     * The package manifest.
     *
     * @var {Awaitable<PackageJson | null>} pjson
     */
    let pjson: Awaitable<PackageJson | null> = readPackageJson(
      packageUrl,
      null,
      parent,
      fs
    )

    if (isPromise(pjson)) {
      void pjson.then(resolved => (pjson = resolved), constant(null))
    }

    return chainOrCall(pjson, (): Awaitable<URL> => {
      ok(!isPromise(pjson), 'expected `pjson` to be resolved')

      if (pjson?.exports) {
        return packageExportsResolve(
          packageUrl,
          packageSubpath,
          pjson.exports,
          conditions,
          parent,
          fs
        )
      }

      if (packageSubpath !== pathe.dot) {
        return new URL(packageSubpath, packageUrl)
      }

      return legacyMainResolve(packageUrl, pjson, mainFields, parent, fs)
    })
  }
}

/**
 * Resolve the self-import of a package.
 *
 * Implements the `PACKAGE_SELF_RESOLVE` algorithm.
 *
 * > 👉 **Note**: Returns a promise if {@linkcode lookupPackageScope},
 * > {@linkcode packageExportsResolve}, or {@linkcode readPackageJson}
 * > returns a promise.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode Condition}
 * @see {@linkcode FileSystem}
 * @see {@linkcode List}
 * @see {@linkcode ModuleId}
 * @see https://github.com/nodejs/node/blob/v22.9.0/doc/api/esm.md#resolution-algorithm
 *
 * @template {Awaitable<URL | undefined>} T
 *  The resolved URL
 *
 * @this {void}
 *
 * @param {string} name
 *  The package name
 * @param {string} subpath
 *  The package subpath
 * @param {ModuleId} parent
 *  The URL of the parent module
 * @param {List<Condition> | null | undefined} [conditions]
 *  The list of export conditions
 * @param {FileSystem | null | undefined} [fs]
 *  The file system API
 * @return {T}
 *  The resolved URL
 */
function packageSelfResolve<T extends Awaitable<URL | undefined>>(
  this: void,
  name: string,
  subpath: string,
  parent: ModuleId,
  conditions?: List<Condition> | null | undefined,
  fs?: FileSystem | null | undefined
): T

/**
 * Resolve the self-import of a package.
 *
 * Implements the `PACKAGE_SELF_RESOLVE` algorithm.
 *
 * > 👉 **Note**: Returns a promise if {@linkcode lookupPackageScope},
 * > {@linkcode packageExportsResolve}, or {@linkcode readPackageJson}
 * > returns a promise.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode Condition}
 * @see {@linkcode FileSystem}
 * @see {@linkcode List}
 * @see {@linkcode ModuleId}
 * @see https://github.com/nodejs/node/blob/v22.9.0/doc/api/esm.md#resolution-algorithm
 *
 * @this {void}
 *
 * @param {string} name
 *  The package name
 * @param {string} subpath
 *  The package subpath
 * @param {ModuleId} parent
 *  The URL of the parent module
 * @param {List<Condition> | null | undefined} [conditions]
 *  The list of export conditions
 * @param {FileSystem | null | undefined} [fs]
 *  The file system API
 * @return {Awaitable<URL | undefined>}
 *  The resolved URL
 */
function packageSelfResolve(
  this: void,
  name: string,
  subpath: string,
  parent: ModuleId,
  conditions?: List<Condition> | null | undefined,
  fs?: FileSystem | null | undefined
): Awaitable<URL | undefined> {
  /**
   * The URL of the package directory.
   *
   * @const {Awaitable<URL | null>} packageUrl
   */
  const packageUrl: Awaitable<URL | null> = lookupPackageScope(parent, null, fs)

  return chainOrCall(packageUrl, scope => {
    /**
     * The package manifest.
     *
     * @const {Awaitable<PackageJson | null>} pjson
     */
    const pjson: Awaitable<PackageJson | null> = readPackageJson(
      scope = scope === undefined ? packageUrl as URL | null : scope,
      null,
      parent,
      fs
    )

    return chainOrCall(pjson, pkg => {
      if (pkg === undefined) pkg = pjson as PackageJson | null

      if (pkg?.exports && name === pkg.name) {
        return ok(scope, 'expected `scope`'), packageExportsResolve(
          scope,
          subpath,
          pkg.exports,
          conditions,
          parent,
          fs
        )
      }

      return undefined
    })
  })
}

/**
 * Resolve a package target.
 *
 * Implements the `PACKAGE_TARGET_RESOLVE` algorithm.
 *
 * > 👉 **Note**: Returns a promise if {@linkcode packageResolve}
 * > returns a promise.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode Condition}
 * @see {@linkcode ErrInvalidPackageConfig}
 * @see {@linkcode ErrInvalidPackageTarget}
 * @see {@linkcode FileSystem}
 * @see {@linkcode List}
 * @see {@linkcode ModuleId}
 * @see {@linkcode Target}
 * @see https://github.com/nodejs/node/blob/v22.9.0/doc/api/esm.md#resolution-algorithm
 *
 * @template {Awaitable<URL | null | undefined>} T
 *  The resolved package target URL
 *
 * @this {void}
 *
 * @param {ModuleId} packageUrl
 *  The URL of the directory containing the `package.json` file
 * @param {unknown} target
 *  The package target (i.e. a `exports`/`imports` value)
 * @param {string} subpath
 *  The package subpath (i.e. a `exports`/`imports` key)
 * @param {string | null | undefined} [patternMatch]
 *  The subpath pattern match
 * @param {boolean | null | undefined} [isImports]
 *  Whether `target` is internal to the package
 * @param {List<Condition> | null | undefined} [conditions]
 *  The list of export/import conditions
 * @param {List<MainField> | null | undefined} [mainFields]
 *  The list of legacy main fields
 * @param {ModuleId | null | undefined} [parent]
 *  The URL of the parent module
 * @param {FileSystem | null | undefined} [fs]
 *  The file system API
 * @return {T}
 *  The resolved package target URL
 * @throws {ErrInvalidPackageConfig}
 * @throws {ErrInvalidPackageTarget}
 */
function packageTargetResolve<T extends Awaitable<URL | null | undefined>>(
  this: void,
  packageUrl: ModuleId,
  target: unknown,
  subpath: string,
  patternMatch?: string | null | undefined,
  isImports?: boolean | null | undefined,
  conditions?: List<Condition> | null | undefined,
  mainFields?: List<MainField> | null | undefined,
  parent?: ModuleId | null | undefined,
  fs?: FileSystem | null | undefined
): T

/**
 * Resolve a package target.
 *
 * Implements the `PACKAGE_TARGET_RESOLVE` algorithm.
 *
 * > 👉 **Note**: Returns a promise if {@linkcode packageResolve}
 * > returns a promise.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode Condition}
 * @see {@linkcode ErrInvalidPackageConfig}
 * @see {@linkcode ErrInvalidPackageTarget}
 * @see {@linkcode FileSystem}
 * @see {@linkcode List}
 * @see {@linkcode ModuleId}
 * @see {@linkcode Target}
 * @see https://github.com/nodejs/node/blob/v22.9.0/doc/api/esm.md#resolution-algorithm
 *
 * @this {void}
 *
 * @param {ModuleId} packageUrl
 *  The URL of the directory containing the `package.json` file
 * @param {unknown} target
 *  The package target (i.e. a `exports`/`imports` value)
 * @param {string} subpath
 *  The package subpath (i.e. a `exports`/`imports` key)
 * @param {string | null | undefined} [patternMatch]
 *  The subpath pattern match
 * @param {boolean | null | undefined} [isImports]
 *  Whether `target` is internal to the package
 * @param {List<Condition> | null | undefined} [conditions]
 *  The list of export/import conditions
 * @param {List<MainField> | null | undefined} [mainFields]
 *  The list of legacy main fields
 * @param {ModuleId | null | undefined} [parent]
 *  The URL of the parent module
 * @param {FileSystem | null | undefined} [fs]
 *  The file system API
 * @return {Awaitable<URL | null | undefined>}
 *  The resolved package target URL
 * @throws {ErrInvalidPackageConfig}
 * @throws {ErrInvalidPackageTarget}
 */
function packageTargetResolve(
  this: void,
  packageUrl: ModuleId,
  target: unknown,
  subpath: string,
  patternMatch?: string | null | undefined,
  isImports?: boolean | null | undefined,
  conditions?: List<Condition> | null | undefined,
  mainFields?: List<MainField> | null | undefined,
  parent?: ModuleId | null | undefined,
  fs?: FileSystem | null | undefined
): Awaitable<URL | null | undefined> {
  if (target === null) return target

  /**
   * The promise context.
   *
   * > 👉 **Note**: Only used if any function calls return a promise.
   *
   * @const {{ e?: NodeError; url?: URL | null }} context
   */
  const context: { e?: NodeError; url?: URL | null } = {}

  /**
   * The result of the promise chain.
   *
   * > 👉 **Note**: Only used if any function calls return a promise.
   *
   * @var {Awaitable<undefined>} promise
   */
  let promise: Awaitable<undefined>

  if (Array.isArray<TargetList[number]>(target)) {
    /**
     * The error to code to skip.
     *
     * @const {NodeError['code']} code
     */
    const code: NodeError['code'] = codes.ERR_INVALID_PACKAGE_TARGET

    /**
     * The last node error.
     *
     * @var {NodeError | null} error
     */
    let error!: NodeError | null

    for (const targetValue of target) {
      /**
       * The resolved URL.
       *
       * @var {Awaitable<URL | null | undefined>} resolved
       */
      let resolved: Awaitable<URL | null | undefined>

      try {
        resolved = packageTargetResolve(
          packageUrl,
          targetValue,
          subpath,
          patternMatch,
          isImports,
          conditions,
          mainFields,
          parent,
          fs
        )
      } catch (e: unknown) {
        error = e as NonNullable<typeof error>
        if (error.code !== code) throw error
      }

      if (isPromise(resolved)) {
        promise = resolved.then(curl, (e: unknown): undefined => {
          context.e = e as NodeError
          // `packageTargetResolve` is the only resolver method
          // that throws `ERR_INVALID_PACKAGE_TARGET`, so the error
          // will never be thrown by another async resolver method.
          ok(context.e.code !== code, 'did not expect invalid package target')
          throw e
        })
      } else if (resolved && !promise) {
        return resolved
      }
    }

    if (isPromise(promise)) {
      return promise.then(() => {
        // a url is always returned from `packageResolve`, the only
        // other resolver method used inside this resolver method.
        // at this point, `context.url` should always be defined
        // because `packageResolve` throws if it cannot return a url.
        return ok(context.url, 'expected `context.url`'), context.url
      })
    }

    if (error) throw error
    return null
  }

  if (typeof target === 'object') {
    // ensure `target` does not contain any numeric property keys.
    for (const key of Object.getOwnPropertyNames(target)) {
      if (isArrayIndex(key)) {
        throw new ERR_INVALID_PACKAGE_CONFIG(
          pathe.fileURLToPath(new URL('package.json', packageUrl)),
          parent,
          '"exports" cannot contain numeric property keys'
        )
      }
    }

    conditions ??= defaultConditions
    if (Array.isArray(conditions)) conditions = new Set(conditions)

    // try resolving conditional target.
    for (const key of Object.getOwnPropertyNames(target)) {
      if (conditions.has(key as Condition) || key === 'default') {
        /**
         * The resolved package target URL.
         *
         * @var {Awaitable<URL | null | undefined>} resolved
         */
        let resolved: Awaitable<URL | null | undefined>

        resolved = packageTargetResolve(
          packageUrl,
          (target as ConditionalTargets)[key],
          subpath,
          patternMatch,
          isImports,
          conditions,
          mainFields,
          parent,
          fs
        )

        if (isPromise(resolved)) {
          promise = resolved.then(curl)
        } else if (resolved !== undefined && !promise) {
          return resolved
        }
      }
    }

    return chainOrCall(promise, () => context.url)
  }

  if (typeof target === 'string') {
    if (!target.startsWith('./')) {
      if (
        !isImports || // not internal import
        target.startsWith('../') || // out of bounds
        target.startsWith(pathe.sep) || // absolute path
        canParseUrl(target) // url
      ) {
        throw invalidPackageTarget(
          packageUrl,
          subpath,
          target,
          isImports,
          parent
        )
      }

      return packageResolve(
        typeof patternMatch === 'string'
          ? target.replace(chars.asterisk, patternMatch)
          : target,
        packageUrl,
        conditions,
        mainFields,
        fs
      )
    }

    ok(target.startsWith('./'), 'expected `target` to start with "./"')

    if (checkInvalidSegments(target)) {
      throw invalidPackageTarget(
        packageUrl,
        subpath,
        target,
        isImports,
        parent
      )
    }

    /**
     * The resolved URL.
     *
     * @var {URL} resolved
     */
    let resolved: URL = new URL(target, packageUrl)

    // throw if `target` resolves to module outside of package directory.
    if (!String(resolved).startsWith(String(packageUrl))) {
      throw invalidPackageTarget(packageUrl, subpath, target, isImports, parent)
    }

    // replace `chars.asterisk` in `resolved` with `patternMatch`.
    if (typeof patternMatch === 'string') {
      if (patternMatch && checkInvalidSegments(patternMatch)) {
        throw invalidSubpath(
          subpath,
          patternMatch,
          packageUrl,
          isImports,
          parent
        )
      }

      target = target.replace(chars.asterisk, patternMatch)

      ok(typeof target === 'string', 'expected string `target`')
      resolved = new URL(target, packageUrl)
    }

    return resolved
  }

  throw invalidPackageTarget(
    packageUrl,
    subpath,
    target as never,
    isImports,
    parent
  )

  /**
   * @this {void}
   *
   * @param {URL | null | undefined} url
   *  The url to handle
   * @return {undefined}
   */
  function curl(url: URL | null | undefined): undefined {
    // this function is only called when `packageResolve` returns a promise.
    // this means `url` should always be defined because `packageResolve`
    // will throw if it cannot return a url.
    ok(url instanceof URL, 'expected `url` to be a URL')
    if ('url' in context) return void url
    return context.url = url, void 0
  }
}
