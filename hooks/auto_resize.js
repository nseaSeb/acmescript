import { createHook } from "../acmescript.js";

// Grows a <textarea> to fit its content as the user types.
// heex:
//   <textarea phx-hook="AutoResize"></textarea>
export const AutoResize = createHook({
  mounted() {
    this._resize = () => {
      this.el.style.height = "auto";
      this.el.style.height = `${this.el.scrollHeight}px`;
    };

    this.el.addEventListener("input", this._resize);
    this._resize();
  },

  updated() {
    this._resize();
  },

  destroyed() {
    this.el.removeEventListener("input", this._resize);
  }
});
