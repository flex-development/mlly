/**
 * @file getSource
 * @module mlly/lib/getSource
 */

import fs from '#internal/fs'
import identity from '#internal/identity'
import process from '#internal/process'
import isFile from '#lib/is-file'
import isModuleId from '#lib/is-module-id'
import toUrl from '#lib/to-url'
import {
  ERR_UNSUPPORTED_ESM_URL_SCHEME,
  type ErrUnsupportedEsmUrlScheme
} from '@flex-development/errnode'
import type {
  Awaitable,
  EmptyString,
  FileContent,
  GetSourceContext,
  GetSourceHandler,
  GetSourceOptions,
  ModuleId,
  Protocol
} from '@flex-development/mlly'
import when from '@flex-development/when'
import { ok } from 'devlop'

export default getSource

/**
 * Get the source code for a module.
 *
 * @see {@linkcode EmptyString}
 * @see {@linkcode GetSourceOptions}
 *
 * @this {void}
 *
 * @param {EmptyString | null | undefined} id
 *  The module id
 * @param {GetSourceOptions | null | undefined} [options]
 *  Source code retrieval options
 * @return {null}
 *  The module source code
 */
function getSource(
  this: void,
  id: EmptyString | null | undefined,
  options?: GetSourceOptions | null | undefined
): null

/**
 * Get the source code for a module.
 *
 * > 👉 **Note**: Returns a promise if the handler for `id` is async.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode ErrUnsupportedEsmUrlScheme}
 * @see {@linkcode GetSourceOptions}
 * @see {@linkcode ModuleId}
 *
 * @template {Awaitable<FileContent | null | undefined>} T
 *  The module source code
 *
 * @this {void}
 *
 * @param {ModuleId | null | undefined} id
 *  The module id
 * @param {GetSourceOptions | null | undefined} [options]
 *  Source code retrieval options
 * @return {T}
 *  The module source code
 * @throws {ErrUnsupportedEsmUrlScheme}
 */
function getSource<T extends Awaitable<FileContent | null | undefined>>(
  this: void,
  id: ModuleId | null | undefined,
  options?: GetSourceOptions | null | undefined
): T

/**
 * Get the source code for a module.
 *
 * > 👉 **Note**: Returns a promise if the handler for `id` is async.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode ErrUnsupportedEsmUrlScheme}
 * @see {@linkcode GetSourceOptions}
 * @see {@linkcode ModuleId}
 *
 * @this {void}
 *
 * @param {ModuleId | null | undefined} id
 *  The module id
 * @param {GetSourceOptions | null | undefined} [options]
 *  Source code retrieval options
 * @return {Awaitable<FileContent | null | undefined>}
 *  The module source code
 * @throws {ErrUnsupportedEsmUrlScheme}
 */
function getSource(
  this: void,
  id: ModuleId | null | undefined,
  options?: GetSourceOptions | null | undefined
): Awaitable<FileContent | null | undefined> {
  if (!isModuleId(id)) return null

  /**
   * The source code retrieval context.
   *
   * @const {GetSourceContext} context
   */
  const context: GetSourceContext = {
    ...options,
    fs: options?.fs ?? fs,
    handlers: {
      'data:': data,
      'file:': file,
      'http:': https,
      'https:': https,
      'node:': node,
      ...options?.handlers
    },
    req: { ...options?.req },
    schemes: new Set(
      options?.schemes
        ? [...options.schemes]
        : ['data', 'file', 'http', 'https', 'node']
    )
  }

  /**
   * The module url.
   *
   * @const {URL} url
   */
  const url: URL = toUrl(id)

  /**
   * The source code handler for {@linkcode url}.
   *
   * @var {GetSourceHandler | null | undefined} handle
   */
  let handle: GetSourceHandler | null | undefined

  // get source code handler.
  handle = context.handlers[url.protocol as Protocol]

  // handle unsupported url scheme.
  if (typeof handle !== 'function') {
    if (context.ignoreErrors) return undefined

    throw new ERR_UNSUPPORTED_ESM_URL_SCHEME(
      url,
      [...context.schemes],
      process.platform === 'win32'
    )
  }

  return when(handle.call(context, url), identity)
}

/**
 * @this {GetSourceContext}
 *
 * @param {URL} url
 *  The module URL
 * @return {Buffer}
 *  The source code buffer
 */
function data(this: GetSourceContext, url: URL): Buffer {
  const [mime, data = ''] = url.pathname.split(',')

  ok(url.protocol === 'data:', 'expected `data:` URL')
  ok(mime !== undefined, 'expected `mime` to be a string')

  return Buffer.from(
    decodeURIComponent(data),
    mime.endsWith('base64') ? 'base64' : 'utf8'
  )
}

/**
 * > 👉 **Note**: Returns a promise if `this.fs.readFile` or `this.fs.stat`
 * > is async.
 *
 * @this {GetSourceContext}
 *
 * @param {URL} url
 *  The module URL
 * @return {Awaitable<FileContent | null>}
 *  The source code
 */
function file(this: GetSourceContext, url: URL): Awaitable<FileContent | null> {
  ok(url.protocol === 'file:', 'expected `file:` URL')

  return when(isFile(url, this.fs), exists => {
    return exists ? this.fs.readFile(url, this.encoding) : null
  })
}

/**
 * @async
 *
 * @this {GetSourceContext}
 *
 * @param {URL} url
 *  The module URL
 * @return {Promise<string>}
 *  The source code
 */
async function https(this: GetSourceContext, url: URL): Promise<string> {
  ok(/^https?:$/.test(url.protocol), 'expected `http:` or `https:` URL')
  return (await fetch(url.href, this.req)).text()
}

/**
 * @this {GetSourceContext}
 *
 * @param {URL} url
 *  The module URL
 * @return {undefined}
 */
function node(this: GetSourceContext, url: URL): undefined {
  return void ok(url.protocol === 'node:', 'expected `node:` URL')
}
