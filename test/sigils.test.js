import { describe, it, expect } from "vitest";
import { H, J } from "../src/sigils.js";

describe("H", () => {
  it("retourne l'unique élément racine", () => {
    const el = H`<div class="card">${"hi"}</div>`;
    expect(el.tagName).toBe("DIV");
    expect(el.textContent).toBe("hi");
  });

  it("retourne un fragment si plusieurs éléments racine", () => {
    const frag = H`<span>a</span><span>b</span>`;
    expect(frag.childElementCount).toBe(2);
  });
});

describe("J", () => {
  it("parse un JSON valide en ok", () => {
    const [success, data] = J`{"a": ${1}}`;
    expect(success).toBe(true);
    expect(data).toEqual({ a: 1 });
  });

  it("retourne error sur JSON invalide", () => {
    const [success, err] = J`not json`;
    expect(success).toBe(false);
    expect(typeof err).toBe("string");
  });
});
