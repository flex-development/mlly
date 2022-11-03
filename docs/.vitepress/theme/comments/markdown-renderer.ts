/**
 * @file VitePress Theme - md
 * @module docs/vitepress/theme/comments/md
 */

import type MarkdownIt from 'markdown-it'
import path from 'node:path'
import { createMarkdownRenderer } from 'vitepress'
import MARKDOWN_OPTIONS from '../markdown-options'

/**
 * Markdown renderer.
 *
 * @const {MarkdownIt} md
 */
const md: MarkdownIt = await createMarkdownRenderer(
  path.resolve('docs'),
  MARKDOWN_OPTIONS
)

export default md
