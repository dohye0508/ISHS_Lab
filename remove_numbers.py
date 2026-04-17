import json
import re

def remove_numbers_3221m():
    filepath = 'data/english/english_3221m.js'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract the list content
    match = re.search(r'const english_3221m = \[(.*)\];', content, re.DOTALL)
    if not match:
        print("Regex failed to find array")
        return

    # I'll just load it as JSON if possible, but JS might have trailing commas etc.
    # So I'll just use regex replacement within the file
    
    # Pattern to find "en": "X. Text"
    # Handling both single and double quotes just in case
    new_content = re.sub(r'("en":\s*")\d+\.\s*', r'\1', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Removed numbers from {filepath}.")

remove_numbers_3221m()
