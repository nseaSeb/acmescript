import { describe, it, expect } from "vitest";
import { Enum } from "../src/enum.js";

describe("Enum", () => {
  it("map", () => {
    expect(Enum.map((x) => x * 2)([1, 2, 3])).toEqual([2, 4, 6]);
  });

  it("filter", () => {
    expect(Enum.filter((x) => x % 2 === 0)([1, 2, 3, 4])).toEqual([2, 4]);
  });

  it("reject", () => {
    expect(Enum.reject((x) => x % 2 === 0)([1, 2, 3, 4])).toEqual([1, 3]);
  });

  it("reduce", () => {
    expect(Enum.reduce(0, (acc, x) => acc + x)([1, 2, 3])).toBe(6);
  });

  it("take", () => {
    expect(Enum.take(2)([1, 2, 3])).toEqual([1, 2]);
  });

  it("chunkEvery", () => {
    expect(Enum.chunkEvery(2)([1, 2, 3, 4, 5])).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("uniq", () => {
    expect(Enum.uniq()([1, 1, 2, 3, 3])).toEqual([1, 2, 3]);
  });

  it("sort doesn't mutate the original", () => {
    const list = [3, 1, 2];
    const sorted = Enum.sort((a, b) => a - b)(list);
    expect(sorted).toEqual([1, 2, 3]);
    expect(list).toEqual([3, 1, 2]);
  });

  it("each runs a side effect on every item and returns the list", () => {
    const seen = [];
    const result = Enum.each((x) => seen.push(x))([1, 2, 3]);
    expect(seen).toEqual([1, 2, 3]);
    expect(result).toEqual([1, 2, 3]);
  });

  it("any", () => {
    expect(Enum.any((x) => x > 2)([1, 2, 3])).toBe(true);
    expect(Enum.any((x) => x > 5)([1, 2, 3])).toBe(false);
  });

  it("any without a predicate checks truthiness of the elements", () => {
    expect(Enum.any()([false, 0, "", true])).toBe(true);
    expect(Enum.any()([false, 0, ""])).toBe(false);
  });

  it("all", () => {
    expect(Enum.all((x) => x > 0)([1, 2, 3])).toBe(true);
    expect(Enum.all((x) => x > 1)([1, 2, 3])).toBe(false);
  });

  it("all without a predicate checks truthiness of the elements", () => {
    expect(Enum.all()([1, "a", true])).toBe(true);
    expect(Enum.all()([1, 0, true])).toBe(false);
  });

  it("count without predicate returns the length", () => {
    expect(Enum.count()([1, 2, 3])).toBe(3);
  });

  it("count with predicate counts matches", () => {
    expect(Enum.count((x) => x % 2 === 0)([1, 2, 3, 4])).toBe(2);
  });

  it("find returns the first match or the default", () => {
    expect(Enum.find((x) => x > 1)([1, 2, 3])).toBe(2);
    expect(Enum.find((x) => x > 10, "none")([1, 2, 3])).toBe("none");
    expect(Enum.find((x) => x > 10)([1, 2, 3])).toBe(null);
  });

  it("find distinguishes a matched null/undefined from no match", () => {
    expect(Enum.find((x) => x == null, "none")([1, null, 3])).toBe(null);
    expect(Enum.find((x) => x === undefined, "none")([1, undefined, 3])).toBe(undefined);
  });

  it("groupBy buckets items by key", () => {
    const users = [{ role: "admin", name: "Ada" }, { role: "user", name: "Alan" }, { role: "admin", name: "Grace" }];
    expect(Enum.groupBy((u) => u.role)(users)).toEqual({
      admin: [{ role: "admin", name: "Ada" }, { role: "admin", name: "Grace" }],
      user: [{ role: "user", name: "Alan" }]
    });
  });

  it("groupBy is safe against keys colliding with Object.prototype members", () => {
    const result = Enum.groupBy((x) => x)(["constructor", "toString", "constructor"]);
    expect(result.constructor).toEqual(["constructor", "constructor"]);
    expect(result.toString).toEqual(["toString"]);
  });

  it("sum", () => {
    expect(Enum.sum()([1, 2, 3])).toBe(6);
    expect(Enum.sum()([])).toBe(0);
  });
});
