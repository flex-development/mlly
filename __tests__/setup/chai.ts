/**
 * @file Test Setup - chai
 * @module tests/setup/chai
 * @see https://chaijs.com
 */

import chaiEach from 'chai-each'
import chaiQuantifiers from 'chai-quantifiers'
import chaiString from 'chai-string'
import { chai } from 'vitest'

/**
 * initialize chai plugins.
 *
 * @see https://github.com/jamesthomasonjr/chai-each
 * @see https://github.com/funny-bytes/chai-quantifiers
 * @see https://github.com/onechiporenko/chai-string
 */
chai.use(chaiEach)
chai.use(chaiQuantifiers)
chai.use(chaiString)
