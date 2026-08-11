// Composition fonctionnelle : pipe, Enum, ok/error/match, withDo, getIn/putIn, PubSub
import { pipe, Enum, ok, error, match, withDo, getIn, putIn, PubSub } from "../acmescript.js";

// pipe + Enum : équivalent de |> Enum.filter |> Enum.map |> Enum.take
const activeNames = pipe(
  [{ name: "Ada", active: true }, { name: "Grace", active: false }, { name: "Alan", active: true }],
  Enum.filter((u) => u.active),
  Enum.map((u) => u.name),
  Enum.take(1)
); // ["Ada"]

// ok/error/match : équivalent de {:ok, _} / {:error, _} + case
function fetchUser(id) {
  return id > 0 ? ok({ id, name: "Ada" }) : error("invalid id");
}

match(fetchUser(1), {
  ok: (user) => console.log("chargé", user),
  error: (err) => console.error(err)
});

// withDo : équivalent d'un bloc `with`, court-circuite sur la première erreur
function validate(input) {
  return input.email ? ok({ email: input.email }) : error("email requis");
}

function save(ctx) {
  return ok({ saved: true, email: ctx.email });
}

const result = withDo(
  () => validate({ email: "ada@example.com" }),
  (ctx) => save(ctx)
);
// result.ok === true, result.data === { email: "ada@example.com", saved: true, ... }

// getIn/putIn : accès immuable, équivalent de get_in/put_in
const state = { user: { profile: { name: "Ada" } } };
const name = getIn(state, ["user", "profile", "name"]); // "Ada"
const nextState = putIn(state, ["user", "profile", "name"], "Grace"); // nouvel objet, state inchangé

// PubSub : communication entre hooks/composants côté client
PubSub.subscribe("theme:changed", (theme) => document.body.dataset.theme = theme);
PubSub.broadcast("theme:changed", "dark");
