export default const query = {
  where(q) {
    return function(obj) {
      for (let param in q) {
        if (obj[param] !== q[param]) return;
      }
      return obj;
    }
  },
  whereNot(q) {
    return function(obj) {
      for (let param in q) {
        if (obj[param] === q[param]) return;
      }
      return obj;
    }
  },
  pluck(...props) {
    if (props.length === 1) {
      return function(obj) {
        return obj[props];
      }
    } else {
      return function(obj) {
        let res = [];
        for (let i = 0; i < props.length; i++) {
          res.push(obj[props[i]]);
        }
        return res;
      }
    }
  }
};
