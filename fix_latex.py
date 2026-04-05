import os
import re
import json

def get_base_path():
    return os.path.dirname(os.path.abspath(__file__))

def to_latex(s):
    # 1. Powers: ^(foo) -> ^{foo}
    s = re.sub(r'\^\(([^()]+)\)', r'^{\1}', s)
    
    # 2. Fractions
    # (a)/(b) -> \frac{a}{b}
    s = re.sub(r'\(([^()]+)\)/\(([^()]+)\)', r'\\frac{\1}{\2}', s)
    
    # a/(b) -> \frac{a}{b}
    s = re.sub(r'([-\w\^]+)/\(([^()]+)\)', r'\\frac{\1}{\2}', s)
    
    # (a)/b -> \frac{a}{b}
    s = re.sub(r'\(([^()]+)\)/([-\w\^]+)', r'\\frac{\1}{\2}', s)
    
    # a/b -> \frac{a}{b}
    s = re.sub(r'([-\w]+)/([-\w]+)', r'\\frac{\1}{\2}', s)

    # 3. Clean up negative fractions
    # \frac{-a}{b} -> -\frac{a}{b}
    s = re.sub(r'\\frac\{-([^{}]*)\}', r'-\\frac{\1}', s)
    s = s.replace('--', '') # if there was already a minus
    
    # Remove parens around a lone fraction at the start or after a sign
    # e.g., (-\frac{1}{2}) -> -\frac{1}{2}
    s = re.sub(r'^\(-\\frac{([^{}]+)}{([^{}]+)}\)', r'-\\frac{\1}{\2}', s)
    s = re.sub(r'^\(\\frac{([^{}]+)}{([^{}]+)}\)', r'\\frac{\1}{\2}', s)

    # 4. Math functions
    s = re.sub(r'sqrt\((.*?)\)', r'\\sqrt{\1}', s)
    
    for func in ['sin', 'cos', 'tan', 'csc', 'sec', 'cot', 'ln', 'arctan', 'arcsin', 'arccos']:
        s = re.sub(rf'\b{func}\b', rf'\\{func}', s)
        
    return s

def parse_levels(filename):
    try:
        with open(filename, 'r', encoding='utf-8-sig') as f:
            lines = f.readlines()
    except:
        with open(filename, 'r', encoding='cp949') as f:
            lines = f.readlines()

    levels = {1: [], 2: [], 3: [], 4: [], 5: []}
    current_level = 0

    for line in lines:
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        
        level_match = re.match(r"<Level\s+(\d+)>", line)
        if level_match:
            current_level = int(level_match.group(1))
            continue

        if current_level > 0:
            parts = line.split('||')
            if len(parts) >= 2:
                raw_latex = parts[0].strip()
                raw_solution = parts[1].strip()
                levels[current_level].append({
                    "raw_latex": raw_latex,
                    "latex": to_latex(raw_latex),
                    "solution": to_latex(raw_solution),
                    "original_solution": raw_solution  
                })
    return levels

def generate_collections(levels_data):
    total_problems = sum(len(p) for p in levels_data.values())
    target_size = 20
    num_collections = max(1, round(total_problems / target_size))
    buckets = [[] for _ in range(num_collections)]
    
    for lv in range(1, 6):
        probs = levels_data.get(lv, [])
        for i, p in enumerate(probs):
            buckets[i % num_collections].append({**p, 'level': lv})
            
    collections = []
    for i, bucket in enumerate(buckets):
        bucket.sort(key=lambda x: x['level'])
        collections.append({
            "id": f"col{i+1}",
            "name": f"Collection {i+1}",
            "problems": bucket
        })
        
    return collections

def write_js(collections, filename):
    js_content = "window.generatedCollections = [\n"
    for col in collections:
        js_content += '    {\n'
        js_content += f'        id: "{col["id"]}",\n'
        js_content += f'        name: "{col["name"]}",\n'
        js_content += '        problems: [\n'
        for p in col['problems']:
            l = p['latex'].replace('\\', '\\\\').replace('"', '\\"')
            s = p['solution'].replace('\\', '\\\\').replace('"', '\\"')
            js_content += f'            {{ level: {p["level"]}, latex: "{l}", solution: "{s}" }},\n'
        js_content += '        ]\n'
        js_content += '    },\n'
    js_content += '];\n'

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f"Generated {filename} with robust LaTeX formatting.")

if __name__ == "__main__":
    app_path = get_base_path()
    input_file = os.path.join(app_path, "problems", "levels.txt")
    output_file = os.path.join(app_path, "problems", "collections.js")
    
    levels_data = parse_levels(input_file)
    cols = generate_collections(levels_data)
    write_js(cols, output_file)
