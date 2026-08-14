import { createHook } from "../acmescript.js";

// Turns an element into a drag & drop file dropzone: toggles a `.drag-over`
// class while a file is dragged over it (style it yourself), and feeds
// dropped files straight into a LiveView upload on drop.
// heex:
//   <div phx-hook="Dropzone" data-upload-name="avatar" class="dropzone">
//     Drop files here
//   </div>
export const Dropzone = createHook({
  mounted(ctx) {
    const uploadName = this.el.dataset.uploadName;
    let depth = 0;

    this._onDragEnter = (e) => {
      e.preventDefault();
      depth++;
      this.el.classList.add("drag-over");
    };

    this._onDragOver = (e) => e.preventDefault();

    this._onDragLeave = (e) => {
      e.preventDefault();
      depth = Math.max(0, depth - 1);
      if (depth === 0) this.el.classList.remove("drag-over");
    };

    this._onDrop = (e) => {
      e.preventDefault();
      depth = 0;
      this.el.classList.remove("drag-over");
      const files = [...(e.dataTransfer?.files ?? [])];
      if (files.length) ctx.upload(uploadName, files);
    };

    // Fallback for a drag cancelled mid-hover (e.g. Escape): the drag source's
    // "dragend" always fires, even when a matching dragleave doesn't reach this.el.
    this._onWindowDragEnd = () => {
      depth = 0;
      this.el.classList.remove("drag-over");
    };

    this.el.addEventListener("dragenter", this._onDragEnter);
    this.el.addEventListener("dragover", this._onDragOver);
    this.el.addEventListener("dragleave", this._onDragLeave);
    this.el.addEventListener("drop", this._onDrop);
    window.addEventListener("dragend", this._onWindowDragEnd);
  },

  destroyed() {
    this.el.removeEventListener("dragenter", this._onDragEnter);
    this.el.removeEventListener("dragover", this._onDragOver);
    this.el.removeEventListener("dragleave", this._onDragLeave);
    this.el.removeEventListener("drop", this._onDrop);
    window.removeEventListener("dragend", this._onWindowDragEnd);
  }
});
