/**
 * @file isFile
 * @module mlly/lib/isFile
 */

import dfs from '#internal/fs'
import type { FileSystem, ModuleId } from '@flex-development/mlly'

/**
 * Check if a file exists at the given module `id`.
 *
 * @see {@linkcode FileSystem}
 * @see {@linkcode ModuleId}
 *
 * @param {ModuleId} id
 *  Module id to check
 * @param {FileSystem | null | undefined} fs
 *  File system API
 * @return {boolean}
 *  `true` if file exists at `id`, `false` otherwise
 */
function isFile(
  id: ModuleId,
  fs?: FileSystem | null | undefined
): boolean {
  try {
    if (typeof id === 'string' && id.startsWith('file:')) id = new URL(id)
    return (fs ?? dfs).statSync(id).isFile()
  } catch {
    return false
  }
}

export default isFile
