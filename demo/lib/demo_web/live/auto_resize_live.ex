defmodule DemoWeb.AutoResizeLive do
  use DemoWeb, :live_view

  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash}>
      <.header>AutoResize</.header>
      <p class="mb-4 text-sm opacity-70">
        Grows the textarea to fit its content as you type — purely client-side, no server event needed.
      </p>

      <textarea
        id="notes"
        phx-hook="AutoResize"
        class="w-full border rounded p-2"
        placeholder="Start typing, watch it grow..."
        rows="2"
      ></textarea>
    </Layouts.app>
    """
  end
end
