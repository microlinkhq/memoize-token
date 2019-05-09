'use strict'

const assert = require('assert')
const debug = require('debug')('memoize-token')

module.exports = (fn, { key, max, cache = new Map(), expire } = {}) => {
  assert(fn, 'fn required')
  assert(max, 'max required')
  assert(key, 'key required')

  return async (...args) => {
    let { value, count = 0 } = (await cache.get(key)) || {}
    debug(`get key=${key} value=${value} count=${count}`)

    if (value === undefined || count >= max) {
      value = await fn(...args)
      count = 0
      debug(`refresh key=${key} value=${value} count=${count}`)
    }

    await cache.set(key, { value, count: count + 1 }, expire)
    return value
  }
}
