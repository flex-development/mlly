/**
 * @file dprint - prettier
 * @module dprint/prettier
 */

import { ok } from 'devlop'
import editorconfig from 'editorconfig'
import { Transform } from 'node:stream'
import * as prettier from 'prettier'

declare module 'editorconfig' {
  interface KnownProps {
    max_line_length?: number | undefined
    single_attribute_per_line?: boolean | undefined
  }
}

process.stdin.pipe(new Transform({
  /**
   * Formats a file using `prettier`.
   *
   * @see https://prettier.io
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
      end_of_line = 'lf',
      indent_size = 2,
      indent_style = 'space',
      max_line_length = 80,
      quote_type = 'single',
      single_attribute_per_line = false,
      spaces_around_brackets = 'inside',
      tab_width = 2
    } = await editorconfig.parse(filepath)

    /**
     * Formatted text.
     *
     * @const {string} text
     */
    const text: string = await prettier.format(buffer.toString(), {
      arrowParens: 'avoid',
      bracketSpacing: spaces_around_brackets === 'inside',
      endOfLine: end_of_line === 'unset' ? 'auto' : end_of_line,
      filepath,
      jsxSingleQuote: quote_type === 'single',
      printWidth: max_line_length,
      proseWrap: 'always',
      quoteProps: 'as-needed',
      semi: false,
      singleAttributePerLine: single_attribute_per_line,
      singleQuote: quote_type === 'single',
      tabWidth: tab_width === 'unset' ? 2 : tab_width,
      trailingComma: 'none',
      useTabs: [indent_size, indent_style].includes('tab')
    })

    return process.stdout.write(text), text
  }
}))
