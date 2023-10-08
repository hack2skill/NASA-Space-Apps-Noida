# Provides a Demo to how to use our package

from processing import video_generator

#  File to be processed
file_name = 'video.mp4'

# Generate the audio of the video file
video_generator.generate_sound_of_video('video.mp4', 'sound.wav')
video_generator.merge_audio_video('video.mp4', 'sound.wav', 'output_video.mp4')

# the produced video will be saved as output_video.mp4 file
