import numpy as np

def values_in_ring(array, center_x, center_y, inner_radius, ring_width):
    # Create an empty list to store the selected values
    selected_values = []

    # Iterate through the array
    for x in range(array.shape[1]):
        for y in range(array.shape[0]):
            # Calculate the distance from the center
            distance = np.sqrt((x - center_x) ** 2 + (y - center_y) ** 2)

            # Check if the distance is within the ring
            if (
                distance >= inner_radius and
                distance <= inner_radius + ring_width and
                x >= center_x - inner_radius - ring_width // 2 and
                x <= center_x + inner_radius + ring_width // 2 and
                y >= center_y - inner_radius - ring_width // 2 and
                y <= center_y + inner_radius + ring_width // 2
            ):
                selected_values.append(array[y, x])
                array[y,x]= 0


    return selected_values,array

# Example 2D array (replace with your own data)
array = np.array([[100 for j in range(18)] for i in range(18)])


# Center coordinates and ring parameters
center_x, center_y = 8, 8  # Center of the circle
inner_radius = 4  # Inner radius of the ring
ring_width = 2  # Width of the ring

# Get the selected values within the ring
selected_values, array = values_in_ring(array, center_x, center_y, inner_radius, ring_width)

# Print the selected values
print(array.shape)
print(array)

print(selected_values)
