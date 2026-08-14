import { describe, it, expect, vi } from "vitest";
import { Dropzone } from "../../hooks/dropzone.js";

function makeHost(el) {
  return { el, pushEvent: vi.fn(), pushEventTo: vi.fn(), handleEvent: vi.fn(), upload: vi.fn() };
}

function makeContainer() {
  document.body.innerHTML = `<div id="dropzone" data-upload-name="avatar"></div>`;
  return document.getElementById("dropzone");
}

function dragEvent(type, files) {
  const evt = new Event(type, { bubbles: true, cancelable: true });
  Object.assign(evt, { dataTransfer: { files: files ?? [] } });
  return evt;
}

describe("Dropzone", () => {
  it("adds .drag-over on dragenter and removes it on dragleave", () => {
    const el = makeContainer();
    const host = makeHost(el);
    Dropzone.mounted.call(host);

    el.dispatchEvent(dragEvent("dragenter"));
    expect(el.classList.contains("drag-over")).toBe(true);

    el.dispatchEvent(dragEvent("dragleave"));
    expect(el.classList.contains("drag-over")).toBe(false);
  });

  it("uploads dropped files to the named upload and clears .drag-over", () => {
    const el = makeContainer();
    const host = makeHost(el);
    Dropzone.mounted.call(host);
    const file = new File(["hello"], "hello.txt", { type: "text/plain" });

    el.dispatchEvent(dragEvent("dragenter"));
    el.dispatchEvent(dragEvent("drop", [file]));

    expect(host.upload).toHaveBeenCalledWith("avatar", [file]);
    expect(el.classList.contains("drag-over")).toBe(false);
  });

  it("does not upload when the drop carries no files", () => {
    const el = makeContainer();
    const host = makeHost(el);
    Dropzone.mounted.call(host);

    el.dispatchEvent(dragEvent("drop", []));

    expect(host.upload).not.toHaveBeenCalled();
  });

  it("ignores nested dragenter/dragleave pairs (keeps .drag-over until depth reaches 0)", () => {
    const el = makeContainer();
    const host = makeHost(el);
    Dropzone.mounted.call(host);

    el.dispatchEvent(dragEvent("dragenter"));
    el.dispatchEvent(dragEvent("dragenter"));
    el.dispatchEvent(dragEvent("dragleave"));
    expect(el.classList.contains("drag-over")).toBe(true);

    el.dispatchEvent(dragEvent("dragleave"));
    expect(el.classList.contains("drag-over")).toBe(false);
  });

  it("clears .drag-over on a window dragend (drag cancelled mid-hover)", () => {
    const el = makeContainer();
    const host = makeHost(el);
    Dropzone.mounted.call(host);

    el.dispatchEvent(dragEvent("dragenter"));
    expect(el.classList.contains("drag-over")).toBe(true);

    window.dispatchEvent(new Event("dragend"));
    expect(el.classList.contains("drag-over")).toBe(false);

    // depth was reset too: a single dragenter re-adds the class
    el.dispatchEvent(dragEvent("dragenter"));
    expect(el.classList.contains("drag-over")).toBe(true);
  });

  it("stops reacting after destroyed", () => {
    const el = makeContainer();
    const host = makeHost(el);
    Dropzone.mounted.call(host);
    Dropzone.destroyed.call(host);

    const file = new File(["hello"], "hello.txt", { type: "text/plain" });
    el.dispatchEvent(dragEvent("drop", [file]));

    expect(host.upload).not.toHaveBeenCalled();
  });
});
