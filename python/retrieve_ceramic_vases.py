import requests
import json
import os
import time
from tqdm import tqdm

# Define API endpoints
search_endpoint = "https://collectionapi.metmuseum.org/public/collection/v1/search"
object_endpoint = "https://collectionapi.metmuseum.org/public/collection/v1/objects/"

# Create output directory for vase images
os.makedirs("ceramic_vases_images", exist_ok=True)

# Step 1: Search for ceramic vases
print("Searching for ceramic vases...")
params = {
    "classification": "Ceramics",
    "q": "vase"
}
response = requests.get(search_endpoint, params=params)
data = response.json()

# Get list of object IDs
object_ids = data.get("objectIDs", [])  # Retrieve all IDs
print(f"Found {len(object_ids)} ceramic vases.")

# Step 2: Retrieve object details and download images
ceramic_vases_metadata = []
for object_id in tqdm(object_ids, total=len(object_ids)):
    # Skip if the image has already been downloaded
    """
    image_filename = f"ceramic_vases_images/{object_id}.jpg"
    if os.path.exists(image_filename):
        print(f"Skipping already downloaded vase: {object_id}")
        continue
    """

    failed = True
    count = 1
    while failed:
        # Fetch object details from the API
        object_response = requests.get(f"{object_endpoint}{object_id}")    
        object_data = object_response.json()
        if object_response.status_code == 200 or object_response.status_code == 404:
            failed = False
        else:
            print(f"Failed {count}")
            print(object_response.status_code)
            time.sleep(5)
            count += 1

    # Check if the object is public domain and has an image
    if object_data.get("isPublicDomain") and object_data.get("primaryImage"):
        ceramic_vases_metadata.append({
            "title": object_data.get("title"),
            "artist": object_data.get("artistDisplayName"),
            "date": object_data.get("objectDate"),
            "culture": object_data.get("culture"),
            "medium": object_data.get("medium"),
            "image_url": object_data.get("primaryImage"),
            "id": object_id
        })

        # Download and save the image
        image_url = object_data.get("primaryImage")
        #image_response = requests.get(image_url)
        #with open(image_filename, "wb") as file:
            #file.write(image_response.content)
        #print(f"Downloaded image for vase: {object_data.get('title')}")

# Step 3: Save metadata to a JSON file
with open("ceramic_vases_metadata_2.json", "w") as metadata_file:
    json.dump(ceramic_vases_metadata, metadata_file, indent=4)

print("Metadata saved to ceramic_vases_metadata.json")
