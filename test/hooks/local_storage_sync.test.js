import { describe, it, expect, vi, beforeEach } from "vitest";
import { LocalStorageSync } from "../../hooks/local_storage_sync.js";

function makeHost(el) {
  return { el, pushEvent: vi.fn(), pushEventTo: vi.fn(), handleEvent: vi.fn(), upload: vi.fn() };
}

// Node's native localStorage global (added in Node 22+) shadows jsdom's and is
// a no-op stub unless the process is started with --localstorage-file. Use an
// in-memory polyfill instead of relying on the environment's localStorage.
function makeStoragePolyfill() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear()
  };
}

beforeEach(() => {
  Object.defineProperty(globalThis, "localStorage", {
    value: makeStoragePolyfill(),
    configurable: true
  });
});

describe("LocalStorageSync", () => {
  it("restores a previously saved value on mount", () => {
    localStorage.setItem("draft", "hello");
    const el = document.createElement("input");
    el.dataset.storageKey = "draft";
    const host = makeHost(el);

    LocalStorageSync.mounted.call(host);

    expect(el.value).toBe("hello");
  });

  it("saves the value to localStorage on input", () => {
    const el = document.createElement("input");
    el.dataset.storageKey = "draft";
    const host = makeHost(el);
    LocalStorageSync.mounted.call(host);

    el.value = "typed text";
    el.dispatchEvent(new Event("input"));

    expect(localStorage.getItem("draft")).toBe("typed text");
  });

  it("does nothing without a data-storage-key", () => {
    const el = document.createElement("input");
    const host = makeHost(el);
    expect(() => LocalStorageSync.mounted.call(host)).not.toThrow();

    el.value = "x";
    expect(() => el.dispatchEvent(new Event("input"))).not.toThrow();
  });

  it("stops saving after destroyed", () => {
    const el = document.createElement("input");
    el.dataset.storageKey = "draft";
    const host = makeHost(el);
    LocalStorageSync.mounted.call(host);
    LocalStorageSync.destroyed.call(host);

    el.value = "after destroy";
    el.dispatchEvent(new Event("input"));

    expect(localStorage.getItem("draft")).toBe(null);
  });
});
