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

    total_cpp = 0
    total_py = 0

    for folder in folders:
        folder_path = os.path.join(base_dir, folder)
        entries = os.listdir(folder_path)

        # Group by base name (without extension) so a "<name>.py" and a matching
        # "<name>.cpp" become ONE file entry with both languages, rather than two
        # separate sidebar rows -- the folder layout itself is untouched, this only
        # changes how sibling files with the same base name are bundled together.
        base_names = sorted(set(
            os.path.splitext(e)[0] for e in entries
            if e.endswith('.py') or e.endswith('.cpp')
        ))

        files_list = []
        for base_name in base_names:
            py_path = os.path.join(folder_path, base_name + '.py')
            cpp_path = os.path.join(folder_path, base_name + '.cpp')

            file_entry = {"fileName": base_name}

            if os.path.exists(py_path):
                try:
                    with open(py_path, 'r', encoding='utf-8', errors='replace') as f:
                        file_entry["python"] = f.read()
                    total_py += 1
                except Exception as e:
                    print(f"Error reading {py_path}: {e}")

            if os.path.exists(cpp_path):
                try:
                    with open(cpp_path, 'r', encoding='utf-8', errors='replace') as f:
                        file_entry["cpp"] = f.read()
                    total_cpp += 1
                except Exception as e:
                    print(f"Error reading {cpp_path}: {e}")

            if "python" in file_entry or "cpp" in file_entry:
                files_list.append(file_entry)

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
        print(f"Success: {output_file} updated ({len(code_data)} categories, {total_py} python files, {total_cpp} cpp files).")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    sync_algorithms()
