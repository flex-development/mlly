/**
 * @file isFile
 * @module mlly/lib/isFile
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
  if (isModuleId(id)) {
    try {
      if (typeof id === 'string' && id.startsWith('file:')) id = new URL(id)

      /**
       * The stats object.
       *
       * @var {Awaitable<Stats>} stats
       */
      let stats: Awaitable<Stats | null> = (fs ?? dfs).stat(id as ModuleId)

      // resolve the stats object.
      if (isPromise<Stats>(stats)) stats = stats.then(identity, constant(null))

      return chainOrCall(stats, (): Awaitable<boolean> => {
        if (!isPromise(stats)) return stats.isFile()
        return stats.then(stats => stats?.isFile() ?? false)
      })
    } catch {
      // swallow error.
    }
  }

  return false
}
