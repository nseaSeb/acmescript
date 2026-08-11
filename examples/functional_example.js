// Functional composition: pipe, Enum, ok/error/match, withDo, getIn/putIn, PubSub
import { pipe, Enum, ok, error, match, withDo, getIn, putIn, PubSub } from "../acmescript.js";

// pipe + Enum: equivalent to |> Enum.filter |> Enum.map |> Enum.take
const activeNames = pipe(
  [{ name: "Ada", active: true }, { name: "Grace", active: false }, { name: "Alan", active: true }],
  Enum.filter((u) => u.active),
  Enum.map((u) => u.name),
  Enum.take(1)
); // ["Ada"]

// ok/error/match: equivalent to {:ok, _} / {:error, _} + case
function fetchUser(id) {
  return id > 0 ? ok({ id, name: "Ada" }) : error("invalid id");
}

match(fetchUser(1), {
  ok: (user) => console.log("loaded", user),
  error: (err) => console.error(err)
});

// withDo: equivalent to a `with` block, short-circuits on the first error
function validate(input) {
  return input.email ? ok({ email: input.email }) : error("email required");
}

function save(ctx) {
  return ok({ saved: true, email: ctx.email });
}

const result = withDo(
  () => validate({ email: "ada@example.com" }),
  (ctx) => save(ctx)
);
// result.ok === true, result.data === { email: "ada@example.com", saved: true, ... }

// getIn/putIn: immutable access, equivalent to get_in/put_in
const state = { user: { profile: { name: "Ada" } } };
const name = getIn(state, ["user", "profile", "name"]); // "Ada"
const nextState = putIn(state, ["user", "profile", "name"], "Grace"); // new object, state unchanged

// PubSub: communication between client-side hooks/components
PubSub.subscribe("theme:changed", (theme) => document.body.dataset.theme = theme);
PubSub.broadcast("theme:changed", "dark");
