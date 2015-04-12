'use strict';

var _DB;

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: key == null || typeof Symbol == 'undefined' || key.constructor !== Symbol, configurable: true, writable: true }); };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Collection = require('./collection');

var _Collection2 = _interopRequireWildcard(_Collection);

var _collections = Symbol();

var DB = (_DB = {}, _defineProperty(_DB, _collections, {}), _defineProperty(_DB, 'collection', function collection(name) {
  if (this[_collections][name]) {
    return this[_collections][name].clear();
  } else {
    this[_collections][name] = new _Collection2['default']([]);
    return this[_collections][name].clear();
  }
}), _DB);

exports['default'] = DB;
module.exports = exports['default'];