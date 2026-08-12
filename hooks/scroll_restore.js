import { createHook } from "../acmescript.js";

// Restores an element's scroll position (sessionStorage-backed) on mount —
// useful for a chat log or feed that shouldn't reset to the top on navigation.
// heex:
//   <div id="chat-log" phx-hook="ScrollRestore" data-storage-key="chat-log-scroll">...</div>
export const ScrollRestore = createHook({
  mounted() {
    const key = this.el.dataset.storageKey ?? `scroll:${this.el.id}`;
    const saved = sessionStorage.getItem(key);
    if (saved !== null) this.el.scrollTop = Number(saved);

    this._onScroll = () => sessionStorage.setItem(key, String(this.el.scrollTop));
    this.el.addEventListener("scroll", this._onScroll);
  },

  destroyed() {
    this.el.removeEventListener("scroll", this._onScroll);
  }
});
