"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var query = {
  where: function where(q) {
    return function (obj) {
      for (var param in q) {
        if (obj[param] !== q[param]) return;
      }
      return obj;
    };
  },
  whereNot: function whereNot(q) {
    return function (obj) {
      for (var param in q) {
        if (obj[param] === q[param]) return;
      }
      return obj;
    };
  },
  pluck: function pluck() {
    for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
      props[_key] = arguments[_key];
    }

    if (props.length === 1) {
      return function (obj) {
        return obj[props];
      };
    } else {
      return function (obj) {
        var res = [];
        for (var i = 0; i < props.length; i++) {
          res.push(obj[props[i]]);
        }
        return res;
      };
    }
  }
};

exports["default"] = query;
module.exports = exports["default"];