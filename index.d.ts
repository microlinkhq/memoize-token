'use strict'

interface CacheValue<T> {
  value: T
  count: number
}

interface MemoizeTokenOptions {
  /** Unique key for caching */
  key: string
  /** Maximum number of calls before refreshing */
  max: number
  /** Cache storage (default: new Map()) */
  cache?: Map<string, CacheValue<any>>
  /** Expiration time in milliseconds */
  expire?: number
}

type MemoizeTokenFn = <T>(...args: any[]) => Promise<T>

/**
 * Memoize token - A memoization library for refreshing and caching token values
 */
declare function memoizeToken(
  fn: MemoizeTokenFn,
  options: MemoizeTokenOptions
): MemoizeTokenFn

export = memoizeToken
