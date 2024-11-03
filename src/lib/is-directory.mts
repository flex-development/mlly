/**
 * @file isDirectory
 * @module mlly/lib/isDirectory
 */

import dfs from '#internal/fs'
import type { FileSystem, ModuleId } from '@flex-development/mlly'

/**
 * Check if a directory exists at the given module `id`.
 *
 * @see {@linkcode FileSystem}
 * @see {@linkcode ModuleId}
 *
 * @async
 *
 * @param {ModuleId} id
 *  Module id to check
 * @param {FileSystem | null | undefined} fs
 *  File system API
 * @return {Promise<boolean>}
 *  `true` if directory exists at `id`, `false` otherwise
 */
async function isDirectory(
  id: ModuleId,
  fs?: FileSystem | null | undefined
): Promise<boolean> {
  try {
    if (typeof id === 'string' && id.startsWith('file:')) id = new URL(id)
    return (await (fs ?? dfs).stat(id)).isDirectory()
  } catch {
    return false
  }
}

export default isDirectory
