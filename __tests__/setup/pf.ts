/**
 * @file Test Setup - pf
 * @module tests/setup/pf
 * @see https://github.com/facebook/jest/tree/main/packages/pretty-format
 */

import { format, type PrettyFormatOptions } from 'pretty-format'

/**
 * Returns a string representation of `val`.
 *
 * @param {unknown} val - Value to stringify
 * @param {PrettyFormatOptions} [options={min:true}] - Formatting options
 * @return {string} String representation of `val`
 */
const pf = (val: unknown, options: PrettyFormatOptions = {}): string => {
  if (options.min === undefined) Object.assign(options, { min: true })
  return format(val, options)
}

global.pf = pf
