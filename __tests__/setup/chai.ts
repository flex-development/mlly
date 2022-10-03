/**
 * @file Test Setup - chai
 * @module tests/setup/chai
 * @see https://chaijs.com
 */

import chai from 'chai'
import chaiEach from 'chai-each'
import chaiQuantifiers from 'chai-quantifiers'
import chaiString from 'chai-string'

// configure chai
chai.config.includeStack = true
chai.config.truncateThreshold = 0

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
