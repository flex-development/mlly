/**
 * @file VitePress Theme Config
 * @module docs/vitepress/theme
 * @see https://vitepress.vuejs.org/guide/theme-introduction
 */

import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

/**
 * VitePress theme configuration.
 *
 * @const {Theme} theme
 */
const theme: Theme = {
  Layout: DefaultTheme.Layout,
  NotFound: DefaultTheme.NotFound
}

export default theme
