export default function wrap(val) {
  return {
    valueOf() {
      return val;
    }
  };
}