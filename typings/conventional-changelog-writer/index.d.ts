import {} from 'conventional-changelog-writer'

declare module 'conventional-changelog-writer' {
  namespace GeneratedContext {
    interface ExtraContext {
      currentTag?: string | undefined
      gitSemverTags: string[]
      linkCompare?: boolean | undefined
      previousTag?: string | undefined
    }
  }
}
