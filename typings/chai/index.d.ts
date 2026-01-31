declare global {
  namespace Chai {
    interface Assertion {
      /**
       * Execute an expression and check expectations.
       *
       * @see {@linkcode AssertionError}
       *
       * @param {unknown} expression
       *  The expression to be tested
       * @param {Function | string} message
       *  Message to display if expression test fails, or a function that
       *  returns such a message
       * @param {Function | string} negatedMessage
       *  Message to display if negated expression test fails, or a function
       *  that returns such a message
       * @param {unknown} [expected]
       *  Expected value
       * @param {unknown} [actual]
       *  Expresssion test result
       * @param {boolean | undefined} [showDiff]
       *  Display diff in addition to message if expression test fails
       * @return {undefined}
       * @throws {AssertionError}
       */
      assert(
        expression: unknown,
        message: Function | string,
        negatedMessage: Function | string,
        expected: unknown,
        actual?: unknown,
        showDiff?: boolean | undefined
      ): undefined
    }
  }
}

export {}
