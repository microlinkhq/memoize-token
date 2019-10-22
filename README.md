<div align="center">
  <img src="https://cdn.microlink.io/logo/banner.png" alt="microlink">
</div>

![Last version](https://img.shields.io/github/tag/microlinkhq/memoize-token.svg?style=flat-square)
[![Build Status](https://img.shields.io/travis/com/microlinkhq/memoize-token/master.svg?style=flat-square)](https://travis-ci.com/microlinkhq/memoize-token)
[![Dependency status](https://img.shields.io/david/microlinkhq/memoize-token.svg?style=flat-square)](https://david-dm.org/microlinkhq/memoize-token)
[![Dev Dependencies Status](https://img.shields.io/david/dev/microlinkhq/memoize-token.svg?style=flat-square)](https://david-dm.org/microlinkhq/memoize-token#info=devDependencies)
[![NPM Status](https://img.shields.io/npm/dm/memoize-token.svg?style=flat-square)](https://www.npmjs.org/package/memoize-token)

> A memoize library for refreshing and cache token values.

## Install

```bash
$ npm install memoize-token --save
```

## Usage

```js
const memoizeToken = require('memoize-token')
let value = -1
let values = ['foo', 'bar']

const fn = memoizeToken(
  () => values[++value],
  { max: 2, key: 'test', cache }
)

;(async () => {
  await fn() // => 'foo'
  await fn() // => 'foo'
  await fn() // max excedeed, refresh the token => 'bar'
  await fn() // => 'bar'
})()
```

## API

### memoizeToken(fn, [options])

#### fn

*Required*<br>
Type: `Function`

Function to be memoized and used for refreshing the token.

#### options

##### max

*Required*<br>
Type: `Number`<br>

Maximum numbers of calls after refresh the token.

##### key

*Required*<br>
Type: `String`<br>

The base key to use into the cache.

##### expire

Type: `Number`<br>

Time in milliseconds to consider a token as expired.

##### cache

Type: `Object`<br>
Default: `new Map()`

Use a different cache storage.

Must implement the following methods: `.get(key)` and `.set(key, value)`, Check [`keyv`](https://github.com/lukechilds/keyv) to see database connectors.

## Related

- [bottleneck](https://github.com/SGrondin/bottleneck) – Job scheduler and rate limiter.
- [limiter](https://github.com/jhurliman/node-rate-limiter) – Provides a generic rate limiter and token bucket for Node.js.

## License

**memoize-token** © [microlink.io](https://microlink.io), released under the [MIT](https://github.com/microlinkhq/memoize-token/blob/master/LICENSE.md) License.<br>
Authored and maintained by microlink.io with help from [contributors](https://github.com/microlinkhq/memoize-token/contributors).

> [microlink.io](https://microlink.io) · GitHub [microlink.io](https://github.com/microlinkhq) · Twitter [@microlinkhq](https://twitter.com/microlinkhq)
