/**
 * @file isDirectory
 * @module mlly/lib/isDirectory
 */

import chainOrCall from '#internal/chain-or-call'
import constant from '#internal/constant'
import dfs from '#internal/fs'
import identity from '#internal/identity'
import isPromise from '#internal/is-promise'
import isModuleId from '#lib/is-module-id'
import type {
  Awaitable,
  FileSystem,
  ModuleId,
  Stats
} from '@flex-development/mlly'

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
  if (isModuleId(id)) {
    try {
      if (typeof id === 'string' && id.startsWith('file:')) id = new URL(id)

      /**
       * The stats object.
       *
       * @var {Awaitable<Stats | null>} stats
       */
      let stats: Awaitable<Stats | null> = (fs ?? dfs).stat(id as ModuleId)

      // resolve the stats object.
      if (isPromise<Stats>(stats)) stats = stats.then(identity, constant(null))

      return chainOrCall(stats, (): Awaitable<boolean> => {
        if (!isPromise(stats)) return stats.isDirectory()
        return stats.then(stats => stats?.isDirectory() ?? false)
      })
    } catch {
      // swallow error.
    }
  }

  return false
}
