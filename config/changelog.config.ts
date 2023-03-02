/**
 * @file Configuration - Changelog
 * @module config/changelog
 * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-conventionalcommits
 * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-core
 * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-writer
 * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-commits-parser
 * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/git-raw-commits
 */

import {
  Type,
  parserPreset,
  type Commit
} from '@flex-development/commitlint-config'
import pathe from '@flex-development/pathe'
import { CompareResult, isNIL } from '@flex-development/tutils'
import addStream from 'add-stream'
import conventionalChangelog from 'conventional-changelog'
import type { Options } from 'conventional-changelog-core'
import type {
  CommitGroup,
  GeneratedContext
} from 'conventional-changelog-writer'
import dateformat from 'dateformat'
import type mri from 'mri'
import {
  createReadStream,
  createWriteStream,
  readFileSync,
  type ReadStream,
  type WriteStream
} from 'node:fs'
import type { Readable } from 'node:stream'
import sade from 'sade'
import semver from 'semver'
import tempfile from 'tempfile'
import pkg from '../package.json' assert { type: 'json' }

/**
 * Parsed commit with additional fields.
 *
 * @extends {Commit}
 */
interface CommitEnhanced extends Commit {
  raw: Commit
  version?: string
}

/**
 * CLI flags.
 */
interface Flags {
  /**
   * Output unreleased changelog.
   *
   * To the set the current version, pass a string value.
   *
   * @example
   *  '1.0.0-alpha.7'
   * @example
   *  true
   *
   * @default true
   */
  'output-unreleased'?: boolean | string

  /**
   * Number of releases to be generated.
   *
   * If `0`, the changelog will be regenerated and the output file will be
   * overwritten.
   *
   * @default 1
   */
  'release-count'?: number

  /**
   * Output content to {@linkcode infile}.
   *
   * @default false
   */
  'same-file'?: boolean

  /**
   * Enable verbose output.
   *
   * @default false
   */
  debug?: boolean

  /**
   * Read CHANGELOG from this file.
   */
  infile?: string

  /**
   * Write content to this file.
   *
   * **Note**: Requires {@linkcode write} to be `true`.
   */
  outfile?: string

  /**
   * Write content to file instead of {@linkcode process.stdout}.
   *
   * @default false
   */
  write?: boolean
}

