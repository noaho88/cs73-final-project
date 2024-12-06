import os

# Path to your image folder
folder_path = "processed_ceramic_vases"

# Count image files
images = [file for file in os.listdir(folder_path) if file.endswith(('.jpg', '.png'))]
print(f"Number of images: {len(images)}")
