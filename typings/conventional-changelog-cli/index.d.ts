declare module 'conventional-changelog-cli' {
  import type ChangelogSpec from 'conventional-changelog-config-spec'
  import type {
    GitRawCommitsOptions,
    Options,
    ParserOptions,
    WriterOptions
  } from 'conventional-changelog-core'

  export interface Config {
    gitRawCommitsOpts?: GitRawCommitsOptions
    options?: Options & {
      preset?: string | (ChangelogSpec.Config & { name: string })
    }
    parserOpts?: ParserOptions
    writerOpts?: WriterOptions
  }
}
