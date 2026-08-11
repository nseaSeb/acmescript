import { ok } from "./core.js";

export const withDo = (...steps) => {
  let context = {};
  for (const step of steps) {
    if (typeof step === "function") {
      const res = step(context);
      if (!res || res.ok === false) return res; // short-circuit on error
      if (res.data) Object.assign(context, res.data);
    }
  }
  return ok(context);
};
