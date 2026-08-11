import { describe, it, expect, beforeEach } from "vitest";
import { find } from "../src/dom.js";

beforeEach(() => {
  document.body.innerHTML = `<div id="box" class="a"></div>`;
});

describe("find", () => {
  it("returns error when the element doesn't exist", () => {
    const r = find("#missing");
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/Element not found/);
  });

  it("accepts an element directly", () => {
    const el = document.getElementById("box");
    expect(find(el).el).toBe(el);
  });

  it("addClass/removeClass are chainable", () => {
    find("#box").addClass("b", "c").removeClass("a");
    const el = document.getElementById("box");
    expect(el.className).toBe("b c");
  });

  it("attr reads and writes", () => {
    const wrapped = find("#box");
    wrapped.attr("data-x", "1");
    expect(wrapped.attr("data-x")).toBe("1");
  });

  it("on attaches a listener", () => {
    let called = false;
    find("#box").on("click", () => (called = true));
    document.getElementById("box").click();
    expect(called).toBe(true);
  });
});
