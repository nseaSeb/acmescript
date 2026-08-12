defmodule DemoWeb.CopyToClipboardLive do
  use DemoWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok, assign(socket, copy_count: 0)}
  end

  def handle_event("copied", %{"text" => text}, socket) do
    {:noreply,
     socket
     |> update(:copy_count, &(&1 + 1))
     |> put_flash(:info, "Server saw a copy of: #{text}")}
  end

  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash}>
      <.header>CopyToClipboard</.header>
      <p class="mb-4 text-sm opacity-70">
        Copies text to the clipboard on click and pushes a "copied" event to the server.
      </p>

      <pre id="snippet" class="p-4 bg-gray-100 rounded text-sm">pnpm add @nseaprotector/acme-script</pre>

      <button
        id="copy-btn"
        phx-hook="CopyToClipboard"
        data-copy-target="#snippet"
        class="mt-3 px-3 py-1.5 border rounded"
      >
        Copy snippet
      </button>

      <p class="mt-4 text-sm">
        Copied <span class="font-semibold">{@copy_count}</span> time(s) — confirmed server round-trip.
      </p>
    </Layouts.app>
    """
  end
end
