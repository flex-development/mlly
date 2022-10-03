import {} from 'conventional-changelog-writer'

declare module 'conventional-changelog-writer' {
  namespace GeneratedContext {
    interface ExtraContext {
      gitSemverTags: string[]
    }
  }
}
