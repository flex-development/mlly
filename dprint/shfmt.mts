/**
 * @file dprint - shfmt
 * @module dprint/shfmt
 */

import { ok } from 'devlop'
import editorconfig from 'editorconfig'
import { Transform } from 'node:stream'
import * as sh from 'sh-syntax'

declare module 'editorconfig' {
  interface KnownProps {
    binary_next_line?: boolean | undefined
    function_next_line?: boolean | undefined
    keep_comments?: boolean | undefined
    keep_padding?: boolean | undefined
    shell_variant?: sh.LangVariant | undefined
    space_redirects?: boolean | undefined
    switch_case_indent?: boolean | undefined
  }
}

process.stdin.pipe(new Transform({
  /**
   * Formats a file using `sh-syntax`.
   *
   * @see https://github.com/un-ts/sh-syntax
   * @see https://github.com/mvdan/sh/blob/master/cmd/shfmt/shfmt.1.scd
   *
   * @async
   *
   * @param {Buffer} buffer
   *  Data buffer
   * @return {Promise<string>}
   *  Formatted file content
   */
  async transform(buffer: Buffer): Promise<string> {
    const [filepath] = process.argv.slice(2)
    ok(typeof filepath === 'string', 'expected `filepath`')

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
     * @const {sh.ShOptions} options
     */
    const options: sh.ShOptions = {
      binaryNextLine: binary_next_line,
      filepath,
      functionNextLine: function_next_line,
      indent: typeof indent_size === 'string' ? 2 : indent_size,
      keepComments: keep_comments,
      keepPadding: keep_padding,
      minify: false,
      spaceRedirects: space_redirects,
      switchCaseIndent: switch_case_indent,
      tabWidth: tab_width === 'unset' ? 2 : tab_width,
      useTabs: indent_style === 'tab',
      variant: shell_variant
    }

    /**
     * Text to format.
     *
     * @const {string} originalText
     */
    const originalText: string = buffer.toString()

    /**
     * Formatted text AST.
     *
     * @const {sh.File} ast
     */
    const ast: sh.File = await sh.parse(originalText, options)

    /**
     * Formatted text.
     *
     * @const {string} text
     */
    const text: string = await sh.print(ast, { ...options, originalText })

    return process.stdout.write(text), text
  }
}))
