import { describe, it, expect } from "vitest";
import { H, J } from "../src/sigils.js";

describe("H", () => {
  it("returns the single root element", () => {
    const el = H`<div class="card">${"hi"}</div>`;
    expect(el.tagName).toBe("DIV");
    expect(el.textContent).toBe("hi");
  });

  it("returns a fragment when there are multiple root elements", () => {
    const frag = H`<span>a</span><span>b</span>`;
    expect(frag.childElementCount).toBe(2);
  });
});

describe("J", () => {
  it("parses valid JSON into ok", () => {
    const [success, data] = J`{"a": ${1}}`;
    expect(success).toBe(true);
    expect(data).toEqual({ a: 1 });
  });

  it("returns error on invalid JSON", () => {
    const [success, err] = J`not json`;
    expect(success).toBe(false);
    expect(typeof err).toBe("string");
  });
});
