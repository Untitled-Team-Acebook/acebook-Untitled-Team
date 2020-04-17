require 'rails_helper'

RSpec.describe WelcomeController, type: :controller do

  describe "GET #–no-test-framework" do
    it "returns http success" do
      get :–no-test-framework
      expect(response).to have_http_status(:success)
    end
  end

end
