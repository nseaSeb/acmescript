export const Enum = {
  map: (fn) => (list) => list.map(fn),
  filter: (predicate) => (list) => list.filter(predicate),
  reject: (predicate) => (list) => list.filter((x) => !predicate(x)),
  reduce: (initial, fn) => (list) => list.reduce(fn, initial),
  take: (count) => (list) => list.slice(0, count),
  chunkEvery: (size) => (list) => {
    const res = [];
    for (let i = 0; i < list.length; i += size) res.push(list.slice(i, i + size));
    return res;
  },
  uniq: () => (list) => [...new Set(list)],
  sort: (sorter) => (list) => [...list].sort(sorter),
  each: (fn) => (list) => (list.forEach(fn), list),
  any: (predicate) => (list) => list.some(predicate),
  all: (predicate) => (list) => list.every(predicate),
  count: (predicate) => (list) => predicate ? list.filter(predicate).length : list.length,
  find: (predicate, defaultVal = null) => (list) => list.find(predicate) ?? defaultVal,
  groupBy: (keyFn) => (list) => list.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] ??= []).push(item);
    return acc;
  }, {}),
  sum: () => (list) => list.reduce((acc, x) => acc + x, 0)
};
