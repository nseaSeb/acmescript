defmodule DemoWeb.TagsInputLive do
  use DemoWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok, assign(socket, tags: [])}
  end

  def handle_event("tags_changed", %{"tags" => tags}, socket) do
    {:noreply, assign(socket, tags: tags)}
  end

  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash}>
      <.header>TagsInput</.header>
      <p class="mb-4 text-sm opacity-70">
        Enter or comma adds a tag, Backspace on an empty input removes the last one — the full
        list is pushed to the server on every change.
      </p>

      <div id="tags-input" phx-hook="TagsInput" data-tags-event="tags_changed" class="border rounded p-2">
        <div class="tags flex flex-wrap gap-1 mb-2"></div>
        <input type="text" placeholder="Add a tag..." class="w-full border-0 outline-none" />
      </div>

      <p class="mt-4 text-sm">
        Server has: <span class="font-semibold">{Enum.join(@tags, ", ")}</span>
      </p>
    </Layouts.app>
    """
  end
end
