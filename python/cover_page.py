import matplotlib.pyplot as plt
from PIL import Image
import numpy as np

# Load the images you want to use for the background (e.g., a grid of your vase photos)
image_paths = ["vase1.jpg", "vase2.jpg", "vase3.jpg", "vase4.jpg", "vase5.jpg"]  # Add paths to your image files
images = [Image.open(img_path) for img_path in image_paths]

# Resize and arrange images in a grid-like structure (e.g., 2x3 grid)
resized_images = [img.resize((200, 200)) for img in images]
grid_image = np.vstack([np.hstack(resized_images[:3]), np.hstack(resized_images[3:])])

# Create the background collage
fig, ax = plt.subplots(figsize=(12, 8))
ax.imshow(grid_image)
ax.axis('off')  # Remove axes

# Overlay a semi-transparent white box for the text
from matplotlib.patches import Rectangle
rect = Rectangle((0.1, 0.1), 0.8, 0.3, linewidth=0, facecolor='white', alpha=0.5)
ax.add_patch(rect)

# Add the title and subtitle
plt.text(0.5, 0.75, 'Evolution of Vases over Time', color='black', fontsize=30, ha='center', va='center')
plt.text(0.5, 0.65, 'A study of 30,261 vases from the Met', color='black', fontsize=20, ha='center', va='center')

# Show the plot
plt.show()
