/**
 * @file Interfaces - BufferEncodingMap
 * @module mlly/interfaces/BufferEncodingMap
 */

/**
 * Registry of character encodings that can be used when working
 * with {@linkcode Buffer} objects.
 *
 * This interface can be augmented to register custom encodings.
 *
 * @example
 *  declare module '@flex-development/mlly' {
 *    interface BufferEncodingMap {
 *      custom: 'custom'
 *    }
 *  }
 */
interface BufferEncodingMap {
  ascii: 'ascii'
  base64: 'base64'
  base64url: 'base64url'
  binary: 'binary'
  hex: 'hex'
  latin1: 'latin1'
  ucs2: 'ucs2' | 'ucs-2'
  utf16le: 'utf16le' | 'utf-16le'
  utf8: 'utf8' | 'utf-8'
}

export type { BufferEncodingMap as default }
