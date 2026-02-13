/**
 * @file Type Aliases - GetNewExtension
 * @module mlly/types/GetNewExtension
 */

/**
 * Get a new file extension for a `url`.
 *
 * Returning an empty string (`''`), `false`, `null`, or `undefined`
 * will remove the current file extension.
 *
 * ::: info
 * File extensions are normalized and
 * do not need to begin with a dot character (`'.'`).
 * :::
 *
 * @see {@linkcode URL}
 * @see https://github.com/flex-development/pathe/tree/1.0.3#changeextpath-string-ext-nullablestring-string
 *
 * @template {string | false | null | undefined} [T]
 *  The new file extension
 *
 * @param {URL} url
 *  The resolved module URL
 * @param {string} specifier
 *  The module specifier being resolved
 * @return {T}
 *  The new file extension
 */
type GetNewExtension<
  T extends string | false | null | undefined =
    | string
    | false
    | null
    | undefined
> = (this: void, url: URL, specifier: string) => T

export type { GetNewExtension as default }
