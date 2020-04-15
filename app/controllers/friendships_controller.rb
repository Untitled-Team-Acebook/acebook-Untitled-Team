class FriendshipsController < ApplicationController
  def index
    @friendships = Friendship.all
  end
  def new
    @friendship = Friendship.new
  end
  def create
    user = User.find_by(id: params[:id])
    @friendship = current_user.friend_request(user)
  end
end


def friendship_params
  params.fetch(:user, {}).permit(:name, :email, :password, :password_confirmation)
end
