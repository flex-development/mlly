/**
 * @file Fixtures - server
 * @module fixtures/server
 */

import { http, HttpResponse } from 'msw'
import { setupServer, type SetupServerApi } from 'msw/node'

/**
 * The mock server.
 *
 * @type {SetupServerApi}
 */
export default setupServer(
  http.get('https://esm.sh/@flex-development/mlly', () => {
    return HttpResponse.text(String.raw`
      /* esm.sh - @flex-development/mlly@1.0.0-alpha.20 */
      import "/#lib/index?target=es2022";
      export * from "/@flex-development/mlly@1.0.0-alpha.20/es2022/mlly.mjs";
    `)
  })
)
