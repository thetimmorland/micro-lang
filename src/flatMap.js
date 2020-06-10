export default function flatMap(arr, fn) {
  return arr.reduce((arr, x) => arr.concat(fn(x)), []);
}
