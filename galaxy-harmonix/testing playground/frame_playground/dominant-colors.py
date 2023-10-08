import cv2
import numpy as np

# Load the image
image = cv2.imread('image.png')

# Convert the image to grayscale
gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Apply thresholding
_, thresholded = cv2.threshold(gray_image, 230, 255, cv2.THRESH_BINARY)

# Apply morphological operations
kernel = np.ones((5, 5), np.uint8)
erosion = cv2.erode(thresholded, kernel, iterations=1)
dilation = cv2.dilate(erosion, kernel, iterations=1)

# Find contours
contours, _ = cv2.findContours(dilation, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
print(contours)
# Filter contours based on area (adjust min_area and max_area as needed)
min_area = 10  # Minimum contour area to consider as a star
max_area = 100  # Maximum contour area to consider as a star

stars = []
for contour in contours:
    area = cv2.contourArea(contour)
    if min_area <= area <= max_area:
        stars.append(contour)

# Draw the detected stars on the original image (optional)
result_image = image.copy()
cv2.drawContours(result_image, stars, -1, (0, 255, 0), 2)
print(stars)
# Save or display the result
cv2.imwrite('output_image.jpg', result_image)
cv2.imshow('Detected Stars', result_image)
cv2.waitKey(0)
cv2.destroyAllWindows()


