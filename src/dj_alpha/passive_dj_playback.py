import json
import os
import pygame
import time

class DJMixer:
    def __init__(self):
        pygame.mixer.init()

    def play(self, mp3_file, start_time, end_time):
        pygame.mixer.music.load(mp3_file)
        pygame.mixer.music.play(start=0)
        pygame.mixer.music.set_pos(start_time)
        elapsed_time = 0

        while elapsed_time < (end_time - start_time):
            time.sleep(1)
            elapsed_time += 1

        pygame.mixer.music.stop()




with open("playback.json", "r") as f:
    playback = json.load(f)

directory = "/home/velocitatem/Daily Mix 3/"
playback.sort(key=lambda x: x[1])
mixer = DJMixer()
for track in playback:
    # play the file from start to end times
    start = track[1]
    end = track[2]
    filename = track[0]
    print(filename)
    mixer.play(directory + filename, start, end)
