// Hook LiveView : compteur avec transition + rendu via sigil HTML
// heex :
//   <div id="counter" phx-hook="Counter" phx-update="ignore"></div>
import { createHook, H, find, show } from "../acmescript.js";

export const Counter = createHook({
  mounted(ctx) {
    this.count = 0;
    this.el.append(H`<span class="count">0</span>`);
    show(this.el);

    ctx.handle("counter:reset", () => {
      this.count = 0;
      this._renderCount();
    });

    this.el.addEventListener("click", () => {
      this.count += 1;
      this._renderCount();
      ctx.push("counter:changed", { count: this.count });
    });

    this._renderCount = () => {
      find(".count", this.el).el.textContent = this.count;
    };
  }
});
