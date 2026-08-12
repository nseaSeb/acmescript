import { createHook, H } from "../acmescript.js";

// Turns a container into a tag/pill input: Enter or comma adds a tag,
// Backspace on an empty input removes the last one. Pushes the full tag list
// on every change.
// heex:
//   <div phx-hook="TagsInput" data-tags-event="tags_changed">
//     <div class="tags"></div>
//     <input type="text" />
//   </div>
export const TagsInput = createHook({
  mounted(ctx) {
    const event = this.el.dataset.tagsEvent ?? "tags_changed";
    const container = this.el.querySelector(".tags");
    const input = this.el.querySelector("input");
    let tags = [];

    const render = () => {
      container.replaceChildren(...tags.map((tag) => {
        const pill = H`<span class="tag">${tag} <button type="button">x</button></span>`;
        pill.querySelector("button").addEventListener("click", () => {
          tags = tags.filter((t) => t !== tag);
          render();
          ctx.push(event, { tags });
        });
        return pill;
      }));
    };

    this._onKeydown = (e) => {
      if ((e.key === "Enter" || e.key === ",") && input.value.trim()) {
        e.preventDefault();
        const tag = input.value.trim();
        if (!tags.includes(tag)) tags.push(tag);
        input.value = "";
        render();
        ctx.push(event, { tags });
      } else if (e.key === "Backspace" && !input.value && tags.length) {
        tags = tags.slice(0, -1);
        render();
        ctx.push(event, { tags });
      }
    };

    input.addEventListener("keydown", this._onKeydown);
  },

  destroyed() {
    this.el.querySelector("input")?.removeEventListener("keydown", this._onKeydown);
  }
});
