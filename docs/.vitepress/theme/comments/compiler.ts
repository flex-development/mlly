/**
 * @file VitePress Theme - CommentsCompiler
 * @module docs/vitepress/theme/comments/Compiler
 */

import {
  Kind,
  Type,
  type BlockTag,
  type Comment,
  type ImplicitDescription,
  type InlineTag,
  type Node,
  type Root
} from '@flex-development/docast'
import slugify from '@sindresorhus/slugify'
import type { Position } from 'unist'
import { remove } from 'unist-util-remove'
import { source } from 'unist-util-source'
import { CONTINUE, EXIT, visit, type VisitorResult } from 'unist-util-visit'
import type { BuildVisitor } from 'unist-util-visit/complex-types'
import type { VFile } from 'vfile'
import UnifiedCompiler from './compiler-unified'
import replacements from './link-replacements.json' assert { type: 'json' }
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
class CommentsCompiler extends UnifiedCompiler<Root, string[]> {
  /**
   * Instantiates a new [`Comment`][1] tree compiler.
   *
   * [1]: https://github.com/flex-development/docast
   *
   * @param {Root} tree - `Comment` tree to compile
   * @param {VFile} file - File associated with `tree`
   */
  constructor(tree: Root, file: VFile) {
    super(tree, file)

    // filter tree
    Object.assign(this, {
      tree: remove(this.tree, (node: Node): boolean => {
        // retain non-comment nodes
        if (node.type !== Type.COMMENT) return false

        // remove comments not associated with declarations
        if (node.data.context === null) return true

        // remove function and interface member comments
        return node.position?.start.column !== 1
      })
    })
  }

  /**
   * Compiles {@link tree}.
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

    /**
     * Extracts documentation from JSDoc comments as markdown snippets by
     * visiting nodes in {@link tree}.
     *
     * @param {Comment} node - Root node child
     * @return {VisitorResult} Visitor result
     */
    const visitor: BuildVisitor<Root, Type.COMMENT> = (
      node: Comment
    ): VisitorResult => {
      /**
       * Markdown documentation snippet.
       *
       * @var {string} doc
       */
      let doc: string = ''

      // add declaration name
      doc += this.identifier(node, 2) + '\n\n'

      // add declaration description
      doc += this.description(node)

      // add declaration specific documentation
      switch (true) {
        case this.isArrowFunction(node):
          doc += this.example(node)
          doc += this.references(node)
          doc += this.params(node)
          doc += this.returns(node)
          doc += this.throws(node)
          break
        case this.isConstant(node):
        case this.isInterface(node):
        case this.isType(node):
          doc += this.snippet(node.data.context!.position) + '\n\n'
          doc += this.references(node)
          break
      }

      // apply @link replacements
      for (const [key, replacement] of Object.entries(replacements)) {
        doc = doc.replace(
          new RegExp(`(?<!(?:\\/\\/|\\*|\`\`\`.*\n).*)${key}`, 'g'),
          replacement
        )
      }

      // add markdown documentation snippet
      return void result.push(doc.trim() + '\n')
    }

    // get markdown documentation snippets
    visit(this.tree, Type.COMMENT, visitor)

