/**
 * @file VitePress Theme - ThemeConfig
 * @module docs/vitepress/theme/ThemeConfig
 */

import type { DefaultTheme } from 'vitepress'

/**
 * VitePress theme configuration schema.
 *
 * @see https://vitepress.vuejs.org/config/theme-configs
 *
 * @extends {DefaultTheme.Config}
 */
interface ThemeConfig extends DefaultTheme.Config {
  /**
   * API documentation.
   */
  apidocs: [string, string][]

  /**
   * Header navigation menu configuration.
   *
   * @see https://vitepress.vuejs.org/config/theme-configs#nav
   */
  nav: [
    { link: string; text: string },
    DefaultTheme.NavItemWithChildren & {
      items: DefaultTheme.NavItemWithLink[]
      text: string
    }
  ]

  /**
   * Sidebar navigation menu configuration.
   *
   * @see https://vitepress.vuejs.org/config/theme-configs#sidebar
   */
  sidebar: (DefaultTheme.SidebarGroup & {
    items: { link: string; text: string }[]
    text: string
  })[]
}

export type { ThemeConfig as default }
