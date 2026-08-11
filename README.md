# AcmeScript

Client-side JavaScript for Elixir/Phoenix projects. Brings helpers close to Elixir
idioms (`pipe`, `ok/error`, `match`, `with`, `Enum`, immutable access on nested maps)
to simplify writing LiveView hooks and `.heex` templates.

No build step required: native ES modules, importable directly in the browser or
through your Phoenix asset bundler (esbuild/vite).

```
pnpm add @nseaprotector/acme-script
```

```js
import { pipe, ok, error, match, cond, unless, inspect, H, J, find, show, hide,
         createHook, createLiveComponent, Enum, getIn, putIn, updateIn,
         PubSub, withDo } from "./acmescript.js";
```

## Structure

```
acmescript.js   public entry point (re-exports src/index.js)
src/
  core.js            pipe, ok, error, match
  sigils.js          H (HTML template), J (safe JSON)
  dom.js             find (fluent DOM selection)
  transitions.js     transition, show, hide
  hook.js            createHook (LiveView hook wrapper)
  live_component.js  createLiveComponent (stateful custom element)
  enum.js            Enum (map/filter/reduce/... Elixir-style)
  access.js          getIn, putIn, updateIn (immutable access)
  pubsub.js          PubSub (client-side, independent of the server)
  with.js            withDo (Elixir `with`-style chaining)
```

## API

### `pipe(value, ...fns)`
Chains unary functions, `|>`-style.

```js
pipe(5, (x) => x + 1, (x) => x * 2); // 12
```

### `ok(data)` / `error(err)` / `match(result, clauses)`
Typed result `{ok, data, error}` (also iterable as `[bool, data]`), `{:ok, _}` / `{:error, _}`-style.

```js
const result = ok({ id: 1 });
match(result, {
  ok: (data) => console.log("found", data),
  error: (err) => console.error(err)
});
```

### `cond(pairs)`
Evaluates `[test, resultOrFn]` pairs in order, `cond do` block-style. `resultOrFn` can
be a plain value or a zero-arg function (called lazily, only for the matching branch).

```js
cond([
  [score > 90, "A"],
  [score > 70, () => computeGrade(score)],
  [true, "F"]
]);
```

### `unless(test, branch)`
Runs `branch` when `test` is falsy, the inverse of `if`.

```js
unless(user.isActive, () => deactivate(user));
```

### `inspect(label)`
`IO.inspect`-style: logs the value (with an optional label) and passes it through
unchanged. Meant to be dropped into a `pipe` chain for debugging.

```js
pipe(input, inspect("before"), transform, inspect("after"));
```

### `` H`...` `` — HTML sigil
Parses a template literal into an `HTMLElement` or `DocumentFragment`.

```js
const el = H`<div class="card">${title}</div>`;
document.body.append(el);
```

### `` J`...` `` — safe JSON sigil
Parses a JSON template literal, returns `ok`/`error` (never throws).

```js
const [success, data] = J`${jsonString}`;
if (success) render(data);
```

### `find(selector, parent = document)`
Selects an element and returns a fluent wrapper (`ok`/`error` + chainable methods).

```js
find("#modal")
  .addClass("open")
  .attr("aria-hidden", "false")
  .on("click", (e) => console.log(e));
```

### `transition(target, opts)` / `show(target, opts)` / `hide(target, opts)`
Class-based CSS transitions (Tailwind-compatible), inspired by Phoenix LiveView's `JS.show/hide`.

```js
show("#modal");
hide("#modal", { duration: 200 });
```

### `createHook(spec)`
LiveView hook wrapper: injects a `ctx` (`push`, `pushTo`, `handle`, `upload`) into `mounted/updated/destroyed`.

```js
export default createHook({
  mounted(ctx) {
    ctx.handle("refresh", (payload) => this.el.textContent = payload.value);
    ctx.push("ready");
  }
});
```

### `createLiveComponent({ mount, handleEvent, render })`
Standalone custom element with local state, hydrated from `phx-state`.

```js
customElements.define("acme-counter", createLiveComponent({
  mount: (state) => ({ count: state.count ?? 0 }),
  handleEvent: {
    inc: (state) => ({ count: state.count + 1 })
  },
  render: (state, send) => H`<button onclick="${() => send("inc")}">${state.count}</button>`
}));
```

### `Enum`
List transformation pipeline, Elixir `Enum`-style. Each function returns a
`(list) => list` (or `(list) => value`) transformer, to compose with `pipe`.

`map`, `filter`, `reject`, `reduce`, `take`, `chunkEvery`, `uniq`, `sort`, `each`,
`any`, `all`, `count`, `find`, `groupBy`, `sum`.

```js
pipe(
  users,
  Enum.filter((u) => u.active),
  Enum.map((u) => u.name),
  Enum.uniq(),
  Enum.take(10)
);

Enum.groupBy((u) => u.role)(users); // { admin: [...], user: [...] }
Enum.count((u) => u.active)(users); // 3
```

### `getIn(obj, path, default)` / `putIn(obj, path, val)` / `updateIn(obj, path, fn)`
Immutable read/write on nested objects, `Kernel.get_in/put_in/update_in`-style.

```js
const state = { user: { profile: { name: "Ada" } } };
getIn(state, ["user", "profile", "name"]);          // "Ada"
putIn(state, ["user", "profile", "name"], "Grace");  // new object
updateIn(state, ["user", "profile", "name"], (n) => n.toUpperCase());
```

### `PubSub`
Client-side pub/sub, independent of the server-side `Phoenix.PubSub` — useful for
letting hooks/components on the page talk to each other.

```js
const unsubscribe = PubSub.subscribe("cart:updated", (payload) => render(payload));
PubSub.broadcast("cart:updated", { count: 3 });
unsubscribe();
```

### `withDo(...steps)`
Chains steps that return `ok(data)`/`error(err)`, short-circuits on the first error,
Elixir `with`-style. Each `ok(data).data` is merged into the accumulated context.

```js
withDo(
  () => validateForm(input) ? ok({ input }) : error("invalid"),
  (ctx) => saveToServer(ctx.input)
);
```

## Examples

See [`examples/`](./examples) for complete use cases (LiveView hook, live component,
functional composition).

## Tests

```
pnpm test
```

See [`test/`](./test) (vitest + jsdom, one file per module in `src/`).

## Minified build

```
pnpm build
```

Generates `dist/acmescript.min.js` (ESM, ~3.3kb minified) via esbuild. Not versioned,
regenerate it when deploying Phoenix assets.
