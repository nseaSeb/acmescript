export const getIn = (obj, path, defaultVal = null) => {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultVal), obj);
};

export const putIn = (obj, [key, ...rest], val) => {
  if (!key) return val;
  return {
    ...obj,
    [key]: rest.length ? putIn(obj[key] || {}, rest, val) : val
  };
};

export const updateIn = (obj, [key, ...rest], updateFn) => {
  if (!key) return updateFn(obj);
  return {
    ...obj,
    [key]: rest.length ? updateIn(obj[key] || {}, rest, updateFn) : updateFn(obj[key])
  };
};
