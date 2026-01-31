/**
 * @file Snapshot Serializers - nodeError
 * @module tests/serializers/nodeError
 * @see https://vitest.dev/guide/snapshot
 */

import { isNodeError } from '@flex-development/errnode'
import { ok } from 'devlop'
import type { SnapshotSerializer } from 'vitest'

/**
 * Node error snapshot serializer.
 *
 * @type {SnapshotSerializer}
 */
export default {
  /**
   * @this {void}
   *
   * @param {unknown} value
   *  The value to print
   * @return {string}
   *  The snapshot value
   */
  print(this: void, value: unknown): string {
    ok(isNodeError(value), 'expected `value` to be NodeError')
    const { cause, code, message, ...rest } = value

    return JSON // eslint-disable-next-line sort-keys
      .stringify({ code, ...rest, message, cause }, null, 2)
      .replaceAll(process.cwd(), '${process.cwd()}')
  },

  test: isNodeError
}
