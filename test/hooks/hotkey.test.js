import { describe, it, expect, vi } from "vitest";
import { Hotkey } from "../../hooks/hotkey.js";

function makeHost(el) {
  return { el, pushEvent: vi.fn(), pushEventTo: vi.fn(), handleEvent: vi.fn(), upload: vi.fn() };
}

describe("Hotkey", () => {
  it("pushes the configured event on a matching key", () => {
    const el = document.createElement("div");
    el.dataset.key = "k";
    el.dataset.event = "open_search";
    const host = makeHost(el);
    Hotkey.mounted.call(host);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k" }));

    expect(host.pushEvent).toHaveBeenCalledWith("open_search", {});
  });

  it("requires the meta/ctrl key when data-meta is set", () => {
    const el = document.createElement("div");
    el.dataset.key = "k";
    el.dataset.meta = "true";
    const host = makeHost(el);
    Hotkey.mounted.call(host);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k" }));
    expect(host.pushEvent).not.toHaveBeenCalled();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
    expect(host.pushEvent).toHaveBeenCalledWith("hotkey", {});
  });

  it("ignores non-matching keys", () => {
    const el = document.createElement("div");
    el.dataset.key = "k";
    const host = makeHost(el);
    Hotkey.mounted.call(host);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "j" }));

    expect(host.pushEvent).not.toHaveBeenCalled();
  });

  it("stops listening after destroyed", () => {
    const el = document.createElement("div");
    el.dataset.key = "k";
    const host = makeHost(el);
    Hotkey.mounted.call(host);
    Hotkey.destroyed.call(host);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k" }));

    expect(host.pushEvent).not.toHaveBeenCalled();
  });
});
