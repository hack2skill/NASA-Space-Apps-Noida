import cv2
import numpy as np
from moviepy.editor import VideoFileClip, AudioFileClip
from moviepy.video.io.ffmpeg_tools import ffmpeg_extract_audio
from moviepy.editor import VideoFileClip, AudioFileClip, clips_array
# Input image file path
image_path = 'image.png'

# Output video file path
output_path = 'output_video.mp4'

# Load the input image
image = cv2.imread(image_path)

# Get the height and width of the image
height, width, _ = image.shape

# Define the video codec and create a VideoWriter object
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
fps = 2  # Frames per second (1 frame per second for a 1-pixel movement)
output_video = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

# Initialize the position of the white slider
slider_position = 0

# Total duration of the video in seconds
duration = width//10  # Video width = 1 pixel per second
print(duration)
step_size = 10
for _ in range(duration):
    # Create a frame by copying the input image
    frame = np.copy(image)
    # Draw a white slider at the current position
    cv2.rectangle(frame, (slider_position, 0), (slider_position + step_size
                                                , height), (255, 255, 255), -1)
    # Write the frame to the output video
    output_video.write(frame)
    # Increment the slider position by 1 pixel per second
    slider_position += step_size
# Release the video writer
output_video.release()

print("Video created successfully!")

# Load the WAV audio file
audio_path = 'imgseq.wav'
audio = AudioFileClip(audio_path)

# Add audio to the video using moviepy
video = VideoFileClip(output_path)
video = video.set_audio(audio)

# Save the final video with audio
video.write_videofile('new.mp4')

# Remove the temporary audio file extracted by moviepy

