import os

# Ensure the output directory exists
os.makedirs("./sec", exist_ok=True)

# Read the master.html file
with open("master.html", "r", encoding="utf-8") as file:
    content = file.read()

# Replace and save for 1~6
for i in range(1, 7):
    modified_content = content.replace("./example.docx", f"/docxView/{i}.docx")
    output_path = f"./sec/{i}.html"
    
    with open(output_path, "w", encoding="utf-8") as file:
        file.write(modified_content)
    
    print(f"Saved: {output_path}")
