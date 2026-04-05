import os
import json

def sync_algorithms():
    # Paths relative to the scripts folder
    script_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.join(os.path.dirname(script_dir), 'data', 'algorithms', 'categories')
    output_file = os.path.join(os.path.dirname(script_dir), 'data', 'algorithms', 'data.js')

    if not os.path.exists(base_dir):
        print(f"Error: Category directory {base_dir} not found.")
        return

    code_data = []

    # Get all subdirectories (categories)
    folders = [f for f in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, f))]
    folders.sort()

    for folder in folders:
        folder_path = os.path.join(base_dir, folder)
        files_list = []
        
        # Get all .py files in the folder
        py_files = [f for f in os.listdir(folder_path) if f.endswith('.py')]
        py_files.sort()
        
        for py_file in py_files:
            file_path = os.path.join(folder_path, py_file)
            try:
                # Use errors='replace' to handle potential encoding issues
                with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
                    content = f.read()
                
                files_list.append({
                    "fileName": py_file,
                    "content": content
                })
            except Exception as e:
                print(f"Error reading {file_path}: {e}")
        
        if files_list:
            code_data.append({
                "folderName": folder,
                "files": files_list
            })

    # JSON 데이터로 저장
    try:
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("const codeData = ")
            json.dump(code_data, f, ensure_ascii=False, indent=2)
            f.write(";")
        print(f"Success: {output_file} updated ({len(code_data)} categories).")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    sync_algorithms()
