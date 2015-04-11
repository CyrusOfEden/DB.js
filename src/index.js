import Collection from './collection';

const _collections = Symbol();

const DB = {
  [_collections]: {},
  collection(name) {
    if (this[_collections][name]) {
      return this[_collections][name].clear();
    } else {
      this[_collections][name] = new Collection([]);
      return this[_collections][name].clear();
    }
  }
}

export default DB;
