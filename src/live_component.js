export const createLiveComponent = ({ mount, handleEvent, render }) => {
  return class extends HTMLElement {
    constructor() {
      super();
      this.state = {};
    }

    connectedCallback() {
      const initialState = JSON.parse(this.getAttribute("phx-state") || "{}");
      this.state = mount ? mount(initialState) : initialState;
      this._render();
    }

    send(event, payload = {}) {
      if (handleEvent && handleEvent[event]) {
        this.state = handleEvent[event](this.state, payload);
        this._render();
      }
    }

    _render() {
      if (render) {
        const dom = render(this.state, (evt, data) => this.send(evt, data));
        this.replaceChildren(dom);
      }
    }
  };
};
