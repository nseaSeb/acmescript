import { describe, it, expect, vi } from "vitest";
import { createHook } from "../src/hook.js";

function makeLifecycleHost() {
  return {
    el: document.createElement("div"),
    pushEvent: vi.fn(),
    pushEventTo: vi.fn(),
    handleEvent: vi.fn(),
    upload: vi.fn()
  };
}

describe("createHook", () => {
  it("injects a ctx with push/pushTo/handle/upload into mounted", () => {
    let receivedCtx;
    const hook = createHook({
      mounted(ctx) {
        receivedCtx = ctx;
      }
    });

    const host = makeLifecycleHost();
    hook.mounted.call(host);

    receivedCtx.push("evt", { a: 1 });
    expect(host.pushEvent).toHaveBeenCalledWith("evt", { a: 1 });

    receivedCtx.pushTo("#target", "evt", { a: 1 });
    expect(host.pushEventTo).toHaveBeenCalledWith("#target", "evt", { a: 1 });

    const cb = () => {};
    receivedCtx.handle("evt", cb);
    expect(host.handleEvent).toHaveBeenCalledWith("evt", cb);

    receivedCtx.upload("field", ["file"]);
    expect(host.upload).toHaveBeenCalledWith("field", ["file"]);
  });

  it("calls updated/destroyed with the same ctx as mounted", () => {
    const contexts = [];
    const hook = createHook({
      mounted(ctx) { contexts.push(ctx); },
      updated(ctx) { contexts.push(ctx); },
      destroyed(ctx) { contexts.push(ctx); }
    });

    const host = makeLifecycleHost();
    hook.mounted.call(host);
    hook.updated.call(host);
    hook.destroyed.call(host);

    expect(contexts).toHaveLength(3);
    expect(contexts[0]).toBe(contexts[1]);
    expect(contexts[1]).toBe(contexts[2]);
  });

  it("doesn't throw when mounted/updated/destroyed are absent from the spec", () => {
    const hook = createHook({});
    const host = makeLifecycleHost();
    expect(() => hook.mounted.call(host)).not.toThrow();
    expect(() => hook.updated.call(host)).not.toThrow();
    expect(() => hook.destroyed.call(host)).not.toThrow();
  });
});
