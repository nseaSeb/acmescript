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

  it("sort ne mute pas l'original", () => {
    const list = [3, 1, 2];
    const sorted = Enum.sort((a, b) => a - b)(list);
    expect(sorted).toEqual([1, 2, 3]);
    expect(list).toEqual([3, 1, 2]);
  });
});
