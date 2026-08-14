defmodule DemoWeb.HomeLive do
  use DemoWeb, :live_view

  @hooks [
    {"/copy-to-clipboard", "CopyToClipboard", "Copies text to the clipboard on click."},
    {"/auto-resize", "AutoResize", "Grows a textarea to fit its content."},
    {"/click-outside", "ClickOutside", "Closes a dropdown on outside click or Escape."},
    {"/infinite-scroll", "InfiniteScroll", "Loads more items as a sentinel scrolls into view."},
    {"/reorderable", "Reorderable", "Reorders a list via native HTML5 drag and drop."},
    {"/local-storage-sync", "LocalStorageSync", "Persists an input's value across reloads."},
    {"/hotkey", "Hotkey", "Triggers a server event on a keyboard shortcut."},
    {"/scroll-restore", "ScrollRestore", "Restores a scrollable panel's scroll position."},
    {"/context-menu", "ContextMenu", "A custom right-click menu."},
    {"/tags-input", "TagsInput", "A tag/pill input built from scratch."},
    {"/dropzone", "Dropzone", "Drag & drop files onto a LiveView upload."}
  ]

  def mount(_params, _session, socket) do
    {:ok, assign(socket, hooks: @hooks)}
  end

  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash}>
      <.header>AcmeScript classic hooks</.header>
      <p class="mb-6 text-sm opacity-70">
        Eleven common LiveView hooks built with <code>createHook</code> from
        <a href="https://github.com/nseaSeb/acmescript" class="underline">acme-script</a>.
        Each page demos one hook end-to-end, client interaction through to a server event.
      </p>

      <ul class="space-y-3">
        <li :for={{path, name, description} <- @hooks} class="border rounded p-3">
          <.link navigate={path} class="font-semibold underline">{name}</.link>
          <p class="text-sm opacity-70">{description}</p>
        </li>
      </ul>
    </Layouts.app>
    """
  end
end
