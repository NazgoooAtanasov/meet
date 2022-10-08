defmodule MeetChat.UserRepo do
  import MeetChat.Repo
  alias MeetChat.User

  def users(), do: all(User)
  def user(id), do: get(User, id)
end
