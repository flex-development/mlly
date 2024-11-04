/**
 * @file toRelativeSpecifier
 * @module mlly/lib/toRelativeSpecifier
 */

import toUrl from '#lib/to-url'
import type { ModuleId } from '@flex-development/mlly'
import pathe from '@flex-development/pathe'

/**
 * Turn `url` into a *relative specifier*.
 *
 * ::: info
 * The relative specifier will only include a file extension if `specifier`
 * includes a file extension.
 * :::
 *
 * @see {@linkcode ModuleId}
 * @see https://nodejs.org/api/esm.html#terminology
 *
 * @param {ModuleId} url
 *  The `file:` URL to convert
 * @param {ModuleId} parent
 *  Parent module id
 * @return {string}
 *  Relative specifier
 */
function toRelativeSpecifier(url: ModuleId, parent: ModuleId): string {
  /**
   * Relative specifier.
   *
   * @var {string} specifier
   */
  let specifier: string = pathe.relative(
    pathe.fileURLToPath(toUrl(parent)),
    pathe.fileURLToPath(toUrl(url))
  )

  if (/(?:\.\.\/){2,}/.test(specifier)) {
    specifier = specifier.slice(specifier.indexOf(pathe.sep) + 1)
  } else if (specifier.startsWith(pathe.dot.repeat(2))) {
    specifier = specifier.slice(1)
  } else if (specifier) {
    specifier = pathe.dot + pathe.sep + specifier
  } else {
    specifier = pathe.dot
  }

  return specifier
}

export default toRelativeSpecifier
