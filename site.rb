['rubygems', 'sinatra', 'haml', 'couchrest', 'bcrypt'].each {|gem| require gem}
require 'sinatra/reloader' if development?

if ENV['CLOUDANT_URL']
  set :db, CouchRest.database!( ENV['CLOUDANT_URL'] + '/doinnothin' )
else
  set :db, CouchRest.database!( 'http://localhost:5984/doinnothin' )
end

set :haml, :format => :html5
enable :sessions

helpers do

  def protected!
    unless authorized?
      redirect '/login'
    end
  end

  def authorized?
    session[:authenticated]
  end
  
  def login(username, password)
	user = options.db.view('users/by_username', :key => username)['rows']
	if user.length == 1
		u = user.first['value']
		if encrypt_password(u['password']) == password
			session[:username] = username
			session[:api_key] = u['_id']
			session[:authenticated] = true
			true
		end
	end
	u
  end
  
  def logout
    session[:username] = nil
	session[:api_key] = nil
	session[:authenticated] = false
  end

  def encrypt_password(password)
	BCrypt::Password.new(password)
  end
  
end

get '/' do
    haml :index
end

get '/login' do
	haml :login
end

post '/login' do
	login(params[:username], params[:password])
    if authorized?
        redirect '/'
    else
        @error = 'Password incorrect'
        haml :login
    end
end

get '/logout' do
	logout
	redirect '/'
end

get '/about' do
    haml :about
end

post '/save' do
	if authorized?
		if params[:times]
			options.db.save_doc({
				:user => session[:api_key],
				:times => params[:times],
				:start => params[:start],
				:created => Time.now.to_s
			})
			'Saved'
		else
			'Invalid data submitted'
		end
	else
		'No user logged in'
	end
end

not_found do 
    'Aww snap! Not found baby!'
end