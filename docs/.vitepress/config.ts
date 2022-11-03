/**
 * @file VitePress Config
 * @module docs/vitepress/config
 * @see https://vitepress.vuejs.org/config/app-configs
 * @see https://vitepress.vuejs.org/config/theme-configs
 */

import search, { type SearchClient, type SearchIndex } from 'algoliasearch'
import {
  load as cheerio,
  type AnyNode,
  type Cheerio,
  type CheerioAPI
} from 'cheerio'
import { config as dotenv } from 'dotenv'
import { globby } from 'globby'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pupa from 'pupa'
import { SitemapStream, streamToPromise } from 'sitemap'
import tsconfigpaths from 'vite-tsconfig-paths'
import {
  defineConfigWithTheme as defineConfig,
  type HeadConfig,
  type SiteConfig,
  type TransformContext,
  type UserConfig
} from 'vitepress'
import pkg from '../../package.json' assert { type: 'json' }
import useComments from './composables/use-comments'
import usePageUrl from './composables/use-page-url'
import type ThemeConfig from './theme/config'
import type IndexObject from './theme/index-object'
import MARKDOWN_OPTIONS from './theme/markdown-options'

/**
 * Environment file directory.
 *
 * @const {string} ENV_DIR
 */
const ENV_DIR: string = path.dirname(fileURLToPath(import.meta.url))

// load environment variables
dotenv({ path: path.resolve(ENV_DIR, '.env') })

// environment variables
const {
  ALGOLIA_API_KEY = '',
  CI = 'false',
  MEASUREMENT_ID,
  NODE_ENV,
  VERCEL_ENV,
  VERIFICATION_ID = ''
} = process.env

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
 * Project version as GitHub branch name or release tag.
 *
 * @const {string} GITHUB_VERSION
 */
const GITHUB_VERSION: string = pkg.version === '0.0.0' ? 'main' : pkg.version

/**
 * GitHub repository url.
 *
 * @const {string} REPOSITORY
 */
const REPOSITORY: string = pkg.repository.replace(/\.git$/, '')

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

// clear search index
if (VERCEL_ENV === 'preview' || VERCEL_ENV === 'production') {
  await index.clearObjects()
}

/**
 * VitePress configuration options.
 *
 * @const {UserConfig<ThemeConfig>} config
 */
const config: UserConfig<ThemeConfig> = defineConfig<ThemeConfig>({
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
  markdown: MARKDOWN_OPTIONS,
  themeConfig: {
    algolia: {
      apiKey: ALGOLIA_API_KEY,
      appId: algolia.appId,
      indexName: index.indexName
    },
    documentation: await useComments(),
    editLink: {
      pattern: `${REPOSITORY}/edit/${GITHUB_VERSION}/docs/:path`,
      text: 'Edit this page on GitHub'
    },
    nav: [
      {
        link: '/api/',
        text: 'API'
      },
      {
        items: [
          {
            link: `${REPOSITORY}/blob/${GITHUB_VERSION}/CHANGELOG.md`,
            text: 'Changelog'
          },
          {
            link: `${REPOSITORY}/blob/${GITHUB_VERSION}/CONTRIBUTING.md`,
            text: 'Contributing'
          },
          {
            link: REPOSITORY + '/releases',
            text: 'Releases'
          }
        ],
        text: pkg.version
      }
    ],
    outline: [2, 3],
    sidebar: [
      {
        items: [{ link: '/#install', text: 'Install' }],
        text: 'Getting Started'
      },
      {
        items: [
          { link: '/api/', text: 'API Reference' },
          { link: '/api/constants', text: 'Constants' }
        ],
        text: 'API'
      }
    ],
    socialLinks: [{ icon: 'github', link: REPOSITORY }]
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
    const url: string = usePageUrl(HOSTNAME, pageData.relativePath)

    return [
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

      // verify website ownership
      ['meta', { content: VERIFICATION_ID, name: 'google-site-verification' }],

      // software used to build site
      ['meta', { content: 'vitepress', property: 'generator' }],

      // prevent duplicate content issues
      ['link', { href: url, rel: 'canonical' }],

      // google analytics
      [
        'script',
        {
          async: '',
          src: `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
        }
      ],
      [
        'script',
        {},
        `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}\ngtag('js',new Date());gtag('config','${MEASUREMENT_ID}')`
      ]
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
    const url: string = usePageUrl(HOSTNAME, ctx.pageData.relativePath)

    /**
     * Search index objects.
     *
     * @const {IndexObject[]} objects
     */
    const objects: IndexObject[] = []

    // index headings
    for (const [type, heading] of [
      [...$('.vp-doc > div h1').toArray()].map(el => ['lvl1', $(el)]),
      [...$('.vp-doc > div h2').toArray()].map(el => ['lvl2', $(el)]),
      [...$('.vp-doc > div h3').toArray()].map(el => ['lvl3', $(el)]),
      [...$('.vp-doc > div h4').toArray()].map(el => ['lvl4', $(el)]),
      [...$('.vp-doc > div h5').toArray()].map(el => ['lvl5', $(el)]),
      [...$('.vp-doc > div h6').toArray()].map(el => ['lvl6', $(el)])
    ].flat() as [IndexObject['type']?, Cheerio<AnyNode>?][]) {
      if (!type || !heading) continue

      /**
       * Heading level.
       *
       * @const {number} position
       */
      const position: number = +type.replace(/lvl/, '')

      // skip indexing headings past level 2 on api reference page
      if (ctx.pageData.relativePath.startsWith('api/') && position > 2) {
        continue
      }

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
          lvl2: 2 <= position ? lvl($('.vp-doc > div h2').last()) : null,
          lvl3: 3 <= position ? lvl($('.vp-doc > div h3').last()) : null,
          lvl4: 4 <= position ? lvl($('.vp-doc > div h4').last()) : null,
          lvl5: 5 <= position ? lvl($('.vp-doc > div h5').last()) : null,
          lvl6: 6 <= position ? lvl($('.vp-doc > div h6').last()) : null,
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
    for (const el of [
      ...$('.vp-doc p').toArray(),
      ...$('.vp-doc li').toArray()
    ].map(el => $(el))) {
      /**
       * Page content.
       *
       * @const {string} content
       */
      const content: string = el.first().text().trim()

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
    envDir: ENV_DIR,
    plugins: [tsconfigpaths({ projects: [path.resolve('tsconfig.json')] })],
    server: { hmr: { overlay: false } }
  },
  vue: { isProduction: [NODE_ENV, VERCEL_ENV].includes('production') }
})

export default config
