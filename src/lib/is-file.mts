/**
 * @file isFile
 * @module mlly/lib/isFile
 */

import constant from '#internal/constant'
import dfs from '#internal/fs'
import isModuleId from '#lib/is-module-id'
import type { Awaitable, FileSystem } from '@flex-development/mlly'
import when from '@flex-development/when'

export default isFile

/**
 * Check if a file exists.
 *
 * > 👉 **Note**: Returns a promise if `fs.stat` is async.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode FileSystem}
 *
 * @template {Awaitable<boolean>} T
 *  The result of the check
 *
 * @this {void}
 *
 * @param {unknown} id
 *  The module id to check
 * @param {FileSystem | null | undefined} fs
 *  The file system API
 * @return {T}
 *  `true` if file exists at `id`, `false` otherwise
 */
function isFile<T extends Awaitable<boolean>>(
  this: void,
  id: unknown,
  fs?: FileSystem | null | undefined
): T

/**
 * Check if a file exists.
 *
 * > 👉 **Note**: Returns a promise if `fs.stat` is async.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode FileSystem}
 *
 * @this {void}
 *
 * @param {unknown} id
 *  The module id to check
 * @param {FileSystem | null | undefined} fs
 *  The file system API
 * @return {Awaitable<boolean>}
 *  `true` if file exists at `id`, `false` otherwise
 */
function isFile(
  this: void,
  id: unknown,
  fs?: FileSystem | null | undefined
): Awaitable<boolean> {
  if (typeof id === 'string' && id.startsWith('file:')) id = new URL(id)
  if (!isModuleId(id)) return false

  fs ??= dfs

  try {
    return when(fs.stat(id), stats => stats.isFile(), constant(false))
  } catch {
    return false // swallow error.
  }
}
