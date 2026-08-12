defmodule DemoWeb.ClickOutsideLive do
  use DemoWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok, assign(socket, open: false)}
  end

  def handle_event("toggle", _params, socket) do
    {:noreply, update(socket, :open, &(!&1))}
  end

  def handle_event("close_menu", _params, socket) do
    {:noreply, assign(socket, open: false)}
  end

  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash}>
      <.header>ClickOutside</.header>
      <p class="mb-4 text-sm opacity-70">
        Closes the dropdown when you click outside it or press Escape — both handled server-side.
      </p>

      <div class="relative inline-block">
        <button phx-click="toggle" class="px-3 py-1.5 border rounded">
          Menu {if @open, do: "▲", else: "▼"}
        </button>

        <div
          :if={@open}
          id="dropdown"
          phx-hook="ClickOutside"
          data-close-event="close_menu"
          class="absolute mt-1 w-40 border rounded bg-white shadow p-2"
        >
          <p class="text-sm">Click outside or press Escape to close.</p>
        </div>
      </div>
    </Layouts.app>
    """
  end
end
