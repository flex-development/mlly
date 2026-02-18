/// <reference types='vitest/globals' />

namespace NodeJS {
  interface ProcessEnv extends Dict<string> {
    VITEST_ENVIRONMENT?: import('vitest/node').BuiltinEnvironment
  }
}
