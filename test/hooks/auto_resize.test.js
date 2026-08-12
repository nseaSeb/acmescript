import { describe, it, expect, vi } from "vitest";
import { AutoResize } from "../../hooks/auto_resize.js";

function makeHost(el) {
  return { el, pushEvent: vi.fn(), pushEventTo: vi.fn(), handleEvent: vi.fn(), upload: vi.fn() };
}

describe("AutoResize", () => {
  it("sets height to scrollHeight on mount", () => {
    const el = document.createElement("textarea");
    Object.defineProperty(el, "scrollHeight", { value: 42, configurable: true });
    const host = makeHost(el);

    AutoResize.mounted.call(host);

    expect(el.style.height).toBe("42px");
  });

  it("resizes again on input", () => {
    const el = document.createElement("textarea");
    Object.defineProperty(el, "scrollHeight", { value: 10, configurable: true });
    const host = makeHost(el);
    AutoResize.mounted.call(host);

    Object.defineProperty(el, "scrollHeight", { value: 80, configurable: true });
    el.dispatchEvent(new Event("input"));

    expect(el.style.height).toBe("80px");
  });

  it("resizes on updated (server-side value change)", () => {
    const el = document.createElement("textarea");
    Object.defineProperty(el, "scrollHeight", { value: 10, configurable: true });
    const host = makeHost(el);
    AutoResize.mounted.call(host);

    Object.defineProperty(el, "scrollHeight", { value: 60, configurable: true });
    AutoResize.updated.call(host);

    expect(el.style.height).toBe("60px");
  });

  it("stops resizing on input after destroyed", () => {
    const el = document.createElement("textarea");
    Object.defineProperty(el, "scrollHeight", { value: 10, configurable: true });
    const host = makeHost(el);
    AutoResize.mounted.call(host);
    AutoResize.destroyed.call(host);

    Object.defineProperty(el, "scrollHeight", { value: 999, configurable: true });
    el.dispatchEvent(new Event("input"));

    expect(el.style.height).toBe("10px");
  });
});
