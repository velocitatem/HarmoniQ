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


print(tracks)

# beat match the tracks
playback = [] # track, start time, end time
def beat_match_tracks(tracks):
    playback = []

    # Assume the first track's tempo as ground tempo
    ground_tempo = tracks[0][1]

    # Initialize start_time
    start_time = 0

    for i in range(len(tracks)):
        song, tempo, beat_frames = tracks[i]

        # Calculate the speed change factor to match the ground tempo
        speed_change = ground_tempo / tempo

        # Calculate new beat_frames to match the ground tempo
        adjusted_beat_frames = beat_frames * speed_change

        # Find the closest beat frame to start
        closest_start_frame = min(adjusted_beat_frames, key=lambda x:abs(x-start_time))

        # Assuming we will play for 30 seconds from the closest_start_frame
        end_time = closest_start_frame + 30  # You can adjust this

        # Add to the playback list
        playback.append((song, closest_start_frame, end_time))

        # Update start_time for next iteration
        start_time = end_time

    return playback

# TODO beat match the tracks
playback = beat_match_tracks(tracks)

print(playback)
# save the playback to json
import json
with open("playback.json", "w") as f:
    json.dump(playback, f)
