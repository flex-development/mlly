/**
 * @file resolver
 * @module mlly/lib/resolver
 */

import chars from '#internal/chars'
import checkInvalidSegments from '#internal/check-invalid-segments'
import dfs from '#internal/fs'
import invalidPackageTarget from '#internal/invalid-package-target'
import invalidSubpath from '#internal/invalid-subpath'
import canParseUrl from '#lib/can-parse-url'
import defaultConditions from '#lib/default-conditions'
import defaultMainFields from '#lib/default-main-fields'
import isArrayIndex from '#lib/is-array-index'
import isDirectory from '#lib/is-directory'
import isFile from '#lib/is-file'
import isImportsSubpath from '#lib/is-imports-subpath'
import isRelativeSpecifier from '#lib/is-relative-specifier'
import lookupPackageScope from '#lib/lookup-package-scope'
import patternMatch from '#lib/pattern-match'
import readPackageJson from '#lib/read-package-json'
import root from '#lib/root'
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
  FileSystem,
  MainField,
  ModuleId,
  PatternMatch
} from '@flex-development/mlly'
import pathe from '@flex-development/pathe'
import type {
  Condition,
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
     * Directory URL.
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
 * Resolve the [`main`][main] package entry point using the legacy CommonJS
 * resolution algorithm.
 *
 * [main]: https://github.com/nodejs/node/blob/v22.9.0/doc/api/packages.md#main
 *
 * @see {@linkcode ErrModuleNotFound}
 * @see {@linkcode FileSystem}
 * @see {@linkcode MainField}
 * @see {@linkcode ModuleId}
 * @see {@linkcode PackageJson}
 *
 * @param {ModuleId} packageUrl
 *  URL of package directory, `package.json` file, or module in the same
 *  directory as a `package.json` file
 * @param {PackageJson | null | undefined} [manifest]
 *  Package manifest
 * @param {MainField[] | Set<MainField> | null | undefined} [mainFields]
 *  List of legacy main fields
 * @param {ModuleId | null | undefined} [parent]
 *  URL of parent module
 * @param {FileSystem | null | undefined} [fs]
 *  File system API
 * @return {URL}
 *  Resolved URL
 * @throws {ErrModuleNotFound}
 */
function legacyMainResolve(
  packageUrl: ModuleId,
  manifest?: PackageJson | null | undefined,
  mainFields?: MainField[] | Set<MainField> | null | undefined,
  parent?: ModuleId | null | undefined,
  fs?: FileSystem | null | undefined
): URL {
  if (manifest) {
    for (const field of mainFields ?? defaultMainFields) {
      /**
       * Possible inputs for package entry point URL.
       *
       * @const {string[]} tries
       */
      const tries: string[] = []

      /**
       * Main field value.
       *
       * @const {JsonValue} value
       */
      const value: JsonValue | undefined = manifest[field]

      /**
       * Resolved URL.
       *
       * @var {URL | null} resolved
       */
      let resolved: URL | null = null

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

      for (const input of tries) {
        resolved = new URL(input, packageUrl)
        if (isFile(resolved, fs)) return resolved
      }
    }
  }

  throw new ERR_MODULE_NOT_FOUND(
    pathe.fileURLToPath(packageUrl),
    parent && pathe.fileURLToPath(parent)
  )
}

/**
 * Resolve a module `specifier`.
 *
 * Implements the `MODULE_RESOLVE` (`ESM_RESOLVE`) algorithm.
 *
 * @see {@linkcode Condition}
 * @see {@linkcode ErrInvalidModuleSpecifier}
 * @see {@linkcode ErrModuleNotFound}
 * @see {@linkcode ErrUnsupportedDirImport}
 * @see {@linkcode FileSystem}
 * @see {@linkcode ModuleId}
 * @see https://github.com/nodejs/node/blob/v22.9.0/doc/api/esm.md#resolution-algorithm
 *
 * @param {string} specifier
 *  Module specifier to resolve
 * @param {ModuleId} parent
 *  URL of parent module
 * @param {Condition[] | Set<Condition> | null | undefined} [conditions]
 *  List of export/import conditions
 * @param {MainField[] | Set<MainField> | null | undefined} [mainFields]
 *  List of legacy main fields
 * @param {boolean | null | undefined} [preserveSymlinks]
 *  Keep symlinks instead of resolving them
 * @param {FileSystem | null | undefined} [fs]
 *  File system API
 * @return {URL}
 *  Resolved URL
 * @throws {ErrInvalidModuleSpecifier}
 * @throws {ErrModuleNotFound}
 * @throws {ErrUnsupportedDirImport}
 */
function moduleResolve(
  specifier: string,
  parent: ModuleId,
  conditions?: Condition[] | Set<Condition> | null | undefined,
  mainFields?: MainField[] | Set<MainField> | null | undefined,
  preserveSymlinks?: boolean | null | undefined,
  fs?: FileSystem | null | undefined
): URL {
  /**
   * URL protocol of parent module.
   *
   * @const {string} protocol
   */
  const protocol: string = typeof parent === 'string'
    ? parent.slice(0, parent.indexOf(':') + 1)
    : parent.protocol

  /**
   * Resolved URL.
   *
   * @var {URL} resolved
   */
  let resolved: URL

  if (pathe.isAbsolute(specifier) || isRelativeSpecifier(specifier)) {
    try {
      resolved = new URL(specifier, parent)
    } catch (e: unknown) {
      /**
       * Node error.
       *
       * @var {ErrUnsupportedResolveRequest} error
       */
      let error: ErrUnsupportedResolveRequest

      error = new ERR_UNSUPPORTED_RESOLVE_REQUEST(String(specifier), parent)
      error.cause = e

      throw error
    }
  } else if (protocol === 'file:' && isImportsSubpath(specifier)) {
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
      if (protocol === 'data:' && !isBuiltin(specifier)) {
        /**
         * Node error.
         *
         * @var {ErrUnsupportedResolveRequest} error
         */
        let error: ErrUnsupportedResolveRequest

        error = new ERR_UNSUPPORTED_RESOLVE_REQUEST(String(specifier), parent)
        error.cause = e

        throw error
      }

      resolved = packageResolve(
        specifier,
        parent,
        conditions,
        mainFields,
        fs
      )
    }
  }

  ok(resolved, 'expected `resolved` to be a URL')

  if (resolved.protocol === 'file:') {
    const { hash, pathname, search } = resolved

    if (/%2f|%5c/i.test(pathname)) {
      throw new ERR_INVALID_MODULE_SPECIFIER(
        pathname,
        'must not include encoded "/" or "\\" characters',
        pathe.fileURLToPath(parent)
      )
    }

    if (isDirectory(resolved, fs)) {
      /**
       * Node error.
       *
       * @var {ErrUnsupportedDirImport} error
       */
      let error: ErrUnsupportedDirImport

      error = new ERR_UNSUPPORTED_DIR_IMPORT(
        pathname,
        pathe.fileURLToPath(parent)
      )

      error.url = String(resolved)

      throw error
    }

    if (!isFile(resolved, fs)) {
      throw new ERR_MODULE_NOT_FOUND(
        pathname,
        pathe.fileURLToPath(parent),
        resolved
      )
    }

    if (!preserveSymlinks) {
      fs ??= dfs
      resolved = new URL(pathe.pathToFileURL(fs.realpathSync(resolved)))
      resolved.hash = hash
      resolved.search = search
    }
  }

  return resolved
}

