export const transition = (target, { transition, from, to, duration = 300 }) => {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;

  const tClasses = transition.split(" ").filter(Boolean);
  const fromClasses = from.split(" ").filter(Boolean);
  const toClasses = to.split(" ").filter(Boolean);

  el.classList.add(...tClasses, ...fromClasses);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.remove(...fromClasses);
      el.classList.add(...toClasses);

      setTimeout(() => {
        el.classList.remove(...tClasses, ...toClasses);
      }, duration);
    });
  });
};

export const show = (target, opts = {}) =>
  transition(target, {
    transition: "transition-all ease-out duration-200",
    from: "opacity-0 scale-95",
    to: "opacity-100 scale-100",
    ...opts
  });

export const hide = (target, opts = {}) =>
  transition(target, {
    transition: "transition-all ease-in duration-150",
    from: "opacity-100 scale-100",
    to: "opacity-0 scale-95",
    ...opts
  });
