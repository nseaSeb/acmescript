defmodule DemoWeb.HotkeyLive do
  use DemoWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok, assign(socket, search_open: false)}
  end

  def handle_event("open_search", _params, socket) do
    {:noreply, assign(socket, search_open: true)}
  end

  def handle_event("close_search", _params, socket) do
    {:noreply, assign(socket, search_open: false)}
  end

  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash}>
      <.header>Hotkey</.header>
      <p class="mb-4 text-sm opacity-70">
        Press <kbd class="border rounded px-1">Cmd/Ctrl</kbd> + <kbd class="border rounded px-1">K</kbd>
        anywhere on this page to open the search box.
      </p>

      <div id="hotkey-listener" phx-hook="Hotkey" data-key="k" data-meta="true" data-event="open_search"></div>

      <div :if={@search_open} class="border rounded p-3">
        <input type="text" placeholder="Search..." class="w-full border rounded p-2" autofocus />
        <button phx-click="close_search" class="mt-2 text-sm underline">close</button>
      </div>
    </Layouts.app>
    """
  end
end
