/**
 * @file Type Aliases - ChangeExtFn
 * @module mlly/types/ChangeExtFn
 */

/**
 * Get a new file extension of `url`.
 *
 * Returning an empty string (`''`), `null`, or `undefined` will remove the
 * current file extension.
 *
 * ::: info
 * The new file extension need not begin with a dot character (`'.'`).
 * :::
 *
 * @see {@linkcode URL}
 * @see https://github.com/flex-development/pathe/tree/1.0.3#changeextpath-string-ext-nullablestring-string
 *
 * @template {string | null | undefined} Ext
 *  File extension
 *
 * @param {URL} url
 *  The resolved module URL
 * @param {string} specifier
 *  The module specifier being resolved
 * @return {Ext}
 *  New file extension, `null`, or `undefined`
 */
type ChangeExtFn<
  Ext extends string | null | undefined = string | null | undefined
> = (this: void, url: URL, specifier: string) => Ext

export type { ChangeExtFn as default }
