module FriendGraph 
def self.generate_json()
  friends = {nodes: [], links: []}
  all_users = []

  User.find_each do |user|
    puts "#{user.name} + #{ user.friends.count } friends"
    all_users << user
  end

    # -------------------------------- #

    all_users.each do |user| 
      user.friends.each do |friend|
        friends[:links] << {source: user.id, target: friend.id}
      end
      friends[:nodes] << {id: user.id, name: user.name, rank: user.friends.count}
    end

  File.open("public/friend_graph_data.js","w") do |f|
    f.write("friends = #{friends.to_json()}")
  end
end
def self.generate_json_friends_of_friends(user)
  friends = {nodes: [], links: []}

  friends[:nodes] << {id: user.id, name: user.name, rank: 1}
  
  user.friends.each do |friend|
    friends[:nodes] << { id: friend.id, name: friend.name, rank: 2 }
    friends[:links] << { source: user.id, target: friend.id }
  end

  File.open("public/friend_group_data.js","w") do |f|
    f.write("friends = #{friends.to_json()}")
  end
end
end