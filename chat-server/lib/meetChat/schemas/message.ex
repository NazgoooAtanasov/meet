defmodule MeetChat.Message do
  use Ecto.Schema
  
  @primary_key {:id, :string, autogenerate: false}
  schema "Message" do
    field :text, :string
    belongs_to :user, MeetChat.User, type: :string, foreign_key: :userId
    belongs_to :chat, MeetChat.Chat, type: :string, foreign_key: :chatId
  end
end
