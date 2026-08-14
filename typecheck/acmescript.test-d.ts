// Typechecked via `pnpm typecheck` (tsc --noEmit). Not a runtime test — exercises
// the public API surface against acmescript.d.ts / hooks/index.d.ts so the
// hand-written declarations stay in sync with actual usage.
import {
  pipe, ok, error, match, cond, unless, inspect, H, J, find, show, hide,
  createHook, createLiveComponent, Enum, getIn, putIn, updateIn, PubSub, withDo
} from "../acmescript.js";
import type { Result } from "../acmescript.js";
import * as AcmeHooks from "../hooks/index.js";

// pipe
const piped: number = pipe(5, (x) => x + 1, (x: number) => x * 2);

// ok / error / match
const okResult = ok({ id: 1 });
const errResult = error("nope");
const matched = match(okResult, {
  ok: (data) => `found ${data.id}`,
  error: (err) => err
});
matched satisfies string | Result<{ id: number }, never>;
const [success, data] = okResult;
success satisfies boolean;
data satisfies { id: number } | null;

// cond / unless
const grade: string = cond<string>([
  [true, "A"],
  [false, () => "F"]
]) ?? "F";
unless(false, () => console.log("ran"));

// inspect
pipe(1, inspect("x"));

// H / J sigil
const el: HTMLElement | DocumentFragment = H`<div>${"hi"}</div>`;
const parsed = J<{ ok: boolean }>`${"{}"}`;

// find
const wrapped = find("#modal");
if (wrapped.ok) {
  wrapped.addClass("open").attr("aria-hidden", "false").on("click", (e) => e.preventDefault());
}

// transitions
show("#modal");
hide("#modal", { duration: 200 });

// createHook
const hook = createHook({
  mounted(ctx) {
    // real hooks/*.js style: read/write `this.el` and stash custom fields on `this`
    this._onClick = () => this.el.classList.add("active");
    this.el.addEventListener("click", this._onClick);
    ctx.handle("refresh", (payload) => (this.el.textContent = payload.value));
    ctx.push("ready");
    ctx.pushTo("#target", "ready");
    ctx.upload("avatar", []);
  },
  destroyed() {
    this.el.removeEventListener("click", this._onClick);
  }
});
hook satisfies { mounted?(): void; updated?(): void; destroyed?(): void };

// createLiveComponent
customElements.define(
  "acme-counter",
  createLiveComponent<{ count: number }>({
    mount: (state) => ({ count: state.count ?? 0 }),
    handleEvent: { inc: (state) => ({ count: state.count + 1 }) },
    render: (state, send) => H`<button>${state.count}</button>`
  })
);

// Enum
const names: string[] = pipe(
  [{ active: true, name: "a" }],
  Enum.filter((u) => u.active),
  Enum.map((u) => u.name),
  Enum.uniq(),
  Enum.take(10)
);
const grouped: Record<string, { role: string }[]> = Enum.groupBy((u: { role: string }) => u.role)([
  { role: "admin" }
]);
const activeCount: number = Enum.count((u: { active: boolean }) => u.active)([{ active: true }]);

// access
const state = { user: { profile: { name: "Ada" } } };
const name: string | null = getIn(state, ["user", "profile", "name"]);
const updated = putIn(state, ["user", "profile", "name"], "Grace");
const upcased = updateIn(state, ["user", "profile", "name"], (n) => String(n).toUpperCase());

// PubSub
const unsubscribe = PubSub.subscribe<{ count: number }>("cart:updated", (payload) => payload.count);
PubSub.broadcast("cart:updated", { count: 3 });
unsubscribe();

// withDo
withDo(
  () => (true ? ok({ input: 1 }) : error("invalid")),
  (ctx) => ok({ saved: ctx.input })
);

// hooks/index.js — every classic hook is a LiveViewHook, structurally usable
// straight in LiveSocket's `hooks` option.
const liveSocketHooks: Record<string, { mounted?(): void; updated?(): void; destroyed?(): void }> = {
  ...AcmeHooks
};
