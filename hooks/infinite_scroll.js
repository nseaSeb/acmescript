import { createHook } from "../acmescript.js";

// Pushes an event when the element scrolls into view. Drop this as an empty
// sentinel element at the bottom of a list to trigger loading more.
// heex:
//   <div id="sentinel" phx-hook="InfiniteScroll" data-load-event="load_more"></div>
export const InfiniteScroll = createHook({
  mounted(ctx) {
    const event = this.el.dataset.loadEvent ?? "load_more";

    this._observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) ctx.push(event);
    });

    this._observer.observe(this.el);
  },

  destroyed() {
    this._observer.disconnect();
  }
});
