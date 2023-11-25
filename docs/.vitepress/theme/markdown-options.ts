/**
 * @file VitePress Theme - MARKDOWN_OPTIONS
 * @module docs/vitepress/theme/MARKDOWN_OPTIONS
 */

import type { MarkdownOptions } from 'vitepress'

/**
 * Markdown parser options.
 *
 * @see https://vitepress.dev/reference/site-config#markdown
 */
const MARKDOWN_OPTIONS: MarkdownOptions = {
  attrs: { allowedAttributes: ['id'] },
  headers: { level: [0, 0] },
  theme: 'github-dark'
}

export default MARKDOWN_OPTIONS
