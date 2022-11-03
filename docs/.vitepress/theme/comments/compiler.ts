/**
 * @file VitePress Theme - CommentTreeCompiler
 * @module docs/vitepress/theme/comments/Compiler
 */

import type {
  BlockTag,
  Comment,
  ImplicitDescription,
  Root
} from '@flex-development/docast'
import { dedent } from 'ts-dedent'
import UnifiedCompiler from './compiler-unified'
import md from './markdown-renderer'

/**
 * [`Comment`][1] tree compiler.
 *
 * [1]: https://github.com/flex-development/docast
 *
 * @see https://github.com/unifiedjs/unified#processorcompiler
 *
 * @extends {UnifiedCompiler<Root, string[]>}
 */
class CommentTreeCompiler extends UnifiedCompiler<Root, string[]> {
  /**
   * Compiles {@link tree} based on {@link file#path}.
   *
   * @public
   * @override
   *
   * @return {string[]} Compilation result
   */
  public override compile(): string[] {
    /**
     * Compilation result.
     *
     * @const {string[]} result
     */
    const result: string[] = []

    // compile tree
    switch (true) {
      case this.file.path.endsWith('src/constants.ts'):
        result.push(...this.compileConstants())
        break
      case /src\/interfaces\/[\w-]+\.ts$/.test(this.file.path):
        result.push(this.compileInterface())
        break
      case /src\/lib\/[\w-]+\.ts$/.test(this.file.path):
        result.push(this.compileFunction())
        break
      case /src\/types\/[\w-]+\.ts$/.test(this.file.path):
        result.push(this.compileType())
        break
    }

    // return markdown documentation snippets as html
    return result.map(res => md.render(res.trim()))
  }

  /**
   * Compiler for trees generated from files containing constant values.
   *
   * @protected
   *
   * @return {string[]} Markdown documentation snippets
   */
  protected compileConstants(): string[] {
    /**
     * Documentation snippets.
     *
     * @const {string[]} snippets
     */
    const snippets: string[] = []

    // get snippets
    for (const { children, data } of this.tree.children) {
      // do nothing if comment does not have context
      if (!data.context) continue

      // declaration name and code snippet position
      const { identifier, position } = data.context

      // implicit description and block tags
      const [description, ...tags] = children as [
        ImplicitDescription,
        ...BlockTag[]
      ]

      /**
       * Documentation snippet.
       *
       * @const {string} snippet
       */
      const snippet: string = dedent`
        ## \`${identifier}\`

        ${description.data.value}
        ${this.references(tags)}

        \`\`\`ts
        ${this.snippet(position.start.offset, position.end.offset)}
        \`\`\`
      `

      // add snippet
      snippets.push(snippet)
    }

    return snippets
  }

  /**
   * Compiler for trees generated from files containing library functions.
   *
   * @protected
   *
   * @return {string} Markdown documentation snippet
   */
  protected compileFunction(): string {
    // get node containing function documentation
    const [, { children, data }] = this.tree.children as [Comment, Comment]

    // function name
    const { identifier } = data.context!

    // implicit description and block tags
    const [description, ...tags] = children as [
      ImplicitDescription,
      ...BlockTag[]
    ]

    /**
     * Function examples.
     *
     * @const {string[]} examples
     */
    const examples: string[] = tags
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
     * Function return type and description as markdown table.
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
     * Function error type and description as custom markdown container.
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

        /**
         * Container heading.
         *
         * @const {string} heading
         */
        const heading: string = this.subheading(
          identifier,
          `Throws \`${match.groups!.type!.replace('|', '\\|')}\``,
          3
        )

        return dedent`
          ::: danger ${heading}
          ${match.groups!.description ?? ''}
          :::
        `
      })
      .shift()

    // add section header to examples
    if (examples.length > 0) {
      examples.unshift('\n', this.subheading(identifier, 'Examples', 3))
    }

    // add headers to parameters table
    if (params.length > 0) {
      params.unshift(
        this.subheading(identifier, 'Parameters', 3),
        '| | | |',
        '| :- | :- | :- |'
      )
    }

    // add headers to returns table
    if (returns.length > 0) {
      returns.unshift(
        this.subheading(identifier, 'Returns', 3),
        '| | |',
        '| :- | :- |'
      )
    }

    return dedent`
      ## \`${identifier}\`

      ${description.data.value}
      ${this.references(tags)}

      ${examples.join('\n')}
      ${params.join('\n')}
      ${returns.join('\n')}
      ${throws ?? ''}
    `
  }

  /**
   * Compiler for trees generated from files containing interfaces.
   *
   * @todo display interface members in subsections
   *
   * @protected
   *
   * @return {string} Markdown documentation snippet
   */
  protected compileInterface(): string {
    // get node containing interface documentation
    const [, { children, data }] = this.tree.children as [Comment, Comment]

    // interface name and code snippet position
    const { identifier, position } = data.context!

    // implicit description and block tags
    const [description, ...tags] = children as [
      ImplicitDescription,
      ...BlockTag[]
    ]

    return dedent`
      ## \`${identifier}\`

      ${description.data.value}
      ${this.references(tags)}

      \`\`\`ts
      ${this.snippet(position.start.offset, position.end.offset)}
      \`\`\`
    `
  }

  /**
   * Compiler for trees generated from files containing type definitions.
   *
   * @protected
   *
   * @return {string} Markdown documentation snippet
   */
  protected compileType(): string {
    // get comment node containing type definition documentation
    const [, { children, data }] = this.tree.children as [Comment, Comment]

    // type definition name and code snippet position
    const { identifier, position } = data.context!

    // implicit description and block tags
    const [description, ...tags] = children as [
      ImplicitDescription,
      ...BlockTag[]
    ]

    return dedent`
      ## \`${identifier}\`

      ${description.data.value}
      ${this.references(tags)}

      \`\`\`ts
      ${this.snippet(position.start.offset, position.end.offset)}
      \`\`\`
    `
  }

  /**
   * Creates a markdown list containing reference links.
   *
   * @protected
   *
   * @param {BlockTag[]} nodes - Block tag nodes
   * @return {string} Reference links list
   */
  protected references(nodes: BlockTag[]): string {
    /**
     * Reference links.
     *
     * @const {string[]} refs
     */
    const refs: string[] = nodes
      .filter(node => node.data.tag === '@see')
      .filter(node => node.data.text.startsWith('http'))
      .map(node => `- ${node.data.text}`)

    // add section header
    if (refs.length > 0) refs.unshift('\n', '**References**')

    return refs.join('\n')
  }

  /**
   * Returns a snippet from {@link file}.
   *
   * @protected
   *
   * @param {number} offset1 - Index to begin snippet
   * @param {number} offset2 - Index to end snippet
   * @return {string} `file` snippet
   */
  protected snippet(offset1: number, offset2: number): string {
    return this.file.toString().slice(offset1, offset2).trim()
  }

  /**
   * Creates a subheading.
   *
   * @protected
   *
   * @param {string} identifier - Declaration name
   * @param {string} subtitle - Subheading text
   * @param {number} level - Heading level
   * @return {string} Subheading HTML
   */
  protected subheading(
    identifier: string,
    subtitle: string,
    level: number
  ): string {
    return md
      .render(`${'#'.repeat(level)} ${subtitle}`)
      .replace(/id="(.+)"/, `id="${identifier.toLowerCase()}--$1"`)
      .replace(/#(\w+)/, `#${identifier.toLowerCase()}--$1`)
  }
}

export default CommentTreeCompiler
