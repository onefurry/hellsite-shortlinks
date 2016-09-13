require 'sinatra'
require 'sinatra/json'
require 'redis'
require 'securerandom'

redis = Redis.new

def urlify key, request
  portline = (request.port == 80 ? '' : ":#{request.port}")
  "#{request.scheme}://#{request.host}#{portline}/#{key}"
end

get '/' do
  haml :list
end

get '/make' do
  if redis.exists('o:' + params[:url])
    json :passed => true, :url => urlify(redis.get('o:' + params[:url]), request)
  else
    if /^https?:\/\/([a-zA-Z0-9\-\.]+\.)?tumblr.com(\/.*)?$/ =~ params[:url]
      key = SecureRandom.hex(5)
      redis.set('o:' + params[:url], key)
      redis.set('k:' + key, params[:url])
      json :passed => true, :url => urlify(key, request)
    else
      json :passed => false
    end
  end
end

get '/:key' do
  if redis.exists('k:' + params[:key])
    redirect to redis.get('k:' + params[:key])
  else
    redirect to '/'
  end
end
