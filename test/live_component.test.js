import { describe, it, expect } from "vitest";
import { createLiveComponent } from "../src/live_component.js";

describe("createLiveComponent", () => {
  it("hydrate l'état depuis phx-state et rend au connectedCallback", () => {
    const tag = `acme-test-${Math.random().toString(36).slice(2)}`;
    customElements.define(tag, createLiveComponent({
      mount: (state) => ({ count: state.count ?? 0 }),
      render: (state) => {
        const span = document.createElement("span");
        span.textContent = String(state.count);
        return span;
      }
    }));

    const el = document.createElement(tag);
    el.setAttribute("phx-state", JSON.stringify({ count: 5 }));
    document.body.append(el);

    expect(el.textContent).toBe("5");
  });

  it("send() applique handleEvent et re-render", () => {
    const tag = `acme-test-${Math.random().toString(36).slice(2)}`;
    customElements.define(tag, createLiveComponent({
      mount: (state) => ({ count: state.count ?? 0 }),
      handleEvent: {
        inc: (state) => ({ count: state.count + 1 })
      },
      render: (state) => {
        const span = document.createElement("span");
        span.textContent = String(state.count);
        return span;
      }
    }));

    const el = document.createElement(tag);
    document.body.append(el);
    expect(el.textContent).toBe("0");

    el.send("inc");
    expect(el.textContent).toBe("1");
  });

  it("send() ignore un event inconnu", () => {
    const tag = `acme-test-${Math.random().toString(36).slice(2)}`;
    customElements.define(tag, createLiveComponent({
      render: () => document.createElement("span")
    }));

    const el = document.createElement(tag);
    document.body.append(el);
    expect(() => el.send("unknown")).not.toThrow();
  });
});
