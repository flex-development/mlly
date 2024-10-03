/**
 * @file Config - remark
 * @module config/remark
 */

import remarkDirective from 'remark-directive'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkLint from 'remark-lint'
import remarkLintBlockquoteIndentation from 'remark-lint-blockquote-indentation'
import remarkLintCheckboxCharacterStyle from 'remark-lint-checkbox-character-style'
import remarkLintCheckboxContentIndent from 'remark-lint-checkbox-content-indent'
import remarkLintCodeBlockStyle from 'remark-lint-code-block-style'
import remarkLintDefinitionCase from 'remark-lint-definition-case'
import remarkLintDefinitionSpacing from 'remark-lint-definition-spacing'
import remarkLintEmphasisMarker from 'remark-lint-emphasis-marker'
import remarkLintFencedCodeFlag from 'remark-lint-fenced-code-flag'
import remarkLintFencedCodeMarker from 'remark-lint-fenced-code-marker'
import remarkLintFileExtension from 'remark-lint-file-extension'
import remarkLintFinalDefinition from 'remark-lint-final-definition'
import remarkLintFinalNewline from 'remark-lint-final-newline'
import remarkLintFirstHeadingLevel from 'remark-lint-first-heading-level'
import remarkLintHardBreakSpaces from 'remark-lint-hard-break-spaces'
import remarkLintHeadingIncrement from 'remark-lint-heading-increment'
import remarkLintHeadingStyle from 'remark-lint-heading-style'
import remarkLintLinebreakStyle from 'remark-lint-linebreak-style'
import remarkLintLinkTitleStyle from 'remark-lint-link-title-style'
import remarkLintListItemBulletIndent from 'remark-lint-list-item-bullet-indent'
import remarkLintListItemContentIndent from 'remark-lint-list-item-content-indent'
import remarkLintListItemIndent from 'remark-lint-list-item-indent'
import remarkLintListItemSpacing from 'remark-lint-list-item-spacing'
import remarkLintMaximumHeadingLength from 'remark-lint-maximum-heading-length'
import remarkLintMaximumLineLength from 'remark-lint-maximum-line-length'
import remarkLintNoBlockquoteWithoutMarker from 'remark-lint-no-blockquote-without-marker'
import remarkLintNoConsecutiveBlankLines from 'remark-lint-no-consecutive-blank-lines'
import remarkLintNoDuplicateDefinedUrls from 'remark-lint-no-duplicate-defined-urls'
import remarkLintNoDuplicateDefinitions from 'remark-lint-no-duplicate-definitions'
import remarkLintNoDuplicateHeadingsInSection from 'remark-lint-no-duplicate-headings-in-section'
import remarkLintNoEmphasisAsHeading from 'remark-lint-no-emphasis-as-heading'
import remarkLintNoEmptyUrl from 'remark-lint-no-empty-url'
import remarkLintNoFileNameArticles from 'remark-lint-no-file-name-articles'
import remarkLintNoFileNameConsecutiveDashes from 'remark-lint-no-file-name-consecutive-dashes'
import remarkLintNoFileNameIrregularCharacters from 'remark-lint-no-file-name-irregular-characters'
import remarkLintNoFileNameMixedCase from 'remark-lint-no-file-name-mixed-case'
import remarkLintNoFileNameOuterDashes from 'remark-lint-no-file-name-outer-dashes'
import remarkLintNoHeadingContentIndent from 'remark-lint-no-heading-content-indent'
import remarkLintNoHeadingPunctuation from 'remark-lint-no-heading-punctuation'
import remarkLintNoLiteralUrls from 'remark-lint-no-literal-urls'
import remarkLintNoMissingBlankLines from 'remark-lint-no-missing-blank-lines'
import remarkLintNoMultipleToplevelHeadings from 'remark-lint-no-multiple-toplevel-headings'
import remarkLintNoParagraphContentIndent from 'remark-lint-no-paragraph-content-indent'
import remarkLintNoShellDollars from 'remark-lint-no-shell-dollars'
import remarkLintNoShortcutReferenceImage from 'remark-lint-no-shortcut-reference-image'
import remarkLintNoShortcutReferenceLink from 'remark-lint-no-shortcut-reference-link'
import remarkLintNoTableIndentation from 'remark-lint-no-table-indentation'
import remarkLintNoTabs from 'remark-lint-no-tabs'
import remarkLintNoUndefinedReferences from 'remark-lint-no-undefined-references'
import remarkLintNoUnneededFullReferenceImage from 'remark-lint-no-unneeded-full-reference-image'
import remarkLintNoUnneededFullReferenceLink from 'remark-lint-no-unneeded-full-reference-link'
import remarkLintNoUnusedDefinitions from 'remark-lint-no-unused-definitions'
import remarkLintNoTrailingSlash from 'remark-lint-no-url-trailing-slash'
import remarkLintOrderedListMarkerStyle from 'remark-lint-ordered-list-marker-style'
import remarkLintOrderedListMarkerValue from 'remark-lint-ordered-list-marker-value'
import remarkLintRuleStyle from 'remark-lint-rule-style'
import remarkLintStrikethroughMarker from 'remark-lint-strikethrough-marker'
import remarkLintStrongMarker from 'remark-lint-strong-marker'
import remarkLintTableCellPadding from 'remark-lint-table-cell-padding'
import remarkLintTablePipeAlignment from 'remark-lint-table-pipe-alignment'
import remarkLintTablePipes from 'remark-lint-table-pipes'
import remarkLintUnorderedListMarkerStyle from 'remark-lint-unordered-list-marker-style'
import remarkLintValidateLinks from 'remark-validate-links'

