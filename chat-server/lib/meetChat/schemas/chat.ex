defmodule MeetChat.Chat do
  use Ecto.Schema

  @primary_key {:id, :string, autogenerate: false}
  schema "Chat" do
    has_many :messages, MeetChat.Message, foreign_key: :chatId
  end
end
