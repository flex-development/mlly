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
 * @param {ModuleId} id
 *  Module id to check
 * @param {FileSystem | null | undefined} fs
 *  File system API
 * @return {boolean}
 *  `true` if directory exists at `id`, `false` otherwise
 */
function isDirectory(
  id: ModuleId,
  fs?: FileSystem | null | undefined
): boolean {
  try {
    if (typeof id === 'string' && id.startsWith('file:')) id = new URL(id)
    return (fs ?? dfs).statSync(id).isDirectory()
  } catch {
    return false
  }
}

export default isDirectory
