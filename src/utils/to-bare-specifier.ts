/**
 * @file toBareSpecifier
 * @module mlly/utils/toBareSpecifier
 */

import type { PackageScope, ParsedModuleId } from '#src/interfaces'
import regexp from '#src/internal/escape-reg-exp'
import validateURLString from '#src/internal/validate-url-string'
import type { ModuleId } from '#src/types'
import {
  ERR_OPERATION_FAILED,
  ERR_PACKAGE_PATH_NOT_EXPORTED,
  ErrorCode,
  type NodeError
} from '@flex-development/errnode'
import isBuiltin from '@flex-development/is-builtin'
import { isNIL, type Nullable } from '@flex-development/tutils'
import { URL, fileURLToPath, pathToFileURL } from 'node:url'
import CONDITIONS from './conditions'
import findSubpath from './find-subpath'
import isAbsoluteSpecifier from './is-absolute-specifier'
import isRelativeSpecifier from './is-relative-specifier'
import lookupPackageScope from './lookup-package-scope'
import parseModuleId from './parse-module-id'
import parseSubpath from './parse-subpath'
import toAbsoluteSpecifier from './to-absolute-specifier'
import toNodeURL from './to-node-url'
import toURL from './to-url'

/**
 * Converts the given module `specifier` into a bare specifier.
 *
 * The new specifier is **not** guaranteed to resolve to an existing module, nor
 * is it guaranteed to have a file extension, but it *is* guaranteed to be a
 * package path containing a valid [subpath export][1] if the specifier's parent
 * package uses package [`exports`][2]. If the parent package does not use
 * `exports`, the new specifier is only guaranteed to begin with a valid NPM
 * package name or Node.js [builtin module][3] name.
 *
 * The given module `specifier` should be absolute, syntactically bare (i.e. not
 * begin with `'/'` or `'.'`), or relative to the current working directory
 * (e.g. `'./dist/index.mjs'`).
 *
 * ::: warning
 * Internal specifier (i.e. [subpath import][4]; `'#src'`, `'#src/utils'`)
 * conversion is not supported. Converting *_to_* an internal specifier will be
 * supported in the future.
 * :::
 *
 * [1]: https://nodejs.org/api/packages.html#subpath-exports
 * [2]: https://nodejs.org/api/packages.html#exports
 * [3]: https://nodejs.org/api/module.html#modulebuiltinmodules
 * [4]: https://nodejs.org/api/packages.html#subpath-imports
 *
 * @see {@linkcode CONDITIONS}
 * @see {@linkcode ModuleId}
 * @see https://nodejs.org/api/esm.html#terminology
 *
 * @param {ModuleId} specifier - Module specifier to convert
 * @param {ModuleId} parent - URL of module to resolve from
 * @param {Set<string>?} [conditions=CONDITIONS] - Export conditions
 * @return {string} `specifier` as bare specifier
 * @throws {NodeError}
 */
const toBareSpecifier = (
  specifier: ModuleId,
  parent: ModuleId,
  conditions: Set<string> = CONDITIONS
): string => {
  validateURLString(specifier, 'specifier')
  validateURLString(parent, 'parent')

  // ensure specifier is a string
  if (specifier instanceof URL) specifier = specifier.href

  // ensure specifier is a path
  if (specifier.startsWith('file:')) specifier = fileURLToPath(specifier)

  // exit early if specifier begins with builtin module name
  if (isBuiltin(specifier)) return toNodeURL(specifier)

  // convert relative specifiers to absolute paths
  if (isRelativeSpecifier(specifier)) {
    specifier = fileURLToPath(toAbsoluteSpecifier(specifier))
  }

  /**
   * Location to begin package scope search for {@linkcode specifier}.
   *
   * @const {URL} url
   */
  const url: URL = toURL(
    isAbsoluteSpecifier(specifier) || specifier.startsWith('node_modules')
      ? specifier
      : `node_modules/${specifier}`
  )

  /**
   * Package scope result for {@linkcode specifier}.
   *
   * @const {Nullable<PackageScope>} scope
   */
  const scope: Nullable<PackageScope> = lookupPackageScope(
    url,
    pathToFileURL('.')
  )

  // throw if package scope was not found
  if (!scope) {
    throw new ERR_OPERATION_FAILED(`Package scope for '${specifier}' not found`)
  }

  // get directory containing package.json file and package.json object
  const { dir: pkgdir, pkgjson } = scope

  // get package exports and name
  const { exports, main, name = '', types } = pkgjson

  // convert specifier to bare specifier
  specifier = url.pathname.includes(name)
    ? name + url.pathname.replace(new RegExp(`.*${regexp(name)}`), '')
    : name + specifier.replace(fileURLToPath(pkgdir.replace(/\/$/, '')), '')

  /**
   * Parsed module specifier.
   *
   * Ensures {@linkcode specifier} has become a bare specifier.
   *
   * @const {ParsedModuleId} id
   */
  const id: ParsedModuleId = parseModuleId(specifier, {
    internal: false,
    parent,
    pkgname: true
  })

  // exit early if subpath does not need to be validated
  if (isNIL(exports)) {
    return [main, types].some(ep => ep === id.path || ep === id.path.slice(2))
      ? id.pkg
      : specifier
  }

  // check if specifier contains valid subpath export
  try {
    parseSubpath(specifier, exports, { dir: pkgdir, parent })
  } catch (e: unknown) {
    // try finding defined subpath if specifier is invalid package path
    if ((e as NodeError).code === ErrorCode.ERR_PACKAGE_PATH_NOT_EXPORTED) {
      /**
       * Package target to find defined subpath for.
       *
       * @const {string} target
       */
      const target: string = specifier.replace(name, '.')

      /**
       * Subpath in {@linkcode exports} thats maps to {@linkcode target}, if any
       * at all.
       *
       * @var {Nullable<string>} subpath
       */
      let subpath: Nullable<string> = findSubpath(target, exports, {
        conditions,
        dir: pkgdir,
        parent
      })

      // throw if target was not matched to a subpath
      if (subpath === null) {
        throw new ERR_PACKAGE_PATH_NOT_EXPORTED(
          fileURLToPath(pkgdir),
          id.path,
          fileURLToPath(parent)
        )
      }

      if (subpath.includes('*')) {
        subpath = subpath.slice(0, subpath.indexOf('*')).slice(1)
        subpath = '.' + target.slice(target.indexOf(subpath))
      }

      return name + subpath.slice(1)
    } /* c8 ignore next 3 */
    // throw original error if package path error is not encountered
    throw e
  }

  return specifier
}

export default toBareSpecifier
