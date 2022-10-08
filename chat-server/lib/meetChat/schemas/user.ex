defmodule MeetChat.User do
  use Ecto.Schema

  @primary_key {:id, :string, autogenerate: false}
  schema "User" do
    field :firstName, :string
    field :lastName, :string
    field :email, :string
  end
end
