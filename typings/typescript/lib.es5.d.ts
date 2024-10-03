declare global {
  interface ArrayConstructor {
    /**
     * Check if `value` is an array.
     *
     * @template {any} T
     *  Array item type
     *
     * @param {unknown} value
     *  Value to check
     * @return {value is ReadonlyArray<T> | T[]}
     *  `true` if `value` is an array
     */
    isArray<T>(value: unknown): value is T[] | readonly T[]
  }
}

export {}
