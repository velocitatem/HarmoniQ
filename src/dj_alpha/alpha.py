"""
This is a prelude to an AI DJ

Creating a simple remix of a song using this JSON data involves several steps:

1. **Load Audio Data**: The first step is to load the actual audio data. The JSON only contains metadata and analysis.

2. **Identify Segments**: Using the `segments` field, you can identify portions of the song that you'd like to manipulate. These segments are usually denoted by their start time and duration.

3. **Apply Effects**: Using libraries like `pydub` or `librosa`, you can apply effects like pitch shifting, time-stretching, or reversing. The JSON data's `loudness`, `tempo`, and `key` fields can guide you in applying these effects.

4. **Rearrange Sections**: The `sections` and `bars` fields in the JSON can help you in rearranging the song. For example, you might want to repeat a section with a high `confidence` score.

5. **Mixing**: Once you have your modified segments and sections, you can concatenate them to create your remix. Again, libraries like `pydub` can help here.

Here's a pseudo-code example to give you an idea:

```python
from pydub import AudioSegment

# Load audio data (Assuming you have it as a separate file)
audio = AudioSegment.from_file("song.mp3")

# Read JSON data (Assuming you have it in a variable 'data')
data = your_json_data

# Loop through segments and apply effects
for segment in data['segments']:
    start = int(segment['start'] * 1000)  # Convert to milliseconds
    end = start + int(segment['duration'] * 1000)
    segment_audio = audio[start:end]

    # Apply effects based on JSON data (e.g., pitch shift, tempo change)
    # ...

    # Replace original segment with new segment
    audio = audio[:start] + segment_audio + audio[end:]

# Loop through sections to rearrange
# ...

# Save the new audio
audio.export("remix.mp3", format="mp3")
```

Would you like to go into more detail on any of these steps?
"""
# import spotify
import spotipy as spotify
import os
from dotenv import load_dotenv
import librosa
import librosa.display
import numpy as np
## requrements.txt

# get client ID and SECRET from .env
load_dotenv()
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")

# get token
sp = spotify.Spotify(auth_manager=spotify.SpotifyClientCredentials(client_id=CLIENT_ID, client_secret=CLIENT_SECRET))



# https://developer.spotify.com/documentation/web-api/reference/get-audio-analysis
def get_track_analysis(track_id):
    """
    Get track analysis
    """
    # get track analysis
    track_analysis = sp.audio_analysis(track_id)
    return track_analysis

def get_track_information(track_id):
    """
    Get track information
    """
    # get track analysis
    track_information = sp.track(track_id)
    return track_information

def download_track(track_id):
    """
    use the CLI to download a track
    """
    res=os.system(f"spotify_dl -l https://open.spotify.com/track/{track_id}")
    return res




def main():
    # compare two songs
    # original: https://open.spotify.com/track/2Y0iGXY6m6immVb2ktbseM?si=6fc4c4acc5224a2a
    # get track analysis
    # track_analysis = get_track_analysis("2Y0iGXY6m6immVb2ktbseM")
    # download_track("2Y0iGXY6m6immVb2ktbseM")
    # assuming its already downloaded
    fileName = "/home/velocitatem/Music/MGMT - Little Dark Age.wav"
    # convert to wav


    # load the audio
    y, sr = librosa.load(fileName)
    # get the tempo
    tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
    # get the beat frames
    beat_times = librosa.frames_to_time(beat_frames, sr=sr)

    print(f"Estimated tempo: {tempo}")
    print(f"Beat frames: {beat_frames}")

    # generate a new baseline track
    baseLine = np.zeros_like(y)
    # get the beat frames
    for beat in beat_frames:
        baseLine[beat] = 1

    # get the chroma for the beats
    chromagram = librosa.feature.chroma_cqt(y=y, sr=sr)
    chroma_beats = chromagram[:, beat_frames]
    chroma_beats_times = librosa.frames_to_time(np.arange(len(chroma_beats.T)), sr=sr)








main()
