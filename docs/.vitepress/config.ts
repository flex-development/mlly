/**
 * @file VitePress Config
 * @module docs/vitepress/config
 * @see https://vitepress.vuejs.org/config/app-configs
 * @see https://vitepress.vuejs.org/config/theme-configs
 */

import type { SearchOptions } from '@algolia/client-search'
import search, { type SearchClient } from 'algoliasearch'
import { load as cheerio, type CheerioAPI } from 'cheerio'
import { globby } from 'globby'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pupa from 'pupa'
import { SitemapStream, streamToPromise } from 'sitemap'
import tsconfigpaths from 'vite-tsconfig-paths'
import {
  defineConfig,
  type HeadConfig,
  type SiteConfig,
  type TransformContext,
  type UserConfig
} from 'vitepress'
import pkg from '../../package.json' assert { type: 'json' }

const {
  ALGOLIA_API_KEY = '',
  HOSTNAME = '',
  NODE_ENV,
  VERCEL_ENV
} = process.env

/**
 * GitHub repository url.
 *
 * @const {string} repository
 */
const repository: string = pkg.repository.replace(/\.git$/, '')

/**
 * Algolia search client.
 *
 * @const {SearchClient} algolia
 */
const algolia: SearchClient = search('DG3R131QAX', ALGOLIA_API_KEY)

/**
 * Algolia search index name.
 *
 * @const {string} index
 */
const index: string = pkg.name.replace(/.+\//, '')

/**
 * VitePress configuration options.
 *
 * @const {UserConfig} config
 */
const config: UserConfig = defineConfig({
  appearance: 'dark',
  /**
   * Performs postbuild tasks.
   *
   * This includes:
   *
   * 1. Writing `sitemap.xml` to `config.outDir`
   * 2. Writing `robots.txt` to `config.outDir`
   *
   * @async
   *
   * @param {SiteConfig} config - Site configuration
   * @param {string} config.outDir - Absolute path to output directory
   * @param {string} config.root - Absolute path to project directory
   * @return {Promise<void>} Nothing when complete
   */
  async buildEnd({ outDir, root }: SiteConfig): Promise<void> {
    /**
     * Sitemap routes.
     *
     * @const {[string, CheerioAPI][]} routes
     */
    const routes: [string, CheerioAPI][] = []

    /**
     * Sitemap stream.
     *
     * @const {SitemapStream} stream
     */
    const stream: SitemapStream = new SitemapStream({ hostname: HOSTNAME })

    // get sitemap routes
    for (const route of await globby('**.html', { cwd: outDir })) {
      routes.push([
        route.replace(/\.html$/, '').replace(/index$/, ''),
        cheerio(await fs.readFile(path.resolve(outDir, route), 'utf8'))
      ])
    }

    // update sitemap stream
    // see: https://sitemaps.org/protocol.html#xmlTagDefinitions
    for (const [url, $] of routes.sort((a, b) => a[0]!.localeCompare(b[0]!))) {
      stream.write({
        changefreq: $('meta[name=changefreq]').attr('content'),
        lastmod: $('.VPLastUpdated > time').attr('datatime'),
        priority: $('meta[name=priority]').attr('content'),
        url
      })
    }

    // write sitemap.xml
    await fs.writeFile(
      path.resolve(outDir, 'sitemap.xml'),
      await streamToPromise(stream.end())
    )

    /**
     * `robots.txt` template file path.
     *
     * @const {string} robots
     */
    const robots: string = path.resolve(root, '.vitepress/templates/robots.txt')

    // write robots.txt
    await fs.writeFile(
      path.resolve(outDir, 'robots.txt'),
      pupa(await fs.readFile(robots, 'utf8'), { HOSTNAME })
    )

    return void 0
  },
  cleanUrls: 'with-subfolders',
  description: pkg.description,
  ignoreDeadLinks: false,
  lastUpdated: true,
  markdown: {
    headers: { level: [0, 0] },
    theme: { dark: 'github-dark', light: 'github-light' }
  },
  themeConfig: {
    algolia: {
      apiKey: ALGOLIA_API_KEY,
      appId: algolia.appId,
      indexName: index,
      searchParameters: {} as SearchOptions
    },
    editLink: {
      pattern: `${repository}/edit/main/docs/:path`,
      text: 'Edit this page on GitHub'
    },
    nav: [
      {
        items: [
          {
            link: repository + '/blob/main/CHANGELOG.md',
            text: 'Changelog'
          },
          {
            link: repository + '/blob/main/CONTRIBUTING.md',
            text: 'Contributing'
          },
          {
            link: repository + '/releases',
            text: 'Releases'
          }
        ],
        text: pkg.version
      }
    ],
    outline: [2, 3],
    sidebar: [
      {
        items: [{ link: '#install', text: 'Install' }],
        text: 'Getting Started'
      }
    ],
    socialLinks: [{ icon: 'github', link: repository }]
  },
  title: pkg.name,
  /**
   * Configures additional `<head>` entries.
   *
   * @see https://vitepress.vuejs.org/config/app-configs#transformhead
   * @see https://github.com/joshbuchea/HEAD
   *
   * @param {TransformContext} ctx - Vitepress transform context
   * @return {HeadConfig[]} Additional `<head>` entries
   */
  transformHead(ctx: TransformContext): HeadConfig[] {
    if (ctx.title.startsWith('404')) return []

    const { description, pageData, siteData, title } = ctx

    /**
     * {@link pageData.relativePath} as page url.
     *
     * @const {string} url
     */
    const url: string =
      pageData.relativePath === 'index.md'
        ? HOSTNAME
        : path
            .join(HOSTNAME, pageData.relativePath)
            .replace(/\.md$/, '.html')
            .replace(/index\.html$/, '')

    return [
      // document description
      ['meta', { content: description, property: 'description' }],

      // control behavior of search engine crawling and indexing
      ['meta', { content: 'index,follow', property: 'robots' }],
      ['meta', { content: 'index,follow', property: 'googlebot' }],

      // facebook open graph
      ['meta', { content: description, property: 'og:description' }],
      ['meta', { content: siteData.lang, property: 'og:locale' }],
      ['meta', { content: pkg.name, property: 'og:site_name' }],
      ['meta', { content: title, property: 'og:title' }],
      ['meta', { content: 'website', property: 'og:type' }],
      ['meta', { content: url, property: 'og:url' }],

      // twitter card
      ['meta', { content: 'summary', property: 'twitter:card' }],
      ['meta', { content: description, property: 'twitter:description' }],
      ['meta', { content: title, property: 'twitter:title' }],
      ['meta', { content: url, property: 'twitter:url' }],

      // software used to build site
      ['meta', { content: 'vitepress', property: 'generator' }],

      // prevent duplicate content issues
      ['link', { href: url.replace(/\/$/, '/index.html'), rel: 'canonical' }]
    ]
  },
  vite: {
    cacheDir: path.resolve('node_modules/.vitepress'),
    envDir: path.dirname(fileURLToPath(import.meta.url)),
    plugins: [tsconfigpaths({ projects: [path.resolve('tsconfig.json')] })],
    server: { hmr: { overlay: false } }
  },
  vue: { isProduction: [NODE_ENV, VERCEL_ENV].includes('production') }
})

export default config
