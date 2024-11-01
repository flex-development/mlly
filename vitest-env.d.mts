/// <reference types='vitest/globals' />

interface ImportMetaEnv {
  readonly BASE_URL: string
  readonly DEV: '1' | import('@flex-development/tutils').EmptyString
  readonly GITHUB_TOKEN: string
  readonly LINT_STAGED?: import('@flex-development/tutils').Stringify<0 | 1>
  readonly MODE: string
  readonly NODE_ENV: string
  readonly PROD: '1' | import('@flex-development/tutils').EmptyString
  readonly PWD: string
  readonly SSR: '1' | import('@flex-development/tutils').EmptyString
  readonly TEST: 'true'
  readonly USER: string
  readonly VITEST: 'true'
  readonly VITEST_MODE: 'DEV' | 'RUN'
  readonly VITEST_POOL_ID: import('@flex-development/tutils').Numeric
  readonly VITEST_WORKER_ID: import('@flex-development/tutils').Numeric
  readonly VITE_ROOT: string
  readonly VITE_USER_NODE_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
