'use strict'

const delay = require('delay')
const test = require('ava')

const memoizeToken = require('.')

test('successive calls', async t => {
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

test('expire time', async t => {
  const cache = new Map()
  let value = -1
  let values = ['foo', 'bar', 'baz']
  const fn = memoizeToken(() => values[++value], {
    max: 2,
    cache,
    key: 'test',
    expire: 100
  })

  await fn()
  t.is(cache.get('test:value'), 'foo')
  t.is(cache.get('test:count'), 1)
  await fn()
  t.is(cache.get('test:value'), 'foo')
  t.is(cache.get('test:count'), 2)
  await delay(100)
  await fn()
  t.is(cache.get('test:value'), 'bar')
  t.is(cache.get('test:count'), 1)
  await fn()
  await fn()
  await fn()
  t.is(cache.get('test:value'), 'baz')
  t.is(cache.get('test:count'), 2)
})
