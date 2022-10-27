/**
 * @file VitePress Theme Config
 * @module docs/vitepress/theme
 * @see https://vitepress.vuejs.org/guide/theme-introduction
 */

import type { App } from '@vue/runtime-core'
import type { EnhanceAppContext, Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ApiDoc from '../components/ApiDoc.vue'

/**
 * VitePress theme configuration.
 *
 * @const {Theme} theme
 */
const theme: Theme = {
  Layout: DefaultTheme.Layout,
  NotFound: DefaultTheme.NotFound,
  /**
   * Performs app enhancement tasks.
   *
   * This includes:
   *
   * - Registering global components
   *
   * @see https://vuejs.org/guide/components/registration.html
   *
   * @param {EnhanceAppContext} ctx - VitePress app enhancement context
   * @param {App} ctx.app - Vue 3 app instance
   * @return {void} Nothing when complete
   */
  enhanceApp({ app }: EnhanceAppContext): void {
    app.component('ApiDoc', ApiDoc)
  }
}

export default theme
