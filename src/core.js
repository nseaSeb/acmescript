export const pipe = (value, ...fns) =>
  fns.reduce((acc, fn) => (typeof fn === "function" ? fn(acc) : acc), value);

export const ok = (data) => Object.assign([true, data], { ok: true, data, error: null });
export const error = (err) => Object.assign([false, err], { ok: false, data: null, error: err });

export const match = (result, clauses = {}) => {
  if (result?.ok && clauses.ok) return clauses.ok(result.data);
  if (!result?.ok && clauses.error) return clauses.error(result.error);
  if (clauses._) return clauses._(result);
  return result;
};

// cond([[test, resultOrFn], ...]): evaluates tests in order, `cond do`-style
export const cond = (pairs) => {
  for (const [test, branch] of pairs) {
    if (test) return typeof branch === "function" ? branch() : branch;
  }
  return undefined;
};

export const unless = (test, branch) =>
  !test ? (typeof branch === "function" ? branch() : branch) : undefined;

// `|> IO.inspect(label: "x")`-style: logs and passes the value through unchanged, pipe-friendly
export const inspect = (label = "") => (value) => {
  console.log(...(label ? [`${label}:`, value] : [value]));
  return value;
};
