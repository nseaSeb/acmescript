import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScrollRestore } from "../../hooks/scroll_restore.js";

function makeHost(el) {
  return { el, pushEvent: vi.fn(), pushEventTo: vi.fn(), handleEvent: vi.fn(), upload: vi.fn() };
}

function makeScrollableEl() {
  const el = document.createElement("div");
  let scrollTopValue = 0;
  Object.defineProperty(el, "scrollTop", {
    get: () => scrollTopValue,
    set: (v) => { scrollTopValue = v; },
    configurable: true
  });
  return el;
}

beforeEach(() => {
  sessionStorage.clear();
});

describe("ScrollRestore", () => {
  it("restores scrollTop from sessionStorage on mount", () => {
    sessionStorage.setItem("log-scroll", "150");
    const el = makeScrollableEl();
    el.dataset.storageKey = "log-scroll";
    const host = makeHost(el);

    ScrollRestore.mounted.call(host);

    expect(el.scrollTop).toBe(150);
  });

  it("saves scrollTop to sessionStorage on scroll", () => {
    const el = makeScrollableEl();
    el.dataset.storageKey = "log-scroll";
    const host = makeHost(el);
    ScrollRestore.mounted.call(host);

    el.scrollTop = 300;
    el.dispatchEvent(new Event("scroll"));

    expect(sessionStorage.getItem("log-scroll")).toBe("300");
  });

  it("falls back to a scroll:<id> key when no data-storage-key is set", () => {
    const el = makeScrollableEl();
    el.id = "chat-log";
    const host = makeHost(el);
    ScrollRestore.mounted.call(host);

    el.scrollTop = 20;
    el.dispatchEvent(new Event("scroll"));

    expect(sessionStorage.getItem("scroll:chat-log")).toBe("20");
  });

  it("stops saving after destroyed", () => {
    const el = makeScrollableEl();
    el.dataset.storageKey = "log-scroll";
    const host = makeHost(el);
    ScrollRestore.mounted.call(host);
    ScrollRestore.destroyed.call(host);

    el.scrollTop = 999;
    el.dispatchEvent(new Event("scroll"));

    expect(sessionStorage.getItem("log-scroll")).toBe(null);
  });
});
