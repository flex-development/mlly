import type {} from '@flex-development/mlly'

declare module '@flex-development/mlly' {
  interface ConditionMap {
    kronk: 'kronk'
    mlly: 'mlly'
  }

  interface MainFieldMap {
    unpkg: 'unpkg'
  }
}
