defmodule DemoWeb.ContextMenuLive do
  use DemoWeb, :live_view

  @items [
    %{id: "1", name: "Invoice #1024"},
    %{id: "2", name: "Invoice #1025"},
    %{id: "3", name: "Invoice #1026"}
  ]

  def mount(_params, _session, socket) do
    {:ok, assign(socket, items: @items, last_opened: nil)}
  end

  def handle_event("context_menu_opened", %{"id" => id}, socket) do
    {:noreply, assign(socket, last_opened: id)}
  end

  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash}>
      <.header>ContextMenu</.header>
      <p class="mb-4 text-sm opacity-70">
        Right-click an item for a custom menu instead of the browser's default one.
      </p>

      <ul class="border rounded divide-y mb-4">
        <li
          :for={item <- @items}
          phx-hook="ContextMenu"
          id={"item-#{item.id}"}
          data-menu-target="#context-menu"
          data-id={item.id}
          class="p-2 text-sm"
        >
          {item.name}
        </li>
      </ul>

      <p :if={@last_opened} class="text-sm">
        Server saw the menu open for item <span class="font-semibold">#{@last_opened}</span>.
      </p>

      <div id="context-menu" class="hidden fixed border rounded bg-white shadow p-2 text-sm">
        <p class="px-2 py-1 hover:bg-gray-100 cursor-pointer">View</p>
        <p class="px-2 py-1 hover:bg-gray-100 cursor-pointer">Delete</p>
      </div>
    </Layouts.app>
    """
  end
end
