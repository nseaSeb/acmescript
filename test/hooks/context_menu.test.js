import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ContextMenu } from "../../hooks/context_menu.js";

function makeHost(el) {
  return { el, pushEvent: vi.fn(), pushEventTo: vi.fn(), handleEvent: vi.fn(), upload: vi.fn() };
}

beforeEach(() => {
  // jsdom doesn't implement requestAnimationFrame, used by the lib's show/hide
  global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
  vi.useFakeTimers();
  document.body.innerHTML = `
    <div id="item" data-menu-target="#context-menu" data-id="42">right-click me</div>
    <div id="context-menu" class="hidden"></div>
  `;
});

afterEach(() => {
  vi.useRealTimers();
});

describe("ContextMenu", () => {
  it("positions and shows the menu on contextmenu, pushes the item id", () => {
    const el = document.getElementById("item");
    const menu = document.getElementById("context-menu");
    const host = makeHost(el);
    ContextMenu.mounted.call(host);

    el.dispatchEvent(new MouseEvent("contextmenu", { clientX: 10, clientY: 20, cancelable: true }));

    expect(menu.style.left).toBe("10px");
    expect(menu.style.top).toBe("20px");
    expect(host.pushEvent).toHaveBeenCalledWith("context_menu_opened", { id: "42" });
  });

  it("prevents the native browser context menu", () => {
    const el = document.getElementById("item");
    const host = makeHost(el);
    ContextMenu.mounted.call(host);

    const evt = new MouseEvent("contextmenu", { cancelable: true });
    el.dispatchEvent(evt);

    expect(evt.defaultPrevented).toBe(true);
  });

  it("does nothing if the menu target doesn't exist", () => {
    document.body.innerHTML = `<div id="item" data-menu-target="#missing"></div>`;
    const el = document.getElementById("item");
    const host = makeHost(el);

    expect(() => ContextMenu.mounted.call(host)).not.toThrow();
  });

  it("toggles the `hidden` class open on contextmenu and closed (after the fade) on outside click", () => {
    const el = document.getElementById("item");
    const menu = document.getElementById("context-menu");
    const host = makeHost(el);
    ContextMenu.mounted.call(host);

    expect(menu.classList.contains("hidden")).toBe(true);

    el.dispatchEvent(new MouseEvent("contextmenu", { cancelable: true }));
    expect(menu.classList.contains("hidden")).toBe(false);

    document.dispatchEvent(new MouseEvent("click"));
    // still visible mid-fade, `hide()`'s own class cleanup would otherwise
    // leave it unhidden if we relied on it alone
    expect(menu.classList.contains("hidden")).toBe(false);

    vi.advanceTimersByTime(150);
    expect(menu.classList.contains("hidden")).toBe(true);
  });
});
