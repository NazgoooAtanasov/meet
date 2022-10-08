defmodule MeetChatWeb.MessageChannel do
  use MeetChatWeb, :channel

  alias MeetChat.Chat
  alias MeetChat.ChatRepo
  alias MeetChat.MessageRepo

  # @NOTE FOR SELF, using the broadcast! you can send messages to all connected clients

  @impl true
  def join("chat:lobby", _payload, socket) do
    {:ok, socket}
  end

  @impl true
  def join("chat:"<> id, %{ "userId" => userId }, socket) do
    with %Chat{} <- ChatRepo.chat(id),
      {:ok} <- authorize_chat("", userId) do
      {:ok, socket}
    else
      _error -> {:error, "unauthorized"}
    end
  end

  @impl true
  def handle_in("message:create", %{"message" => message}, socket) do
    case MessageRepo.create_message(message) do
      {:ok, msg} -> 
        broadcast!(socket, "message:created", %{ message: msg.text })
        {:noreply, socket}

      {:error, _changeset} -> 
        {:reply, :error, socket}
    end
  end

  # @TODO: make the authorization happen :D 
  defp authorize_chat(_event_id, _user_id), do: {:ok}
end
