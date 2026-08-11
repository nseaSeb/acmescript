import { describe, it, expect } from "vitest";
import { pipe, ok, error, match } from "../src/core.js";

describe("pipe", () => {
  it("chains functions in order", () => {
    expect(pipe(5, (x) => x + 1, (x) => x * 2)).toBe(12);
  });

  it("ignores non-function inputs", () => {
    expect(pipe(5, null, undefined, (x) => x + 1)).toBe(6);
  });

  it("returns the value as-is without fns", () => {
    expect(pipe(5)).toBe(5);
  });
});

describe("ok/error", () => {
  it("ok exposes ok/data/error and destructures as an array", () => {
    const r = ok({ id: 1 });
    expect(r.ok).toBe(true);
    expect(r.data).toEqual({ id: 1 });
    expect(r.error).toBe(null);
    const [success, data] = r;
    expect(success).toBe(true);
    expect(data).toEqual({ id: 1 });
  });

  it("error exposes ok/data/error and destructures as an array", () => {
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
  it("calls clauses.ok on an ok result", () => {
    expect(match(ok(42), { ok: (d) => d + 1 })).toBe(43);
  });

  it("calls clauses.error on an error result", () => {
    expect(match(error("nope"), { error: (e) => `err:${e}` })).toBe("err:nope");
  });

  it("calls clauses._ as fallback", () => {
    expect(match(ok(1), { _: () => "fallback" })).toBe("fallback");
  });

  it("returns the raw result if no clause matches", () => {
    const r = ok(1);
    expect(match(r, {})).toBe(r);
  });
});
