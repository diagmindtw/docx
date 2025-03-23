import os
import requests
import json
import time
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

# Ensure the output directory exists
os.makedirs("./sec", exist_ok=True)

# Read the master.html file
with open("master.html", "r", encoding="utf-8") as file:
    content = file.read()

# Configure retry strategy
retry_strategy = Retry(
    total=5,
    backoff_factor=1,
    status_forcelist=[429, 500, 502, 503, 504],
    allowed_methods=["GET"]
)

# Setup the session with the retry strategy
session = requests.Session()
session.mount("https://", HTTPAdapter(max_retries=retry_strategy))

# Fetch JSON data from the URL
try:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "application/json",
        "Referer": "https://diagmindtw.com/"
    }
    
    print("Attempting to fetch data from server...")
    response = session.get(
        "https://diagmindtw.com/48001.php/vitepressOUTPUT/left.json", 
        headers=headers, 
        timeout=30
    )
    response.raise_for_status()
    json_data = response.json()
    
    # Filter out items containing "籌備行政事項"
    filtered_items = [item for item in json_data if "籌備行政事項" not in item.get("text", "")]
    
    # Prepare l1toc.json content
    l1toc_content = {
        "categories": []
    }
    
    # Generate HTML files for filtered items
    for i, item in enumerate(filtered_items, 1):
        vartmp = item.get("text", "")
        print(f"Processing: {vartmp}")
        modified_content = content.replace("./example.docx", f"https://diagmindtw.com/rawdocx/docxView/{vartmp}.docx")
        output_path = f"./sec/{i}.html"
        
        with open(output_path, "w", encoding="utf-8") as file:
            file.write(modified_content)
        
        # Add entry to l1toc.json
        l1toc_content["categories"].append({
            "name": vartmp,
            "url": f"/sec/{i}.html"
        })
        
        print(f"Saved: {output_path} - {item.get('text', '')}")
    
    # Write l1toc.json file
    with open("l1toc.json", "w", encoding="utf-8") as toc_file:
        json.dump(l1toc_content, toc_file, ensure_ascii=False, indent=2)
    print("Generated l1toc.json file")
    
except requests.exceptions.RetryError:
    print("Error: Maximum retry attempts reached. The server might be blocking requests.")
except requests.exceptions.Timeout:
    print("Error: Request timed out. The server might be slow or blocking requests.")
except requests.exceptions.RequestException as e:
    print(f"Error fetching data on line {e.__traceback__.tb_lineno}: {e}")
except json.JSONDecodeError:
    print("Error: Invalid JSON data received")
