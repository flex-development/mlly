/**
 * @file dprint - remark
 * @module dprint/remark
 */

import remarkPreset from '@flex-development/remark-preset'
import concat from 'concat-stream'
import { ok } from 'devlop'
import { remark } from 'remark'
import type { VFile } from 'vfile'

process.stdin.pipe(concat(
  /**
   * Format a file using `remark`.
   *
   * @see https://github.com/remarkjs/remark
   *
   * @param {Buffer} chunk
   *  The file content to format
   * @return {undefined}
   */
  function(chunk: Buffer): undefined {
    return void remark().use(remarkPreset).process(chunk, done)

    /**
     * @param {Error | undefined} [e]
     *  The error to handle, if any
     * @param {VFile | undefined} [file]
     *  The formatted file
     * @return {undefined}
     * @throws {Error}
     */
    function done(
      e?: Error | undefined,
      file?: VFile | undefined
    ): undefined {
      if (e) throw e
      return ok(file, 'expected `file`'), void process.stdout.write(file.value)
    }
  }
))
