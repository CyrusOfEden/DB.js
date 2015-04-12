'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _EventEmitter2 = require('events');

var _query = require('./query');

var _query2 = _interopRequireWildcard(_query);

var _wrap = require('./wrap');

var _wrap2 = _interopRequireWildcard(_wrap);

var Collection = (function (_EventEmitter) {
  function Collection(data) {
    var pkey = arguments[1] === undefined ? 'id' : arguments[1];

    _classCallCheck(this, Collection);

    _get(Object.getPrototypeOf(Collection.prototype), 'constructor', this).call(this);
    this.options = { pkey: pkey };
    this.records = [];
    this.indexes = { pkey: {} };
    this.queries = [];
    this.buildIndexes(data || []);
  }

  _inherits(Collection, _EventEmitter);

  _createClass(Collection, [{
    key: 'configure',
    value: function configure(fn) {
      fn(this.options);
      return this;
    }
  }, {
    key: 'index',
    value: function index(record) {
      return this.indexes.pkey[record[this.options.pkey]];
    }
  }, {
    key: 'buildIndexes',
    value: function buildIndexes(data) {
      var count = data.length;
      this.records = Array(count);
      for (var i = 0; i < count; i++) {
        var record = data[i];
        this.records[i] = record;
        this.indexes.pkey[record[this.options.pkey]] = i;
      }
      return this;
    }
  }, {
    key: 'set',
    value: function set(data) {
      this.buildIndexes(data);
      return this;
    }
  }, {
    key: 'add',
    value: function add(record) {
      if (this.index(record) !== undefined) {
        return;
      } else {
        this.indexes.pkey[record[this.options.pkey]] = this.records.push(record) - 1;
        this.emit('add', record);
        return this.index(record);
      }
    }
  }, {
    key: 'update',
    value: function update(params) {
      var added = this.add(params);
      if (added !== undefined) {
        return added;
      } else {
        var record = this.records[this.index(params)];
        for (var prop in params) {
          record[prop] = params[prop];
        }
        this.emit('update', record);
        this.emit('save', record);
        return record;
      }
    }
  }, {
    key: 'save',
    value: function save(record) {
      return this.update(record);
    }
  }, {
    key: 'remove',
    value: function remove(record) {
      return this.destroy(record.id);
    }
  }, {
    key: 'destroy',
    value: function destroy(id) {
      var index = this.index({ id: id });
      if (index) {
        var record = this.records[record];
        this.records.splice(index, 1);
        delete this.indexes.pkey[id];
        this.emit('destroy', record);
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.queries = [];
      return this;
    }
  }, {
    key: 'count',
    value: function count() {
      if (this.queries.length) {
        this.queries.push([null, _query2['default'].identity(), 'count']);
      } else {
        return _wrap2['default'](this.records.length);
      }
      return this;
    }
  }, {
    key: 'all',
    value: function all() {
      return _wrap2['default'](this.records);
    }
  }, {
    key: 'pluck',
    value: function pluck() {
      for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
        props[_key] = arguments[_key];
      }

      this.queries.push([null, _query2['default'].pluck.apply(_query2['default'], props), 'pluck']);
      return this;
    }
  }, {
    key: 'find',
    value: function find(id) {
      return _wrap2['default'](this.records[this.indexes.pkey[id]] || null);
    }
  }, {
    key: 'findBy',
    value: function findBy(q) {
      this.queries.push([1, _query2['default'].where(q), 'findBy']);
      return this;
    }
  }, {
    key: 'where',
    value: function where(q) {
      this.queries.push([null, _query2['default'].where(q), 'where']);
      return this;
    }
  }, {
    key: 'limit',
    value: function limit(n) {
      this.queries.push([n, _query2['default'].identity(), 'limit']);
      return this;
    }
  }, {
    key: 'whereNot',
    value: function whereNot(q) {
      this.queries.push([null, _query2['default'].whereNot(q), 'whereNot']);
      return this;
    }
  }, {
    key: 'exec',
    value: function exec() {
      var res = [];
      var limit = this.records.length;
      var queries = [];
      for (var i = 0, len = this.queries.length; i < len; i++) {
        var q = this.queries[i];
        if (q[0] !== null && q[0] < limit) limit = q[0];
        queries.push(q.slice(1));
      }
      if (limit === 0) {
        return [];
      }for (var i = 0, len = this.records.length; i < len; i++) {
        var obj = this.records[i];
        for (var n = 0; n < queries.length; n++) {
          obj = queries[n][0](obj);
          if (obj === undefined) break;
        }
        if (obj) res.push(obj);
        if (res.length === limit) break;
      }
      switch (queries[queries.length - 1][1]) {
        case 'findBy':
          return res[0];
        case 'count':
          return res.length;
        default:
          return res;
      }
    }
  }, {
    key: 'valueOf',
    value: function valueOf() {
      return this.exec();
    }
  }]);

  return Collection;
})(_EventEmitter2.EventEmitter);

exports['default'] = Collection;
module.exports = exports['default'];