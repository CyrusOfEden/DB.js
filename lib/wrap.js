"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = wrap;

function wrap(val) {
  return {
    valueOf: function valueOf() {
      return val;
    }
  };
}

module.exports = exports["default"];