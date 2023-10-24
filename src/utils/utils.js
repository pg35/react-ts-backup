let id = 0;
export function seedId(n) {
  id = n;
}
export function genId() {
  return ++id;
}
export function memoize(fn, resolver) {
  const cache = new Map();

  return (...args) => {
    const key = resolver ? resolver.apply(this, args) : args[0];

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);

    return result;
  };
}
export function mapList(list, fn) {
  const items = {};
  list.itemOrder.forEach(
    //(itemId) => (items[itemId] = fn({ ...list.items[itemId] }))//dont remember why fn was called with object destructing
    (itemId) => (items[itemId] = fn(list.items[itemId]))
  );
  return { ...list, items };
}
export const reactSelectStyles = {
  input: (styles) => ({
    ...styles,
    "& > input:focus": {
      boxShadow: "none"
    }
  }),
  menu: (styles) => ({ ...styles, marginTop: "0" })
};
