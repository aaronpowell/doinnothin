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

  def display_errors(errors)
	if errors.length > 0
		haml :validation, :layout => false, :locals => { :errors => errors }
	else
		''
	end
  end

  def h(source)
    escape_html(source).gsub(' ', '%20')
  end

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
		if decrypt_password(u['password']) == password
			session[:username] = username
			session[:api_key] = u['_id']
			session[:authenticated] = true
			return true
		end
	end
	false
  end
  
  def logout
    session[:username] = nil
	session[:api_key] = nil
	session[:authenticated] = false
  end

  def decrypt_password(password)
	BCrypt::Password.new(password)
  end
  
  def encrypt_password(password)
	BCrypt::Password.create(password)
  end

end

get '/' do
    haml :index
end

get '/about' do
    haml :about
end

get '/register' do
	if authorized?
		redirect '/'
	end
	haml :register, :locals => { errors: [] }
end

post '/register' do
	username = params[:username]
	errors = []
	if username.empty?
		errors.push('Please provide a username')
	end
	docs = options.db.view('users/by_username', :key => h(username))
	if docs['rows'].length
		errors.push('That username has already been taken')
	end
	
	pwd = params[:password]
	if pwd.empty?
		errors.push('Please provide a password')
	end
	
    email = params[:email]
    if email.empty?
		errors.push('An email address is required to register')
    end
    unless email =~ /^[a-zA-Z][\w\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/
        errors.push('Your email address is incorrectly formatted')
    end
	email = email.downcase
	docs = options.db.view('users/by_email', :key => h(email))
	if docs['rows'].length > 0
		errors.push('This email address is already in use')
	else
		options.db.save_doc({ 
			:email => email,
			:username => username,
			:created => Time.now.to_s,
			:password => encrypt_password(pwd),
			:type => 'user'
		})
		
		login(username, pwd)
		redirect '/'
	end	
	
	haml :register, :locals => { errors: errors }
end

get '/login' do
	if authorized?
		redirect '/'
	end
	haml :login, :locals => { errors: [] }
end

post '/login' do
	login(params[:username], params[:password])
    if authorized?
        redirect '/'
    else
        haml :login, :locals => { errors: ['Username and password combination is not valid'] }
    end
end

get '/logout' do
	logout
	redirect '/'
end

post '/save' do
	if authorized?
		if params[:times]
			options.db.save_doc({
				:user => session[:api_key],
				:times => params[:times],
				:start => params[:start],
				:created => Time.now.to_s,
				:type => 'session'
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