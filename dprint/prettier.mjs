/**
 * @file dprint - prettier
 * @module dprint/prettier
 */

import { includes } from '@flex-development/tutils'
import editorconfig from 'editorconfig'
import { Transform } from 'node:stream'
import * as prettier from 'prettier'

process.stdin.pipe(new Transform({
  /**
   * Formats a file using `prettier`.
   *
   * @see https://prettier.io
   *
   * @async
   *
   * @param {Buffer} buffer - Data buffer
   * @return {Promise<string>} Formatted file content
   */
  async transform(buffer) {
    const [filepath] = process.argv.slice(2)

    const {
      end_of_line = 'lf',
      indent_size = 2,
      indent_style = 'space',
      max_line_length = 80,
      quote_type = 'single',
      spaces_around_brackets = 'inside',
      tab_width = 2
    } = await editorconfig.parse(filepath)

    /**
     * Formatted text.
     *
     * @type {string}
     * @const text
     */
    const text = await prettier.format(buffer.toString(), {
      arrowParens: 'avoid',
      bracketSpacing: spaces_around_brackets === 'inside',
      endOfLine: end_of_line === 'unset' ? 'auto' : end_of_line,
      filepath,
      jsxSingleQuote: quote_type === 'single',
      printWidth: max_line_length,
      proseWrap: 'always',
      quoteProps: 'as-needed',
      semi: false,
      singleAttributePerLine: true,
      singleQuote: quote_type === 'single',
      tabWidth: tab_width === 'unset' ? 2 : tab_width,
      trailingComma: 'none',
      useTabs: includes([indent_size, indent_style], 'tab')
    })

    process.stdout.write(text)
    return text
  }
}))
