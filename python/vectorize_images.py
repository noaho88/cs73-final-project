from transformers import AutoImageProcessor, AutoModel
from PIL import Image
import torch
import os
import pandas as pd
from tqdm import tqdm

# Initialize the model and processor
processor = AutoImageProcessor.from_pretrained('facebook/dinov2-small')
model = AutoModel.from_pretrained('facebook/dinov2-small')

def vectorize_images(directory_path, batch_size=16):
    """
    Vectorizes all images in the specified directory using batch processing.

    Args:
        directory_path (str): Path to the directory containing images.
        batch_size (int): Number of images to process in a batch.

    Returns:
        pd.DataFrame: A DataFrame with file names and corresponding vectors.
    """
    image_vectors = []
    image_paths = []
    images = []

    # Gather all image paths
    for root, _, files in os.walk(directory_path):
        for file in files:
            file_path = os.path.join(root, file)
            try:
                # Open the image and convert to RGB
                image = Image.open(file_path).convert("RGB")
                image_paths.append(file_path)
                images.append(image)
            except Exception as e:
                print(f"Error loading {file_path}: {e}")

    # Process images in batches with tqdm progress bar
    for i in tqdm(range(0, len(images), batch_size), desc="Processing batches"):
        batch_images = images[i:i + batch_size]
        batch_paths = image_paths[i:i + batch_size]
        try:
            # Process the batch of images
            inputs = processor(images=batch_images, return_tensors="pt", padding=True)
            outputs = model(**inputs)
            last_hidden_states = outputs.last_hidden_state

            # Pool vectors and store them with their file paths
            for j, path in enumerate(batch_paths):
                pooled_vector = torch.mean(last_hidden_states[j], dim=0).detach().numpy()
                image_vectors.append((path, pooled_vector))
        except Exception as e:
            print(f"Error processing batch {i} to {i + batch_size}: {e}")

    # Create a DataFrame from the vectors
    df = pd.DataFrame(image_vectors, columns=["file_name", "vector"])
    
    return df

# Specify the directory path containing images
directory_path = "selected_ceramic_vases"

# Vectorize the images in batches
image_vectors_df = vectorize_images(directory_path, batch_size=16)

# Save the results or use them as needed
print(f"Processed {len(image_vectors_df)} images.")

# Optionally save the DataFrame to a CSV or pickle file
image_vectors_df.to_csv("image_vectors.csv")
