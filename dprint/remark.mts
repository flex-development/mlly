/**
 * @file dprint - remark
 * @module dprint/remark
 */

import { ok } from 'devlop'
import { Transform } from 'node:stream'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { unified } from 'unified'
import { VFile } from 'vfile'
import remarkPreset from '../.remarkrc.mjs'

process.stdin.pipe(new Transform({
  /**
   * Formats a file using `remark`.
   *
   * @see https://github.com/remarkjs/remark
   *
   * @async
   *
   * @param {Buffer} buffer
   *  Data buffer
   * @return {Promise<string>}
   *  Formatted file content
   */
  async transform(buffer: Buffer): Promise<string> {
    /**
     * Virtual file.
     *
     * @const {VFile} file
     */
    const file: VFile = new VFile(buffer.toString())

    file.path = process.argv.slice(2)[0]!

    await unified()
      .use(remarkParse)
      .use(remarkPreset)
      .use(remarkStringify)
      .process(file)

    ok(typeof file.value === 'string', 'expected `file.value` to be a string')
    return process.stdout.write(file.value), file.value
  }
}))
