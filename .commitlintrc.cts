/**
 * @file Configuration - commitlint
 * @module config/commitlint
 * @see https://commitlint.js.org
 */

import { RuleConfigSeverity, type UserConfig } from '@commitlint/types'
import { scopes } from '@flex-development/commitlint-config'

/**
 * `commitlint` configuration object.
 *
 * @const {UserConfig} config
 */
const config: UserConfig = {
  extends: ['@flex-development'],
  rules: {
    'scope-enum': [
      RuleConfigSeverity.Error,
      'always',
      scopes(['analyze', 'docs', 'resolve', 'specifiers', 'syntax'])
    ]
  }
}

export default config
