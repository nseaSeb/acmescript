import { describe, it, expect, vi } from "vitest";
import { pipe, ok, error, match, cond, unless, inspect } from "../src/core.js";

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

describe("cond", () => {
  it("returns the branch of the first truthy test", () => {
    expect(cond([[false, "a"], [true, "b"], [true, "c"]])).toBe("b");
  });

  it("calls the branch if it's a function", () => {
    expect(cond([[true, () => "computed"]])).toBe("computed");
  });

  it("returns undefined if no test matches", () => {
    expect(cond([[false, "a"], [false, "b"]])).toBe(undefined);
  });

  it("doesn't call branches past the first match", () => {
    const spy = vi.fn();
    cond([[true, "first"], [true, spy]]);
    expect(spy).not.toHaveBeenCalled();
  });
});

describe("unless", () => {
  it("runs the branch when the test is falsy", () => {
    expect(unless(false, () => "ran")).toBe("ran");
  });

  it("does nothing when the test is truthy", () => {
    expect(unless(true, () => "ran")).toBe(undefined);
  });

  it("accepts a plain value as the branch", () => {
    expect(unless(false, "value")).toBe("value");
  });
});

describe("inspect", () => {
  it("logs the value with a label and returns it unchanged", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const result = inspect("step")(42);
    expect(result).toBe(42);
    expect(logSpy).toHaveBeenCalledWith("step:", 42);
    logSpy.mockRestore();
  });

  it("logs just the value without a label", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    inspect()(42);
    expect(logSpy).toHaveBeenCalledWith(42);
    logSpy.mockRestore();
  });

  it("is pipe-friendly", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    expect(pipe(5, inspect(), (x) => x + 1)).toBe(6);
    logSpy.mockRestore();
  });
});
