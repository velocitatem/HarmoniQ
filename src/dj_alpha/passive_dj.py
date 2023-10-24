import os
from dotenv import load_dotenv
import librosa
import librosa.display
import numpy as np

directory = "/home/velocitatem/Daily Mix 3/"
# get client ID and SECRET from .env
songs = os.listdir(directory)
tracks = []

import random
random.shuffle(songs)
songs = songs[:5]

for song in songs:
    y, sr = librosa.load(directory + song)
    tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
    print(song, tempo)
    # subtract bf[1] - bf[0] to get the length of the first beat and so on for all
    diffs = [beat_frames[i + 1] - beat_frames[i] for i in range(len(beat_frames) - 1)]
    tracks.append((song, tempo, beat_frames, diffs))

# order the tracks by tempo
tracks.sort(key=lambda x: x[1])

print(tracks)

# beat match the tracks
playback = [] # track, start time, end time
def beat_match_tracks(tracks):
    playback = []

    for t in range(len(tracks)):
        # get the track and the next track
        track = tracks[t]
        next_track = tracks[t + 1] if t < len(tracks) - 1 else None

        # get the beat frames for the track
        track_beat_frames = track[2]
        next_track_beat_frames = next_track[2] if next_track else None

        # first place in first track to stop and start the next track
        # look at 70% of the way through the track and past to find a beat
        # that matches the next track
        for i in range(int(len(track_beat_frames) * 0.7), len(track_beat_frames)):
            # get the beat frame
            beat_frame = track_beat_frames[i]

            # check if the next track has a beat frame that matches
            # the current track
            if next_track_beat_frames and beat_frame in next_track_beat_frames:
                # get the start and end times for the track
                start_time = librosa.frames_to_time(beat_frame)
                end_time = librosa.frames_to_time(next_track_beat_frames[next_track_beat_frames.index(beat_frame) + 1]) if next_track_beat_frames.index(beat_frame) < len(next_track_beat_frames) - 1 else librosa.get_duration(y)

                # add the track to the playback
                playback.append((track[0], start_time, end_time))

                # break out of the loop
                break
    return playback

# TODO beat match the tracks
playback = beat_match_tracks(tracks)

print(playback)
# save the playback to json
import json
with open("playback.json", "w") as f:
    json.dump(playback, f)
