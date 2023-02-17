/**
 * @file parseModuleId
 * @module mlly/lib/parseModuleId
 */

import type { ParseModuleIdOptions, ParsedModuleId } from '#src/interfaces'
import ENCODED_SEP_REGEX from '#src/internal/regex-encoded-sep'
import INTERNAL_SPECIFIER_REGEX from '#src/internal/regex-internal-specifier'
import PACKAGE_PATH_REGEX from '#src/internal/regex-package-path'
import validateBoolean from '#src/internal/validate-boolean'
import validateURLString from '#src/internal/validate-url-string'
import type { ModuleId } from '#src/types'
import {
  ERR_INVALID_MODULE_SPECIFIER,
  type NodeError
} from '@flex-development/errnode'
import { isBuiltin } from '@flex-development/is-builtin'
import pathe from '@flex-development/pathe'
import { URL, fileURLToPath } from 'node:url'
import isBareSpecifier from './is-bare-specifier'
import isRelativeSpecifier from './is-relative-specifier'
import toNodeURL from './to-node-url'

/**
 * Creates an object representation the given module `id`.
 *
 * @see {@linkcode ModuleId}
 * @see {@linkcode ParseModuleIdOptions}
 * @see {@linkcode ParsedModuleId}
 *
 * @param {ModuleId} id - Module id to parse
 * @param {ParseModuleIdOptions?} [options={}] - Parsing options
 * @return {ParsedModuleId} Object representing `id`
 * @throws {NodeError<TypeError>}
 */
const parseModuleId = (
  id: ModuleId,
  options: ParseModuleIdOptions = {}
): ParsedModuleId => {
  const {
    internal = id instanceof URL ? false : id.startsWith('#'),
    pkgname = false
  } = options

  // ensure id is an instance of URL or a string
  validateURLString(id, 'id')

  // ensure option schemas
  validateBoolean(internal, 'options.internal')
  validateBoolean(pkgname, 'options.pkgname')

  // ensure id a string without leading and trailing spaces
  id = id instanceof URL ? id.href : id.trim()

  /**
   * Reason for [`ERR_INVALID_MODULE_SPECIFIER`][1], if any.
   *
   * [1]: https://nodejs.org/api/errors.html#err_invalid_module_specifier
   *
   * @const {string | undefined} error
   */
  let error: string | undefined

  /**
   * Object representing `id`.
   *
   * @var {ParsedModuleId} parsed
   */
  let parsed: ParsedModuleId = {
    internal: false,
    path: id,
    pkg: '',
    protocol: '',
    raw: id,
    scope: '',
    version: '',
    version_prefix: ''
  }

  // try parsing module id
  switch (true) {
    case ENCODED_SEP_REGEX.test(id):
      error = `must not include encoded '${pathe.sep}' or '\\' characters`
      break
    case isBuiltin(id):
      const { href, protocol, pathname } = new URL(toNodeURL(id))

      parsed = {
        internal: false,
        path: pathname.replace(/^\S+?(?=\/|$)/, ''),
        pkg: href.replace(/\/.*$/, ''),
        protocol: id.startsWith('node:') ? protocol : '',
        raw: id,
        scope: '',
        version: '',
        version_prefix: ''
      }

      break
    case INTERNAL_SPECIFIER_REGEX.test(id):
      const [, root = ''] = INTERNAL_SPECIFIER_REGEX.exec(id)!

      parsed = {
        internal: true,
        path: id,
        pkg: root,
        protocol: '',
        raw: id,
        scope: '',
        version: '',
        version_prefix: ''
      }

      break
    case PACKAGE_PATH_REGEX.test(id):
      const [
        ,
        pkg = '',
        scope = '',
        version_prefix = '',
        version = '',
        subpath = ''
      ] = PACKAGE_PATH_REGEX.exec(id)!

      parsed = {
        internal: false,
        path: '.' + subpath,
        pkg,
        protocol: '',
        raw: id,
        scope,
        version,
        version_prefix
      }

      break
    case /^[\w-]{2,}:/.test(id):
      try {
        const { host, protocol, pathname } = new URL(id)

        parsed = {
          internal: false,
          path: host + pathname,
          pkg: '',
          protocol,
          raw: id,
          scope: '',
          version: '',
          version_prefix: ''
        }
      } catch {
        error = 'is not a valid URL'
      }

      break
    case isBareSpecifier(id as string):
    case isRelativeSpecifier(id as string):
    case pathe.isAbsolute(id):
      break
    default:
      error = ''
      break
  }

  // reset error reason
  error = ENCODED_SEP_REGEX.test(id)
    ? error
    : internal && !INTERNAL_SPECIFIER_REGEX.test(id)
    ? 'is not a valid internal imports specifier name'
    : pkgname && !PACKAGE_PATH_REGEX.test(id)
    ? 'does not start with a valid package name'
    : error

  // throw if module specifier is invalid
  if (error !== undefined) {
    let { parent } = options

    if (parent !== undefined) {
      validateURLString(parent, 'options.parent')
      parent = fileURLToPath(parent)
    }

    throw new ERR_INVALID_MODULE_SPECIFIER(id, error, parent)
  }

  return parsed
}

export default parseModuleId
