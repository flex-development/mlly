/**
 * @file Internal - Resolver
 * @module mlly/internal/Resolver
 */

import type {
  PackageScope,
  ParsedModuleId,
  ParsedSubpath
} from '#src/interfaces'
import type { ModuleId } from '#src/types'
import CONDITIONS from '#src/utils/conditions'
import isExportsSugar from '#src/utils/is-exports-sugar'
import isRelativeSpecifier from '#src/utils/is-relative-specifier'
import lookupPackageScope from '#src/utils/lookup-package-scope'
import parseModuleId from '#src/utils/parse-module-id'
import parseSubpath from '#src/utils/parse-subpath'
import PATTERN_CHARACTER from '#src/utils/pattern-character'
import readPackageJson from '#src/utils/read-package-json'
import toNodeURL from '#src/utils/to-node-url'
import toURL from '#src/utils/to-url'
import {
  ERR_INVALID_MODULE_SPECIFIER,
  ERR_INVALID_PACKAGE_CONFIG,
  ERR_INVALID_PACKAGE_TARGET,
  ERR_MODULE_NOT_FOUND,
  ERR_PACKAGE_IMPORT_NOT_DEFINED,
  ERR_PACKAGE_PATH_NOT_EXPORTED,
  ERR_UNSUPPORTED_DIR_IMPORT,
  ErrorCode,
  type NodeError
} from '@flex-development/errnode'
import { isBuiltin } from '@flex-development/is-builtin'
import pathe from '@flex-development/pathe'
import type {
  Exports,
  Imports,
  ImportsKey,
  PackageJson
} from '@flex-development/pkg-types'
import { isNIL, type Nullable } from '@flex-development/tutils'
import fs from 'node:fs'
import { URL, fileURLToPath, pathToFileURL } from 'node:url'
import regexp from './escape-reg-exp'
import isArrayIndex from './is-array-index'
import isDirectory from './is-directory'
import isFile from './is-file'
import PACKAGE_NAME_REGEX from './regex-package-name'
import PACKAGE_PATH_REGEX from './regex-package-path'

/**
 * ECMAScript (ES) module resolver.
 *
 * @see https://nodejs.org/api/esm.html#resolver-algorithm
 *
 * @class
 */
class Resolver {
  /**
   * Resolves `specifier` according to the [ESM Resolver algorithm][1].
   *
   * [1]: https://nodejs.org/api/esm.html#esm_resolver_algorithm
   *
   * @public
   *
   * @param {string} specifier - Module specifier to resolve
   * @param {ModuleId} parent - URL of module to resolve from
   * @param {string?} [condition='default'] - Export condition to apply
   * @param {Set<string>?} [conditions=CONDITIONS] - Export conditions
   * @param {boolean?} [preserveSymlinks=false] - Skip resolving symlinks
   * @return {URL} Resolved module URL
   * @throws {NodeError}
   */
  public resolveModule(
    specifier: string,
    parent: ModuleId,
    condition: string = 'default',
    conditions: Set<string> = CONDITIONS,
    preserveSymlinks: boolean = false
  ): URL {
    // ensure parent is an instance of URL
    parent = toURL(parent)

    /**
     * Remote module check for {@linkcode parent}.
     *
     * @const {boolean} remote
     */
    const remote: boolean = /^https?:$/.test(parent.protocol)

    /**
     * Module resolution error.
     *
     * @var {NodeError} error
     */
    let error: NodeError = new ERR_MODULE_NOT_FOUND(
      specifier,
      remote ? parent.href : fileURLToPath(parent),
      PACKAGE_PATH_REGEX.test(specifier) ? 'package' : 'module'
    )

    /**
     * Resolved module URL.
     *
     * @var {Nullable<URL>} url
     */
    let url: Nullable<URL> = null

    // try resolving module
    try {
      switch (true) {
        case isRelativeSpecifier(specifier):
        case pathe.isAbsolute(specifier):
          url = new URL(specifier, parent)
          break
        case !remote && specifier.startsWith('#'):
          url = this.resolvePackageImport(
            specifier,
            parent,
            condition,
            conditions
          )
          break
        default:
          try {
            url = new URL(specifier)
          } catch {
            if (!remote) {
              url = this.resolvePackage(
                specifier,
                parent,
                condition,
                conditions
              )
            }
          }

          break
      }

      // finalize resolution
      if (url && url.protocol === 'file:') {
        /**
         * Absolute path to resolved module.
         *
         * @var {string} path
         */
        const path: string = fileURLToPath(url)

        // throw if resolved module is not a file
        if (!isFile(path)) {
          throw isDirectory(path)
            ? new ERR_UNSUPPORTED_DIR_IMPORT(path, fileURLToPath(parent))
            : new ERR_MODULE_NOT_FOUND(path, fileURLToPath(parent), 'module')
        }

        // resolve symlinks
        if (!preserveSymlinks) {
          // preserve fragment and query portions of module url
          const { hash, search } = url

          // remove symlinks in module url
          url = pathToFileURL(fs.realpathSync(path))

          // re-add fragment and query portions of module url
          url.hash = hash
          url.search = search
        }
      }
    } catch (e: unknown) {
      error = e as NodeError
      url = null
    }

    // throw if specifier could not be resolved
    if (!url) throw error

    return url
  }

