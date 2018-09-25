'use strict'

const assert = require('assert')

const isNil = value => value === undefined || value === null

module.exports = (fn, { key, max, cache = new Map(), expire } = {}) => {
  assert(fn, 'fn required')
  assert(max, 'max required')
  assert(key, 'key required')

  return async (...args) => {
    let { value, count = 0 } = (await cache.get(key)) || {}

    if (isNil(value) || count >= max) {
      value = await fn(args)
      count = 0
    }

    await cache.set(key, { value, count: count + 1 }, expire)
    return value
  }
}
