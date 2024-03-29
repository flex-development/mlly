/**
 * @file Unit Tests - parseDataURL
 * @module mlly/utils/tests/unit/parseDataURL
 */

import type { ParsedDataUrl } from '#src/interfaces'
import { ErrorCode, type ErrInvalidUrl } from '@flex-development/errnode'
import { cast } from '@flex-development/tutils'
import testSubject from '../parse-data-url'

describe('unit:utils/parseDataURL', () => {
  it('should return ParsedDataUrl object', () => {
    // Arrange
    type Expected = Omit<ParsedDataUrl, 'protocol'>
    const cases: [...Parameters<typeof testSubject>, Expected][] = [
      [
        'data:text/javascript;base64,SGVsbG8sIFdvcmxkIQ==',
        {
          base64: true,
          data: 'SGVsbG8sIFdvcmxkIQ==',
          href: 'data:text/javascript;base64,SGVsbG8sIFdvcmxkIQ==',
          mime: 'text/javascript',
          pathname: 'text/javascript;base64,SGVsbG8sIFdvcmxkIQ=='
        }
      ],
      [
        'data:text/javascript,console.log("hello!");',
        {
          base64: false,
          data: 'console.log("hello!");',
          href: 'data:text/javascript,console.log("hello!");',
          mime: 'text/javascript',
          pathname: 'text/javascript,console.log("hello!");'
        }
      ],
      [
        'data:text/javascript,',
        {
          base64: false,
          data: '',
          href: 'data:text/javascript,',
          mime: 'text/javascript',
          pathname: 'text/javascript,'
        }
      ]
    ]

    // Act + Expect
    cases.forEach(([url, expected]) => {
      expect(testSubject(url)).to.eql({ ...expected, protocol: 'data:' })
    })
  })

  it('should throw if url is not valid data: url', () => {
    // Arrange
    const url: string = 'data:,Hello%2C%20World%21'
    let error!: ErrInvalidUrl

    // Act
    try {
      testSubject(url)
    } catch (e: unknown) {
      error = cast(e)
    }

    // Expect
    expect(error).to.have.property('code', ErrorCode.ERR_INVALID_URL)
    expect(error).to.have.property('input', url)
  })
})
