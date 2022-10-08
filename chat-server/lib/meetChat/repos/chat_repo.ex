defmodule MeetChat.ChatRepo do 
  import MeetChat.Repo
  alias MeetChat.Chat

  def chats(), do: all(Chat) |> MeetChat.Repo.preload(:messages)
  def chat(id), do: get(Chat, id) |> MeetChat.Repo.preload(:messages)
end
