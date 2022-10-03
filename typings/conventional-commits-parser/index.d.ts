import {} from 'conventional-commits-parser'

declare module 'conventional-commits-parser' {
  export interface CommitRaw {
    body: import('conventional-commits-parser').Commit.Field
    committerDate: string
    footer: import('conventional-commits-parser').Commit.Field
    gitTags: string
    hash: string
    header: import('conventional-commits-parser').Commit.Field
    mentions: string[]
    merge: import('conventional-commits-parser').Commit.Field
    notes: import('conventional-commits-parser').Commit.Note[]
    references: import('conventional-commits-parser').Commit.Reference[]
    revert: import('conventional-commits-parser').Commit.Revert | null
    scope: import('conventional-commits-parser').Commit.Field
    subject: import('conventional-commits-parser').Commit.Field
    type: import('conventional-commits-parser').Commit.Field
  }

  export interface Commit extends CommitRaw {
    raw: CommitRaw
    shortHash: string
    version?: string
  }
}
