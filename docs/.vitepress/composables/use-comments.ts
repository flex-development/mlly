/**
 * @file VitePress Composables - useComments
 * @module docs/vitepress/composables/useComments
 */

import docast, {
  type BlockTag,
  type Comment,
  type Options,
  type Root
} from '@flex-development/docast'
import { globby } from 'globby'
import type MarkdownIt from 'markdown-it'
import fs from 'node:fs/promises'
import path from 'node:path'
import { dedent } from 'ts-dedent'
import { unified } from 'unified'
import { createMarkdownRenderer } from 'vitepress'
import MARKDOWN_OPTIONS from '../theme/markdown-options'

/**
 * Extracts API documentation from JSDoc comments.
 *
 * @todo resolve links to source files and symbols
 *
 * @async
 *
 * @return {Promise<[string, string][]>} API identifiers mapped to documentation
 */
async function useComments(): Promise<[string, string][]> {
  /**
   * API identifiers mapped to documentation.
   *
   * @const {[string, string][]} docs
   */
  const docs: [string, string][] = []

  /**
   * Names of files containing API documentation.
   *
   * @const {string[]} files
   */
  const files: string[] = await globby('*.ts', {
    cwd: path.resolve(process.cwd(), 'src', 'lib'),
    ignore: ['index.ts']
  })

  /**
   * Markdown renderer.
   *
   * @const {MarkdownIt} md
   */
  const md: MarkdownIt = await createMarkdownRenderer(
    path.resolve('docs'),
    MARKDOWN_OPTIONS
  )

  // get api documentation
  for (const file of files) {
    /**
     * Docblock abstract syntax tree for {@link file}.
     *
     * @see https://github.com/flex-development/docast
     *
     * @const {Root} tree
     */
    const tree: Root = unified()
      .use<[Options?], string, Root>(docast)
      .parse(await fs.readFile(path.resolve('src', 'lib', file)))

    // comment node containing documentation
    const [, { children, data }] = tree.children as [Comment, Comment]

    // implicit description and block tag nodes
    const [description, ...tags] = children

    // get comment context
    const { identifier } = data.context!

    /**
     * Creates a subheading.
     *
     * @param {string} subtitle - Subheading text
     * @param {number} level - Heading level
     * @return {string} Subheading HTML
     */
    const subheading = (subtitle: string, level: number): string => {
      /**
       * Subheading HTML.
       *
       * @const {string} html
       */
      const html: string = md.render(`${'#'.repeat(level)} ${subtitle}`)

      return html
        .replace(/id="(.+)"/, `id="${identifier.toLowerCase()}--$1"`)
        .replace(/#(\w+)/, `#${identifier.toLowerCase()}--$1`)
    }

    /**
     * API examples.
     *
     * @const {string[]} examples
     */
    const examples: string[] = (tags as BlockTag[])
      .filter(node => node.data.tag === '@example')
      .map(node => {
        return node.data.text.startsWith('`')
          ? node.data.text
          : dedent`
            \`\`\`ts
            ${node.data.text}
            \`\`\`
          `
      })

    /**
     * Function parameters as markdown table.
     *
     * @const {string[]} params
     */
    const params: string[] = tags
      .filter(node => node.data.tag === '@param')
      .map(node => {
        /**
         * Match for parameter name, description, and type.
         *
         * **Note**: Name will include default value if provided.
         *
         * @const {RegExpMatchArray} match
         */
        const match: RegExpMatchArray = node.data.value
          .matchAll(/^@\w+ (?<type>{.+}) (?<name>.+?) - (?<description>.+)/g)
          .next().value

        // normalize parameter type
        match.groups!.type = match.groups!.type!.replace('|', '\\|')

        // parameter description, name, and type
        const { description, name, type } = match.groups!

        return `| \`${type}\` | \`${name}\` | ${description} |`
      })

    /**
     * Reference links.
     *
     * @const {string[]} references
     */
    const references: string[] = (tags as BlockTag[])
      .filter(node => node.data.tag === '@see')
      .filter(node => node.data.text.startsWith('http'))
      .map(node => `- ${node.data.text}`)

    /**
     * Return type and description as markdown table.
     *
     * @const {string[]} returns
     */
    const returns: string[] = tags
      .filter(node => node.data.tag === '@return')
      .map(node => {
        /**
         * Match for `@return` tag description and type.
         *
         * @const {RegExpMatchArray} match
         */
        const match: RegExpMatchArray = node.data.value
          .matchAll(/^@return (?<type>{.+}) (?<description>.+)/g)
          .next().value

        // normalize parameter type
        match.groups!.type = match.groups!.type!.replace('|', '\\|')

        return `| \`${match.groups!.type}\` | ${match.groups!.description} |`
      })

    /**
     * Error type and description as custom markdown container.
     *
     * @see https://vitepress.vuejs.org/guide/markdown#custom-containers
     *
     * @const {string | undefined} throws
     */
    const throws: string | undefined = tags
      .filter(node => node.data.tag === '@throws')
      .map(node => {
        /**
         * Match for `@throws` tag description and type.
         *
         * @const {RegExpMatchArray} match
         */
        const match: RegExpMatchArray = node.data.value
          .matchAll(/^@throws (?<type>{.+})(?: (?<description>.+))?/g)
          .next().value

        // normalize parameter type
        match.groups!.type = match.groups!.type!.replace('|', '\\|')

        return dedent`
          ::: danger ${subheading(`Throws \`${match.groups!.type}\``, 3)}
          ${match.groups!.description ?? ''}
          :::
        `
      })
      .shift()

    // add section header to examples
    if (examples.length > 0) examples.unshift('\n', subheading('Examples', 3))

    // add headers to parameters table
    if (params.length > 0) {
      params.unshift(subheading('Parameters', 3), '| | | |', '| :- | :- | :- |')
    }

    // add section header to references
    if (references.length > 0) references.unshift('\n', '**References**')

    // add headers to returns table
    if (returns.length > 0) {
      returns.unshift(subheading('Returns', 3), '| | |', '| :- | :- |')
    }

    /**
     * API documentation as markdown.
     *
     * @const {string} documentation
     */
    const documentation: string = dedent`
      ## \`${identifier}\`

      ${description!.data.value}
      ${references.join('\n')}

      ${examples.join('\n')}
      ${params.join('\n')}
      ${returns.join('\n')}
      ${throws ?? ''}
    `

    // add api documentation
    docs.push([identifier, md.render(documentation.trim())])
  }

  return docs
}

export default useComments
