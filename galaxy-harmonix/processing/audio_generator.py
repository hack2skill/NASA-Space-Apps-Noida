import numpy as np
from processing.utils import *

def clone_freq_from_clip(audio_file, clip, output_file):
    sample_rate, middle_c = wavfile.read(audio_file)
    frequency = 20
    factor = get_factor_from_file(audio_file, clip, frequency)
    note = apply_overtones(frequency, duration=5.5, factor=factor)

    wavfile.write('god_help_me.wav', rate=44100, data=note.astype(np.int16))

    weights = get_adsr_weights(frequency, duration=5.5, length=[0.05, 0.25, 0.55, 0.15],
                               decay=[0.075, 0.02, 0.005, 0.1], sustain_level=0.1)

    data = note
    data = data * (4096 / np.max(data))
    wavfile.write(output_file, sample_rate, data.astype(np.int16))





