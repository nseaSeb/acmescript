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
  sort: (sorter) => (list) => [...list].sort(sorter)
};
