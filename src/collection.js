import { EventEmitter } from 'events';
import query from './query';
import wrap from './wrap';

class Collection extends EventEmitter {
  constructor(data, pkey = 'id') {
    super();
    this.options = { pkey };
    this.records = [];
    this.indexes = { pkey: {} };
    this.queries = [];
    this.buildIndexes(data || []);
  }
  configure(fn) {
    fn(this.options);
    return this;
  }
  index(record) {
    return this.indexes.pkey[record[this.options.pkey]];
  }
  buildIndexes(data) {
    const count = data.length;
    this.records = Array(count);
    for (let i = 0; i < count; i++) {
      let record = data[i];
      this.records[i] = record;
      this.indexes.pkey[record[this.options.pkey]] = i;
    }
    return this;
  }
  set(data) {
    this.buildIndexes(data);
    return this;
  }
  add(record) {
    if (this.index(record) !== undefined) {
      return;
    } else {
      this.indexes.pkey[record[this.options.pkey]] = (this.records.push(record) - 1);
      this.emit('add', record);
      return this.index(record);
    }
  }
  update(params) {
    const added = this.add(params);
    if (added !== undefined) {
      return added;
    } else {
      let record = this.records[this.index(params)];
      for (let prop in params) {
        record[prop] = params[prop];
      }
      this.emit('update', record);
      this.emit('save', record);
      return record;
    }
  }
  save(record) {
    return this.update(record);
  }
  remove(record) {
    return this.destroy(record.id);
  }
  destroy(id) {
    const index = this.index({ id });
    if (index) {
      const record = this.records[record];
      this.records.splice(index, 1);
      delete this.indexes.pkey[id];
      this.emit('destroy', record);
      return true;
    } else {
      return false;
    }
  }
  clear() {
    this.queries = [];
    return this;
  }
  count() {
    if (this.queries.length) {
      this.queries.push([null, query.identity(), 'count']);
    } else {
      return wrap(this.records.length);
    }
    return this;
  }
  all() {
    return wrap(this.records);
  }
  pluck(...props) {
    this.queries.push([null, query.pluck(...props), 'pluck']);
    return this;
  }
  find(id) {
    return wrap(this.records[this.indexes.pkey[id]] || null);
  }
  findBy(q) {
    this.queries.push([1, query.where(q), 'findBy']);
    return this;
  }
  where(q) {
    this.queries.push([null, query.where(q), 'where']);
    return this;
  }
  limit(n) {
    this.queries.push([n, query.identity(), 'limit']);
    return this;
  }
  whereNot(q) {
    this.queries.push([null, query.whereNot(q), 'whereNot']);
    return this;
  }
  exec() {
    let res = [];
    let limit = this.records.length;
    let queries = [];
    for (let i = 0, len = this.queries.length; i < len; i++) {
      let q = this.queries[i];
      if (q[0] !== null && q[0] < limit) limit = q[0];
      queries.push(q.slice(1));
    }
    if (limit === 0) return [];
    for (let i = 0, len = this.records.length; i < len; i++) {
      let obj = this.records[i];
      for (let n = 0; n < queries.length; n++) {
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
  valueOf() {
    return this.exec();
  }
}

export default Collection;
