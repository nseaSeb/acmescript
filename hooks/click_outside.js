import { createHook } from "../acmescript.js";

// Pushes an event when the user clicks outside the element or presses Escape.
// Useful to close a dropdown/modal from the server. The outside-click listener
// is attached on the next tick so the click that opened the element (e.g. a
// toggle button) doesn't immediately close it.
// heex:
//   <div id="menu" phx-hook="ClickOutside" data-close-event="close_menu">...</div>
export const ClickOutside = createHook({
  mounted(ctx) {
    const event = this.el.dataset.closeEvent ?? "click_outside";

    this._onDocClick = (e) => {
      if (!this.el.contains(e.target)) ctx.push(event);
    };

    this._onKeydown = (e) => {
      if (e.key === "Escape") ctx.push(event);
    };

    this._attachTimer = setTimeout(() => {
      document.addEventListener("click", this._onDocClick);
    }, 0);

    document.addEventListener("keydown", this._onKeydown);
  },

  destroyed() {
    clearTimeout(this._attachTimer);
    document.removeEventListener("click", this._onDocClick);
    document.removeEventListener("keydown", this._onKeydown);
  }
});