  /**
   * Resolves a package path using a combination of the following algorithms:
   *
   * - `PACKAGE_RESOLVE`
   * - `PACKAGE_SELF_RESOLVE`
   *
   * @see https://nodejs.org/api/esm.html#resolver-algorithm-specification
   *
   * @public
   *
   * @param {string} specifier - Module specifier to resolve
   * @param {ModuleId} parent - URL of module to resolve from
   * @param {string?} [condition='default'] - Export condition to apply
   * @param {Set<string>?} [conditions=CONDITIONS] - Export conditions
   * @return {URL} Resolved package path URL
   * @throws {NodeError}
   */
  public resolvePackage(
    specifier: string,
    parent: ModuleId,
    condition: string = 'default',
    conditions: Set<string> = CONDITIONS
  ): URL {
    /**
     * Object representation of {@linkcode specifier}.
     *
     * @const {ParsedModuleId} id
     */
    const id: ParsedModuleId = parseModuleId(specifier, {
      parent,
      pkgname: !isBuiltin(specifier)
    })

    // exit early if specifier is builtin module
    if (isBuiltin(id.raw)) return new URL(toNodeURL(id.raw))

    /**
     * Directory to end package scope search.
     *
     * @const {URL} stopdir
     */
    const stopdir: URL = pathToFileURL('.' + pathe.sep)

    /**
     * Package scope lookup result.
     *
     * @var {Nullable<PackageScope>} scope
     */
    let scope: Nullable<PackageScope> = lookupPackageScope(
      parent,
      stopdir,
      specifier,
      parent
    )

    // try self resolve
    if (scope?.pkgjson.name === id.pkg && !isNIL(scope.pkgjson.exports)) {
      return this.resolvePackageExport(
        id.raw,
        scope.pkg,
        parent,
        condition,
        conditions
      )
    }

    /**
     * Resolved package path URL.
     *
     * @var {Nullable<URL>} url
     */
    let url: Nullable<URL> = null

    // reset scope to try resolving external package
    if (scope) {
      let { dir: pkgdir } = scope

      // lookup package scope for external package
      while (pkgdir !== '.') {
        scope = lookupPackageScope(
          new URL(`node_modules/${id.raw}`, pkgdir + pathe.sep),
          stopdir,
          specifier,
          parent
        )

        // stop search if package scope was found for external package
        if (scope) break

        // continue package scope search
        pkgdir = pathe.dirname(pkgdir)
      }
    }

    // try resolving external package
    switch (true) {
      case scope && !isNIL(scope.pkgjson.exports):
        url = this.resolvePackageExport(
          specifier,
          scope!.pkg,
          parent,
          condition,
          conditions
        )
        break
      case scope && id.path === '.':
        url = this.resolvePackageMain(scope!.pkg, scope!.pkgjson, parent)
        break
      case !!scope:
        url = new URL(id.path, scope!.pkg)
        break
    }

    // throw if package url was not resolved
    if (!url) throw new ERR_MODULE_NOT_FOUND(id.pkg, fileURLToPath(parent))

    return url
  }

