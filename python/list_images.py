import os
import random

# Path to the folder containing your images
image_folder = "/Users/noahorowitz/Desktop/cs73_final/finalproject/ceramic_vases_images"

# List all files in the folder
image_files = [f for f in os.listdir(image_folder) if f.endswith('.jpg')]

# Number of images to display (12 rows * 6 columns = 72 images)
num_images = 72

# Randomly select a specified number of images
selected_images = random.sample(image_files, num_images)

# Create the HTML for displaying the images in a grid
html_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Evolution of Vases</title>
    <link rel="stylesheet" href="styles.css">  <!-- Your CSS file -->
</head>
<body>
    <div class="image-gallery">
"""

# Add the image tags for the selected images
for image in selected_images:
    image_path = f"ceramic_vases_images/{image}"
    html_content += f'<img src="{image_path}" alt="Ceramic Vase" class="vase-image">'

# Close the gallery div and HTML structure
html_content += """
    </div>
</body>
</html>
"""

# Save the HTML content to a file
with open("index.html", "w") as file:
    file.write(html_content)

print("HTML file created with a 12x6 grid of images!")
