/**
 * @file toRelativeSpecifier
 * @module mlly/lib/toRelativeSpecifier
 */

import type { ModuleId } from '@flex-development/mlly'
import pathe from '@flex-development/pathe'
import { ok } from 'devlop'

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
  parent = pathe.fileURLToPath(parent)
  url = pathe.fileURLToPath(url)

  /**
   * Directory name of {@linkcode parent} path.
   *
   * @const {string} dirname
   */
  const dirname: string = pathe.dirname(parent)

  /**
   * Relative specifier.
   *
   * @var {string} specifier
   */
  let specifier: string

  if (url.startsWith(parent) && parent.endsWith(pathe.sep)) {
    // url is inside same directory as parent
    specifier = pathe.dot + pathe.sep + url.slice(parent.length)
  } else if (url === dirname || url.startsWith(dirname + pathe.sep)) {
    // url is directory name of parent or inside same directory as parent
    specifier = pathe.dot + pathe.sep + url.slice(dirname.length + 1)
  } else {
    // url is outside directory of parent
    specifier = pathe.relative(parent, url)
    ok(specifier.startsWith(pathe.dot), 'expected result to start with "."')

    if (specifier !== pathe.dot && specifier !== pathe.dot.repeat(2)) {
      if (/(?:\.\.\/){2,}/.test(specifier)) {
        // remove first '../' segment:
        // pathe.relative backs out of an extra directory
        specifier = specifier.slice(specifier.indexOf(pathe.sep) + 1)
      }
    }
  }

  return specifier
}

export default toRelativeSpecifier
