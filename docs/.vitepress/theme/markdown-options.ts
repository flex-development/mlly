/**
 * @file VitePress Theme - MARKDOWN_OPTIONS
 * @module docs/vitepress/theme/MARKDOWN_OPTIONS
 */

import type { MarkdownOptions } from 'vitepress'

/**
 * Markdown parser options.
 *
 * @see https://vitepress.vuejs.org/config/app-configs#markdown
 */
const MARKDOWN_OPTIONS: MarkdownOptions = {
  headers: { level: [0, 0] },
  theme: 'github-dark'
}

export default MARKDOWN_OPTIONS
