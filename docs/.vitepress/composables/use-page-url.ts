/**
 * @file VitePress Composables - usePageUrl
 * @module docs/vitepress/composables/usePageUrl
 */

/**
 * Creates a page url from a relative path.
 *
 * @param {string} hostname - Site url
 * @param {string} path - Relative page path
 * @return {string} Page url
 */
function usePageUrl(hostname: string, path: string): string {
  return `${hostname}/${path}`
    .replace(/\.md$/, '.html')
    .replace(/index\.html$/, '')
}

export default usePageUrl
