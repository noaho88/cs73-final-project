import os
import json
import shutil
from collections import Counter
from math import floor
import re

# File paths
metadata_file = "ceramic_vases_metadata_2.json"
source_folder = "processed_ceramic_vases"
output_folder = "selected_ceramic_vases"
total_photos = 1000  # Total number of photos to select

# Step 1: Load metadata
with open(metadata_file, 'r') as file:
    metadata = json.load(file)

# Step 2: Parse century from the "date" field
def extract_century(date_str):
    match = re.search(r'(\d+)(st|nd|rd|th) century (BCE|CE)', date_str)
    if match:
        century = int(match.group(1))
        era = match.group(3)
        return f"{century} {era}"  # e.g., "6 BCE" or "3 CE"
    return "Unknown"

# Add a "century" field to each metadata entry
for item in metadata:
    item['century'] = extract_century(item['date'])

# Filter out items with "Unknown" century
metadata = [item for item in metadata if item['century'] != "Unknown"]

# Step 3: Calculate proportional distribution
century_counts = Counter([item['century'] for item in metadata])
total_count = sum(century_counts.values())

# Calculate number of photos to select per century
proportional_distribution = {
    century: floor((count / total_count) * total_photos)
    for century, count in century_counts.items()
}

# Ensure total adds up to exactly 1,000 due to rounding adjustments
allocated_photos = sum(proportional_distribution.values())
remaining_photos = total_photos - allocated_photos

# Add remaining photos to the largest categories
sorted_centuries = sorted(century_counts.keys(), key=lambda c: century_counts[c], reverse=True)
for century in sorted_centuries:
    if remaining_photos <= 0:
        break
    proportional_distribution[century] += 1
    remaining_photos -= 1

# Step 4: Select photos
selected_photos = []
for century, num_photos in proportional_distribution.items():
    # Filter metadata for this century
    century_photos = [item for item in metadata if item['century'] == century]
    selected_photos.extend(century_photos[:num_photos])

# Step 5: Copy selected photos to output folder
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

for photo in selected_photos:
    src_path = os.path.join(source_folder, f"{photo['id']}.jpg")  # Assumes filenames match URLs
    dest_path = os.path.join(output_folder, f"{photo['id']}.jpg")
    if os.path.exists(src_path):  # Ensure the file exists before copying
        shutil.copy(src_path, dest_path)

num_photos_dest = len(os.listdir(output_folder))
print(f"Moved {num_photos_dest} photos to the destination.")
