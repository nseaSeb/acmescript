import { describe, it, expect } from "vitest";
import { createLiveComponent } from "../src/live_component.js";

describe("createLiveComponent", () => {
  it("hydrates state from phx-state and renders on connectedCallback", () => {
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

  it("send() applies handleEvent and re-renders", () => {
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

  it("send() ignores an unknown event", () => {
    const tag = `acme-test-${Math.random().toString(36).slice(2)}`;
    customElements.define(tag, createLiveComponent({
      render: () => document.createElement("span")
    }));

    const el = document.createElement(tag);
    document.body.append(el);
    expect(() => el.send("unknown")).not.toThrow();
  });
});
