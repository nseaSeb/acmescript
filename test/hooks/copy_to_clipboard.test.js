import { describe, it, expect, vi, beforeEach } from "vitest";
import { CopyToClipboard } from "../../hooks/copy_to_clipboard.js";

function makeHost(el) {
  return { el, pushEvent: vi.fn(), pushEventTo: vi.fn(), handleEvent: vi.fn(), upload: vi.fn() };
}

beforeEach(() => {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    configurable: true
  });
});

describe("CopyToClipboard", () => {
  it("copies data-copy-text and pushes 'copied'", async () => {
    const el = document.createElement("button");
    el.dataset.copyText = "hello";
    const host = makeHost(el);
    CopyToClipboard.mounted.call(host);

    el.click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello");
    expect(host.pushEvent).toHaveBeenCalledWith("copied", { text: "hello" });
    expect(el.classList.contains("copied")).toBe(true);
  });

  it("reads text from data-copy-target when set", async () => {
    document.body.innerHTML = `<span id="snippet">from target</span><button></button>`;
    const el = document.querySelector("button");
    el.dataset.copyTarget = "#snippet";
    const host = makeHost(el);
    CopyToClipboard.mounted.call(host);

    el.click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("from target");
  });

  it("stops copying after destroyed", async () => {
    const el = document.createElement("button");
    el.dataset.copyText = "hello";
    const host = makeHost(el);
    CopyToClipboard.mounted.call(host);
    CopyToClipboard.destroyed.call(host);

    el.click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });
});
