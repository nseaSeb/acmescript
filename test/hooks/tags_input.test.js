import { describe, it, expect, vi } from "vitest";
import { TagsInput } from "../../hooks/tags_input.js";

function makeHost(el) {
  return { el, pushEvent: vi.fn(), pushEventTo: vi.fn(), handleEvent: vi.fn(), upload: vi.fn() };
}

function makeContainer() {
  document.body.innerHTML = `
    <div id="tags-input">
      <div class="tags"></div>
      <input type="text" />
    </div>
  `;
  return document.getElementById("tags-input");
}

describe("TagsInput", () => {
  it("adds a tag on Enter and renders a pill", () => {
    const el = makeContainer();
    const host = makeHost(el);
    TagsInput.mounted.call(host);

    const input = el.querySelector("input");
    input.value = "urgent";
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", cancelable: true }));

    expect(el.querySelectorAll(".tag")).toHaveLength(1);
    expect(el.querySelector(".tag").textContent).toContain("urgent");
    expect(input.value).toBe("");
    expect(host.pushEvent).toHaveBeenCalledWith("tags_changed", { tags: ["urgent"] });
  });

  it("adds a tag on comma", () => {
    const el = makeContainer();
    const host = makeHost(el);
    TagsInput.mounted.call(host);

    const input = el.querySelector("input");
    input.value = "bug";
    input.dispatchEvent(new KeyboardEvent("keydown", { key: ",", cancelable: true }));

    expect(host.pushEvent).toHaveBeenCalledWith("tags_changed", { tags: ["bug"] });
  });

  it("removes the last tag on Backspace when the input is empty", () => {
    const el = makeContainer();
    const host = makeHost(el);
    TagsInput.mounted.call(host);
    const input = el.querySelector("input");

    input.value = "a";
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    input.value = "b";
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace" }));

    expect(host.pushEvent).toHaveBeenLastCalledWith("tags_changed", { tags: ["a"] });
  });

  it("removes a tag via its pill button", () => {
    const el = makeContainer();
    const host = makeHost(el);
    TagsInput.mounted.call(host);
    const input = el.querySelector("input");

    input.value = "a";
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

    el.querySelector(".tag button").click();

    expect(el.querySelectorAll(".tag")).toHaveLength(0);
    expect(host.pushEvent).toHaveBeenLastCalledWith("tags_changed", { tags: [] });
  });

  it("ignores duplicate tags", () => {
    const el = makeContainer();
    const host = makeHost(el);
    TagsInput.mounted.call(host);
    const input = el.querySelector("input");

    input.value = "a";
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    input.value = "a";
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

    expect(el.querySelectorAll(".tag")).toHaveLength(1);
  });
});
