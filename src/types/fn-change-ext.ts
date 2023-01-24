/**
 * @file Type Definitions - ChangeExtFn
 * @module mlly/types/ChangeExtFn
 */

import type { Nilable } from '@flex-development/tutils'
import type { URL } from 'node:url'

/**
 * Function that returns a new file extension for the given module `specifier`.
 *
 * Returning an empty string (`''`) will remove the original file extension;
 * returning `null` or `undefined` will skip extension replacement.
 *
 * ::: info
 * The new file extension need not begin with a dot character (`'.'`).
 * :::
 *
 * @see {@linkcode URL}
 * @see https://github.com/flex-development/pathe/tree/1.0.3#changeextpath-string-ext-nullablestring-string
 *
 * @template Ext - File extension type(s)
 *
 * @param {string} specifier - Original module specifier
 * @param {URL} url - Resolved module URL
 * @return {Ext | PromiseLike<Ext>} New file extension, `null`, or `undefined`
 */
type ChangeExtFn<Ext extends Nilable<string> = Nilable<string>> = (
  specifier: string,
  url: URL
) => Ext | PromiseLike<Ext>

export type { ChangeExtFn as default }
