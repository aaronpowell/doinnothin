['rubygems', 'sinatra', 'haml', 'couchrest'].each {|gem| require gem}
require 'sinatra/reloader' if development?
require 'newrelic_rpm' if production?

if ENV['CLOUDANT_URL']
  set :db, CouchRest.database!( ENV['CLOUDANT_URL'] + '/doinnothin' )
else
  set :db, CouchRest.database!( 'http://localhost:5984/doinnothin' )
end

set :haml, :format => :html5

get '/' do
    haml :index
end

get '/about' do
    haml :about
end

not_found do 
    'Aww snap! Not found baby!'
end