  /**
   * Resolves a subpath export according to the `PACKAGE_EXPORTS_RESOLVE`
   * algorithm.
   *
   * @see https://nodejs.org/api/esm.html#resolver-algorithm-specification
   * @see https://nodejs.org/api/packages.html#subpath-exports
   *
   * @public
   *
   * @param {string} specifier - Module specifier containing subpath
   * @param {ModuleId} pkg - URL of relevant `package.json` file
   * @param {ModuleId} parent - URL of module to resolve from
   * @param {string?} [condition='default'] - Export condition to apply
   * @param {Set<string>?} [conditions=CONDITIONS] - Export conditions
   * @return {URL} Resolved package export URL
   * @throws {NodeError<Error | TypeError>}
   */
  public resolvePackageExport(
    specifier: string,
    pkg: ModuleId,
    parent: ModuleId,
    condition: string = 'default',
    conditions: Set<string> = CONDITIONS
  ): URL {
    /**
     * URL of directory containing `package.json` file.
     *
     * @var {URL} dir
     */
    const dir: URL = new URL('.', pkg)

    /**
     * Possible `package.json` object.
     *
     * @const {PackageJson} pkgjson
     */
    const pkgjson: Nullable<PackageJson> = readPackageJson(
      dir,
      specifier,
      parent
    )

    /**
     * Package `exports`.
     *
     * @var {Exports | undefined} exports
     */
    let exports: Exports | undefined = pkgjson?.exports

    /**
     * Object representation of package subpath.
     *
     * @const {ParsedSubpath} subpath
     */
    const subpath: ParsedSubpath = parseSubpath(specifier, exports, {
      dir,
      parent
    })

    // convert exports to object if using exports main sugar
    if (!subpath.internal && isExportsSugar(exports, pkg, parent)) {
      exports = { '.': exports } as Record<string, Exports>
    }

    /**
     * Resolved package export URL.
     *
     * @const {Nullable<URL>} url
     */
    const url: Nullable<URL> = this.resolvePackageTarget(
      dir,
      (exports as Nullable<Record<string, Exports>>)?.[subpath.key],
      subpath.base,
      subpath.key,
      parent,
      subpath.internal,
      condition,
      conditions
    )

    // throw if subpath export was not resolved
    if (!url) {
      throw new ERR_PACKAGE_PATH_NOT_EXPORTED(
        fileURLToPath(dir),
        subpath.raw,
        fileURLToPath(parent)
      )
    }

    return url
  }

  /**
   * Resolves a subpath import according to the `PACKAGE_IMPORTS_RESOLVE`
   * algorithm.
   *
   * @see https://nodejs.org/api/esm.html#resolver-algorithm-specification
   * @see https://nodejs.org/api/packages.html#subpath-imports
   *
   * @public
   *
   * @param {string} specifier - Module specifier containing subpath
   * @param {ModuleId} parent - URL of module to resolve from
   * @param {string?} [condition='default'] - Export condition to apply
   * @param {Set<string>?} [conditions=CONDITIONS] - Export conditions
   * @return {URL} Resolved package import URL
   * @throws {NodeError<Error | TypeError>}
   */
  public resolvePackageImport(
    specifier: string,
    parent: ModuleId,
    condition: string = 'default',
    conditions: Set<string> = CONDITIONS
  ): URL {
    /**
     * Parsed module id.
     *
     * Ensures {@linkcode specifier} is a valid internal specifier.
     *
     * @const {ParsedModuleId} id
     */
    const id: ParsedModuleId = parseModuleId(specifier, {
      internal: true,
      parent
    })

    /**
     * Package scope result for {@linkcode parent}.
     *
     * @const {Nullable<PackageScope>} scope
     */
    const scope: Nullable<PackageScope> = lookupPackageScope(
      parent,
      pathToFileURL('.'),
      specifier,
      parent
    )

    /**
     * Resolved package import URL.
     *
     * @var {Nullable<URL>} url
     */
    let url: Nullable<URL> = null

    // try resolving subpath import
    if (scope) {
      /**
       * Package `imports`.
       *
       * @var {Imports | undefined} imports
       */
      const imports: Imports | undefined = scope.pkgjson.imports

      /**
       * Object representation of package subpath.
       *
       * @const {ParsedSubpath} subpath
       */
      const subpath: ParsedSubpath = parseSubpath(id.raw, imports, {
        dir: scope.dir,
        internal: true,
        parent
      })

      url = this.resolvePackageTarget(
        scope.dir,
        imports?.[subpath.key as ImportsKey],
        subpath.base,
        subpath.key,
        parent,
        subpath.internal,
        condition,
        conditions
      )
    }

    // throw if subpath import was not resolved
    if (!url) {
      throw new ERR_PACKAGE_IMPORT_NOT_DEFINED(
        specifier,
        fileURLToPath(parent),
        /* c8 ignore next */ scope?.dir ? fileURLToPath(scope.dir) : undefined
      )
    }

    return url
  }

