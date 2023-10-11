# SERVER FILE FOR THE BACKEND
import os
from flask import Flask, request, redirect, jsonify

# TODO: import the Spotify API wrapper and research how to use it
# https://pypi.org/project/spotify/


# Get environment variables
domain = os.getenv('DOMAIN', 'http://localhost:3000') # This is the domain of the server
port = int(os.getenv('PORT', 3000))


# Create Flask app and set up CORS
app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'


# create the routes for the app
@app.route('/spotify/auth', methods=['GET'])
def spotify_auth():
    """
    When a user visits this routes, they will be redirected to the Spotify login page. They should also provide
    The event name as a query parameter. This parameter should be passed to the Spotify callback route.
    """

    # Users visits this link -> spotify login page -> spotify callback route -> redirect to frontend


@app.route('/spotify/callback', methods=['GET'])
def spotify_callback():
    """
    This route is called when the user has logged into Spotify. The route should redirect the user to the frontend
    What this route does is that it gives use the auth token and refresh token for that specific user.
    There are two things that should happen when this gets called:
    + We should store the auth token and refresh token in the database
    + We should store the users music preferences in the database (This will be done maybe in a another server)
    """


# Other routes
# - Get most popular songs for a specific genre
# - Get most popular artists
# - Get user demographics information
# - Get a list of all the events
# - For each event, get the most popular songs and artists
# - For each event, get the user demographics information
# - For each event, get the user music preferences


@app.route('/status', methods=['GET'])
def status():
    """
    This route will be used to check if the server is running
    """
    return jsonify({'status': 'OK'})

def main():
    # TODO: connect to the database here

    # TODO: start the server here (use the domain and port variables) and set debug to True
