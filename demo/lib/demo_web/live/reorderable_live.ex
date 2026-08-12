defmodule DemoWeb.ReorderableLive do
  use DemoWeb, :live_view

  @tasks [
    %{id: "1", name: "Write the README"},
    %{id: "2", name: "Ship the demo"},
    %{id: "3", name: "Drink coffee"},
    %{id: "4", name: "Review the PR"}
  ]

  def mount(_params, _session, socket) do
    {:ok, assign(socket, tasks: @tasks)}
  end

  def handle_event("reorder", %{"ids" => ids}, socket) do
    tasks_by_id = Map.new(socket.assigns.tasks, &{&1.id, &1})
    reordered = Enum.map(ids, &Map.fetch!(tasks_by_id, &1))
    {:noreply, assign(socket, tasks: reordered)}
  end

  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash}>
      <.header>Reorderable</.header>
      <p class="mb-4 text-sm opacity-70">
        Drag items to reorder — the new order is pushed to the server on drop.
      </p>

      <ul id="task-list" phx-hook="Reorderable" data-reorder-event="reorder" class="border rounded divide-y">
        <li :for={task <- @tasks} draggable="true" data-id={task.id} class="p-2 text-sm cursor-move bg-white">
          ⠿ {task.name}
        </li>
      </ul>
    </Layouts.app>
    """
  end
end
