'use strict'

const assert = require('assert')

const isNil = value => value === undefined || value === null

module.exports = (fn, { key, max, cache = new Map() } = {}) => {
  assert(fn, 'fn required')
  assert(max, 'max required')
  assert(key, 'key required')

  const keyValue = `${key}:value`
  const keyCount = `${key}:count`

  return async (...args) => {
    let value = await cache.get(keyValue)
    let count = (await cache.get(keyCount)) || 0
    if (isNil(value) || count >= max) {
      value = await fn(args)
      count = 0
      await Promise.all([
        cache.set(keyCount, count),
        cache.set(keyValue, value)
      ])
    }

    await cache.set(keyCount, count + 1)
    return value
  }
}
