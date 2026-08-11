import { describe, it, expect } from "vitest";
import { withDo } from "../src/with.js";
import { ok, error } from "../src/core.js";

describe("withDo", () => {
  it("merges each ok step's data into the context", () => {
    const result = withDo(
      () => ok({ a: 1 }),
      (ctx) => ok({ b: ctx.a + 1 })
    );
    expect(result.ok).toBe(true);
    expect(result.data).toEqual({ a: 1, b: 2 });
  });

  it("short-circuits at the first error step", () => {
    let secondCalled = false;
    const result = withDo(
      () => error("boom"),
      () => { secondCalled = true; return ok({}); }
    );
    expect(result.ok).toBe(false);
    expect(result.error).toBe("boom");
    expect(secondCalled).toBe(false);
  });

  it("ignores non-function steps", () => {
    const result = withDo(null, () => ok({ a: 1 }));
    expect(result.data).toEqual({ a: 1 });
  });

  it("returns ok({}) with no steps", () => {
    const result = withDo();
    expect(result.ok).toBe(true);
    expect(result.data).toEqual({});
  });
});
