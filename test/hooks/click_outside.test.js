import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ClickOutside } from "../../hooks/click_outside.js";

function makeHost(el) {
  return { el, pushEvent: vi.fn(), pushEventTo: vi.fn(), handleEvent: vi.fn(), upload: vi.fn() };
}

beforeEach(() => {
  vi.useFakeTimers();
  document.body.innerHTML = `<div id="menu">inside</div><div id="outside">outside</div>`;
});

afterEach(() => {
  vi.useRealTimers();
});

describe("ClickOutside", () => {
  it("does not push on the click that mounted it (deferred attach)", () => {
    const el = document.getElementById("menu");
    const host = makeHost(el);
    ClickOutside.mounted.call(host);

    document.getElementById("outside").click();

    expect(host.pushEvent).not.toHaveBeenCalled();
  });

  it("pushes click_outside (or a custom event) once attached", () => {
    const el = document.getElementById("menu");
    el.dataset.closeEvent = "close_menu";
    const host = makeHost(el);
    ClickOutside.mounted.call(host);
    vi.runOnlyPendingTimers();

    document.getElementById("outside").click();

    expect(host.pushEvent).toHaveBeenCalledWith("close_menu", {});
  });

  it("does not push when clicking inside the element", () => {
    const el = document.getElementById("menu");
    const host = makeHost(el);
    ClickOutside.mounted.call(host);
    vi.runOnlyPendingTimers();

    el.click();

    expect(host.pushEvent).not.toHaveBeenCalled();
  });

  it("pushes on Escape", () => {
    const el = document.getElementById("menu");
    const host = makeHost(el);
    ClickOutside.mounted.call(host);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(host.pushEvent).toHaveBeenCalledWith("click_outside", {});
  });

  it("stops listening after destroyed", () => {
    const el = document.getElementById("menu");
    const host = makeHost(el);
    ClickOutside.mounted.call(host);
    vi.runOnlyPendingTimers();
    ClickOutside.destroyed.call(host);

    document.getElementById("outside").click();

    expect(host.pushEvent).not.toHaveBeenCalled();
  });
});
