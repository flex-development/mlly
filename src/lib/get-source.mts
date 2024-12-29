/**
 * @file getSource
 * @module mlly/lib/getSource
 */

import fs from '#internal/fs'
import process from '#internal/process'
import isFile from '#lib/is-file'
import toUrl from '#lib/to-url'
import {
  ERR_UNSUPPORTED_ESM_URL_SCHEME,
  type ErrUnsupportedEsmUrlScheme
} from '@flex-development/errnode'
import type {
  GetSourceContext,
  GetSourceHandler,
  GetSourceOptions,
  ModuleId,
  Protocol
} from '@flex-development/mlly'
import { ok } from 'devlop'

export default getSource

/**
 * Get the source code for `id`.
 *
 * @see {@linkcode ErrUnsupportedEsmUrlScheme}
 * @see {@linkcode GetSourceOptions}
 * @see {@linkcode ModuleId}
 *
 * @async
 *
 * @this {void}
 *
 * @param {ModuleId} id
 *  Module id to handle
 * @param {GetSourceOptions | null | undefined} [options]
 *  Source code retrieval options
 * @return {Promise<string | null | undefined>}
 *  Source code for `id`
 * @throws {ErrUnsupportedEsmUrlScheme}
 */
async function getSource(
  this: void,
  id: ModuleId,
  options?: GetSourceOptions | null | undefined
): Promise<string | null | undefined> {
  /**
   * Source code retrieval context.
   *
   * @const {GetSourceContext} context
   */
  const context: GetSourceContext = {
    ...options,
    error: false,
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
   * Module url.
   *
   * @const {URL} url
   */
  const url: URL = toUrl(id)

  /**
   * Source code handler for {@linkcode url}.
   *
   * @const {GetSourceHandler} handle
   */
  const handle: GetSourceHandler | null | undefined =
    context.handlers[url.protocol as Protocol]

  /**
   * Source code.
   *
   * @var {Uint8Array | string | null | undefined} code
   */
  let code: Uint8Array | string | null | undefined

  // get source code
  if (handle) {
    code = await handle.call(context, url)
  } else {
    context.error = true
  }

  // throw on unsupported url scheme
  if (context.error && !context.ignoreErrors) {
    throw new ERR_UNSUPPORTED_ESM_URL_SCHEME(
      url,
      [...context.schemes],
      process.platform === 'win32'
    )
  }

  if (code !== null && code !== undefined) code = String(code)
  return code
}

/**
 * @this {GetSourceContext}
 *
 * @param {URL} url
 *  Module URL
 * @return {Buffer}
 *  Source code buffer
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
 * @this {GetSourceContext}
 *
 * @param {URL} url
 *  Module URL
 * @return {Buffer | string | null}
 *  Source code or `null` if module is not found
 */
function file(
  this: GetSourceContext,
  url: URL
): Buffer | string | null {
  ok(url.protocol === 'file:', 'expected `file:` URL')

  /**
   * Source code.
   *
   * @var {Buffer | string | null} code
   */
  let code: Buffer | string | null = null

  if (isFile(url, this.fs)) code = this.fs.readFileSync(url)
  return code
}

/**
 * @async
 *
 * @this {GetSourceContext}
 *
 * @param {URL} url
 *  Module URL
 * @return {Promise<string>}
 *  Source code
 */
async function https(this: GetSourceContext, url: URL): Promise<string> {
  ok(/^https?:$/.test(url.protocol), 'expected `http:` or `https:` URL')
  return (await fetch(url.href, this.req)).text()
}

/**
 * @this {GetSourceContext}
 *
 * @param {URL} url
 *  Module URL
 * @return {undefined}
 */
function node(this: GetSourceContext, url: URL): undefined {
  return void ok(url.protocol === 'node:', 'expected `node:` URL')
}
