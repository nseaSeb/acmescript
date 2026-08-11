import { describe, it, expect } from "vitest";
import { pipe, ok, error, match } from "../src/core.js";

describe("pipe", () => {
  it("enchaîne les fonctions dans l'ordre", () => {
    expect(pipe(5, (x) => x + 1, (x) => x * 2)).toBe(12);
  });

  it("ignore les entrées non-fonction", () => {
    expect(pipe(5, null, undefined, (x) => x + 1)).toBe(6);
  });

  it("retourne la valeur telle quelle sans fns", () => {
    expect(pipe(5)).toBe(5);
  });
});

describe("ok/error", () => {
  it("ok expose ok/data/error et se déstructure comme tableau", () => {
    const r = ok({ id: 1 });
    expect(r.ok).toBe(true);
    expect(r.data).toEqual({ id: 1 });
    expect(r.error).toBe(null);
    const [success, data] = r;
    expect(success).toBe(true);
    expect(data).toEqual({ id: 1 });
  });

  it("error expose ok/data/error et se déstructure comme tableau", () => {
    const r = error("boom");
    expect(r.ok).toBe(false);
    expect(r.data).toBe(null);
    expect(r.error).toBe("boom");
    const [success, err] = r;
    expect(success).toBe(false);
    expect(err).toBe("boom");
  });
});

describe("match", () => {
  it("appelle clauses.ok sur un résultat ok", () => {
    expect(match(ok(42), { ok: (d) => d + 1 })).toBe(43);
  });

  it("appelle clauses.error sur un résultat error", () => {
    expect(match(error("nope"), { error: (e) => `err:${e}` })).toBe("err:nope");
  });

  it("appelle clauses._ en fallback", () => {
    expect(match(ok(1), { _: () => "fallback" })).toBe("fallback");
  });

  it("retourne le résultat brut si aucune clause ne correspond", () => {
    const r = ok(1);
    expect(match(r, {})).toBe(r);
  });
});
