/**
 * @file dprint - remark
 * @module dprint/remark
 */

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
  async transform(buffer) {
    /**
     * Virtual file.
     *
     * @type {VFile}
     * @const file
     */
    const file = new VFile(buffer.toString())

    file.path = process.argv.slice(2)[0]

    await unified()
      .use(remarkParse)
      .use(remarkPreset)
      .use(remarkStringify)
      .process(file)

    process.stdout.write(file.value)
    return file.value
  }
}))
