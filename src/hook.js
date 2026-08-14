export const createHook = (spec) => ({
  mounted() {
    this._acmeCtx = {
      el: this.el,
      push: (event, payload = {}) => this.pushEvent(event, payload),
      pushTo: (target, event, payload = {}) => this.pushEventTo(target, event, payload),
      handle: (event, callback) => this.handleEvent(event, callback),
      upload: (name, files) => this.upload(name, files)
    };

    if (spec.mounted) spec.mounted.call(this, this._acmeCtx);
  },

  updated() {
    if (spec.updated) spec.updated.call(this, this._acmeCtx ?? {});
  },

  destroyed() {
    if (spec.destroyed) spec.destroyed.call(this, this._acmeCtx ?? {});
  }
});
