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

# Read existing l1toc.json file
with open("l1toc.json", "r", encoding="utf-8") as toc_file:
    l1toc_content = json.load(toc_file)
    print("Loaded existing l1toc.json file")

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

# Generate HTML files based on entries in l1toc.json
try:
    for i, item in enumerate(l1toc_content["categories"], 1):
        vartmp = item.get("name", "")
        print(f"Processing: {vartmp}")
        modified_content = content.replace("./example.docx", f"/docxView/{i}.docx")#f"https://diagmindtw.com/rawdocx/docxView/{vartmp}.docx")
        output_path = f"./sec/{i}.html"
        
        with open(output_path, "w", encoding="utf-8") as file:
            file.write(modified_content)
        
        print(f"Saved: {output_path} - {vartmp}")
    
except Exception as e:
    print(f"Error processing data: {e}")