    // return markdown documentation snippets as html
    return result.map(res => md.render(res.trim()))
  }

  /**
   * Creates a custom markdown container.
   *
   * @see https://vitepress.vuejs.org/guide/markdown#custom-containers
   *
   * @protected
   *
   * @param {'danger'|'details'|'info'|'tip'|'warning'} type - Container type
   * @param {string} [content=''] - Container content
   * @param {string} [heading=''] - Custom heading
   * @return {string} Custom markdown container
   */
  protected customContainer(
    type: 'danger' | 'details' | 'info' | 'tip' | 'warning',
    content: string = '',
    heading: string = ''
  ): string {
    return `::: ${type} ${heading}\n${content}\n:::\n\n`
  }

  /**
   * Extracts a declaration description from `node`.
   *
   * @protected
   *
   * @param {Comment} node - Comment node to extract description from
   * @return {string} Description text or empty string
   */
  protected description(node: Comment): string {
    /**
     * Declaration description.
     *
     * @var {string} description
     */
    let description: string = ''

    /**
     * Extracts a declaration description from {@link node}.
     *
     * @param {ImplicitDescription} visited - Implicit description node
     * @return {VisitorResult} Visitor result
     */
    const visitor: BuildVisitor<Comment, Type.IMPLICIT_DESCRIPTION> = (
      visited: ImplicitDescription
    ): VisitorResult => {
      description = visited.data.value + '\n\n'
      return EXIT
    }

    // extract declaration description
    visit(node, Type.IMPLICIT_DESCRIPTION, visitor)

    return description
  }

  /**
   * Builds a markdown code fence containing example code.
   *
   * @protected
   *
   * @param {Comment} node - Comment node to pull `@example` tag from
   * @return {string} Markdown code fence containing example or empty string
   */
  protected example(node: Comment): string {
    /**
     * Markdown code fence containing example code.
     *
     * @var {string} example
     */
    let example: string = ''

    /**
     * Builds a markdown code fence containing example code by visiting each
     * child node in {@link node} until an `@example` tag is found.
     *
     * @param {BlockTag} visited - Block tag node
     * @return {VisitorResult} Visitor result
     */
    const visitor: BuildVisitor<Comment, Type.BLOCK_TAG> = (
      visited: BlockTag
    ): VisitorResult => {
      // do nothing if tag name is not @example
      if (visited.data.tag !== '@example') return CONTINUE

      // add example
      example += visited.data.text.startsWith('`')
        ? visited.data.text + '\n'
        : `\`\`\`ts\n${visited.data.text}\n\`\`\`\n`

      return EXIT
    }

    // build code fence
    visit(node, Type.BLOCK_TAG, visitor)

    return example ? example + '\n' : example
  }

  /**
   * Creates a markdown heading.
   *
   * @protected
   *
   * @param {string} text - Heading text
   * @param {1 | 2 | 3 | 4 | 5 | 6} depth - Heading level
   * @return {string} Markdown heading
   */
  protected heading(text: string, depth: 1 | 2 | 3 | 4 | 5 | 6): string {
    return `${'#'.repeat(depth)} ${text}`
  }

  /**
   * Returns a declaration name as a heading.
   *
   * @see {@link Comment}
   *
   * @protected
   *
   * @param {Comment} node - Comment node to get declaration name from
   * @param {1 | 2 | 3 | 4 | 5 | 6} depth - Heading level
   * @return {string} Declaration name as markdown heading
   */
  protected identifier(node: Comment, depth: 1 | 2 | 3 | 4 | 5 | 6): string {
    return this.heading(`\`${node.data.context!.identifier}\``, depth)
  }

  /**
   * Checks if `node` represents an arrow function.
   *
   * @protected
   *
   * @param {Comment} node - Node to check
   * @return {boolean} `true` if `node` represents arrow function
   */
  protected isArrowFunction(node: Comment): boolean {
    return node.data.context?.kind === Kind.CONST && this.returns(node) !== ''
  }

  /**
   * Checks if `node` represents a constant value.
   *
   * @protected
   *
   * @param {Comment} node - Comment node to check
   * @return {boolean} `true` if `node` represents constant value
   */
  protected isConstant(node: Comment): boolean {
    /**
     * Constant value check.
     *
     * @var {boolean} constant
     */
    let constant: boolean = false

    /**
     * Checks if `node` represents a constant value by visiting each block tag
     * child node in {@link node} until an `@const` tag is found.
     *
     * @param {BlockTag} visited - Block tag node
     * @return {VisitorResult} Visitor result
     */
    const visitor: BuildVisitor<Comment, Type.BLOCK_TAG> = (
      visited: BlockTag
    ): VisitorResult => {
      if (visited.data.tag !== '@const') return CONTINUE
      constant = true
      return EXIT
    }

    // check if node represents constant value
    visit(node, Type.BLOCK_TAG, visitor)

    return constant
  }

  /**
   * Checks if `node` represents an interface.
   *
   * @protected
   *
   * @param {Comment} node - Comment node to check
   * @return {boolean} `true` if `node` represents interface
   */
  protected isInterface(node: Comment): boolean {
    return node.data.context?.kind === Kind.INTERFACE
  }

  /**
   * Checks if `node` represents a type definition.
   *
   * @protected
   *
   * @param {Comment} node - Comment node to check
   * @return {boolean} `true` if `node` represents type definition
   */
  protected isType(node: Comment): boolean {
    return node.data.context?.kind === Kind.TYPE
  }

  /**
   * Builds a markdown table containing function parameters.
   *
   * @todo link types
   *
   * @protected
   *
   * @param {Comment} node - Comment node to get `@param` tags from
   * @return {string} Markdown table or empty string
   */
  protected params(node: Comment): string {
    // get declaration name
    const { identifier } = node.data.context!

    /**
     * Markdown table containing function parameters.
     *
     * @var {string} params
     */
    let params: string = ''

    /**
     * Builds a markdown table by visiting each `@param` tag in {@link node}.
     *
     * @param {BlockTag} visited - Block tag node
     * @return {VisitorResult} Visitor result
     */
    const visitor: BuildVisitor<Comment, Type.BLOCK_TAG> = (
      visited: BlockTag
    ): VisitorResult => {
      if (visited.data.tag !== '@param') return CONTINUE

      // add table headers
      if (params === '') {
        params += this.subheading(identifier, 'Params', 3) + '\n\n'
        params += '| | | |\n| :- | :- | :- |\n'
      }

      // get parameter name, description, and type
      const { groups }: RegExpMatchArray = visited.data.value
        .matchAll(/^@\w+ {(?<type>.+)} (?<name>.+?) - (?<description>.+)/g)
        .next().value

      // add parameter type, name, and description
      params += `| \`${groups!.type!.replace('|', '\\|')}\` `
      params += `| \`${groups!.name}\` `
      params += `| ${groups!.description} |\n`

      return CONTINUE
    }

    // build table
    visit(node, Type.BLOCK_TAG, visitor)

    return params ? params + '\n' : params
  }

  /**
   * Builds a markdown list containing reference links.
   *
   * @param {Comment} node - Comment node to get `@see` tags from
   * @return {string} Markdown reference link list
   */
  protected references(node: Comment): string {
    // get declaration name
    const { identifier } = node.data.context!

    /**
     * Markdown list containing reference links.
     *
     * @var {string} list
     */
    let list: string = ''

    /**
     * Builds a list containing reference links by visiting each `@see` tag in
     * {@link node}.
     *
     * @param {BlockTag} visited - Block tag node
     * @return {VisitorResult} Visitor result
     */
    const visitor: BuildVisitor<Comment, Type.BLOCK_TAG> = (
      visited: BlockTag
    ): VisitorResult => {
      // do nothing if tag name is not @see
      if (visited.data.tag !== '@see') return CONTINUE

      // add list header
      if (list.length === 0) {
        list += this.subheading(identifier, 'See Also', 3) + '\n\n'
      }

      // add list item
      if (visited.data.text.startsWith('{@link')) {
        const [{ data }] = visited.children as [InlineTag]
        list += `- [\`${data.text}\`](${visited.data.text})\n`
      } else {
        list += `- ${visited.data.text}\n`
      }

      return CONTINUE
    }

    // build list
    visit(node, Type.BLOCK_TAG, visitor)

    return list ? list + '\n' : list
  }

  /**
   * Builds a markdown section documenting the value a function returns.
   *
   * @todo link types
   *
   * @protected
   *
   * @param {Comment} node - Comment node to get `@return` tag from
   * @return {string} Markdown section or empty string
   */
  protected returns(node: Comment): string {
    // get declaration name
    const { identifier } = node.data.context!

    /**
     * Markdown section documenting the value a function returns.
     *
     * @var {string} section
     */
    let section: string = ''

    /**
     * Builds a markdown section documenting the value a function returns by
     * visiting each child node in {@link node} until an `@return` tag is found.
     *
     * @param {BlockTag} visited - Block tag node
     * @return {VisitorResult} Visitor result
     */
    const visitor: BuildVisitor<Comment, Type.BLOCK_TAG> = (
      visited: BlockTag
    ): VisitorResult => {
      /**
       * Possible match for `@return` tag description and type parameter.
       *
       * @const {RegExpMatchArray | undefined} match
       */
      const match: RegExpMatchArray | undefined = visited.data.value
        .matchAll(/^@return {(?<type>.+)} (?<description>.+)/g)
        .next().value

      // do nothing if no match for @return
      if (!match) return CONTINUE

      // add section header
      if (section.length === 0) {
        section += this.subheading(identifier, 'Returns', 3) + '\n\n'
      }

      // get return type and description
      const { description, type } = match.groups!

      // add return type and description
      section += `\`${type}\`&nbsp;&nbsp;&nbsp;${description}\n`
      return EXIT
    }

    // build section
    visit(node, Type.BLOCK_TAG, visitor)

    return section ? section + '\n' : section
  }

  /**
   * Returns the source code associated with a node or position.
   *
   * @protected
   *
   * @param {Node | Position} value - Node or position
   * @return {string} Source code wrapped in markdown code fence
   */
  protected snippet(value: Node | Position): string {
    return `\`\`\`ts\n${source(value, this.file) ?? ''}\n\`\`\``
  }

  /**
   * Creates a subheading.
   *
   * @protected
   *
   * @param {string} identifier - Declaration name
   * @param {string} subtitle - Subheading text
   * @param {1 | 2 | 3 | 4 | 5 | 6} depth - Heading level
   * @return {string} Subheading HTML
   */
  protected subheading(
    identifier: string,
    subtitle: string,
    depth: 1 | 2 | 3 | 4 | 5 | 6
  ): string {
    /**
     * Subheading id.
     *
     * @see https://github.com/valeriangalliat/markdown-it-anchor#manually-setting-the-id-attribute
     *
     * @const {string} id
     */
    const id: string = slugify(`${identifier}-${subtitle}`, {
      customReplacements: [[`ErrnoException`, '']],
      decamelize: false
    })

    return `${this.heading(subtitle, depth)} {#${id}}`
  }

  /**
   * Builds a markdown section documenting the value a function throws.
   *
   * @protected
   *
   * @param {Comment} node - Comment node to get `@throws` tag from
   * @return {string} Markdown section or empty string
   */
  protected throws(node: Comment): string {
    // get declaration name
    const { identifier } = node.data.context!

    /**
     * Markdown section documenting the value a function throws.
     *
     * @var {string} section
     */
    let section: string = ''

    /**
     * Builds a markdown section documenting the value a function throws by
     * visiting each child node in {@link node} until an `@throws` tag is found.
     *
     * @param {BlockTag} visited - Block tag node
     * @return {VisitorResult} Visitor result
     */
    const visitor: BuildVisitor<Comment, Type.BLOCK_TAG> = (
      visited: BlockTag
    ): VisitorResult => {
      /**
       * Possible match for `@throws` tag description and type parameter.
       *
       * @const {RegExpMatchArray | undefined} match
       */
      const match: RegExpMatchArray | undefined = visited.data.value
        .matchAll(/^@throws {(?<type>.+)}(?: (?<description>.+))?/g)
        .next().value

      // do nothing if no match for @throws
      if (!match) return CONTINUE

      // normalize exception type
      match.groups!.type = match.groups!.type!.replace('|', '\\|')

      // get exception type and description
      const { description, type } = match.groups!

      // add exception type and description
      section = this.customContainer(
        'danger',
        description,
        md.render(this.subheading(identifier, `Throws \`${type}\``, 3))
      )

      return EXIT
    }

    // build section
    visit(node, Type.BLOCK_TAG, visitor)

    return section
  }
}

export default CommentsCompiler
