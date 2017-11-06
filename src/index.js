/**
 * Imports
 */

var babel = require("@babel/standalone");
var camelCase = require("camel-case");
const arrowFunctions = require("babel-plugin-transform-es2015-arrow-functions");
var t = require("babel-types");

/**
 * Expose auto yield
 */

module.exports = autoYield;
function addLineNumber(path) {
  return t.callExpression(t.identifier(path.node.callee.name), [
    t.numericLiteral(path.node.callee.loc.start.line),
    ...path.node.arguments
  ]);
}

function addCallFnWrapper(path, userFnName) {
  return t.callExpression(t.identifier(userFnName), [
    t.numericLiteral(path.node.callee.loc.start.line),
    t.identifier(path.node.callee.name),
    ...path.node.arguments
  ]);
}

/**
 * auto-yield
 */

function autoYield(code, generatorNames, secondOrderGens, userFnName = "") {
  generatorNames = generatorNames || [];
  secondOrderGens = secondOrderGens || [];

  var withoutArrows = babel.transform(code, {
    retainLines: true,
    plugins: [arrowFunctions]
  });

  const visitor = {
    CallExpression,
    VariableDeclarator,
    FunctionDeclaration,
    FunctionExpression: FunctionDeclaration
  };

  const result = babel.transform(withoutArrows.code, {
    plugins: [{ visitor }]
  });

  return result.code;

  function CallExpression(path) {
    var parent = path.parentPath;
    if (parent.node.type !== "YieldExpression") {
      if (path.node.callee.type !== "MemberExpression") {
        const inScope =
          path.scope.bindings[path.node.callee.name] &&
          // path.scope.bindings[path.node.callee.name].type &&
          path.scope.bindings[path.node.callee.name].type !== "param";
        const inFile = path.hub.file.scope.bindings[path.node.callee.name];
        const deleg = inScope || inFile ? true : false;
        path.replaceWith(
          t.yieldExpression(
            deleg ? addCallFnWrapper(path, userFnName) : addLineNumber(path),
            deleg
          )
        );
      }
    }
  }

  function FunctionDeclaration(path) {
    if (!path.node.generator) {
      path.replaceWith(
        t[camelCase(path.node.type)](
          path.node.id,
          path.node.params,
          path.node.body,
          true
        )
      );
    }
  }

  function VariableDeclarator(path) {
    if (
      path.node.init.type === "FunctionExpression" &&
      !path.node.init.generator
    ) {
      path.replaceWith(
        t.variableDeclarator(
          path.node.id,
          t[camelCase(path.node.init.type)](
            path.node.init.id,
            path.node.init.params,
            path.node.init.body,
            true
          )
        )
      );
    }
  }

  function isGenerator(callee, scope) {
    if (callee.object) {
      return isMethodGenerator(callee.object.name, callee.property.name, scope);
    } else {
      return isFunctionGenerator(callee.name, scope);
    }
  }

  function isFunctionGenerator(name, scope) {
    scope = findBindingScope(name, scope);
    if (scope) {
      return (
        scope.bindings[name].path.node.generator ||
        (!scope.parent && generatorNames.indexOf(name) >= 0)
      );
    } else {
      return generatorNames.indexOf(name) >= 0;
    }
  }

  function isMethodGenerator(objectName, propertyName, scope) {
    scope = findBindingScope(objectName, scope);
    //XXX add real support for methods
    return scope && !scope.parent && generatorNames.indexOf(objectName) >= 0;
  }

  function findBindingScope(name, scope) {
    while (scope && !scope.bindings[name]) {
      scope = scope.parent;
    }
    return scope;
  }
}
