import { createHook } from "../acmescript.js";

// Persists an <input>/<textarea>'s value to localStorage and restores it on
// mount — handy for draft text that should survive a page reload.
// heex:
//   <input phx-hook="LocalStorageSync" data-storage-key="draft-message" name="message" />
export const LocalStorageSync = createHook({
  mounted() {
    const key = this.el.dataset.storageKey;
    if (!key) return;

    const saved = localStorage.getItem(key);
    if (saved !== null) this.el.value = saved;

    this._onInput = () => localStorage.setItem(key, this.el.value);
    this.el.addEventListener("input", this._onInput);
  },

  destroyed() {
    this.el.removeEventListener("input", this._onInput);
  }
});
