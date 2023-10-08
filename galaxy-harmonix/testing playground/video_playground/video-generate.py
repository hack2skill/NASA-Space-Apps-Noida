import cv2
from moviepy.editor import VideoFileClip, ImageSequenceClip
from moviepy.audio.io.AudioFileClip import AudioFileClip

# Input video file and audio file
video_path = 'video.mp4'  # Replace with your input video file
audio_path = 'imgseq.wav'   # Replace with your input audio file
output_video_path = 'output_video.mp4'

video_clip = VideoFileClip(video_path)

audio_clip = AudioFileClip(audio_path)

frame_rate = 30  # Desired output frame rate (1 FPS)
frame_count = 0
frames = []

for frame in video_clip.iter_frames(fps=frame_rate):
    frames.append(frame)

frame_clip = ImageSequenceClip(frames, fps=frame_rate)

output_clip = frame_clip.set_audio(audio_clip)

output_clip.write_videofile(output_video_path, codec='libx264', audio_codec='aac')
