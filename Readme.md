
# auto-yield

[![Build status][travis-image]][travis-url]
[![Git tag][git-image]][git-url]
[![NPM version][npm-image]][npm-url]
[![Code style][standard-image]][standard-url]

Automatically add yield to generator calls.

## Installation

    $ npm install auto-yield

## Usage

```js
var autoYield = require('auto-yield')

var code = autoYield(`
function main () {
  move()
}

function * move () {
  yield 'moving'
}
`) =>

`function* main() {
yield move();
}

function* move() {
yield 'moving';
}`

```

## API

### autoYield(code, globalGens, secondOrderGens, userFnName)

- `code` - code to transform
- `globalGens` - array of global names or object names that are generators or have generators
- `secondOrderGens` - array of functions that return generators
- `userFnName` - string of call function wrapper or function determining call function wrapper string

**Returns:** transformed code

## License

MIT

[travis-image]: https://img.shields.io/travis/joshrtay/auto-yield.svg?style=flat-square
[travis-url]: https://travis-ci.org/joshrtay/auto-yield
[git-image]: https://img.shields.io/github/tag/joshrtay/auto-yield.svg
[git-url]: https://github.com/joshrtay/auto-yield
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat
[standard-url]: https://github.com/feross/standard
[npm-image]: https://img.shields.io/npm/v/auto-yield.svg?style=flat-square
[npm-url]: https://npmjs.org/package/auto-yield
