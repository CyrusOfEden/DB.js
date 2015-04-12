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
    this.buildIndexes(data);
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
    if (this.index(record) === undefined) {
      return;
    } else {
      this.indexes.pkey[record[this.options.pkey]] = (this.records.push(record) - 1);
      this.emit('add', record);
      return this.index(record);
    }
  }
  update(params) {
    const added = this.add(record);
    if (added !== undefined) {
      return added;
    } else {
      let record = this.records[this.index(record)];
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
    return wrap(this.records.length);
  }
  all() {
    return wrap(this.records);
  }
  pluck(...props) {
    this.queries.push([null, query.pluck(...props)]);
    return this;
  }
  find(id) {
    return wrap(this.records[this.indexes.pkey[id]] || null);
  }
  findBy(q) {
    this.queries.push([1, query.where(q)]);
    return this;
  }
  where(q) {
    this.queries.push([null, query.where(q)]);
    return this;
  }
  limit(n) {
    this.queries.push([n, (obj) => obj]);
    return this;
  }
  whereNot(q) {
    this.queries.push([null, query.whereNot(q)]);
    return this;
  }
  exec() {
    let data = this.records;
    let res = [];
    let limit = this.count();
    let queries = [];
    for (let i = 0; i < this.queries.length; i++) {
      let q = this.queries[i];
      if (q[0] !== null && q[0] < limit) limit = q[0];
      queries.push(q[1]);
    }
    if (limit === 0) return [];
    for (let id in data) {
      let pass = true;
      let prev = data[id];
      let curr = null;
      for (let i = 0; i < queries.length; i++) {
        let fn = queries[i];
        curr = fn(prev);
        if (curr) {
          prev = curr;
        } else {
          pass = false;
          break;
        }
      }
      if (pass) res.push(prev);
      if (res.length === limit) break;
    }
    return res;
  }
  valueOf() {
    return this.exec();
  }
}

export default Collection;
