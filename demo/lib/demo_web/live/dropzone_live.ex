defmodule DemoWeb.DropzoneLive do
  use DemoWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok,
     socket
     |> assign(uploaded_files: [])
     |> allow_upload(:avatar, accept: :any, max_entries: 5)}
  end

  def handle_event("validate", _params, socket) do
    {:noreply, socket}
  end

  def handle_event("cancel", %{"ref" => ref}, socket) do
    {:noreply, cancel_upload(socket, :avatar, ref)}
  end

  def handle_event("save", _params, socket) do
    uploaded_files =
      consume_uploaded_entries(socket, :avatar, fn _meta, entry ->
        {:ok, entry.client_name}
      end)

    {:noreply, update(socket, :uploaded_files, &(&1 ++ uploaded_files))}
  end

  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash}>
      <.header>Dropzone</.header>
      <p class="mb-4 text-sm opacity-70">
        Drag files onto the box to queue them for the <code>avatar</code> LiveView upload, or
        click to browse — the hook only handles the drag/drop wiring, LiveView does the rest.
      </p>

      <form id="upload-form" phx-submit="save" phx-change="validate">
        <label
          id="dropzone"
          phx-hook="Dropzone"
          data-upload-name="avatar"
          for={@uploads.avatar.ref}
          class="block border-2 border-dashed rounded p-8 text-center cursor-pointer"
        >
          Drop files here, or click to browse
          <.live_file_input upload={@uploads.avatar} class="hidden" />
        </label>

        <p :for={err <- upload_errors(@uploads.avatar)} class="mt-2 text-sm text-red-600">
          {error_to_string(err)}
        </p>

        <ul class="mt-4 space-y-1">
          <li :for={entry <- @uploads.avatar.entries} class="text-sm flex items-center gap-2">
            <span>{entry.client_name} — {entry.progress}%</span>
            <span :for={err <- upload_errors(@uploads.avatar, entry)} class="text-red-600">
              {error_to_string(err)}
            </span>
            <button type="button" phx-click="cancel" phx-value-ref={entry.ref} class="opacity-50">
              &times;
            </button>
          </li>
        </ul>

        <button
          :if={@uploads.avatar.entries != []}
          type="submit"
          class="mt-4 border rounded px-3 py-1 text-sm"
        >
          Upload
        </button>
      </form>

      <p :if={@uploaded_files != []} class="mt-4 text-sm">
        Server received: <span class="font-semibold">{Enum.join(@uploaded_files, ", ")}</span>
      </p>
    </Layouts.app>
    """
  end

  defp error_to_string(:too_large), do: "Too large"
  defp error_to_string(:not_accepted), do: "Unacceptable file type"
  defp error_to_string(:too_many_files), do: "Too many files"
  defp error_to_string(err), do: to_string(err)
end
