from PIL import Image
from processing.utils import *
from scipy.io import wavfile
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
from mpl_toolkits.axes_grid1.inset_locator import zoomed_inset_axes, mark_inset


def plot_zoomed_area(image_path, x_start, x_end, y_start, y_end, zoom_factor=2, inset_loc=1):
    img = mpimg.imread(image_path)

    fig, ax = plt.subplots(figsize=(6, 6))
    ax.imshow(img, cmap='viridis')
    ax.set_title('Original Image')

    axins = zoomed_inset_axes(ax, zoom_factor, loc=inset_loc)

    # Calculate the extent for the zoomed-in area
    extent = [x_start, x_end, y_start, y_end]

    # Crop the zoomed-in area from the original image
    zoomed_area = img[y_start:y_end, x_start:x_end]

    axins.imshow(zoomed_area, cmap='viridis', extent=extent)

    # Mark the area in the original image corresponding to the inset
    mark_inset(ax, axins, loc1=2, loc2=4, fc="none", ec="white")

    # Set the font color to white for axis labels and number marks
    for label in axins.get_xticklabels() + axins.get_yticklabels():
        label.set_color('white')

    plt.show()


# plot_zoomed_area('your_image.png', 100, 105, 50, 55)


def surface(data):
    x = np.arange(data.shape[1])
    y = np.arange(data.shape[0])
    X, Y = np.meshgrid(x, y)

    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')
    ax.plot_surface(X, Y, data, cmap='viridis')
    ax.set_xlabel('X')
    ax.set_ylabel('Y')
    ax.set_zlabel('Z')
    plt.show()
def show(*args):
    nr = len(args)
    fig, ax = plt.subplots(nr)
    if nr>1:
        for i,j in zip(ax, args):
            i.imshow(j)
    else:
        ax.imshow(args[0])
    plt.show()

def compress(img, scale=0.1):
    x, y = img.size
    return img.resize((int(x * scale), int(y * scale)))


# image compress
img = Image.open('image.png')

# plot_zoomed_area('image.png', 740,750,385,395,25)
lum = img.convert('L')

red_scale_image = img.split()[1]
# red_scale_image = Image.merge('L', [red_scale_image])

img2 = compress(img)
img2 = img2.convert('L')# (128, 72)
show( img2)
img = np.array(img)
lum = np.array(lum)
img2 = np.array(img2)

for i in range(lum.shape[0]):
    for j in range(lum.shape[1]):
        if lum[i,j] > 240:
            pass
        else:
            lum[i,j] = 0
img2 = Image.fromarray(lum)
show(lum)


print(img.size)


slid = lum[:,0]
# plt.plot(slid)
# plt.show()
print(slid[0:2])
# surface(lum)



tones = get_piano_notes()
frequency = 110
base = get_sine_wave(frequency,1)
factor = [0.5,0.2,0.3]
note = apply_overtones(frequency,1,factor,)
weights = get_adsr_weights(frequency,1, length=[0.05, 0.25, 0.55, 0.15],
                           decay=[0.075,0.02,0.005,0.1], sustain_level=0.1)
data = note*weights
data = data*(4096/np.max(data)) # Adjusting the Amplitude
wavfile.write('../music_playground/imagetone.wav', 44100, data.astype(np.int16))









# [1,0,0,0,1,1,1,0,1,0,0,0,0,0,1,1,1,0,0,0,]























