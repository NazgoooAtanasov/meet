defmodule MeetChat.Message do
  use Ecto.Schema
  import Ecto.Changeset
  
  @primary_key {:id, :string, autogenerate: false}
  schema "Message" do
    field :text, :string
    belongs_to :user, MeetChat.User, type: :string, foreign_key: :userId
    belongs_to :chat, MeetChat.Chat, type: :string, foreign_key: :chatId
  end

  def changeset(message, params) do
    message
    |> cast(params, [:text, :chatId, :userId])
    |> validate_required([:text, :chatId, :userId])
  end
end
