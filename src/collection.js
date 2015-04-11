import query from './query';
import wrap from './wrap';

const _data = Symbol();

class Collection {
  constructor(data, pkey = 'id') {
    this.options = { pkey };
    this.records = [];
    this.indexes = { pkey: {} };
    this[_data] = (data || []);
    this.queries = [];
  }
  configure(fn) {
    fn(this.options);
    return this;
  }
  buildIndexes() {
    const count = this[_data].length;
    this.records = Array(count);
    for (let i = 0; i < count; i++) {
      let record = this[_data][i];
      this.records[i] = record;
      this.indexes.pkey[record[this.options.pkey]] = i;
    }
    return this;
  }
  set(data) {
    this[_data] = data;
    this.buildIndexes();
    return this;
  }
  update(record) {
    const idx = this.indexes.pkey[record[this.options.pkey]];
    if (idx === undefined) {
      this.records[idx] = record;
    } else {
      for (let prop in record) {
        this.records[idx][prop] = record[prop];
      }
    }
    return this.record[idx];
  }
  save(record) {
    const idx = this.indexes.pkey[record[this.options.pkey]];
    if (idx === undefined) {
      this.indexes.pkey[record[this.options.pkey]] = (this.records.push(record) - 1);
    } else {
      this.records[idx] = record;
    }
    return this.records[idx];
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
