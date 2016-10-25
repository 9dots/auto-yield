/**
 * Imports
 */

var babel = require('babel-core')
var camelCase = require('camel-case')

/**
 * Expose auto yield
 */

module.exports = autoYield

/**
 * auto-yield
 */

function autoYield (code, generatorNames, secondOrderGens) {
  generatorNames = generatorNames || []
  secondOrderGens = secondOrderGens || []

  var it = { CallExpression: CallExpression, VariableDeclarator: VariableDeclarator }
  var result = babel.transform(code, {
    plugins: [{ visitor: it }]
  })
  return result.code

  function CallExpression (path) {
    var parent = path.parentPath
    if (parent.node.type !== 'YieldExpression' && isGenerator(path.node.callee, path.scope)) {
      const inScope = path.scope.bindings[path.node.callee.name]
      const inFile = path.hub.file.scope.bindings[path.node.callee.name]
      const deleg = inScope || inFile ? true : false
      path.replaceWith(babel.types.yieldExpression(path.node, deleg))
      while (parent && parent.node.type !== 'FunctionExpression' && parent.node.type !== 'FunctionDeclaration') {
        parent = parent.parentPath
      }
      if (parent && !parent.node.generator) {
        parent.replaceWith(babel.types[camelCase(parent.node.type)](parent.node.id, parent.node.params, parent.node.body, true))
        parent.parentPath.traverse(it)
      }
    }
  }

  function VariableDeclarator (path) {
    if (path.node.init.callee) {
      var inScope = path.scope.bindings[path.node.init.callee.name] ? true : false
      var inSecondGens = secondOrderGens.indexOf(path.node.init.callee.name) >= 0
      if (inScope || inSecondGens) {
        if (generatorNames.indexOf(path.node.id.name) === -1) {
          generatorNames.push(path.node.id.name)
        }
      }
    }
  }

  function isGenerator (callee, scope) {
    if (callee.object) {
      return isMethodGenerator(callee.object.name, callee.property.name, scope)
    } else {
      return isFunctionGenerator(callee.name, scope)
    }
  }

  function isFunctionGenerator(name, scope) {
    scope = findBindingScope(name, scope)
    if (scope) {
      return scope.bindings[name].path.node.generator || !scope.parent && generatorNames.indexOf(name) >= 0
    } else {
      return generatorNames.indexOf(name) >= 0
    }
  }

  function isMethodGenerator (objectName, propertyName, scope) {
    scope = findBindingScope(objectName, scope)
    //XXX add real support for methods
    return scope && !scope.parent && generatorNames.indexOf(objectName) >= 0
  }

  function findBindingScope (name, scope) {
    while (scope && !scope.bindings[name]) {
      scope = scope.parent
    }
    return scope
  }
}
