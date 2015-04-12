function isFunction(f) {
  return typeof(f) === 'function';
}

function propEqual(prop, val) {
  return function(obj) {
    return obj[prop] === val;
  }
}

function propMatchFn(prop, fn) {
  return function(obj) {
    return fn(obj[prop]);
  }
}

function buildPredicates(q) {
  let predicates = [];
  for (let param in q) {
    predicates.push(
      isFunction(q[param]) ? propMatchFn(param, q[param]) : propEqual(param, q[param])
    );
  }
  return predicates;
}

const query = {
  identity() {
    return function(obj) {
      return obj;
    }
  },
  where(q) {
    if (isFunction(q)) {
      return function(obj) {
        return q(obj);
      }
    } else {
      let predicates = buildPredicates(q);
      let len = predicates.length;
      return function(obj) {
        for (let i = 0; i < len; i++) {
          if (!predicates[i](obj)) return;
        }
        return obj;
      }
    }
  },
  whereNot(q) {
    if (isFunction(q)) {
      return function(obj) {
        return !q(obj);
      }
    } else {
      let predicates = buildPredicates(q);
      let len = predicates.length;
      return function(obj) {
        for (let i = 0; i < len; i++) {
          if (predicates[i](obj)) return;
        }
        return obj;
      }
    }
  },
  pluck(...props) {
    if (props.length === 1) {
      let prop = props[0];
      return function(obj) {
        return obj[prop];
      }
    } else {
      let len = props.length;
      return function(obj) {
        let res = [];
        for (let i = 0; i < len; i++) {
          res.push(obj[props[i]]);
        }
        return res;
      }
    }
  }
};

export default query;
