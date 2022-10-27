/**
 * @file toBareSpecifier
 * @module mlly/lib/toBareSpecifier
 */

import { CONDITIONS } from '#src/constants'
import type { ResolveOptions } from '#src/interfaces'
import isBuiltin from '@flex-development/is-builtin'
import { isNIL, type Nullable } from '@flex-development/tutils'
import type { ErrnoException } from 'import-meta-resolve'
import { codes as errors } from 'import-meta-resolve/lib/errors'
import {
  findEntryInExports,
  findPathInExports,
  parseModuleId
} from 'node-package-exports'
import { fileURLToPath, URL } from 'node:url'
import { readPackageUp, type PackageJson, type ReadResult } from 'read-pkg-up'
import upath from 'upath'

/**
 * Converts `specifier` into a bare specifier.
 *
 * ::: info
 * The returned specifier will only include a file extension if the original
 * specifier includes an extension.
 * :::
 *
 * @see https://nodejs.org/api/esm.html#terminology
 * @see {@link ErrnoException}
 *
 * @async
 *
 * @param {URL | string} specifier - File url or path to convert
 * @param {ResolveOptions['conditions']} [conditions=CONDITIONS] - Conditions
 * @return {string} `specifier` as bare specifier
 * @throws {ErrnoException}
 */
const toBareSpecifier = async (
  specifier: URL | string,
  conditions: ResolveOptions['conditions'] = CONDITIONS
): Promise<string> => {
  // convert file url object to file url string
  if (specifier instanceof URL) specifier = specifier.href

  // convert file url string to path
  if (specifier.startsWith('file:')) specifier = fileURLToPath(specifier)

  // exit early if specifier is node builtin
  if (isBuiltin(specifier)) return specifier

  /**
   * `package.json` search result.
   *
   * @const {ReadResult | undefined} pkg
   */
  const pkg: ReadResult | undefined = await readPackageUp({
    cwd: specifier,
    normalize: false
  })

  // throw error if corresponding package.json not found
  if (!pkg) {
    /**
     * `package.json` search error cause.
     *
     * @const {string} pkgerror
     */
    const pkgerror: string = '- package.json not found'

    throw new errors.ERR_INVALID_PACKAGE_CONFIG(pkgerror, `'${specifier}'`, '')
  }

  /**
   * Normalizes `p` by adding a leading `./` and removing the file extension.
   *
   * @param {string} p -  Path to evaluate
   * @return {string} `p` normalized
   */
  const normalize = (p: string): string => {
    return upath
      .format({
        base: '',
        dir: upath.dirname(p),
        ext: '',
        name: upath.basename(p, upath.extname(p)),
        root: ''
      })
      .replace(/^(\w)/, './$1')
  }

  // parse bare specifier
  const {
    name,
    path,
    raw: bare
  } = parseModuleId(specifier.replace(/.*node_modules\//, ''))

  // return package name without scope if @types is detected
  if (name.startsWith('@types')) return name.replace(/^@types\/(\w+)$/g, '$1')

  // get package exports
  const { exports }: PackageJson = pkg.packageJson

  // check package name + main and types entry points if no exports
  if (isNIL(exports)) {
    // get entry points
    const { main = '', types = '' }: PackageJson = pkg.packageJson

    // return package name if specifier is package name or entry point
    if (bare === name || path === main || path === types) return name

    // return package name if specifier is entry point without file extension
    if ([normalize(main), normalize(types)].includes(normalize(path))) {
      return name
    }

    return bare
  }

  // return package name if specifier is exports
  if (path === findEntryInExports(exports, [...conditions])) return name

  // parse possible package path
  const { dir } = upath.parse(path.replace(/^\.\//, ''))

  /**
   * Paths to attempt finding in {@link exports}.
   *
   * @const {Set<string>} tries
   */
  const tries: Set<string> = new Set(
    [
      path || '.',
      ...dir.split('/').map(seg => './' + (path.split(seg + '/')[1] ?? ''))
    ]
      .map(trypath => (/^\.\/index(?:\..*)?$/.test(trypath) ? '.' : trypath))
      .filter(trypath => trypath === '.' || trypath.length > 2)
  )

  // find subpath export
  for (const trypath of tries) {
    /**
     * Package path search result.
     *
     * @const {Nullable<string>} exportpath
     */
    const exportpath: Nullable<string> = findPathInExports(trypath, exports, [
      ...conditions
    ])

    // return subpath export if export path was found
    if (exportpath) return upath.join(name, trypath)
  }

  throw new errors.ERR_PACKAGE_PATH_NOT_EXPORTED(
    upath.dirname(pkg.path) + '/',
    [...tries][0]
  )
}

export default toBareSpecifier
