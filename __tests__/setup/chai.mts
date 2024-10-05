/**
 * @file Test Setup - chai
 * @module tests/setup/chai
 * @see https://chaijs.com
 */

import { JestExtend as extend } from '@vitest/expect'
import chaiEach from 'chai-each'
import chaiString from 'chai-string'
import { chai } from 'vitest'

/**
 * initialize chai plugins.
 *
 * @see https://github.com/jamesthomasonjr/chai-each
 * @see https://github.com/onechiporenko/chai-string
 */
extend(chai, chai.util)
chai.use(chaiEach)
chai.use(chaiString)
