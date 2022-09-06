defmodule MeetChatWeb.MessagesSocket do
  use Phoenix.Socket
  channel "event:*", MeetChatWeb.EventChannel

  @impl true
  def connect(_params, socket, _connect_info) do
    {:ok, socket}
  end

  @impl true
  def id(_socket), do: nil
end