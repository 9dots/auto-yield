
# auto-yield

<!-- [![Build status][travis-image]][travis-url] -->
[![Git tag][git-image]][git-url]
[![NPM version][npm-image]][npm-url]
<!-- [![Code style][standard-image]][standard-url] -->

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

### autoYield(code, globalGens, secondOrderGens, userFnNameOrGetter)

- `code` - code to transform
- `globalGens` - array of global names or object names that are generators or have generators
- `secondOrderGens` - array of functions that return generators
- `userFnNameOrGetter` - string of call function wrapper or function determining call function wrapper string, function accepts one argument that is the name of the function node that is being called (path.node.callee.name).

**Returns:** transformed code

## License

MIT

[travis-image]: https://img.shields.io/travis/joshrtay/auto-yield.svg?style=flat-square
[travis-url]: https://travis-ci.org/joshrtay/auto-yield
[git-image]: https://img.shields.io/github/tag/9dots/auto-yield.svg
[git-url]: https://github.com/9dots/auto-yield
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat
[standard-url]: https://github.com/feross/standard
[npm-image]: https://img.shields.io/npm/v/auto-yield-delegate.svg?style=flat-square
[npm-url]: https://npmjs.org/package/auto-yield-delegate
