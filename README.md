# AcmeScript

JavaScript côté client pour projets Elixir/Phoenix. Apporte des helpers proches des
habitudes Elixir (`pipe`, `ok/error`, `match`, `with`, `Enum`, accès immuable dans des
maps imbriquées) pour simplifier l'écriture des hooks LiveView et des templates `.heex`.

Pas de build step requis : modules ES natifs, importables directement dans le navigateur
ou via votre bundler (esbuild/vite) d'assets Phoenix.

```js
import { pipe, ok, error, match, H, J, find, show, hide,
         createHook, createLiveComponent, Enum, getIn, putIn, updateIn,
         PubSub, withDo } from "./acmescript.js";
```

## Structure

```
acmescript.js   point d'entrée public (re-exporte src/index.js)
src/
  core.js            pipe, ok, error, match
  sigils.js          H (template HTML), J (JSON sécurisé)
  dom.js             find (sélection DOM fluide)
  transitions.js     transition, show, hide
  hook.js            createHook (wrapper hook LiveView)
  live_component.js  createLiveComponent (custom element stateful)
  enum.js            Enum (map/filter/reduce/... à la Elixir)
  access.js          getIn, putIn, updateIn (accès immuable)
  pubsub.js          PubSub (client-side, indépendant du serveur)
  with.js            withDo (chaînage à la `with` Elixir)
```

## API

### `pipe(value, ...fns)`
Enchaîne des fonctions unaires, façon `|>`.

```js
pipe(5, (x) => x + 1, (x) => x * 2); // 12
```

### `ok(data)` / `error(err)` / `match(result, clauses)`
Résultat typé `{ok, data, error}` (aussi itérable comme `[bool, data]`), façon `{:ok, _}` / `{:error, _}`.

```js
const result = ok({ id: 1 });
match(result, {
  ok: (data) => console.log("trouvé", data),
  error: (err) => console.error(err)
});
```

### `` H`...` `` — sigil HTML
Parse un template literal en `HTMLElement` ou `DocumentFragment`.

```js
const el = H`<div class="card">${title}</div>`;
document.body.append(el);
```

### `` J`...` `` — sigil JSON sécurisé
Parse un template literal JSON, retourne un `ok`/`error` (jamais de throw).

```js
const [success, data] = J`${jsonString}`;
if (success) render(data);
```

### `find(selector, parent = document)`
Sélectionne un élément et retourne un wrapper fluide (`ok`/`error` + méthodes chainables).

```js
find("#modal")
  .addClass("open")
  .attr("aria-hidden", "false")
  .on("click", (e) => console.log(e));
```

### `transition(target, opts)` / `show(target, opts)` / `hide(target, opts)`
Transitions CSS par classes (compatible Tailwind), inspirées de `JS.show/hide` de Phoenix LiveView.

```js
show("#modal");
hide("#modal", { duration: 200 });
```

### `createHook(spec)`
Wrapper de hook LiveView : injecte un contexte `ctx` (`push`, `pushTo`, `handle`, `upload`) dans `mounted/updated/destroyed`.

```js
export default createHook({
  mounted(ctx) {
    ctx.handle("refresh", (payload) => this.el.textContent = payload.value);
    ctx.push("ready");
  }
});
```

### `createLiveComponent({ mount, handleEvent, render })`
Custom element autonome avec état local, hydraté depuis `phx-state`.

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
Pipeline de transformations de listes, façon `Enum` Elixir. Chaque fonction retourne un
transformateur `(list) => list`, à composer avec `pipe`.

```js
pipe(
  users,
  Enum.filter((u) => u.active),
  Enum.map((u) => u.name),
  Enum.uniq(),
  Enum.take(10)
);
```

### `getIn(obj, path, default)` / `putIn(obj, path, val)` / `updateIn(obj, path, fn)`
Accès et mise à jour immuables dans des objets imbriqués, façon `Kernel.get_in/put_in/update_in`.

```js
const state = { user: { profile: { name: "Ada" } } };
getIn(state, ["user", "profile", "name"]);          // "Ada"
putIn(state, ["user", "profile", "name"], "Grace");  // nouvel objet
updateIn(state, ["user", "profile", "name"], (n) => n.toUpperCase());
```

### `PubSub`
Pub/sub client-side, indépendant du `Phoenix.PubSub` serveur — utile pour faire
communiquer des hooks/composants entre eux dans la page.

```js
const unsubscribe = PubSub.subscribe("cart:updated", (payload) => render(payload));
PubSub.broadcast("cart:updated", { count: 3 });
unsubscribe();
```

### `withDo(...steps)`
Chaîne des étapes qui retournent `ok(data)`/`error(err)`, court-circuite à la première
erreur, façon `with` Elixir. Chaque `ok(data).data` fusionné dans le contexte accumulé.

```js
withDo(
  () => validateForm(input) ? ok({ input }) : error("invalid"),
  (ctx) => saveToServer(ctx.input)
);
```

## Exemples

Voir [`examples/`](./examples) pour des cas d'usage complets (hook LiveView, live
component, composition fonctionnelle).

## Tests

```
pnpm test
```

Voir [`test/`](./test) (vitest + jsdom, un fichier par module de `src/`).

## Build minifié

```
pnpm build
```

Génère `dist/acmescript.min.js` (ESM, ~3.3kb minifié) via esbuild. Non versionné,
à régénérer au déploiement des assets Phoenix.
