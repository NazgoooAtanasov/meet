  defmodule MeetChat.MessageRepo do
    import MeetChat.Repo
    import Ecto.Query

    alias MeetChat.Message

    @doc """
      Gets all `MeetChat.Message` instances for the provided `chatId`
    """
    def messages(chatId), do: all(from m in Message, where: m.chatId == ^chatId)

    @doc """
      Creates a new message and assigns it to the userId and chatId passed in `msg`

      Returns `{:ok, struct}` or `{:error, changeset}`
    """
    def create_message(msg) do
      message = Message.changeset(%Message{id: Ecto.UUID.generate}, msg)

      if message.valid? do
        insert(message)
      else
        {:error, "Changeset not valid"}
      end
    end
  end
