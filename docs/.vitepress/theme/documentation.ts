/**
 * @file VitePress Theme - Documentation
 * @module docs/vitepress/theme/Documentation
 */

/**
 * Object containing API documentation.
 */
interface Documentation {
  /**
   * API documentation.
   */
  doc: string

  /**
   * Absolute path to source file.
   */
  file: string
}

export type { Documentation as default }
