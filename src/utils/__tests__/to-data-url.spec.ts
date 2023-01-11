/**
 * @file Unit Tests - toDataURL
 * @module mlly/utils/tests/unit/toDataURL
 */

import type { MimeType } from '#src/types'
import { dedent } from 'ts-dedent'
import testSubject from '../to-data-url'

describe('unit:utils/toDataURL', () => {
  it('should return javascript data url', () => {
    // Act
    const result = testSubject('console.log("hello!")')

    // Expect
    expect(result).to.startWith('data:text/javascript;base64,')
  })

  it('should return json data url', () => {
    // Arrange
    const mime: MimeType = 'application/json'

    // Act
    const result = testSubject(JSON.stringify({ hello: 'world' }), mime)

    // Expect
    expect(result).to.startWith(`data:${mime};base64,`)
  })

  it('should return wasm data url', () => {
    // Arrange
    const mime: MimeType = 'application/wasm'
    const code = dedent`
      (module
        (type $i32_=>_i32 (func (param i32) (result i32)))
        (memory $0 0)
        (export "fib" (func $module/fib))
        (export "memory" (memory $0))
        (func $module/fib (param $0 i32) (result i32)
          (local $1 i32)
          (local $2 i32)
          (local $3 i32)
          i32.const 1
          local.set $1
          local.get $0
          i32.const 0
          i32.gt_s
          if
          loop $while-continue|0
            local.get $0
            i32.const 1
            i32.sub
            local.tee $0
            if
            local.get $1
            local.get $2
            i32.add
            local.set $3
            local.get $1
            local.set $2
            local.get $3
            local.set $1
            br $while-continue|0
            end
          end
          local.get $1
          return
          end
          i32.const 0
        )
      )
    `

    // Act + Expect
    expect(testSubject(code, mime)).to.startWith(`data:${mime};base64,`)
  })
})
