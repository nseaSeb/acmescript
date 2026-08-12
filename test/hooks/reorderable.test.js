import { describe, it, expect, vi } from "vitest";
import { Reorderable } from "../../hooks/reorderable.js";

function makeHost(el) {
  return { el, pushEvent: vi.fn(), pushEventTo: vi.fn(), handleEvent: vi.fn(), upload: vi.fn() };
}

function makeList() {
  document.body.innerHTML = `
    <ul id="list">
      <li data-id="1">a</li>
      <li data-id="2">b</li>
      <li data-id="3">c</li>
    </ul>
  `;
  return document.getElementById("list");
}

describe("Reorderable", () => {
  it("pushes the current data-id order on dragend", () => {
    const el = makeList();
    const host = makeHost(el);
    Reorderable.mounted.call(host);

    el.dispatchEvent(new Event("dragend"));

    expect(host.pushEvent).toHaveBeenCalledWith("reorder", { ids: ["1", "2", "3"] });
  });

  it("uses a custom event name from data-reorder-event", () => {
    const el = makeList();
    el.dataset.reorderEvent = "list_reordered";
    const host = makeHost(el);
    Reorderable.mounted.call(host);

    el.dispatchEvent(new Event("dragend"));

    expect(host.pushEvent).toHaveBeenCalledWith("list_reordered", { ids: ["1", "2", "3"] });
  });

  it("dragover on a non-draggable target doesn't throw", () => {
    const el = makeList();
    const host = makeHost(el);
    Reorderable.mounted.call(host);

    const evt = new Event("dragover", { bubbles: true, cancelable: true });
    Object.assign(evt, { clientY: 0 });
    expect(() => el.dispatchEvent(evt)).not.toThrow();
  });

  it("stops reacting after destroyed", () => {
    const el = makeList();
    const host = makeHost(el);
    Reorderable.mounted.call(host);
    Reorderable.destroyed.call(host);

    el.dispatchEvent(new Event("dragend"));

    expect(host.pushEvent).not.toHaveBeenCalled();
  });
});
