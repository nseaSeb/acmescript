import { createHook } from "../acmescript.js";

// Makes the direct children of the element reorderable via native HTML5 drag
// and drop (no external dependency), pushes the new order of `data-id` values.
// heex:
//   <ul phx-hook="Reorderable" data-reorder-event="reorder">
//     <li draggable="true" data-id={item.id}>{item.name}</li>
//   </ul>
export const Reorderable = createHook({
  mounted(ctx) {
    const event = this.el.dataset.reorderEvent ?? "reorder";
    let dragged = null;

    this._onDragStart = (e) => {
      if (!e.target.dataset.id) return;
      dragged = e.target;
      e.dataTransfer.effectAllowed = "move";
    };

    this._onDragOver = (e) => {
      e.preventDefault();
      const target = e.target.closest("[data-id]");
      if (!target || target === dragged || !this.el.contains(target)) return;

      const rect = target.getBoundingClientRect();
      const before = e.clientY < rect.top + rect.height / 2;
      target.parentNode.insertBefore(dragged, before ? target : target.nextSibling);
    };

    this._onDragEnd = () => {
      const ids = [...this.el.querySelectorAll("[data-id]")].map((el) => el.dataset.id);
      ctx.push(event, { ids });
      dragged = null;
    };

    this.el.addEventListener("dragstart", this._onDragStart);
    this.el.addEventListener("dragover", this._onDragOver);
    this.el.addEventListener("dragend", this._onDragEnd);
  },

  destroyed() {
    this.el.removeEventListener("dragstart", this._onDragStart);
    this.el.removeEventListener("dragover", this._onDragOver);
    this.el.removeEventListener("dragend", this._onDragEnd);
  }
});
