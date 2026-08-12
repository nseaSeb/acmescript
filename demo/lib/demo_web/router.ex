defmodule DemoWeb.Router do
  use DemoWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {DemoWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", DemoWeb do
    pipe_through :browser

    live "/", HomeLive
    live "/copy-to-clipboard", CopyToClipboardLive
    live "/auto-resize", AutoResizeLive
    live "/click-outside", ClickOutsideLive
    live "/infinite-scroll", InfiniteScrollLive
    live "/reorderable", ReorderableLive
    live "/local-storage-sync", LocalStorageSyncLive
    live "/hotkey", HotkeyLive
    live "/scroll-restore", ScrollRestoreLive
    live "/context-menu", ContextMenuLive
    live "/tags-input", TagsInputLive
  end

  # Other scopes may use custom stacks.
  # scope "/api", DemoWeb do
  #   pipe_through :api
  # end
end
