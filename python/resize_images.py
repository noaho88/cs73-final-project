from PIL import Image
import os

# Folder paths
image_folder = '/Users/noahorowitz/Desktop/cs73_final/finalproject/ceramic_vases_images'
output_folder = '/Users/noahorowitz/Desktop/cs73_final/finalproject/processed_ceramic_vases'

# Create the output folder if it doesn't exist
os.makedirs(output_folder, exist_ok=True)

# Resize settings
new_width = 300
new_height = 300

# Loop through all images in the folder
for image_name in os.listdir(image_folder):
    image_path = os.path.join(image_folder, image_name)
    
    # Skip if it's not a .jpg file
    if not image_name.lower().endswith('.jpg'):
        continue
    
    try:
        # Open the image
        with Image.open(image_path) as img:
            # Resize image
            img = img.resize((new_width, new_height))
            
            # Save resized image
            output_path = os.path.join(output_folder, image_name)
            img.save(output_path)
            print(f"Processed {image_name}")
    except Exception as e:
        print(f"Error processing {image_name}: {e}")
