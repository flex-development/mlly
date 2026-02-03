/**
 * @file Interfaces - ReadFile
 * @module mlly/interfaces/ReadFile
 */

import type {
  Awaitable,
  BufferEncoding,
  FileContent,
  ModuleId
} from '@flex-development/mlly'

/**
 * Read the entire contents of a file.
 */
interface ReadFile {
  /**
   * @see {@linkcode ModuleId}
   *
   * @this {unknown}
   *
   * @param {ModuleId} id
   *  The module id
   * @param {BufferEncoding} encoding
   *  The encoding of the file contents
   * @return {Awaitable<string>}
   *  The file contents
   */
  (id: ModuleId, encoding: BufferEncoding): Awaitable<string>

  /**
   * @see {@linkcode Awaitable}
   * @see {@linkcode FileContent}
   * @see {@linkcode ModuleId}
   *
   * @template {Awaitable<FileContent | null | undefined>} T
   *  The file contents
   *
   * @this {unknown}
   *
   * @param {ModuleId} id
   *  The module id
   * @param {BufferEncoding | null | undefined} [encoding]
   *  The encoding of the file contents
   * @return {T}
   *  The file contents
   */
  <T extends Awaitable<FileContent | null | undefined>>(
    id: ModuleId,
    encoding?: BufferEncoding | null | undefined
  ): T
}

export type { ReadFile as default }
