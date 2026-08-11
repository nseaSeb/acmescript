import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { transition, show, hide } from "../src/transitions.js";

beforeEach(() => {
  document.body.innerHTML = `<div id="box"></div>`;
  // jsdom n'implémente pas requestAnimationFrame
  global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
  vi.useFakeTimers();
});

afterEach(() => {
  // évite qu'un setTimeout(duration) laissé pendant fuite sur le test suivant
  vi.useRealTimers();
});

describe("transition", () => {
  it("ajoute transition+from puis bascule vers to après les frames, retire après duration", () => {
    const el = document.getElementById("box");
    transition(el, {
      transition: "t",
      from: "f",
      to: "g",
      duration: 100
    });

    expect(el.classList.contains("t")).toBe(true);
    expect(el.classList.contains("f")).toBe(true);

    vi.runOnlyPendingTimers(); // 1ère rAF
    vi.runOnlyPendingTimers(); // 2ème rAF (nested)

    expect(el.classList.contains("f")).toBe(false);
    expect(el.classList.contains("g")).toBe(true);

    vi.advanceTimersByTime(100);

    expect(el.classList.contains("t")).toBe(false);
    expect(el.classList.contains("g")).toBe(false);
  });

  it("ne fait rien si la cible n'existe pas", () => {
    expect(() => transition("#missing", { transition: "t", from: "f", to: "g" })).not.toThrow();
  });
});

describe("show/hide", () => {
  it("show va vers opacity-100 scale-100", () => {
    const el = document.getElementById("box");
    show(el);
    vi.runOnlyPendingTimers();
    vi.runOnlyPendingTimers();
    expect(el.classList.contains("opacity-100")).toBe(true);
    expect(el.classList.contains("scale-100")).toBe(true);
  });

  it("hide va vers opacity-0 scale-95", () => {
    const el = document.getElementById("box");
    hide(el);
    vi.runOnlyPendingTimers();
    vi.runOnlyPendingTimers();
    expect(el.classList.contains("opacity-0")).toBe(true);
    expect(el.classList.contains("scale-95")).toBe(true);
  });
});