  /**
   * Resolves a package entry point using the legacy CommonJS `main` resolution
   * alogirthm:
   *
   * 1. let M = pkgdir `pkgjson.main`
   * 2. TRY(M, M.js, M.json, M.node, M/index.js, M/index.json, M/index.node)
   * 4. TRY(pkgdir/index.js, pkgdir/index.json, pkgdir/index.node)
   * 5. ERR_MODULE_NOT_FOUND
   *
   * @todo emit deprecation messages
   *
   * @public
   *
   * @param {ModuleId} pkg - URL of relevant `package.json` file
   * @param {PackageJson} pkgjson - Relevant `package.json` object
   * @param {ModuleId} parent - URL of module to resolve from
   * @return {URL} Package entry point URL
   * @throws {NodeError} If package entry point is not found
   */
  public resolvePackageMain(
    pkg: ModuleId,
    pkgjson: PackageJson,
    parent: ModuleId
  ): URL {
    /**
     * Possible inputs for package entry point URL.
     *
     * @const {string[]} tries
     */
    const tries: string[] = [
      ...(pkgjson.main
        ? [
            pkgjson.main,
            `./${pkgjson.main}.js`,
            `./${pkgjson.main}.json`,
            `./${pkgjson.main}.node`,
            `./${pkgjson.main}/index.js`,
            `./${pkgjson.main}/index.json`,
            `./${pkgjson.main}/index.node`
          ]
        : []),
      './index.js',
      './index.json',
      './index.node'
    ]

    /**
     * Package entry point URL.
     *
     * @var {Nullable<URL>} url
     */
    let url: Nullable<URL> = null

    // try resolving package entry point
    for (const input of tries) {
      if (isFile((url = new URL(input, pkg)))) break
      url = null
    }

    // throw if package entry point was not resolved
    if (!url) {
      throw new ERR_MODULE_NOT_FOUND(
        fileURLToPath(new URL('.', pkg)),
        fileURLToPath(parent)
      )
    }

    return url
  }

