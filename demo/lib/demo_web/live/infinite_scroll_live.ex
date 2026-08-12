defmodule DemoWeb.InfiniteScrollLive do
  use DemoWeb, :live_view

  @page_size 10
  @max_items 50

  def mount(_params, _session, socket) do
    {:ok,
     assign(socket,
       items: Enum.to_list(1..@page_size),
       page_size: @page_size,
       max_items: @max_items
     )}
  end

  def handle_event("load_more", _params, socket) do
    items = socket.assigns.items

    items =
      if length(items) >= @max_items do
        items
      else
        items ++ Enum.to_list((length(items) + 1)..(length(items) + @page_size))
      end

    {:noreply, assign(socket, items: items)}
  end

  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash}>
      <.header>InfiniteScroll</.header>
      <p class="mb-4 text-sm opacity-70">
        Loads {@page_size} more items whenever the sentinel at the bottom scrolls into view
        (capped at {@max_items} for this demo).
      </p>

      <ul class="border rounded divide-y max-h-80 overflow-y-auto">
        <li :for={item <- @items} class="p-2 text-sm">Item #{item}</li>
        <li
          :if={length(@items) < @max_items}
          id="sentinel"
          phx-hook="InfiniteScroll"
          class="p-2 text-xs opacity-50"
        >
          Loading more...
        </li>
        <li :if={length(@items) >= @max_items} class="p-2 text-xs opacity-50">— end of list —</li>
      </ul>
    </Layouts.app>
    """
  end
end
