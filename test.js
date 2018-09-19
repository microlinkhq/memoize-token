'use strict'

const test = require('ava')

const memoizeToken = require('.')

test('cache successive calls', async t => {
  const cache = new Map()
  let value = -1
  let values = ['foo', 'bar']
  const fn = memoizeToken(() => values[++value], { max: 2, cache, key: 'test' })

  await fn()
  await fn()
  t.is(cache.get('test:value'), 'foo')
  t.is(cache.get('test:count'), 2)
})

test('token refresh', async t => {
  const cache = new Map()
  let value = -1
  let values = ['foo', 'bar']
  const fn = memoizeToken(() => values[++value], { max: 2, cache, key: 'test' })

  await fn()
  await fn()
  t.is(cache.get('test:value'), 'foo')
  t.is(cache.get('test:count'), 2)
  await fn()
  await fn()
  t.is(cache.get('test:value'), 'bar')
  t.is(cache.get('test:count'), 2)
})
