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
  type Root
} from '@flex-development/docast'
import {
  cast,
  get,
  isEmptyString,
  isNull,
  trim,
  type LiteralUnion,
  type Optional
} from '@flex-development/tutils'
import slugify from '@sindresorhus/slugify'
import type unist from 'unist'
import { remove } from 'unist-util-remove'
import { source } from 'unist-util-source'
import {
  CONTINUE,
  EXIT,
  visit,
  type BuildVisitor,
  type VisitorResult
} from 'unist-util-visit'
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
    remove(this.tree, (node: unist.Node): boolean => {
      // retain non-comment nodes
      if (node.type !== Type.COMMENT) return false

      // remove comments not associated with declarations
      if (isNull(cast<Comment>(node).context)) return true

      // remove function and interface member comments
      return node.position?.start.column !== 1
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
        case this.isEnum(node):
        case this.isInterface(node):
        case this.isType(node):
          doc += this.snippet(node.context!.position) + '\n\n'
          doc += this.references(node)
          break
      }

      // apply {@link .*} and {@linkcode .*} replacements
      for (const [key, url] of Object.entries(replacements)) {
        const [text] = /(?<={@link(?:code)? )(\S+?)(?=})/.exec(key)!

        /**
         * Regex patterns used to replace `{@link .*}` and `{@linkcode .*}` in
         * {@linkcode doc}.
         *
         * @const {RegExp[]} expressions
         */
        const expressions: RegExp[] = [
          new RegExp(`(?<=\\[\`.+\`\\]\\()${key}(?=\\))`, 'g'),
          new RegExp(`(?<=\\[\\d+\\]\\: )${this.escapeRegExp(key)}`, 'g'),
          new RegExp(this.escapeRegExp(key), 'g')
        ]

        // do replacements
        for (const [i, regex] of expressions.entries()) {
          doc = doc.replace(
            regex,
            i === expressions.length - 1 ? `[\`${text}\`](${url})` : url
          )
        }
      }

      // add markdown documentation snippet
      return void result.push(trim(doc) + '\n')
    }

    // get markdown documentation snippets
    visit(this.tree, Type.COMMENT, visitor)

    // return markdown documentation snippets as html
    return result.map(res => md.render(trim(res)))
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
      description = visited.value + '\n\n'
      return EXIT
    }

    // extract declaration description
    visit(node, Type.IMPLICIT_DESCRIPTION, visitor)

    return description
  }

  /**
   * Escapes special characters in the given regex `pattern`.
   *
   * A backslash escape (`\\`) is used when valid. A `\x2d` escape is used when
   * the former would be disallowed by stricter Unicode pattern grammar.
   *
   * @protected
   *
   * @param {string} pattern - Regex pattern to escape
   * @return {string} `pattern` with special characters escaped
   */
  protected escapeRegExp(pattern: string): string {
    return pattern.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&').replace(/-/g, '\\x2d')
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
      if (visited.tag !== '@example') return CONTINUE

      // add example
      example += visited.text.startsWith('`')
        ? visited.text + '\n'
        : `\`\`\`ts\n${visited.text}\n\`\`\`\n`

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
    return this.heading(`\`${get(node, 'context.identifier')}\``, depth)
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
    return (
      get(node, 'context.kind') === Kind.CONST &&
      !isEmptyString(this.returns(node))
    )
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
      if (visited.tag !== '@const') return CONTINUE
      constant = true
      return EXIT
    }

    // check if node represents constant value
    visit(node, Type.BLOCK_TAG, visitor)

    return constant
  }

  /**
   * Checks if `node` represents an enum.
   *
   * @protected
   *
   * @param {Comment} node - Comment node to check
   * @return {boolean} `true` if `node` represents enum
   */
  protected isEnum(node: Comment): boolean {
    /**
     * Node kind.
     *
     * @const {Optional<LiteralUnion<Kind, string>>} kind
     */
    const kind: Optional<LiteralUnion<Kind, string>> = get(node, 'context.kind')

    return kind === Kind.ENUM || kind === Kind.ENUM_CONST
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
    return get(node, 'context.kind') === Kind.INTERFACE
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
    return get(node, 'context.kind') === Kind.TYPE
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
    const { identifier } = node.context!

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
      if (visited.tag !== '@param') return CONTINUE

      // add table headers
      if (params === '') {
        params += this.subheading(identifier, 'Params', 3) + '\n\n'
        params += '| | | |\n| :- | :- | :- |\n'
      }

      // get parameter name, description, and type
      const { groups }: RegExpMatchArray = visited.value
        .matchAll(/^@\w+ {(?<type>.+)} (?<name>.+?) - (?<description>.+)/g)
        .next().value

      // add parameter type, name, and description
      params += `| \`${groups!.type!.replace(/(\|)/g, '\\$1')}\` `
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
    const { identifier } = node.context!

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
      if (visited.tag !== '@see') return CONTINUE

      // add list header
      if (!list.length) {
        list += this.subheading(identifier, 'See Also', 3) + '\n\n'
      }

      // add list item
      if (visited.text.startsWith('{@link')) {
        const [{ text }] = cast<[InlineTag]>(visited.children)
        list += `- [\`${text}\`](${visited.text})\n`
      } else {
        list += `- ${visited.text}\n`
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
    const { identifier } = node.context!

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
      const match: RegExpMatchArray | undefined = visited.value
        .matchAll(/^@return {(?<type>.+)} (?<description>.+)/g)
        .next().value

      // do nothing if no match for @return
      if (!match) return CONTINUE

      // add section header
      if (!section.length) {
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
   * @param {unist.Node | unist.Position} value - Node or position
   * @return {string} Source code wrapped in markdown code fence
   */
  protected snippet(value: unist.Node | unist.Position): string {
    return `\`\`\`ts\n${source(this.file, value) ?? ''}\n\`\`\``
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
    const { identifier } = node.context!

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
       * @const {RegExpExecArray | null} match
       */
      const match: RegExpExecArray | null =
        /^@throws {(?<type>.+?)}(?: (?<description>.+))?$/s.exec(visited.value)

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
        md.render(this.subheading(identifier, `THROWS \`${type}\``, 3))
      )

      return EXIT
    }

    // build section
    visit(node, Type.BLOCK_TAG, visitor)

    return section
  }
}

export default CommentsCompiler
