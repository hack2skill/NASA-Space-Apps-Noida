##### I AM GOING TO COMPLETE THIS PROJECT  TO ITS FUCKING-END !!!!!
import matplotlib.pyplot as plt

from scipy.io import wavfile
import numpy as np
plt.style.use('seaborn-dark')

def get_piano_notes():
    octave = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B']
    base_freq = 440  # frequency of A4
    keys = np.array([x + str(y) for y in range(0, 9) for x in octave])
    # TRIM TO STANDARD 88 Keys
    start = np.where(keys == 'A0')[0][0]
    end = np.where(keys == 'C8')[0][0]
    keys = keys[start: end + 1]
    notes_freq = dict(zip(keys, [2 ** ((n + 1 - 49) / 12) * base_freq for n in range(len(keys))]))
    notes_freq[''] = 0
    return notes_freq


def get_sine_wave(frequency, duration, sample_rate=44100, amplitude=4096):
    t = np.linspace(0, duration, int(sample_rate * duration))
    wave = amplitude * np.sin(2 * np.pi * frequency * t)  # a * sin(2π.f.t)
    return wave


notes_freq = get_piano_notes()
frequency = notes_freq['A4']

# sine_wave = get_sine_wave(frequency, 10)
# wavfile.write('c4_tone.wav',rate=44100, data=sine_wave.astype(np.int16))
#

plt.grid()
plt.legend()
sample_rate, middle_c = wavfile.read('space.wav')
# middle_c = get_sine_wave(440,0.1)
plt.plot(middle_c)
plt.show()
# middle_c = middle_c[400000: 1200000,0]
# print(middle_c))
plt.plot(middle_c)
plt.grid()
plt.legend()
plt.show()

print(len(middle_c))

print(middle_c.shape)
t = np.arange(middle_c.shape[0])
freq = np.fft.fftfreq(t.shape[-1]) * sample_rate
sp = np.fft.fft(middle_c)
print(sp)

plt.plot(freq, abs(sp.real))
# plt.plot(middle_c)
plt.xlim((0, 2000))
plt.grid()
plt.legend()
plt.show()

idx = np.where(freq > 0)[0]
freq = freq[idx]
sp = sp[idx]

sort = np.argsort(-abs(sp.real))[:100]
dom_freq = freq[sort]

frequency = 20
freq_ratio = np.round(dom_freq / frequency)

unique_freq_ratio = np.unique(freq_ratio)
print(unique_freq_ratio)
amp_ratio = abs(sp.real[sort] / np.sum(sp.real[sort]))
factor = np.zeros(int(unique_freq_ratio[-1]), )

for i in range(factor.shape[0]):
    idx = np.where(freq_ratio == i + 1)[0]
    factor[i] = np.sum(amp_ratio[idx])
factor = factor / np.sum(factor)
# factor = np.array([0.2,0.2,0.2,0.2,0.2])

# print('factor',factor[:10])


def apply_overtones(frequency, duration, factor, sample_rate=44100, amplitude=7096):
    assert abs(1 - sum(factor)) < 1e-8
    frequencies = np.minimum(np.array([frequency * (x + 1) for x in range(len(factor))]), sample_rate)
    amplitudes = np.array([(amplitude * x) for x in factor])

    fundamental = get_sine_wave(frequencies[0], duration, sample_rate, amplitudes[0])
    for i in range(1, len(factor)):
        overtone = get_sine_wave(frequencies[i], duration, sample_rate, amplitudes[i])
        fundamental += overtone
    return fundamental


def get_adsr_weights(frequency, duration, length, decay, sustain_level, sample_rate=44100):
    assert abs(sum(length) - 1) < 1e-8
    assert len(length) == len(decay) == 4

    intervals = int(duration * frequency)
    len_A = np.maximum(int(intervals * length[0]), 1)
    len_D = np.maximum(int(intervals * length[1]), 1)
    len_S = np.maximum(int(intervals * length[1]), 1)
    len_R = np.maximum(int(intervals * length[1]), 1)

    decay_A, decay_D, decay_S, decay_R = decay

    A = 1/np.array([(1-decay_A)**n for n in range(len_A)])
    A = A/np.nanmax(A)
    D = np.array([(1-decay_D)**n for n in range(len_D)])
    D = D*(1-sustain_level)+sustain_level
    S = np.array([(1-decay_S)**n for n in range(len_S)])
    S = S*sustain_level
    R = np.array([(1-decay_R)**n for n in range(len_R)])
    R = R*S[-1]

    weights = np.concatenate((A, D, S, R))
    smoothing = np.array([1.0 * (1 - 0.1) ** n for n in range(5)])
    weights = np.convolve(weights, smoothing, mode='same')

    weights = np.repeat(weights, int(sample_rate * duration / intervals))
    tail = int(sample_rate * duration - weights.shape[0])
    if tail > 0:
        weights = np.concatenate((weights, weights[-1]/tail*np.arange(tail)))
    return weights


print(factor)

note = apply_overtones(frequency, duration=5.5, factor=factor)
plt.plot(note[:1000])
plt.show()
wavfile.write('god_help_me.wav', rate=44100, data=note.astype(np.int16))

weights = get_adsr_weights(frequency, duration=5.5, length=[0.05,0.25,0.55,0.15],
                           decay=[0.075, 0.02,0.005,0.1], sustain_level=0.1)

# data = note*weights
data = note
data = data*(4096/np.max(data))
wavfile.write('synthetic_c.wav', sample_rate, data.astype(np.int16))