sade('changelog', true)
  .option('-d, --debug', 'Enable verbose output', false)
  .option('-i, --infile', 'Read CHANGELOG from this file')
  .option('-o, --outfile', 'Write content to this file (requires --write)')
  .option('-r, --release-count', 'Number of releases to be generated', 1)
  .option('-s, --same-file', 'Output content to infile', false)
  .option('-u, --output-unreleased', 'Output unreleased changelog')
  .option('-w, --write', 'Write content to file', false)
  .action((flags: mri.Argv<Flags>): void => {
    const {
      'release-count': releaseCount = 1,
      debug = false,
      write = false
    } = flags
    let {
      'output-unreleased': outputUnreleased = true,
      infile,
      'same-file': samefile,
      outfile
    } = flags

    // convert possible 'false' or 'true' to boolean value
    if (outputUnreleased === 'false' || outputUnreleased === 'true') {
      outputUnreleased = JSON.parse(outputUnreleased)
    }

    /**
     * Regex used to extract a release version from a string containing
     * Git tags.
     *
     * @const {RegExp} vgx
     */
    const vgx: RegExp = pkg.tagPrefix
      ? new RegExp(`tag:\\s*[=]?${pkg.tagPrefix}(.+?)[,)]`, 'gi')
      : /tag:\s*[=v]?(.+?)[),]/gi

    /**
     * Changelog content stream.
     *
     * @const {Readable} changelog
     */
    // @ts-expect-error type definitions are incorrect
    const changelog: Readable = conventionalChangelog<Commit>(
      {
        append: false,
        debug: debug ? console.debug.bind(console) : undefined,
        outputUnreleased:
          typeof outputUnreleased === 'boolean'
            ? outputUnreleased
            : typeof outputUnreleased === 'string'
            ? !!outputUnreleased.trim()
            : false,
        pkg: { path: pathe.resolve('package.json') },
        preset: {
          header: '',
          name: parserPreset.name,
          releaseCommitMessageFormat: 'release: {{currentTag}}',
          types: [
            { section: ':package: Build', type: Type.BUILD },
            { section: ':house_with_garden: Housekeeping', type: Type.CHORE },
            { section: ':robot: Continuous Integration', type: Type.CI },
            { section: ':pencil: Documentation', type: Type.DOCS },
            { section: ':sparkles: Features', type: Type.FEAT },
            { section: ':bug: Fixes', type: Type.FIX },
            { section: ':fire: Performance Improvements', type: Type.PERF },
            { section: ':mechanical_arm: Refactors', type: Type.REFACTOR },
            { section: ':wastebasket: Reverts', type: Type.REVERT },
            { hidden: true, type: Type.STYLE },
            { section: ':white_check_mark: Testing', type: Type.TEST },
            { hidden: true, type: Type.WIP }
          ]
        },
        releaseCount,
        skipUnstable: false,
        tagPrefix: pkg.tagPrefix,
        /**
         * Raw commit transformer.
         *
         * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-core#transform-1
         * @see https://github.com/conventional-changelog/conventional-changelog/issues/415
         *
         * @param {Commit} commit - Commit object
         * @param {Options.Transform.Callback} apply - Commit handler
         * @return {void} Nothing when complete
         */
        transform(commit: Commit, apply: Options.Transform.Callback): void {
          return void apply(null, {
            ...commit,
            committerDate: dateformat(commit.committerDate, 'yyyy-mm-dd', true),
            mentions: commit.mentions.filter(m => m !== 'flexdevelopment'),
            // @ts-expect-error ts(2322)
            raw: commit,
            references: commit.references.filter(ref => ref.action !== null),
            version: commit.gitTags ? vgx.exec(commit.gitTags)?.[1] : undefined
          })
        },
        warn: parserPreset.parserOpts.warn
      },
      {},
      {
        debug: debug ? parserPreset.parserOpts.warn : undefined,
        format:
          '%B%n-hash-%n%H%n-shortHash-%n%h%n-gitTags-%n%d%n-committerDate-%n%ci%n'
      },
      parserPreset.parserOpts,
      {
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
          if (a.title === false) return CompareResult.GREATER_THAN
          if (b.title === false) return CompareResult.LESS_THAN

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
           * Compare result for {@linkcode b.committerDate} and
           * {@linkcode a.committerDate}.
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
         * - Setting the current and previous release tags
         * - Setting the release date
         * - Determining patch release state
         * - Determining if compare links should be generated
         *
         * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-core#finalizecontext
         * @see https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-writer#finalizecontext
         *
         * @param {GeneratedContext} context - Generated changelog context
         * @param {Options} options - `conventional-changelog-core` options
         * @param {CommitEnhanced[]} commits - Commits for release
         * @param {CommitEnhanced?} key - Release commit
         * @return {GeneratedContext} Final changelog context
         */
        finalizeContext(
          context: GeneratedContext,
          options: Options,
          commits: CommitEnhanced[],
          key?: CommitEnhanced
        ): GeneratedContext {
          const { gitSemverTags = [], isPatch, linkCompare, version } = context
          let { currentTag, previousTag } = context

          /**
           * First commit in release.
           *
           * @const {CommitEnhanced?} first_commit
           */
          const first_commit: CommitEnhanced | undefined = commits.at(0)

          /**
           * Last commit in release.
           *
           * @const {CommitEnhanced?} last_commit
           */
          const last_commit: CommitEnhanced | undefined = commits.at(-1)

          // set current and previous tags
          if (key && (!currentTag || !previousTag)) {
            currentTag = key.version ?? undefined

            // try setting previous tag based on current tag
            if (gitSemverTags.includes(currentTag ?? '')) {
              const { version = '' } = key
              previousTag = gitSemverTags[gitSemverTags.indexOf(version) + 1]
              if (!previousTag) previousTag = last_commit?.hash ?? undefined
            }
          } else {
            currentTag = /^unreleased$/i.test(version ?? '')
              ? currentTag ??
                (typeof outputUnreleased === 'string' && outputUnreleased
                  ? outputUnreleased
                  : first_commit?.hash ?? undefined)
              : !currentTag && version
              ? pkg.tagPrefix + version
              : currentTag ?? version
            previousTag = previousTag ?? gitSemverTags[0]
          }

          // set release date
          context.date =
            key?.committerDate ??
            dateformat(new Date().toLocaleDateString(), 'yyyy-mm-dd', true)

          // determine patch release state
          if (version && semver.valid(version)) {
            context.isPatch = isPatch ?? semver.patch(version) !== 0
          }

          // @ts-expect-error ts(2322)
          return {
            ...context,
            currentTag,
            linkCompare: isNIL(linkCompare) && !!currentTag && !!previousTag,
            previousTag,
            repoUrl: pkg.repository.slice(0, -4)
          }
        },
        headerPartial: readFileSync(
          'config/templates/changelog/header.hbs',
          'utf8'
        ),
        ignoreReverted: false
      }
    ).on('error', err => console.error(err.stack))

    // override samefile if infile and outfile are the same file
    if (infile && infile === outfile) samefile = true

    // reset outfile if changelog should be output to infile
    if (samefile) outfile = infile = infile ?? 'CHANGELOG.md'

    /**
     * Creates a file writer.
     *
     * If writing to file is disabled, {@linkcode process.stdout} will be used
     * to write content to the terminal.
     *
     * Otherwise, {@linkcode createWriteStream} will be used to create a stream
     * for {@linkcode outfile}.
     *
     * @see {@linkcode NodeJS.WriteStream}
     * @see {@linkcode WriteStream}
     * @see {@linkcode createWriteStream}
     *
     * @return {WriteStream | (NodeJS.WriteStream & { fd: 1 })} File writer
     */
    const writer = (): WriteStream | (NodeJS.WriteStream & { fd: 1 }) => {
      return write && outfile ? createWriteStream(outfile) : process.stdout
    }

    // write changelog to infile, outfile, or stdout
    switch (true) {
      case infile && releaseCount !== 0:
        /**
         * Changelog file stream.
         *
         * @const {ReadStream} rs
         */
        const rs: ReadStream = createReadStream(infile!).on('error', () => {
          if (debug) console.error('infile does not exist.')
          if (samefile) changelog.pipe(writer())
        })

        // write changelog to infile or stdout
        if (samefile) {
          /**
           * Absolute path to random temporary file.
           *
           * @const {string} tmp
           */
          const tmp: string = tempfile()

          changelog
            .pipe(addStream(rs))
            .pipe(createWriteStream(tmp))
            .on('finish', () => createReadStream(tmp).pipe(writer()))
        } else {
          changelog.pipe(addStream(rs)).pipe(writer())
        }

        break
      default:
        changelog.pipe(writer())
        break
    }

    return void 0
  })
  .parse(process.argv)
