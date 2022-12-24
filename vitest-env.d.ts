/// <reference types='vitest/globals' />

interface ImportMetaEnv extends import('vitest/importMeta').ImportMetaEnv {
  readonly BASE_URL: string
  readonly CI: 'false' | 'true'
  readonly DEV: '1' | import('@flex-development/tutils').EmptyString
  readonly MODE: import('@flex-development/tutils').NodeEnv.TEST
  readonly NODE_ENV: import('@flex-development/tutils').NodeEnv.TEST
  readonly PROD: '1' | import('@flex-development/tutils').EmptyString
  readonly PWD: string
  readonly SSR: '1' | import('@flex-development/tutils').EmptyString
  readonly TEST: 'true'
  readonly USER: string
  readonly VITEST: 'true'
  readonly VITEST_CLI_WRAPPER: 'true'
  readonly VITEST_MODE: 'DEV' | 'RUN'
  readonly VITEST_POOL_ID: `${number}`
  readonly VITEST_WORKER_ID: `${number}`
  readonly VITE_ROOT: string
  readonly VITE_USER_NODE_ENV: import('@flex-development/tutils').NodeEnv.TEST
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
