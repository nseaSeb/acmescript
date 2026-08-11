import { describe, it, expect } from "vitest";
import { withDo } from "../src/with.js";
import { ok, error } from "../src/core.js";

describe("withDo", () => {
  it("fusionne les data de chaque étape ok dans le contexte", () => {
    const result = withDo(
      () => ok({ a: 1 }),
      (ctx) => ok({ b: ctx.a + 1 })
    );
    expect(result.ok).toBe(true);
    expect(result.data).toEqual({ a: 1, b: 2 });
  });

  it("court-circuite à la première étape error", () => {
    let secondCalled = false;
    const result = withDo(
      () => error("boom"),
      () => { secondCalled = true; return ok({}); }
    );
    expect(result.ok).toBe(false);
    expect(result.error).toBe("boom");
    expect(secondCalled).toBe(false);
  });

  it("ignore les étapes non-fonction", () => {
    const result = withDo(null, () => ok({ a: 1 }));
    expect(result.data).toEqual({ a: 1 });
  });

  it("sans étapes retourne ok({})", () => {
    const result = withDo();
    expect(result.ok).toBe(true);
    expect(result.data).toEqual({});
  });
});
