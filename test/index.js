/**
 * Imports
 */

import test from 'tape'
import autoYield from '../src'

/**
 * Tests
 */

/** @todo Fix broken tests */
// test('should add yield', (t) => {
//   var code = autoYield(`
//   function main () {
//     move()
//   }

//   function * move () {
//     yield 'moving'
//   }
//   `)

//   var out = `function* main() {
//   yield* move();
// }

// function* move() {
//   yield 'moving';
// }`

//   t.equal(code, out)
//   t.end()
// })

// test('should add yield at depth 2', (t) => {
//   var code = autoYield(`
//   function main () {
//     square()
//   }

//   function square () {
//     move()
//     move()
//   }

//   function * move () {
//     yield 'moving'
//   }
//   `)

//   var out = `function* main() {
//   yield* square();
// }

// function* square() {
//   yield* move();
//   yield* move();
// }

// function* move() {
//   yield 'moving';
// }`

//   t.equal(code, out)
//   t.end()
// })

// test('should add yield for imported', (t) => {
//   var code = autoYield(`
//   var move = require('move')

//   function main () {
//     move()
//   }
//   `, ['move'])

//   var out = `
// var move = require('move');

// function* main() {
//   yield* move();
// }`

//   t.equal(code, out)
//   t.end()
// })

// test('should add yield for imported second order gen function', (t) => {
//   var code = autoYield(`
//   var move = require('move')
//   var steer = move('a', 'b')

//   function main () {
//     steer.rotate()
//   }
//   `, [], ['move'])

//   var out = `
// var move = require('move');
// var steer = move('a', 'b');

// function* main() {
//   yield steer.rotate();
// }`

//   t.equal(code, out)
//   t.end()
// })


// test('should add yield for imported objects', (t) => {
//   var code = autoYield(`
//   const { move } = require('ev3')

//   function main () {
//     move.rotations()
//   }
//   `, ['move'])

//   var out = `
// const { move } = require('ev3');

// function* main() {
//   yield move.rotations();
// }`

//   t.equal(code, out)
//   t.end()
// })

test('should add yield when userFnNameOrGetter is a string', (t) => {
  var code = autoYield(`forward()
    forward()
    turnAround()

    function turnAround() {
      turnRight()
      turnRight()
    }
  `, null, null, 'callFn')

  var out = `yield forward(1);
yield forward(2);
yield* callFn(3, turnAround);

function* turnAround() {
  yield turnRight(6);
  yield turnRight(7);
}`

  t.equal(code, out)
  t.end()
})

test('should add yield when userFnNameOrGetter is a function', (t) => {
  var code = autoYield(`forward()
    forward()
    turnAround()
    moveTurn()

    function moveTurn() {
      forward()
      turnRight()
    }

    function turnAround() {
      turnRight()
      turnRight()
    }
  `, null, null, name => ['turnAround'].includes(name) ? 'callSpecialFn': 'callFn')

  var out = `yield forward(1);
yield forward(2);
yield* callSpecialFn(3, turnAround);
yield* callFn(4, moveTurn);

function* moveTurn() {
  yield forward(7);
  yield turnRight(8);
}

function* turnAround() {
  yield turnRight(12);
  yield turnRight(13);
}`

  t.equal(code, out)
  t.end()
})

// TODO: add support
// test('should add yield for generator methods', (t) => {
//   var code = autoYield(`
//   function main () {
//     move.rotations()
//   }
//
//   const move = {
//     rotations: function * () {
//       yield 'rotate'
//     }
//   }
//   `)
//
//   var out = `
// function* main() {
//   yield move.rotations();
// }
//
// const move = {
//   rotations: function * () {
//     yield 'rotate';
//   }
// }`
//
//   t.equal(code, out)
//   t.end()
// })
