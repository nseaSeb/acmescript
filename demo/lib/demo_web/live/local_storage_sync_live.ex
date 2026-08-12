defmodule DemoWeb.LocalStorageSyncLive do
  use DemoWeb, :live_view

  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash}>
      <.header>LocalStorageSync</.header>
      <p class="mb-4 text-sm opacity-70">
        Persists this draft to <code>localStorage</code> as you type — reload the page and it's
        still there. Purely client-side, no server event needed.
      </p>

      <textarea
        id="draft"
        phx-hook="LocalStorageSync"
        data-storage-key="acme-demo-draft"
        class="w-full border rounded p-2"
        rows="4"
        placeholder="Type something, then reload the page..."
      ></textarea>
    </Layouts.app>
    """
  end
end
