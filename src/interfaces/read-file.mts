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
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode Buffer}
 *
 * @template {Awaitable<FileContent | null | undefined>} [T]
 *  The file contents
 */
interface ReadFile<
  T extends Awaitable<FileContent | null | undefined> = Awaitable<FileContent>
> {
  /**
   * @see {@linkcode ModuleId}
   *
   * @this {void}
   *
   * @param {ModuleId} id
   *  The module id
   * @param {BufferEncoding} encoding
   *  The encoding of the file contents
   * @return {Awaitable<string>}
   *  The file contents
   */
  (this: void, id: ModuleId, encoding: BufferEncoding): Awaitable<string>

  /**
   * @see {@linkcode ModuleId}
   *
   * @this {void}
   *
   * @param {ModuleId} id
   *  The module id
   * @param {BufferEncoding | null | undefined} [encoding]
   *  The encoding of the file contents
   * @return {T}
   *  The file contents
   */
  (this: void, id: ModuleId, encoding?: BufferEncoding | null | undefined): T
}

export type { ReadFile as default }
