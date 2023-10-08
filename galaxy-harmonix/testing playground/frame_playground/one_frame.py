from processing.utils import *
import numpy as np
from PIL import Image
from scipy.io import wavfile


def get_channels(img):
    luminance = img.convert('L')
    r, g, b = img.split()
    return luminance, r, g, b

# image compress
img = Image.open('image.png')
# img = compress(img,0.1)
lum,r,g,b = get_channels(img)
lum = np.array(lum)
r = np.array(r)
g = np.array(g)
b = np.array(b)

final = get_sine_wave(100,0.1)

for i in range(0,lum.shape[1], 10):
    sort = []
    for j in range(0, lum.shape[0], 10):
        block = lum[j:j+10, i:i+10]
        blink = is_hot(block, 10, 10, 248)
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

        final = np.concatenate((final,note*weights))

    # final = final + note*weights
print(len(final)/44100)
wavfile.write('imgseq.wav', 44100, final.astype(np.int16))
