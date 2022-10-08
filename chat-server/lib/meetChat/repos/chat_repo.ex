defmodule MeetChat.ChatRepo do 
  import MeetChat.Repo
  alias MeetChat.Chat

  @doc """
    Returns all `MeetChat.Chat` instances.
  """
  def chats(), do: all(Chat) |> MeetChat.Repo.preload(:messages)


  @doc """
    Tries go get a `MeetChat.Chat` object from the db based on `id`.

    Retuns `nil` if the `id` does not relate to a `MeetChat.Chat` object.
  """
  def chat(id), do: get(Chat, id) |> MeetChat.Repo.preload(:messages)
end
