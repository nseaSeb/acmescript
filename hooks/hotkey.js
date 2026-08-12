import { createHook } from "../acmescript.js";

// Pushes an event when a keyboard shortcut is pressed anywhere on the page.
// heex:
//   <div phx-hook="Hotkey" data-key="k" data-meta="true" data-event="open_search"></div>
export const Hotkey = createHook({
  mounted(ctx) {
    const key = this.el.dataset.key?.toLowerCase();
    const needsMeta = this.el.dataset.meta === "true";
    const needsShift = this.el.dataset.shift === "true";
    const event = this.el.dataset.event ?? "hotkey";

    this._onKeydown = (e) => {
      if (e.key.toLowerCase() !== key) return;
      if (needsMeta && !(e.metaKey || e.ctrlKey)) return;
      if (needsShift && !e.shiftKey) return;

      e.preventDefault();
      ctx.push(event);
    };

    document.addEventListener("keydown", this._onKeydown);
  },

  destroyed() {
    document.removeEventListener("keydown", this._onKeydown);
  }
});
