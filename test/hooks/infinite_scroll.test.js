import { describe, it, expect, vi, beforeEach } from "vitest";
import { InfiniteScroll } from "../../hooks/infinite_scroll.js";

function makeHost(el) {
  return { el, pushEvent: vi.fn(), pushEventTo: vi.fn(), handleEvent: vi.fn(), upload: vi.fn() };
}

let observed;

beforeEach(() => {
  observed = [];
  global.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback;
      this.disconnect = vi.fn();
    }
    observe(el) {
      observed.push({ el, instance: this });
    }
  };
});

describe("InfiniteScroll", () => {
  it("observes the element on mount", () => {
    const el = document.createElement("div");
    const host = makeHost(el);
    InfiniteScroll.mounted.call(host);

    expect(observed).toHaveLength(1);
    expect(observed[0].el).toBe(el);
  });

  it("pushes load_more (or a custom event) when intersecting", () => {
    const el = document.createElement("div");
    el.dataset.loadEvent = "load_more_items";
    const host = makeHost(el);
    InfiniteScroll.mounted.call(host);

    observed[0].instance.callback([{ isIntersecting: true }]);

    expect(host.pushEvent).toHaveBeenCalledWith("load_more_items", {});
  });

  it("does not push when not intersecting", () => {
    const el = document.createElement("div");
    const host = makeHost(el);
    InfiniteScroll.mounted.call(host);

    observed[0].instance.callback([{ isIntersecting: false }]);

    expect(host.pushEvent).not.toHaveBeenCalled();
  });

  it("disconnects the observer on destroyed", () => {
    const el = document.createElement("div");
    const host = makeHost(el);
    InfiniteScroll.mounted.call(host);
    InfiniteScroll.destroyed.call(host);

    expect(observed[0].instance.disconnect).toHaveBeenCalled();
  });
});