  /**
   * Resolves a package target according to the `PACKAGE_TARGET_RESOLVE`
   * algorithm.
   *
   * @see https://nodejs.org/api/esm.html#resolver-algorithm-specification
   *
   * @todo emit deprecation messages
   *
   * @public
   *
   * @param {ModuleId} dir - URL of directory containing relevant `package.json`
   * @param {Exports | undefined} target - Package `exports` or `imports` target
   * @param {string} subpath - Package subpath without entry prefix (`key`)
   * @param {string} key - Subpath defined in relevant `package.json` file
   * @param {ModuleId} parent - URL of module to resolve from
   * @param {boolean?} [internal=false] - Package `imports` hint
   * @param {string?} [condition='default'] - Export condition to apply
   * @param {Set<string>?} [conditions=CONDITIONS] - Export conditions
   * @return {Nullable<URL>} Resolved package target URL or `null`
   * @throws {NodeError<Error | TypeError>}
   */
  public resolvePackageTarget(
    dir: ModuleId,
    target: Exports | undefined,
    subpath: string,
    key: string,
    parent: ModuleId,
    internal: boolean = false,
    condition: string = 'default',
    conditions: Set<string> = CONDITIONS
  ): Nullable<URL> {
    /**
     * Resolved package target URL.
     *
     * @var {Nullable<URL>} url
     */
    let url: Nullable<URL> = null

    // try resolving package target
    switch (true) {
      case target === null:
        break
      case Array.isArray(target):
        /**
         * Possible package target resolution error.
         *
         * @var {NodeError | undefined} error
         */
        let error: NodeError | undefined

        // try resolving package target based on first match in target array
        for (const item of target as string[]) {
          try {
            url = this.resolvePackageTarget(
              dir,
              item,
              subpath,
              key,
              parent,
              internal,
              condition,
              conditions
            )
          } catch (e: unknown) {
            error = e as NodeError

            /* c8 ignore next */
            if (error.code !== ErrorCode.ERR_INVALID_PACKAGE_TARGET) throw error

            continue
          }

          // stop resolution attempts if target was resolved
          if (url) break
        }

        // throw if error was encountered and package target was not resolved
        if (error && !url) throw error

        break
      case typeof target === 'object':
        target = target as Record<string, Exports>

        for (const prop of Object.getOwnPropertyNames(target)) {
          // ensure prop is not an array index
          if (isArrayIndex(prop)) {
            throw new ERR_INVALID_PACKAGE_CONFIG(
              fileURLToPath(dir),
              fileURLToPath(parent),
              '"exports" cannot contain numeric property keys'
            )
          }

          // try resolving package target based on condition
          if (prop === condition || conditions.has(prop)) {
            url = this.resolvePackageTarget(
              dir,
              target[prop],
              subpath,
              key,
              parent,
              internal,
              condition,
              conditions
            )

            // stop resolution attempts if target was resolved
            if (url) break
          }
        }

        break
      case typeof target === 'string':
        target = target as string

        /**
         * Subpath pattern check.
         *
         * @const {boolean} pattern
         */
        const pattern: boolean = key.includes(PATTERN_CHARACTER)

        switch (true) {
          case subpath && !pattern && !target.endsWith(pathe.sep):
            throw new ERR_INVALID_PACKAGE_TARGET(
              fileURLToPath(dir),
              key,
              target,
              internal,
              fileURLToPath(parent)
            )
          case internal && PACKAGE_NAME_REGEX.test(target):
            url = this.resolvePackage(target, parent, condition, conditions)
            break
          case target.startsWith('.' + pathe.sep):
            /**
             * Returns a regex pattern matching invalid path segments.
             *
             * Invalid segments include:
             *
             * - `'node_modules/'` (decoded and encoded)
             *
             * @param {'deprecated'?} type - Pattern type
             * @return {RegExp} Regex pattern matching invalid path segments
             */
            const invalidSegmentRegex = (type?: 'deprecated'): RegExp => {
              return new RegExp(
                `(^|\\\\|\\/)((\\.|%2e)(\\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))${
                  type === 'deprecated' ? '' : '?'
                }(\\\\|\\/|$)`,
                'i'
              )
            }

            // check target for invalid segments
            if (invalidSegmentRegex().test(target.slice(2))) {
              if (invalidSegmentRegex('deprecated').test(target.slice(2))) {
                throw new ERR_INVALID_PACKAGE_TARGET(
                  fileURLToPath(dir),
                  key,
                  target,
                  internal,
                  fileURLToPath(parent)
                )
              }
            }

            // set resolved package target url using target
            url = new URL(
              target,
              pathToFileURL(fileURLToPath(dir).replace(/\/$/, '') + pathe.sep)
            )

            // check subpath for invalid segments
            if (subpath) {
              if (invalidSegmentRegex().test(subpath)) {
                if (invalidSegmentRegex('deprecated').test(subpath)) {
                  throw new ERR_INVALID_MODULE_SPECIFIER(
                    key.replace(PATTERN_CHARACTER, subpath),
                    [
                      `request is not a valid match in pattern "${key}" for`,
                      `the "${internal ? 'imports' : 'exports'}" resolution`,
                      `of ${fileURLToPath(dir).replace(/\/$/, '')}/package.json`
                    ].join(' '),
                    fileURLToPath(parent)
                  )
                }
              }

              // set resolved package target url using subpath
              url = new URL(
                url.href.replace(
                  new RegExp(regexp(PATTERN_CHARACTER), 'g'),
                  subpath
                )
              )
            }

            break
          default:
            throw new ERR_INVALID_PACKAGE_TARGET(
              fileURLToPath(dir),
              key,
              target,
              internal,
              fileURLToPath(parent)
            )
        }

        break
      default:
        throw new ERR_INVALID_PACKAGE_TARGET(
          fileURLToPath(dir),
          key,
          target,
          internal,
          fileURLToPath(parent)
        )
    }

    return url
  }
}

export default Resolver
