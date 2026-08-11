import { describe, it, expect, vi } from "vitest";
import { PubSub } from "../src/pubsub.js";

describe("PubSub", () => {
  it("broadcast appelle tous les abonnés du topic", () => {
    const a = vi.fn();
    const b = vi.fn();
    PubSub.subscribe("t1", a);
    PubSub.subscribe("t1", b);

    PubSub.broadcast("t1", { x: 1 });

    expect(a).toHaveBeenCalledWith({ x: 1 });
    expect(b).toHaveBeenCalledWith({ x: 1 });
  });

  it("unsubscribe retire le callback", () => {
    const cb = vi.fn();
    const unsubscribe = PubSub.subscribe("t2", cb);
    unsubscribe();

    PubSub.broadcast("t2", {});

    expect(cb).not.toHaveBeenCalled();
  });

  it("broadcast sur un topic sans abonné ne plante pas", () => {
    expect(() => PubSub.broadcast("t3-empty", {})).not.toThrow();
  });
});