/**
 * Resolve a package export.
 *
 * Implements the `PACKAGE_EXPORTS_RESOLVE` algorithm.
 *
 * @see {@linkcode Condition}
 * @see {@linkcode ErrInvalidPackageConfig}
 * @see {@linkcode ErrPackagePathNotExported}
 * @see {@linkcode Exports}
 * @see {@linkcode FileSystem}
 * @see {@linkcode Imports}
 * @see {@linkcode ModuleId}
 * @see https://github.com/nodejs/node/blob/v22.9.0/doc/api/esm.md#resolution-algorithm
 *
 * @param {ModuleId} packageUrl
 *  URL of package directory, `package.json` file, or module in the same
 *  directory as a `package.json` file
 * @param {string} subpath
 *  Package subpath to resolve
 * @param {Exports | undefined} exports
 *  Package exports
 * @param {Condition[] | Set<Condition> | null | undefined} [conditions]
 *  List of export/import conditions
 * @param {ModuleId | null | undefined} [parent]
 *  URL of parent module
 * @param {FileSystem | null | undefined} [fs]
 *  File system API
 * @return {URL}
 *  Resolved URL
 * @throws {ErrInvalidPackageConfig}
 * @throws {ErrPackagePathNotExported}
 */
function packageExportsResolve(
  packageUrl: ModuleId,
  subpath: string,
  exports: Exports | undefined,
  conditions?: Condition[] | Set<Condition> | null | undefined,
  parent?: ModuleId | null | undefined,
  fs?: FileSystem | null | undefined
): URL {
  if (exports) {
    /**
     * Boolean indicating all {@linkcode exports} object keys must start with a
     * dot character (`'.'`).
     *
     * @var {boolean} dot
     */
    let dot: boolean = false

    if (!Array.isArray(exports) && typeof exports === 'object') {
      for (const [i, key] of Object.getOwnPropertyNames(exports).entries()) {
        /**
         * Boolean indicating the current {@linkcode exports} key starts with a
         * dot character (`'.'`).
         *
         * @var {boolean} dotStart
         */
        let dotStart: boolean = key[0] === pathe.dot

        if (i === 0) {
          dot = dotStart
          continue
        }

        // throw if keys of `exports` are not all conditions or all subpaths
        if (dot !== dotStart) {
          throw new ERR_INVALID_PACKAGE_CONFIG(
            pathe.fileURLToPath(new URL('package.json', packageUrl)),
            parent,
            '"exports" cannot contain some keys starting' +
              ' starting with \'.\' and some not.' +
              ' The exports object must either be an object of package subpath keys or an object of main entry condition name keys only.'
          )
        }
      }
    }

    /**
     * Resolved package export URL.
     *
     * @var {URL | null | undefined} resolved
     */
    let resolved: URL | null | undefined = null

    if (subpath === pathe.dot) {
      /**
       * Main package target.
       *
       * @var {Exports | undefined} mainExport
       */
      let mainExport: Exports | undefined

      if (Array.isArray(exports) || typeof exports === 'string' || !dot) {
        mainExport = exports
      } else if (Object.prototype.hasOwnProperty.call(exports, subpath)) {
        mainExport = exports[pathe.dot]
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
    } else if (typeof exports === 'object' && dot) {
      ok(!Array.isArray(exports), 'expected `exports` to not be an array')
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
 * @see {@linkcode Condition}
 * @see {@linkcode ExportsObject}
 * @see {@linkcode FileSystem}
 * @see {@linkcode Imports}
 * @see {@linkcode ModuleId}
 * @see https://github.com/nodejs/node/blob/v22.9.0/doc/api/esm.md#resolution-algorithm
 *
 * @param {string} matchKey
 *  Package subpath from module specifier or dot character (`'.'`)
 * @param {ExportsObject | Imports | null | undefined} matchObject
 *  Package exports object or imports
 * @param {ModuleId} packageUrl
 *  URL of directory containing `package.json` file
 * @param {boolean | null | undefined} [isImports]
 *  Whether `matchObject` is internal to the package
 * @param {Condition[] | Set<Condition> | null | undefined} [conditions]
 *  List of export/import conditions
 * @param {MainField[] | Set<MainField> | null | undefined} [mainFields]
 *  List of legacy main fields
 * @param {ModuleId | null | undefined} [parent]
 *  URL of parent module
 * @param {FileSystem | null | undefined} [fs]
 *  File system API
 * @return {URL | null | undefined}
 *  Resolved URL
 */
function packageImportsExportsResolve(
  matchKey: string,
  matchObject: ExportsObject | Imports | null | undefined,
  packageUrl: ModuleId,
  isImports?: boolean | null | undefined,
  conditions?: Condition[] | Set<Condition> | null | undefined,
  mainFields?: MainField[] | Set<MainField> | null | undefined,
  parent?: ModuleId | null | undefined,
  fs?: FileSystem | null | undefined
): URL | null | undefined {
  if (typeof matchObject === 'object' && matchObject) {
    /**
     * List containing expansion key and subpath pattern match.
     *
     * @const {PatternMatch | null} match
     */
    const match: PatternMatch | null = patternMatch(matchKey, matchObject)

    if (match) {
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
  }

  return null
}

/**
 * Resolve a package import.
 *
 * Implements the `PACKAGE_IMPORTS_RESOLVE` algorithm.
 *
 * @see {@linkcode Condition}
 * @see {@linkcode ErrInvalidModuleSpecifier}
 * @see {@linkcode ErrPackageImportNotDefined}
 * @see {@linkcode FileSystem}
 * @see {@linkcode ModuleId}
 * @see https://github.com/nodejs/node/blob/v22.9.0/doc/api/esm.md#resolution-algorithm
 *
 * @param {string} specifier
 *  The import specifier to resolve
 * @param {ModuleId} parent
 *  URL of parent module
 * @param {Condition[] | Set<Condition> | null | undefined} [conditions]
 *  List of export/import conditions
 * @param {MainField[] | Set<MainField> | null | undefined} [mainFields]
 *  List of legacy main fields
 * @param {FileSystem | null | undefined} [fs]
 *  File system API
 * @return {URL}
 *  Resolved URL
 * @throws {ErrInvalidModuleSpecifier}
 * @throws {ErrPackageImportNotDefined}
 */
function packageImportsResolve(
  specifier: string,
  parent: ModuleId,
  conditions?: Condition[] | Set<Condition> | null | undefined,
  mainFields?: MainField[] | Set<MainField> | null | undefined,
  fs?: FileSystem | null | undefined
): URL {
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
   * URL of directory containing `package.json` file.
   *
   * @const {URL | null} packageUrl
   */
  const packageUrl: URL | null = lookupPackageScope(parent, null, fs)

  if (packageUrl) {
    /**
     * Package manifest.
     *
     * @const {PackageJson | null} pjson
     */
    const pjson: PackageJson | null = readPackageJson(
      packageUrl,
      specifier,
      parent,
      fs
    )

    if (pjson) {
      /**
       * Resolved package import URL.
       *
       * @const {URL | null | undefined} resolved
       */
      const resolved: URL | null | undefined = packageImportsExportsResolve(
        specifier,
        pjson.imports,
        packageUrl,
        true,
        conditions,
        mainFields,
        parent,
        fs
      )

      if (resolved) return resolved
    }
  }

  throw new ERR_PACKAGE_IMPORT_NOT_DEFINED(
    specifier,
    packageUrl && pathe.fileURLToPath(packageUrl),
    pathe.fileURLToPath(parent)
  )
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
 * [exports]: https://nodejs.org/api/packages.html#exports
 *
 * @see {@linkcode Condition}
 * @see {@linkcode ErrInvalidModuleSpecifier}
 * @see {@linkcode ErrModuleNotFound}
 * @see {@linkcode FileSystem}
 * @see {@linkcode MainField}
 * @see {@linkcode ModuleId}
 * @see https://github.com/nodejs/node/blob/v22.9.0/doc/api/esm.md#resolution-algorithm
 *
 * @param {string} specifier
 *  The package specifier to resolve
 * @param {ModuleId} parent
 *  Id of module to resolve `packageSpecifier` against
 * @param {Condition[] | Set<Condition> | null | undefined} [conditions]
 *  List of export/import conditions
 * @param {MainField[] | Set<MainField> | null | undefined} [mainFields]
 *  List of legacy main fields
 * @param {FileSystem | null | undefined} [fs]
 *  File system API
 * @return {URL}
 *  Resolved URL
 * @throws {ErrInvalidModuleSpecifier}
 * @throws {ErrModuleNotFound}
 */
function packageResolve(
  specifier: string,
  parent: ModuleId,
  conditions?: Condition[] | Set<Condition> | null | undefined,
  mainFields?: MainField[] | Set<MainField> | null | undefined,
  fs?: FileSystem | null | undefined
): URL {
  if (isBuiltin(specifier)) {
    return new URL('node:' + specifier.replace(/^node:/, ''))
  }

  /**
   * Index of separator in {@linkcode specifier}.
   *
   * @var {number} separatorIndex
   */
  let separatorIndex: number = -1

  /**
   * Boolean indicating valid package name.
   *
   * @var {boolean} validPackageName
   */
  let valid: boolean = !!specifier

  if (specifier) {
    separatorIndex = specifier.indexOf(pathe.sep)

    if (specifier[0] === chars.at) {
      if (separatorIndex === -1) {
        valid = false
      } else {
        separatorIndex = specifier.indexOf(pathe.sep, separatorIndex + 1)
      }
    }
  }

  /**
   * Package name.
   *
   * @const {string} packageName
   */
  const packageName: string = separatorIndex === -1
    ? specifier
    : specifier.slice(0, separatorIndex)

  // package names cannot start with dot characters.
  // they also cannot contain percent-encoding or \\ (`\`) separators.
  if (/^\.|%|\\/.exec(packageName) !== null) valid = false

  // throw on invalid package name
  if (!valid) {
    throw new ERR_INVALID_MODULE_SPECIFIER(
      specifier,
      'is not a valid package name',
      parent
    )
  }

  /**
   * Package subpath.
   *
   * @const {string} packageSubpath
   */
  const packageSubpath: string = pathe.dot + (separatorIndex === -1
    ? chars.empty
    : specifier.slice(separatorIndex))

  /**
   * Resolved self-import URL.
   *
   * @const {URL | undefined} selfUrl
   */
  const selfUrl: URL | undefined = packageSelfResolve(
    packageName,
    packageSubpath,
    parent,
    conditions,
    fs
  )

  if (selfUrl) return selfUrl

  /**
   * URL of parent module.
   *
   * @var {URL} parentUrl
   */
  let parentUrl: URL = new URL(parent)

  while (String(parentUrl) !== String(root)) {
    /**
     * URL of package directory.
     *
     * @var {URL} packageUrl
     */
    let packageUrl: URL = new URL(`node_modules/${packageName}/`, parentUrl)

    // set parentUrl to the parent folder URL of parentUrl
    parentUrl = new URL(pathe.dirname(parentUrl.href) + pathe.sep)

    // continue if the folder at packageUrl does not exist
    if (!isDirectory(packageUrl, fs)) continue

    /**
     * Package manifest.
     *
     * @const {PackageJson | null} pjson
     */
    const pjson: PackageJson | null = readPackageJson(
      packageUrl,
      null,
      parent,
      fs
    )

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

    if (packageSubpath === pathe.dot) {
      return legacyMainResolve(packageUrl, pjson, mainFields, parent, fs)
    }

    return new URL(packageSubpath, packageUrl)
  }

  throw new ERR_MODULE_NOT_FOUND(packageName, pathe.fileURLToPath(parent))
}

/**
 * Resolve the self-import of a package.
 *
 * Implements the `PACKAGE_SELF_RESOLVE` algorithm.
 *
 * @see {@linkcode Condition}
 * @see {@linkcode FileSystem}
 * @see {@linkcode ModuleId}
 * @see https://github.com/nodejs/node/blob/v22.9.0/doc/api/esm.md#resolution-algorithm
 *
 * @param {string} name
 *  Package name
 * @param {string} subpath
 *  Package subpath
 * @param {ModuleId} parent
 *  URL of parent module
 * @param {Condition[] | Set<Condition> | null | undefined} [conditions]
 *  List of export conditions
 * @param {FileSystem | null | undefined} [fs]
 *  File system API
 * @return {URL | undefined}
 *  Resolved URL
 */
function packageSelfResolve(
  name: string,
  subpath: string,
  parent: ModuleId,
  conditions?: Condition[] | Set<Condition> | null | undefined,
  fs?: FileSystem | null | undefined
): URL | undefined {
  /**
   * URL of package directory.
   *
   * @const {URL | null} packageUrl
   */
  const packageUrl: URL | null = lookupPackageScope(parent, null, fs)

  if (packageUrl) {
    /**
     * Package manifest.
     *
     * @const {PackageJson | null} pjson
     */
    const pjson: PackageJson | null = readPackageJson(
      packageUrl,
      null,
      parent,
      fs
    )

    if (pjson?.exports && name === pjson.name) {
      return packageExportsResolve(
        packageUrl,
        subpath,
        pjson.exports,
        conditions,
        parent,
        fs
      )
    }
  }

  return undefined
}

/**
 * Resolve a package target.
 *
 * Implements the `PACKAGE_TARGET_RESOLVE` algorithm.
 *
 * @see {@linkcode Condition}
 * @see {@linkcode ErrInvalidPackageConfig}
 * @see {@linkcode ErrInvalidPackageTarget}
 * @see {@linkcode FileSystem}
 * @see {@linkcode ModuleId}
 * @see {@linkcode Target}
 * @see https://github.com/nodejs/node/blob/v22.9.0/doc/api/esm.md#resolution-algorithm
 *
 * @param {ModuleId} packageUrl
 *  URL of directory containing `package.json` file
 * @param {unknown} target
 *  The package target to resolve
 * @param {string} subpath
 *  Package subpath (key of `exports`/`imports`)
 * @param {string | null | undefined} [patternMatch]
 *  Subpath pattern match
 * @param {boolean | null | undefined} [isImports]
 *  Whether `target` is internal to the package
 * @param {Condition[] | Set<Condition> | null | undefined} [conditions]
 *  List of export/import conditions
 * @param {MainField[] | Set<MainField> | null | undefined} [mainFields]
 *  List of legacy main fields
 * @param {ModuleId | null | undefined} [parent]
 *  URL of parent module
 * @param {FileSystem | null | undefined} [fs]
 *  File system API
 * @return {URL | null | undefined}
 *  Resolved URL
 * @throws {ErrInvalidPackageConfig}
 * @throws {ErrInvalidPackageTarget}
 */
function packageTargetResolve(
  packageUrl: ModuleId,
  target: unknown,
  subpath: string,
  patternMatch?: string | null | undefined,
  isImports?: boolean | null | undefined,
  conditions?: Condition[] | Set<Condition> | null | undefined,
  mainFields?: MainField[] | Set<MainField> | null | undefined,
  parent?: ModuleId | null | undefined,
  fs?: FileSystem | null | undefined
): URL | null | undefined {
  if (typeof target === 'string') {
    if (!target.startsWith(pathe.dot + pathe.sep)) {
      if (
        !isImports ||
        target.startsWith(pathe.dot + pathe.dot + pathe.sep) ||
        target.startsWith(pathe.sep) ||
        canParseUrl(target)
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

    ok(
      target.startsWith(pathe.dot + pathe.sep),
      'expected `target` to start with "./"'
    )

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
     * Resolved target URL.
     *
     * @var {URL} resolved
     */
    let resolved: URL = new URL(target, packageUrl)

    // throw if `target` resolves to module outside of package directory
    if (!String(resolved).startsWith(String(packageUrl))) {
      throw invalidPackageTarget(packageUrl, subpath, target, isImports, parent)
    }

    // replace `chars.asterisk` in `resolved` with `patternMatch`
    if (patternMatch) {
      if (checkInvalidSegments(patternMatch)) {
        throw invalidSubpath(
          subpath,
          patternMatch,
          packageUrl,
          isImports,
          parent
        )
      }

      resolved = new URL(
        target.replace(chars.asterisk, patternMatch),
        packageUrl
      )
    }

    return resolved
  }

  if (Array.isArray<TargetList[number]>(target)) {
    if (target.length) {
      /**
       * Last node error.
       *
       * @var {NodeError | null} error
       */
      let error!: NodeError | null

      for (const targetValue of target) {
        /**
         * Resolved package target URL.
         *
         * @var {URL | null | undefined} resolved
         */
        let resolved: URL | null | undefined

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
          if (error.code !== codes.ERR_INVALID_PACKAGE_TARGET) throw error
        }

        if (resolved) return resolved
      }

      if (error) throw error
    }

    return null
  }

  if (typeof target === 'object' && target) {
    // ensure `exports` does not contain any numeric property keys.
    for (const key of Object.getOwnPropertyNames(target)) {
      if (isArrayIndex(key)) {
        throw new ERR_INVALID_PACKAGE_CONFIG(
          pathe.fileURLToPath(new URL('package.json', packageUrl)),
          parent,
          '"exports" cannot contain numeric property keys'
        )
      }
    }

    if (!conditions) conditions = defaultConditions
    if (Array.isArray(conditions)) conditions = new Set(conditions)

    // try resolving conditional target.
    for (const key of Object.getOwnPropertyNames(target)) {
      if (conditions.has(key as Condition) || key === 'default') {
        /**
         * Resolved package target URL.
         *
         * @const {URL | null | undefined} resolved
         */
        const resolved: URL | null | undefined = packageTargetResolve(
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

        if (resolved !== undefined) return resolved
      }
    }

    return undefined
  }

  if (target === null) return null

  throw invalidPackageTarget(
    packageUrl,
    subpath,
    target as never,
    isImports,
    parent
  )
}
