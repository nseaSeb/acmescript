// Live component : panier autonome, hydraté depuis phx-state
// heex :
//   <acme-cart phx-state={Jason.encode!(%{items: @items})}></acme-cart>
import { createLiveComponent, H } from "../acmescript.js";

customElements.define("acme-cart", createLiveComponent({
  mount: (state) => ({ items: state.items ?? [] }),

  handleEvent: {
    "item:remove": (state, { id }) => ({
      items: state.items.filter((item) => item.id !== id)
    })
  },

  render: (state, send) => {
    const ul = H`<ul></ul>`;

    for (const item of state.items) {
      const li = H`<li>${item.name} <button>x</button></li>`;
      li.querySelector("button").addEventListener("click", () => send("item:remove", { id: item.id }));
      ul.append(li);
    }

    return ul;
  }
}));
