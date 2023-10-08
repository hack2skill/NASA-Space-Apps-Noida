import cv2
import cv2 as cv
from time import time as timer
import numpy as np
from processing.utils import *
import matplotlib.pyplot as plt
from moviepy.editor import VideoFileClip, ImageSequenceClip
from processing.utils import *
from moviepy.audio.io.AudioFileClip import AudioFileClip

def getFirstFrame(videofile):
    vid = cv2.VideoCapture(videofile)
    success, image = vid.read()
    return image



def generate_sound_of_video(input_file, output_sound, threshold=50):
    from processing import utils
    factor = utils.factor

    vid = cv.VideoCapture(input_file)
    fps = int(vid.get(cv2.CAP_PROP_FPS)) + 1
    fps = 30
    total_frames = int(vid.get(cv.CAP_PROP_FRAME_COUNT))
    mask = np.zeros_like(getFirstFrame(input_file))
    frame_count = 0
    playback_fps = 1
    pixel_boxes = []
    box_size = 10
    data = []
    final = get_sine_wave(100, 0.1)
    r = []
    g = []
    b = []
    while True:
        stars = []
        ret, frame = vid.read()
        if not ret: break
        frame_with_ring = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        frame_count += 1

        # Skip frames to achieve the desired playback frame rate
        if frame_count % (fps // playback_fps) != 0:
            continue
        sq_frame, boxes = extract_border(frame_with_ring, 200, 10)
        for box in boxes:
            sort = []
            blink = is_hot(box, 10, 10, threshold)
            if blink:
                sort.append(blink)
        if len(sort) == 0:
            sort = [0]
        duration = 0.5 / (len(sort))

        for i in sort:
            if not i:
                freq = 20
            else:
                freq = map_range(i, 1, 100, 500, 1800)

            note = apply_overtones(freq, duration, factor)
            weights = get_adsr_weights(freq, duration, length=length,
                                       decay=decay, sustain_level=0.1)
            stars = np.concatenate((stars, note * weights))

        sq_frame, boxes = extract_border(frame_with_ring, 400, 10)
        for box in boxes:
            sort = []
            blink = is_hot(box, 10, 10, threshold)
            if blink:
                sort.append(blink)
        if len(sort) == 0:
            sort = [0]
        duration = 0.5 / (len(sort))

        for i in sort:
            if not i:
                freq = 20
            else:
                freq = map_range(i, 1, 100, 500, 1800)
            note = apply_overtones(freq, duration, factor)
            weights = get_adsr_weights(freq, duration, length=length,
                                       decay=decay, sustain_level=0.1)
            stars = np.concatenate((stars, note * weights))
            delay = 1000 // fps

        total_pixels = frame.shape[0] * frame.shape[1]
        blue_sum = np.sum(frame[:, :, 0])
        green_sum = np.sum(frame[:, :, 1])
        red_sum = np.sum(frame[:, :, 2])

        if len(sort) == 1 and sort[0] == 0:
            # Calculate the percentage of each channel
            b = (blue_sum / (total_pixels * 255)) * 100
            g = (green_sum / (total_pixels * 255)) * 100
            r = (red_sum / (total_pixels * 255)) * 100

            freq = map_range(r, 0, 12, 20, 80)
            factor = get_factor_from_file('temp_sound.wav', (0, 25000), freq)
            amplitude = map_range(r, 3, 12, 0, 4096)
            note = apply_overtones(freq, duration=1, factor=factor, amplitude=amplitude)
            for i in range(len(stars)):
                stars[i] += note[i]

        final = np.concatenate((final, stars))

        if cv.waitKey(delay) & 0xFF == ord('q'):
            break

    wavfile.write(output_sound, 44100, final.astype(np.int16))

    vid.release()
    cv.destroyAllWindows()



def merge_audio_video(video_file, audio_file, output_video):
    video_clip = VideoFileClip(video_file)
    audio_clip = AudioFileClip(audio_file)
    frame_rate = 30  # Desired output frame rate (1 FPS)
    frame_count = 0
    frames = []

    for frame in video_clip.iter_frames(fps=frame_rate):
        frames.append(frame)

    frame_clip = ImageSequenceClip(frames, fps=frame_rate)

    output_clip = frame_clip.set_audio(audio_clip)
    output_clip.write_videofile(output_video, codec='libx264', audio_codec='aac')

