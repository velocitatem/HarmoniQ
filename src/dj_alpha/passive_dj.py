import os
from dotenv import load_dotenv
import librosa
import librosa.display
import numpy as np

directory = "/home/velocitatem/Daily Mix 3/"
# get client ID and SECRET from .env
songs = os.listdir(directory)
tracks = []

for song in songs:
    y, sr = librosa.load(directory + song)
    tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
    print(song, tempo)
    tracks.append((song, tempo, beat_frames))

# order the tracks by tempo
tracks.sort(key=lambda x: x[1])

# eliminate any tracks that dont have a similar tempo to neighbors (within 10%)
tracks = [track for track in tracks if track[1] > tracks[0][1] * 0.9 and track[1] < tracks[0][1] * 1.1]

print(tracks)

# beat match the tracks
playback = [] # track, start time, end time

# TODO beat match the tracks

print(playback)
# save the playback to json
import json
with open("playback.json", "w") as f:
    json.dump(playback, f)
