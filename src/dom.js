import { ok, error } from "./core.js";

export const find = (selector, parent = document) => {
  const el = typeof selector === "string" ? parent.querySelector(selector) : selector;
  if (!el) return error(`Element not found: ${selector}`);

  const wrapper = Object.assign(ok(el), {
    el,
    // Méthodes fluides intégrées : chaque appel retourne le wrapper, pas `el`
    attr: (name, val) => val !== undefined ? (el.setAttribute(name, val), wrapper) : el.getAttribute(name),
    addClass: (...cls) => (el.classList.add(...cls), wrapper),
    removeClass: (...cls) => (el.classList.remove(...cls), wrapper),
    on: (evt, cb) => (el.addEventListener(evt, cb), wrapper)
  });

  return wrapper;
};
