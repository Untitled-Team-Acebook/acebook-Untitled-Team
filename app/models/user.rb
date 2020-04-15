class User < ApplicationRecord
    has_friendship
    validates :name, presence: true
    EMAIL_FORMAT = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
    validates :email, presence: true, format: { with: EMAIL_FORMAT }, uniqueness: true

    before_save { self.email = email.downcase }

    has_secure_password
    validates :password, length: { minimum: 6, maximum: 10 }
end
