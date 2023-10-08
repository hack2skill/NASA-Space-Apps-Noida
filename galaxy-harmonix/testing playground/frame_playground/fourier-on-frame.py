import numpy as np
from PIL import Image
from scipy.io import wavfile
import matplotlib.pyplot as plt
# Open the image using PIL
input_image = Image.open('image.png')

# Convert the PIL image to grayscale
input_image = input_image.convert('L')

# Convert the PIL image to a NumPy array
frame = np.array(input_image)

# Define parameters
audio_sample_rate = 44100  # Audio sampling rate (e.g., CD quality)

# Perform Fourier transformation on the single frame
frame_fft = np.fft.fft2(frame)  # 2D Fourier transform

# Extract magnitude information (simplified, you can customize this)
magnitude = np.abs(frame_fft)

plt.imshow(np.log1p(magnitude), cmap='gray')  # Apply logarithmic scaling for better visualization
plt.colorbar()
plt.show()

# Convert magnitude to audio data (simplified, you may need to adjust)
audio_data = np.array(magnitude).astype(np.int16)  # Change data type to int16
print(audio_data.shape)
audio_data = audio_data.flatten()
plt.plot(audio_data)
plt.show()
# Create a WAV file using scipy.io.wavfile
wavfile.write('output_audio.wav', audio_sample_rate, audio_data)
