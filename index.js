'use strict'

const assert = require('assert')

const isNil = value => value === undefined || value === null

module.exports = (fn, { key, max, cache = new Map(), expire } = {}) => {
  assert(fn, 'fn required')
  assert(max, 'max required')
  assert(key, 'key required')

  return async (...args) => {
    let { value, count = 0, timestamp } = (await cache.get(key)) || {}
    const now = Date.now()

    if (isNil(value) || (isNil(expire) && now > timestamp) || count >= max) {
      value = await fn(args)
      count = 1
      timestamp = now + expire
      await cache.set(key, { value, count, timestamp })
      return value
    }

    await cache.set(key, { value, count: count + 1, timestamp })
    return value
  }
}
