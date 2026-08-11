import { describe, it, expect } from "vitest";
import { getIn, putIn, updateIn } from "../src/access.js";

describe("getIn", () => {
  it("reads a deep value", () => {
    expect(getIn({ a: { b: { c: 1 } } }, ["a", "b", "c"])).toBe(1);
  });

  it("returns the default value when absent", () => {
    expect(getIn({ a: {} }, ["a", "b", "c"], "fallback")).toBe("fallback");
  });

  it("defaults to null when not provided", () => {
    expect(getIn({}, ["a"])).toBe(null);
  });
});

describe("putIn", () => {
  it("writes a deep value without mutating the original", () => {
    const original = { a: { b: 1 } };
    const next = putIn(original, ["a", "b"], 2);
    expect(next).toEqual({ a: { b: 2 } });
    expect(original).toEqual({ a: { b: 1 } });
  });

  it("creates missing levels", () => {
    expect(putIn({}, ["a", "b"], 1)).toEqual({ a: { b: 1 } });
  });
});

describe("updateIn", () => {
  it("applies a function to the deep value", () => {
    const original = { a: { b: 1 } };
    const next = updateIn(original, ["a", "b"], (n) => n + 1);
    expect(next).toEqual({ a: { b: 2 } });
    expect(original).toEqual({ a: { b: 1 } });
  });
});
