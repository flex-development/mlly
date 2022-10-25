/**
 * @file VitePress Config
 * @module docs/vitepress/config
 * @see https://vitepress.vuejs.org/config/app-configs
 * @see https://vitepress.vuejs.org/config/theme-configs
 */

import type { StoredDocSearchHit } from '@docsearch/react/dist/esm/types'
import type { Nullable } from '@flex-development/tutils'
import search, { type SearchClient, type SearchIndex } from 'algoliasearch'
import {
  load as cheerio,
  type AnyNode,
  type Cheerio,
  type CheerioAPI
} from 'cheerio'
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

const { ALGOLIA_API_KEY = '', CI = 'false', NODE_ENV, VERCEL_ENV } = process.env

/**
 * Site url.
 *
 * @const {string} HOSTNAME
 */
const HOSTNAME: string =
  VERCEL_ENV === 'production' || JSON.parse(CI) === true
    ? process.env.HOSTNAME!
    : pupa('http://localhost:{0}', [VERCEL_ENV === 'development' ? 5173 : 8080])

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
 * @const {string} index_name
 */
const index_name: string =
  pkg.name.replace(/.+\//, '') + (VERCEL_ENV === 'production' ? '' : '_preview')

/**
 * Algolia search index.
 *
 * @const {SearchIndex} index
 */
const index: SearchIndex = algolia.initIndex(index_name)

/**
 * Search index object type.
 *
 * @extends {Omit<StoredDocSearchHit, '_distinctSeqID' | '_rankingInfo'>}
 */
interface IndexObject
  extends Omit<StoredDocSearchHit, '_distinctSeqID' | '_rankingInfo'> {
  lang: string
  weight: {
    level: Nullable<number>
    pageRank: string
    position: Nullable<number>
  }
}

// clear search index
if (VERCEL_ENV === 'preview' || VERCEL_ENV === 'production') {
  await index.clearObjects()
}

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
   * 3. Applying {@link index} settings
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
        priority: +($('meta[name=priority]').attr('content') ?? '0.5'),
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

    // set search index settings
    // see: https://docsearch.algolia.com/docs/templates/#vitepress-template
    return void (await index.setSettings({
      advancedSyntax: true,
      allowTyposOnNumericTokens: false,
      attributeCriteriaComputedByMinProximity: true,
      attributeForDistinct: 'objectID',
      attributesForFaceting: ['lang', 'type'],
      attributesToHighlight: ['hierarchy', 'content'],
      attributesToRetrieve: ['anchor', 'content', 'hierarchy', 'url'],
      attributesToSnippet: ['content:10'],
      camelCaseAttributes: ['content', 'hierarchy'],
      customRanking: [
        'desc(weight.pageRank)',
        'desc(weight.level)',
        'asc(weight.position)'
      ],
      distinct: true,
      highlightPostTag: '</span>',
      highlightPreTag: '<span class="algolia-docsearch-suggestion--highlight">',
      ignorePlurals: true,
      minProximity: 1,
      minWordSizefor1Typo: 3,
      minWordSizefor2Typos: 7,
      ranking: [
        'words',
        'filters',
        'typo',
        'attribute',
        'proximity',
        'exact',
        'custom'
      ],
      removeStopWords: true,
      removeWordsIfNoResults: 'allOptional',
      searchableAttributes: [
        'content',
        'unordered(hierarchy.lvl1)',
        'unordered(hierarchy.lvl2)',
        'unordered(hierarchy.lvl3)',
        'unordered(hierarchy.lvl4)',
        'unordered(hierarchy.lvl5)',
        'unordered(hierarchy.lvl6)'
      ]
    }))
  },
  cleanUrls: 'with-subfolders',
  description: pkg.description,
  head: [
    // improve speed of first search query
    [
      'link',
      {
        crossorigin: '',
        href: 'https://' + pupa('{0}-dsn.algolia.net', [algolia.appId]),
        rel: 'preconnect'
      }
    ]
  ],
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
      indexName: index.indexName
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
    const url: string = path
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
      ['link', { href: url, rel: 'canonical' }]
    ]
  },
  /**
   * Indexes page headings and content in `code`.
   *
   * @async
   *
   * @param {string} code - HTML content
   * @param {string} id - Absolute path to `code`
   * @param {TransformContext} ctx - Vitepress transform context
   * @return {Promise<void>} Nothing when complete
   */
  async transformHtml(
    code: string,
    id: string,
    ctx: TransformContext
  ): Promise<void> {
    if (id.endsWith('404.html')) return

    /**
     * API for traversing/manipulating for {@link code}.
     *
     * @see https://github.com/cheeriojs/cheerio
     *
     * @const {CheerioAPI} $
     */
    const $: CheerioAPI = cheerio(code)

    /**
     * Page priority.
     *
     * @see https://sitemaps.org/protocol.html#xmlTagDefinitions
     *
     * @const {string} pageRank
     */
    const pageRank: string = $('meta[name=priority]').attr('content') ?? '0.5'

    /**
     * {@link ctx.pageData.relativePath} as relative url.
     *
     * @const {string} url
     */
    const url: string = path
      .join(HOSTNAME, ctx.pageData.relativePath)
      .replace(/\.md$/, '.html')
      .replace(/index\.html$/, '')

    /**
     * Search index objects.
     *
     * @const {IndexObject[]} objects
     */
    const objects: IndexObject[] = []

    // index headings
    for (const [type, heading] of [
      [...$('.vp-doc > div > h1').toArray()].map(el => ['lvl1', $(el)]),
      [...$('.vp-doc > div > h2').toArray()].map(el => ['lvl2', $(el)]),
      [...$('.vp-doc > div > h3').toArray()].map(el => ['lvl3', $(el)]),
      [...$('.vp-doc > div > h4').toArray()].map(el => ['lvl4', $(el)]),
      [...$('.vp-doc > div > h5').toArray()].map(el => ['lvl5', $(el)]),
      [...$('.vp-doc > div > h6').toArray()].map(el => ['lvl6', $(el)])
    ].flat() as [IndexObject['type']?, Cheerio<AnyNode>?][]) {
      if (!type || !heading) continue

      /**
       * Heading anchor.
       *
       * @const {string} anchor
       */
      const anchor: string = heading.attr('id')!

      /**
       * Heading search index object id.
       *
       * @const {string} objectID
       */
      const objectID: string = [url, anchor].join('#')

      /**
       * Heading level.
       *
       * @const {number} position
       */
      const position: number = +type.replace(/lvl/, '')

      /**
       * Retrieves heading text from `node`.
       *
       * @param {Cheerio<AnyNode>} node - Node to retrieve text from
       * @return {string} Heading text
       */
      const lvl = (node: Cheerio<AnyNode>): string => {
        return node.text().split('#')[0]!.trim()
      }

      /**
       * Heading text.
       *
       * @const {string} content
       */
      const content: string = lvl(heading.first())

      objects.push({
        anchor,
        content,
        hierarchy: {
          lvl0: 'Documentation',
          lvl1: ctx.pageData.title,
          lvl2: 2 <= position ? lvl($('.vp-doc > div > h2').last()) : null,
          lvl3: 3 <= position ? lvl($('.vp-doc > div > h3').last()) : null,
          lvl4: 4 <= position ? lvl($('.vp-doc > div > h4').last()) : null,
          lvl5: 5 <= position ? lvl($('.vp-doc > div > h5').last()) : null,
          lvl6: 6 <= position ? lvl($('.vp-doc > div > h6').last()) : null,
          [type]: content
        },
        lang: ctx.siteData.lang,
        objectID,
        type,
        url: objectID,
        url_without_anchor: url,
        weight: { level: 100 - position * 10, pageRank, position }
      })
    }

    // index page content
    for (const p of [...$('.vp-doc p').toArray()].map(el => $(el))) {
      /**
       * Page content.
       *
       * @const {string} content
       */
      const content: string = p.first().text().trim()

      // do nothing if content is empty string
      if (!content) continue

      /**
       * Page content anchor.
       *
       * @see https://web.dev/text-fragments/
       *
       * @const {string} anchor
       */
      const anchor: string = ':~:text=' + encodeURI(content)

      /**
       * Page content index object id.
       *
       * @const {string} objectID
       */
      const objectID: string = [url, anchor].join('#')

      objects.push({
        anchor,
        content,
        hierarchy: {
          lvl0: 'Documentation',
          lvl1: ctx.pageData.title,
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null,
          lvl6: null
        },
        lang: ctx.siteData.lang,
        objectID,
        type: 'content',
        url: objectID,
        url_without_anchor: url,
        weight: { level: 30, pageRank, position: 7 }
      })
    }

    // update search index
    for (const object of objects) await index.saveObject(object)

    return void objects
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
