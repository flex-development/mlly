/**
 * @file dprint - shfmt
 * @module dprint/shfmt
 */

import * as tutils from '@flex-development/tutils'
import editorconfig from 'editorconfig'
import { Transform } from 'node:stream'
import * as sh from 'sh-syntax'

process.stdin.pipe(new Transform({
  /**
   * Formats a file using `sh-syntax`.
   *
   * @see https://github.com/un-ts/sh-syntax
   * @see https://github.com/mvdan/sh/blob/master/cmd/shfmt/shfmt.1.scd
   *
   * @async
   *
   * @param {Buffer} buffer - Data buffer
   * @return {Promise<string>} Formatted file content
   */
  async transform(buffer) {
    const [filepath] = process.argv.slice(2)

    const {
      binary_next_line = true,
      function_next_line = false,
      indent_size = 2,
      indent_style = 'space',
      keep_comments = true,
      keep_padding = false,
      shell_variant = 0,
      space_redirects = false,
      switch_case_indent = true,
      tab_width = 2
    } = await editorconfig.parse(filepath)

    /**
     * Shell formatting options.
     *
     * @type {tutils.Shake<Required<Omit<sh.ShOptions,'stopAt'>>>}
     * @const opts
     */
    const opts = tutils.shake({
      binaryNextLine: binary_next_line,
      filepath,
      functionNextLine: function_next_line,
      indent: indent_size,
      keepComments: keep_comments,
      keepPadding: keep_padding,
      minify: false,
      spaceRedirects: space_redirects,
      switchCaseIndent: switch_case_indent,
      tabWidth: tab_width,
      useTabs: indent_style === 'tab',
      variant: shell_variant
    })

    /**
     * Text to format.
     *
     * @type {string}
     * @const originalText
     */
    const originalText = buffer.toString()

    /**
     * Formatted text AST.
     *
     * @type {sh.File}
     * @const ast
     */
    const ast = await sh.parse(originalText, opts)

    /**
     * Formatted text.
     *
     * @type {string}
     * @const text
     */
    const text = await sh.print(ast, { ...opts, originalText })

    process.stdout.write(text)
    return text
  }
}))
