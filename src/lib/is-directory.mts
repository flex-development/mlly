/**
 * @file isDirectory
 * @module mlly/lib/isDirectory
 */

import constant from '#internal/constant'
import dfs from '#internal/fs'
import isModuleId from '#lib/is-module-id'
import type { Awaitable, FileSystem } from '@flex-development/mlly'
import when from '@flex-development/when'

export default isDirectory

/**
 * Check if a directory exists.
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
 *  `true` if directory exists at `id`, `false` otherwise
 */
function isDirectory<T extends Awaitable<boolean>>(
  this: void,
  id: unknown,
  fs?: FileSystem | null | undefined
): T

/**
 * Check if a directory exists.
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
 *  `true` if directory exists at `id`, `false` otherwise
 */
function isDirectory(
  this: void,
  id: unknown,
  fs?: FileSystem | null | undefined
): Awaitable<boolean> {
  if (typeof id === 'string' && id.startsWith('file:')) id = new URL(id)
  if (!isModuleId(id)) return false

  fs ??= dfs

  try {
    return when(fs.stat(id), stats => stats.isDirectory(), constant(false))
  } catch {
    return false // swallow error.
  }
}
