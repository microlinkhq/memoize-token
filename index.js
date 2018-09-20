'use strict'

const assert = require('assert')

const isNil = value => value === undefined || value === null

module.exports = (fn, { key, max, cache = new Map(), expire } = {}) => {
  assert(fn, 'fn required')
  assert(max, 'max required')
  assert(key, 'key required')

  const keyValue = `${key}:value`
  const keyCount = `${key}:count`
  const keyTimestamp = `${key}:timestamp`

  return async (...args) => {
    let [value, count = 0, timestamp] = await Promise.all([
      cache.get(keyValue),
      cache.get(keyCount),
      cache.get(keyTimestamp)
    ])

    const now = Date.now()
    const isExpired = isNil(expire) ? false : now > timestamp

    if (isNil(value) || isExpired || count >= max) {
      value = await fn(args)
      count = 0
      timestamp = now + expire
      await Promise.all([
        cache.set(keyValue, value),
        cache.set(keyCount, count),
        cache.set(keyTimestamp, timestamp)
      ])
    }

    await cache.set(keyCount, count + 1)
    return value
  }
}
