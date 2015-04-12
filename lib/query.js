'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function isFunction(f) {
  return typeof f === 'function';
}

function propEqual(prop, val) {
  return function (obj) {
    return obj[prop] === val;
  };
}

function propMatchFn(prop, fn) {
  return function (obj) {
    return fn(obj[prop]);
  };
}

function buildPredicates(q) {
  var predicates = [];
  for (var param in q) {
    predicates.push(isFunction(q[param]) ? propMatchFn(param, q[param]) : propEqual(param, q[param]));
  }
  return predicates;
}

var query = {
  identity: function identity() {
    return function (obj) {
      return obj;
    };
  },
  where: function where(q) {
    if (isFunction(q)) {
      return function (obj) {
        return q(obj);
      };
    } else {
      var _ret = (function () {
        var predicates = buildPredicates(q);
        var len = predicates.length;
        return {
          v: function (obj) {
            for (var i = 0; i < len; i++) {
              if (!predicates[i](obj)) return;
            }
            return obj;
          }
        };
      })();

      if (typeof _ret === 'object') {
        return _ret.v;
      }
    }
  },
  whereNot: function whereNot(q) {
    if (isFunction(q)) {
      return function (obj) {
        return !q(obj);
      };
    } else {
      var _ret2 = (function () {
        var predicates = buildPredicates(q);
        var len = predicates.length;
        return {
          v: function (obj) {
            for (var i = 0; i < len; i++) {
              if (predicates[i](obj)) return;
            }
            return obj;
          }
        };
      })();

      if (typeof _ret2 === 'object') {
        return _ret2.v;
      }
    }
  },
  pluck: function pluck() {
    for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
      props[_key] = arguments[_key];
    }

    if (props.length === 1) {
      var _ret3 = (function () {
        var prop = props[0];
        return {
          v: function (obj) {
            return obj[prop];
          }
        };
      })();

      if (typeof _ret3 === 'object') {
        return _ret3.v;
      }
    } else {
      var _ret4 = (function () {
        var len = props.length;
        return {
          v: function (obj) {
            var res = [];
            for (var i = 0; i < len; i++) {
              res.push(obj[props[i]]);
            }
            return res;
          }
        };
      })();

      if (typeof _ret4 === 'object') {
        return _ret4.v;
      }
    }
  }
};

exports['default'] = query;
module.exports = exports['default'];