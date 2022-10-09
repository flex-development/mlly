/**
 * @file toBareSpecifier
 * @module mlly/lib/toBareSpecifier
 */

import { CONDITIONS } from '#src/constants'
import isBuiltin from '@flex-development/is-builtin'
import { isNIL, type Nullable } from '@flex-development/tutils'
import type { ErrnoException } from 'import-meta-resolve'
import { codes as errors } from 'import-meta-resolve/lib/errors'
import { findPathInExports, parseModuleId } from 'node-package-exports'
import { fileURLToPath, URL } from 'node:url'
import * as pathe from 'pathe'
import { readPackageUp, type PackageJson, type ReadResult } from 'read-pkg-up'

/**
 * Converts `specifier` into a bare specifier.
 *
 * **Note**: The returned specifier will only include a file extension if the
 * original specifier includes an extension.
 *
 * @see https://nodejs.org/api/esm.html#terminology
 * @see {@link ErrnoException}
 *
 * @async
 *
 * @param {URL | string} specifier - File url or path to convert
 * @param {Set<string> | string[]} [conditions=CONDITIONS] - Export conditions
 * @return {string} `specifier` as bare specifier
 * @throws {ErrnoException}
 */
const toBareSpecifier = async (
  specifier: URL | string,
  conditions: Set<string> | string[] = CONDITIONS
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
    return pathe
      .format({
        dir: pathe.dirname(p),
        ext: '',
        name: pathe.basename(p, pathe.extname(p)),
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

  // get package exports
  const { exports }: PackageJson = pkg.packageJson

  // check package name and main entry point if no exports
  if (isNIL(exports)) {
    // return package name if specifier is package name
    if (bare === name) return name

    // get main entrypoint
    let { main = '' }: PackageJson = pkg.packageJson

    // add leading './' and remove file extension from main
    main = normalize(main)

    // return package name if specifier is main with or without file extension,
    // or return bare specifier
    return path === main || normalize(path) === main ? name : bare
  }

  // parse possible package path
  const { dir, name: basename, root } = pathe.parse(path.replace(/^\.\//, ''))

  /**
   * Paths to attempt finding in {@link exports}.
   *
   * @const {Set<string>} tries
   */
  const tries: Set<string> = new Set(
    [
      path || '.',
      path.replace('./' + root, '.').replace(/^\.\/index$/, '.'),
      path.replace('./' + dir, '.'),
      './' + basename
    ].filter(trypath => {
      return trypath === '.' || (trypath.length > 2 && trypath !== './index')
    })
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
    if (exportpath) return pathe.join(name, trypath)
  }

  throw new errors.ERR_PACKAGE_PATH_NOT_EXPORTED(
    pathe.dirname(pkg.path) + '/',
    tries[0]
  )
}

export default toBareSpecifier
