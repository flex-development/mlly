/**
 * @file Changelog Configuration
 * @module config/changelog
 * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli
 */

import type { Config } from 'conventional-changelog-cli'
import type { Options } from 'conventional-changelog-core'
import type {
  CommitGroup,
  GeneratedContext
} from 'conventional-changelog-writer'
import type { Commit, CommitRaw } from 'conventional-commits-parser'
import dateformat from 'dateformat'
import fs from 'node:fs'
import pkg from './package.json'

/**
 * Changlog context.
 *
 * @extends {GeneratedContext}
 */
interface Context extends GeneratedContext {
  currentTag: string
  linkCompare: boolean
  previousTag: string
}

/**
 * Changelog configuration options.
 *
 * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-conventionalcommits
 * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-core
 * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-writer
 * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-commits-parser
 * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/git-raw-commits
 *
 * @const {Config} config
 */
const config: Config = {
  options: {
    preset: {
      header: '',
      name: 'conventionalcommits',
      releaseCommitMessageFormat: 'release: {{currentTag}}',
      types: [
        { section: ':package: Build', type: 'build' },
        { section: ':house_with_garden: Housekeeping', type: 'chore' },
        { section: ':robot: Continuous Integration', type: 'ci' },
        { section: ':pencil: Documentation', type: 'docs' },
        { section: ':sparkles: Features', type: 'feat' },
        { section: ':bug: Fixes', type: 'fix' },
        { section: ':fire: Performance Improvements', type: 'perf' },
        { section: ':zap: Refactors', type: 'refactor' },
        { section: ':rewind: Reverts', type: 'revert' },
        { hidden: true, type: 'style' },
        { section: ':white_check_mark: Testing', type: 'test' },
        { hidden: true, type: 'wip' }
      ]
    },
    skipUnstable: false,
    tagPrefix: pkg.tagPrefix,
    /**
     * Raw commit transformer.
     *
     * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-core#transform-1
     *
     * @param {CommitRaw} commit - Raw commit object
     * @param {Options.Transform.Callback} apply - Commit handler
     * @return {void} Nothing when complete
     */
    transform(commit: CommitRaw, apply: Options.Transform.Callback): void {
      commit.committerDate = dateformat(commit.committerDate, 'yyyy-mm-dd')

      if (commit.gitTags) {
        /**
         * Regex expression used to check {@link commit.gitTags} for the release
         * {@link commit} belongs to.
         *
         * @const {RegExp} vgx
         */
        const vgx: RegExp = pkg.tagPrefix
          ? new RegExp(`tag:\\s*[=]?${pkg.tagPrefix}(.+?)[,)]`, 'gi')
          : /tag:\s*[=v]?(.+?)[),]/gi

        commit = Object.assign({}, commit, {
          version: vgx.exec(commit.gitTags)?.[1] ?? undefined
        })
      }

      commit.notes = commit.notes.map(note => ({
        ...note,
        text: note.text.replace(/(\n?\n?Signed-off-by:).+/gm, '')
      }))

      return void apply(null, {
        ...commit,
        raw: commit,
        shortHash: commit.hash.slice(0, 7)
      })
    }
  },
  parserOpts: {
    issuePrefixesCaseSensitive: true
  },
  writerOpts: {
    /**
     * Sorts commit groups in descending order by group title.
     *
     * GitHub emojis in titles will be ignored.
     *
     * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-writer#commitgroupssort
     *
     * @param {CommitGroup} a - Commit group object
     * @param {CommitGroup} b - Commit group object to compare to `a`
     * @return {number} Compare result
     */
    commitGroupsSort(a: CommitGroup, b: CommitGroup): number {
      if (a.title === false) return 1
      if (b.title === false) return -1

      /**
       * Regex used to extract commit group titles without GitHub emojis.
       *
       * @const {RegExp} tgx - Regex used to extract commit group title
       */
      const tgx: RegExp = /([A-Z])\w+/

      return tgx.exec(a.title)![0]!.localeCompare(tgx.exec(b.title)![0]!)
    },
    /**
     * Sorts commits in descending order by commit header and date.
     *
     * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-writer#commitssort
     *
     * @param {Commit} a - Commit object
     * @param {Commit} b - Commit object to compare to `b`
     * @return {number} Compare result
     */
    commitsSort(a: Commit, b: Commit): number {
      /**
       * Compare result for {@link b.committerDate} & {@link a.committerDate}.
       *
       * @const {number} by_date
       */
      const by_date: number =
        new Date(b.committerDate).getTime() -
        new Date(a.committerDate).getTime()

      return a.header && b.header
        ? a.header.localeCompare(b.header) || by_date
        : by_date
    },
    /**
     * Modifies `context` before the changelog is generated.
     *
     * This includes:
     *
     * - Setting the release date to the current date
     * - Setting the current release tag
     * - Setting the previous release tag
     * - Setting compare link generation
     *
     * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-core#finalizecontext
     * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-writer#finalizecontext
     *
     * @param {GeneratedContext} context - Generated changelog context
     * @return {Context} Final changelog context
     */
    finalizeContext(context: GeneratedContext): Context {
      /**
       * Use current date as release date instead of date of most recent commit.
       *
       * @see https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/conventional-changelog-writer/lib/util.js#L194-L196
       */
      context.date = dateformat(new Date(), 'yyyy-mm-dd')

      /**
       * Release tag for upcoming version.
       *
       * @const {string} currentTag
       */
      const currentTag: string = pkg.tagPrefix + pkg.version

      /**
       * Release tag for previous version.
       *
       * @const {string} previousTag
       */
      const previousTag: string = context.gitSemverTags[0]!

      return {
        ...context,
        currentTag,
        linkCompare: currentTag !== previousTag,
        previousTag
      }
    },
    headerPartial: fs.readFileSync('templates/changelog/header.hbs', 'utf8'),
    ignoreReverted: false
  }
}

module.exports = config
