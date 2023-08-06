/**
 * @file Type Definitions - ChangeExtFn
 * @module mlly/types/ChangeExtFn
 */

import type { Fn, Nilable } from '@flex-development/tutils'
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
 * @template X - File extension type
 *
 * @param {string} specifier - Original module specifier
 * @param {URL} url - Resolved module URL
 * @return {PromiseLike<X> | X} New file extension, `null`, or `undefined`
 */
type ChangeExtFn<X extends Nilable<string> = Nilable<string>> = Fn<
  [specifier: string, url: URL],
  PromiseLike<X> | X
>

export type { ChangeExtFn as default }
