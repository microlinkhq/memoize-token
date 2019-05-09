'use strict'

const delay = require('delay')
const test = require('ava')

const memoizeToken = require('.')

test('successive calls', async t => {
  const cache = new Map()
  const key = 'test'
  let value = -1
  let values = ['foo', 'bar']
  const fn = () => values[++value]
  const getToken = memoizeToken(fn, { max: 2, cache, key })

  t.is(await getToken(), 'foo')
  t.is(await getToken(), 'foo')
  t.is(cache.get(key).value, 'foo')
  t.is(cache.get(key).count, 2)
  t.is(await getToken(), 'bar')
  t.is(await getToken(), 'bar')
})

test('token refresh', async t => {
  const cache = new Map()
  const key = 'test'
  let value = -1
  let values = ['foo', 'bar']
  const fn = memoizeToken(() => values[++value], { max: 2, cache, key })

  await fn()
  await fn()
  t.is(cache.get(key).value, 'foo')
  t.is(cache.get(key).count, 2)
  await fn()
  await fn()
  t.is(cache.get(key).value, 'bar')
  t.is(cache.get(key).count, 2)
})

test('expire time', async t => {
  const cache = new Map()
  const key = 'test'
  let value = -1
  let values = ['foo', 'bar', 'baz']
  const fn = memoizeToken(() => values[++value], {
    max: 2,
    cache,
    key,
    expire: 100
  })

  await fn()
  t.is(cache.get(key).value, 'foo')
  t.is(cache.get(key).count, 1)
  await fn()
  t.is(cache.get(key).value, 'foo')
  t.is(cache.get(key).count, 2)
  await delay(100)
  await fn()
  t.is(cache.get(key).value, 'bar')
  t.is(cache.get(key).count, 1)
  await fn()
  await fn()
  await fn()
  t.is(cache.get(key).value, 'baz')
  t.is(cache.get(key).count, 2)
})
