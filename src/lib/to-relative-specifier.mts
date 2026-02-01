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
 * The relative specifier will only have a file extension
 * if `specifier` also has an extension.
 * :::
 *
 * @see {@linkcode ModuleId}
 * @see https://nodejs.org/api/esm.html#terminology
 *
 * @this {void}
 *
 * @param {ModuleId} url
 *  The `file:` URL to convert
 * @param {ModuleId} parent
 *  The parent module id
 * @return {string}
 *  The relative specifier
 */
function toRelativeSpecifier(
  this: void,
  url: ModuleId,
  parent: ModuleId
): string {
  parent = pathe.fileURLToPath(parent)
  url = pathe.fileURLToPath(url)

  /**
   * The directory name of the {@linkcode parent} path.
   *
   * @const {string} dirname
   */
  const dirname: string = pathe.dirname(parent)

  /**
   * The relative specifier.
   *
   * @var {string} specifier
   */
  let specifier: string

  if (url.startsWith(parent) && parent.endsWith(pathe.sep)) {
    // inside same directory as parent
    specifier = pathe.dot + pathe.sep + url.slice(parent.length)
  } else if (url === dirname || url.startsWith(dirname + pathe.sep)) {
    // directory name of parent or inside same directory as parent
    specifier = pathe.dot + pathe.sep + url.slice(dirname.length + 1)
  } else {
    // outside directory of parent
    specifier = pathe.relative(parent, url)
    ok(specifier.startsWith(pathe.dot), 'expected result to start with `.`')

    /* v8 ignore else -- @preserve */
    if (/(?:\.\.\/){2,}/.test(specifier)) {
      // remove first '../' segment:
      // pathe.relative backs out of an extra directory
      specifier = specifier.slice(specifier.indexOf(pathe.sep) + 1)
    }
  }

  return specifier
}

export default toRelativeSpecifier
