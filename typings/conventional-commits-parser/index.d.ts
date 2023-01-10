import {} from 'conventional-commits-parser'

declare module 'conventional-commits-parser' {
  export interface CommitBase {
    body: import('conventional-commits-parser').Commit.Field
    footer: import('conventional-commits-parser').Commit.Field
    header: import('conventional-commits-parser').Commit.Field
    mentions: string[]
    merge: import('conventional-commits-parser').Commit.Field
    notes: import('conventional-commits-parser').Commit.Note[]
    references: import('conventional-commits-parser').Commit.Reference[]
    revert: import('conventional-commits-parser').Commit.Revert | null
    scope?: import('conventional-commits-parser').Commit.Field | undefined
    subject?: import('conventional-commits-parser').Commit.Field | undefined
    type?: import('conventional-commits-parser').Commit.Field | undefined
  }

  export interface CommitRaw extends CommitBase {
    committerDate: string
    gitTags: string
    hash: string
  }

  export interface ICommit extends CommitRaw {
    raw: CommitRaw
    shortHash: string
    version?: string | undefined
  }
}
