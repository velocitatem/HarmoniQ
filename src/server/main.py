from flask import Flask, request, redirect, jsonify
from pymongo import MongoClient
from requests import Request, Session
import datetime as datetime
from requests.auth import HTTPBasicAuth
import os
from urllib.parse import urlencode

app = Flask(__name__)
client = MongoClient(os.getenv('MONGODB_URI'))
db = client['harmoniQ']

spotify_auth_url = 'https://accounts.spotify.com/authorize'
spotify_token_url = 'https://accounts.spotify.com/api/token'
spotify_me_url = 'https://api.spotify.com/v1/me'

domain = os.getenv('DOMAIN', 'http://localhost:3000')
port = int(os.getenv('PORT', 3000))

@app.route('/spotify/auth', methods=['GET'])
def spotify_auth():
    client_id = os.getenv('CLIENT_ID')
    event = request.args.get('event')
    redirect_uri = f"{domain}/spotify/auth/callback/{event}"
    scopes = ' '.join([
        'user-read-private',
        'user-read-email',
        'user-library-read',
        'user-top-read'
    ])
    params = {
        'response_type': 'code',
        'client_id': client_id,
        'scope': scopes,
        'redirect_uri': redirect_uri
    }
    auth_url = f"{spotify_auth_url}?{urlencode(params)}"
    return redirect(auth_url)

@app.route('/spotify/auth/callback/<event>', methods=['GET'])
def spotify_auth_callback(event):
    code = request.args.get('code')
    redirect_uri = f"{domain}/spotify/auth/callback/{event}"
    session = Session()
    auth_request = Request(
        'POST',
        spotify_token_url,
        auth=HTTPBasicAuth(os.getenv('CLIENT_ID'), os.getenv('CLIENT_SECRET')),
        params={
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': redirect_uri
        }
    )
    auth_response = session.send(auth_request.prepare())
    auth_data = auth_response.json()

    user_request = Request(
        'GET',
        spotify_me_url,
        headers={'Authorization': f"Bearer {auth_data['access_token']}"}
    )
    user_response = session.send(user_request.prepare())
    user_data = user_response.json()

    user_data.update(auth_data)
    user_data['signupDate'] = datetime.datetime.utcnow()
    user_data['event'] = event

    db.users.insert_one(user_data)

    return jsonify(message='success', user=user_data)

@app.route('/status', methods=['GET'])
def status():
    return 'OK'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port)
