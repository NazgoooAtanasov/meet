defmodule MeetChatWeb.MessageChannel do
  use MeetChatWeb, :channel

  # @NOTE FOR SELF, using the broadcast! you can send messages to all connected clients

  @impl true
  def join("chat:lobby", _payload, socket) do
    {:ok, socket}
  end

  @impl true
  def join("chat:"<> _id, _payload, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  @impl true
  def handle_in("message:create", %{"message" => message}, socket) do
    broadcast!(socket, "message:created", message)
    {:noreply, socket}
  end
end
