defmodule MeetChat.Repo do
  use Ecto.Repo,
    otp_app: :meetChat,
    adapter: Ecto.Adapters.Postgres
end
