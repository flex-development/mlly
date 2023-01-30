/**
 * @file VitePress Theme - md
 * @module docs/vitepress/theme/comments/md
 */

import pathe from '@flex-development/pathe'
import type MarkdownIt from 'markdown-it'
import { createMarkdownRenderer } from 'vitepress'
import MARKDOWN_OPTIONS from '../markdown-options'

/**
 * Markdown renderer.
 *
 * @const {MarkdownIt} md
 */
const md: MarkdownIt = await createMarkdownRenderer(
  pathe.resolve('docs'),
  MARKDOWN_OPTIONS
)

export default md
