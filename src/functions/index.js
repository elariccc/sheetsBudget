export default function deepClone(array) {
  return array.map(
    item => Array.isArray(item) ? deepClone(item) : item
  );
}