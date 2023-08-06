/**
 * @file VitePress Composables - usePageUrl
 * @module docs/vitepress/composables/usePageUrl
 */

import pathe from '@flex-development/pathe'

/**
 * Creates a page url from a relative path.
 *
 * @param {string} hostname - Site url
 * @param {string} path - Relative page path
 * @return {string} Page url
 */
const usePageUrl = (hostname: string, path: string): string => {
  return pathe
    .join(hostname, path)
    .replace(/\.md$/, '.html')
    .replace(/index\.html$/, '')
}

export default usePageUrl
