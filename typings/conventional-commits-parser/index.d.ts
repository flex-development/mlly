import type { Nilable, Nullable } from '@flex-development/tutils'
import {} from 'conventional-commits-parser'

declare module 'conventional-commits-parser' {
  export interface CommitBase {
    body: Nullable<string>
    committerDate: string
    footer: Nullable<string>
    gitTags?: Nilable<string>
    hash: string
    header: Nullable<string>
    mentions: string[]
    merge: Nullable<string>
    notes: import('conventional-commits-parser').Commit.Note[]
    references: import('conventional-commits-parser').Commit.Reference[]
    revert: Nullable<import('conventional-commits-parser').Commit.Revert>
    scope?: Nilable<string>
    subject?: Nilable<string>
    type?: Nilable<string>
  }

  export interface ICommit extends CommitBase {
    raw: CommitBase
    shortHash: string
    version?: string | undefined
  }
}
