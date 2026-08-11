import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { transition, show, hide } from "../src/transitions.js";

beforeEach(() => {
  document.body.innerHTML = `<div id="box"></div>`;
  // jsdom doesn't implement requestAnimationFrame
  global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
  vi.useFakeTimers();
});

afterEach(() => {
  // avoids a leftover pending setTimeout(duration) leaking into the next test
  vi.useRealTimers();
});

describe("transition", () => {
  it("adds transition+from then switches to `to` after the frames, removes after duration", () => {
    const el = document.getElementById("box");
    transition(el, {
      transition: "t",
      from: "f",
      to: "g",
      duration: 100
    });

    expect(el.classList.contains("t")).toBe(true);
    expect(el.classList.contains("f")).toBe(true);

    vi.runOnlyPendingTimers(); // 1st rAF
    vi.runOnlyPendingTimers(); // 2nd rAF (nested)

    expect(el.classList.contains("f")).toBe(false);
    expect(el.classList.contains("g")).toBe(true);

    vi.advanceTimersByTime(100);

    expect(el.classList.contains("t")).toBe(false);
    expect(el.classList.contains("g")).toBe(false);
  });

  it("does nothing if the target doesn't exist", () => {
    expect(() => transition("#missing", { transition: "t", from: "f", to: "g" })).not.toThrow();
  });
});

describe("show/hide", () => {
  it("show transitions to opacity-100 scale-100", () => {
    const el = document.getElementById("box");
    show(el);
    vi.runOnlyPendingTimers();
    vi.runOnlyPendingTimers();
    expect(el.classList.contains("opacity-100")).toBe(true);
    expect(el.classList.contains("scale-100")).toBe(true);
  });

  it("hide transitions to opacity-0 scale-95", () => {
    const el = document.getElementById("box");
    hide(el);
    vi.runOnlyPendingTimers();
    vi.runOnlyPendingTimers();
    expect(el.classList.contains("opacity-0")).toBe(true);
    expect(el.classList.contains("scale-95")).toBe(true);
  });
});
