import { describe, it, expect } from "vitest";
import { getIn, putIn, updateIn } from "../src/access.js";

describe("getIn", () => {
  it("lit une valeur profonde", () => {
    expect(getIn({ a: { b: { c: 1 } } }, ["a", "b", "c"])).toBe(1);
  });

  it("retourne la valeur par défaut si absent", () => {
    expect(getIn({ a: {} }, ["a", "b", "c"], "fallback")).toBe("fallback");
  });

  it("défaut = null si non fourni", () => {
    expect(getIn({}, ["a"])).toBe(null);
  });
});

describe("putIn", () => {
  it("écrit une valeur profonde sans muter l'original", () => {
    const original = { a: { b: 1 } };
    const next = putIn(original, ["a", "b"], 2);
    expect(next).toEqual({ a: { b: 2 } });
    expect(original).toEqual({ a: { b: 1 } });
  });

  it("crée les niveaux manquants", () => {
    expect(putIn({}, ["a", "b"], 1)).toEqual({ a: { b: 1 } });
  });
});

describe("updateIn", () => {
  it("applique une fonction à la valeur profonde", () => {
    const original = { a: { b: 1 } };
    const next = updateIn(original, ["a", "b"], (n) => n + 1);
    expect(next).toEqual({ a: { b: 2 } });
    expect(original).toEqual({ a: { b: 1 } });
  });
});
