import { createHook, show, hide } from "../acmescript.js";

// Replaces the native browser right-click menu with a custom one, positioned
// at the cursor via `show`/`hide`. Pushes the target's `data-id` to LiveView.
//
// `show`/`hide` only animate opacity/scale classes — they strip every
// transition class once the animation ends, which would leave the menu back
// at its default (visible) state. So `hidden` (display:none) is toggled
// separately, on top of the fade, to keep it out of the layout when closed.
// heex:
//   <div phx-hook="ContextMenu" data-menu-target="#context-menu" data-id={item.id}>...</div>
//   <div id="context-menu" class="hidden">...</div>
const HIDE_DURATION = 150;

export const ContextMenu = createHook({
  mounted(ctx) {
    const menu = document.querySelector(this.el.dataset.menuTarget);
    if (!menu) return;

    this._onContextMenu = (e) => {
      e.preventDefault();
      menu.style.left = `${e.clientX}px`;
      menu.style.top = `${e.clientY}px`;
      menu.classList.remove("hidden");
      show(menu);
      ctx.push("context_menu_opened", { id: this.el.dataset.id });
    };

    this._onDocClick = () => {
      hide(menu, { duration: HIDE_DURATION });
      this._hideTimer = setTimeout(() => menu.classList.add("hidden"), HIDE_DURATION);
    };

    this.el.addEventListener("contextmenu", this._onContextMenu);
    document.addEventListener("click", this._onDocClick);
  },

  destroyed() {
    clearTimeout(this._hideTimer);
    this.el.removeEventListener("contextmenu", this._onContextMenu);
    document.removeEventListener("click", this._onDocClick);
  }
});
