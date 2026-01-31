/**
 * @file Test Setup - server
 * @module tests/setup/server
 * @see https://mswjs.io/docs/quick-start
 */

import server from '#fixtures/server'

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

beforeAll(() => {
  server.listen()
})
