import { describe, it, expect, beforeEach } from "vitest";
import { find } from "../src/dom.js";

beforeEach(() => {
  document.body.innerHTML = `<div id="box" class="a"></div>`;
});

describe("find", () => {
  it("retourne error si l'élément n'existe pas", () => {
    const r = find("#missing");
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/Element not found/);
  });

  it("accepte un élément directement", () => {
    const el = document.getElementById("box");
    expect(find(el).el).toBe(el);
  });

  it("addClass/removeClass sont chainables", () => {
    find("#box").addClass("b", "c").removeClass("a");
    const el = document.getElementById("box");
    expect(el.className).toBe("b c");
  });

  it("attr lit et écrit", () => {
    const wrapped = find("#box");
    wrapped.attr("data-x", "1");
    expect(wrapped.attr("data-x")).toBe("1");
  });

  it("on attache un listener", () => {
    let called = false;
    find("#box").on("click", () => (called = true));
    document.getElementById("box").click();
    expect(called).toBe(true);
  });
});
