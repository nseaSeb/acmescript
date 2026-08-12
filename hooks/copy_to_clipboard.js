import { createHook } from "../acmescript.js";

// Copies text to the clipboard on click, toggling a `.copied` class briefly
// for feedback (style it yourself, e.g. swap an icon or show a tooltip).
// heex:
//   <button phx-hook="CopyToClipboard" data-copy-text="hello world">Copy</button>
//   <button phx-hook="CopyToClipboard" data-copy-target="#snippet">Copy</button>
export const CopyToClipboard = createHook({
  mounted(ctx) {
    this._onClick = async () => {
      const targetSelector = this.el.dataset.copyTarget;
      const text = targetSelector
        ? document.querySelector(targetSelector)?.textContent ?? ""
        : this.el.dataset.copyText ?? "";

      await navigator.clipboard.writeText(text);
      ctx.push("copied", { text });

      this.el.classList.add("copied");
      setTimeout(() => this.el.classList.remove("copied"), 1500);
    };

    this.el.addEventListener("click", this._onClick);
  },

  destroyed() {
    this.el.removeEventListener("click", this._onClick);
  }
});