/**
 * remark-lint preset.
 *
 * @type {import('unified').Preset}
 * @const remarkLint
 */
const lint = {
  plugins: [
    remarkLint,
    [remarkLintBlockquoteIndentation, 2],
    [remarkLintCheckboxCharacterStyle, { checked: 'x', unchecked: ' ' }],
    remarkLintCheckboxContentIndent,
    [remarkLintCodeBlockStyle, 'fenced'],
    remarkLintDefinitionCase,
    remarkLintDefinitionSpacing,
    [remarkLintEmphasisMarker, '*'],
    [remarkLintFencedCodeFlag, { allowEmpty: false }],
    [remarkLintFencedCodeMarker, '`'],
    [remarkLintFileExtension, ['md', 'mdx']],
    remarkLintFinalDefinition,
    remarkLintFinalNewline,
    remarkLintFirstHeadingLevel,
    remarkLintHardBreakSpaces,
    remarkLintHardBreakSpaces,
    remarkLintHeadingIncrement,
    [remarkLintHeadingStyle, 'atx'],
    remarkLintLinebreakStyle,
    [remarkLintLinkTitleStyle, '"'],
    remarkLintListItemBulletIndent,
    remarkLintListItemContentIndent,
    [remarkLintListItemIndent, 'one'],
    [remarkLintListItemSpacing, { checkBlanks: true }],
    remarkLintMaximumHeadingLength,
    [remarkLintMaximumLineLength, 120],
    remarkLintNoBlockquoteWithoutMarker,
    remarkLintNoBlockquoteWithoutMarker,
    remarkLintNoConsecutiveBlankLines,
    remarkLintNoDuplicateDefinedUrls,
    remarkLintNoDuplicateDefinitions,
    remarkLintNoDuplicateHeadingsInSection,
    remarkLintNoEmphasisAsHeading,
    remarkLintNoEmptyUrl,
    remarkLintNoFileNameArticles,
    remarkLintNoFileNameConsecutiveDashes,
    [remarkLintNoFileNameIrregularCharacters, /[^\w.-]/],
    remarkLintNoFileNameMixedCase,
    remarkLintNoFileNameOuterDashes,
    remarkLintNoHeadingContentIndent,
    [remarkLintNoHeadingPunctuation, '.'],
    remarkLintNoLiteralUrls,
    [remarkLintNoMissingBlankLines, { exceptTightLists: true }],
    remarkLintNoMultipleToplevelHeadings,
    remarkLintNoParagraphContentIndent,
    remarkLintNoShellDollars,
    remarkLintNoShortcutReferenceImage,
    remarkLintNoShortcutReferenceImage,
    remarkLintNoShortcutReferenceLink,
    remarkLintNoShortcutReferenceLink,
    remarkLintNoTableIndentation,
    remarkLintNoTabs,
    remarkLintNoTrailingSlash,
    remarkLintNoUndefinedReferences,
    remarkLintNoUnneededFullReferenceImage,
    remarkLintNoUnneededFullReferenceLink,
    remarkLintNoUnusedDefinitions,
    [remarkLintOrderedListMarkerStyle, '.'],
    [remarkLintOrderedListMarkerValue, 'ordered'],
    remarkLintStrikethroughMarker,
    [remarkLintRuleStyle, '---'],
    [remarkLintStrongMarker, '*'],
    [remarkLintTableCellPadding, 'padded'],
    remarkLintTablePipeAlignment,
    remarkLintTablePipes,
    [remarkLintUnorderedListMarkerStyle, '-'],
    remarkLintValidateLinks
  ],
  settings: {}
}

/**
 * remark configuration.
 *
 * @type {import('unified').Preset}
 */
export default {
  plugins: [remarkFrontmatter, remarkDirective, remarkGfm, lint],
  settings: { bullet: '-', rule: '-' }
}
