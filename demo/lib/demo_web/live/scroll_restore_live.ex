defmodule DemoWeb.ScrollRestoreLive do
  use DemoWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok, assign(socket, messages: Enum.map(1..60, &"Message ##{&1}"))}
  end

  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash}>
      <.header>ScrollRestore</.header>
      <p class="mb-4 text-sm opacity-70">
        Scroll this panel, navigate away, and come back — the scroll position is restored
        (sessionStorage-backed, purely client-side).
      </p>

      <div
        id="chat-log"
        phx-hook="ScrollRestore"
        data-storage-key="acme-demo-chat-scroll"
        class="border rounded h-64 overflow-y-auto"
      >
        <p :for={message <- @messages} class="p-2 text-sm border-b">{message}</p>
      </div>
    </Layouts.app>
    """
  end
end
