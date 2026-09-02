import os
import re

base_dir = r"c:\Users\User\Downloads\ISHS_Lab\data\algorithms\categories"

difficulty_map = {
    # 그래프
    "BFS_최단거리": "실버 I",
    "DFS_연결요소": "실버 II",
    "MCMF": "플래티넘 III",
    "SCC": "플래티넘 V",
    "격자탐색": "실버 I",
    "위상정렬": "골드 III",
    "이분_매칭": "플래티넘 IV",
    "크루스칼": "골드 IV",
    
    # 그리디
    "분할가능배낭문제": "실버 III",
    "허프만코딩": "골드 IV",
    "회의실배정": "실버 I",
    
    # 기하학
    "CCW": "골드 V",
    "다각형_넓이": "골드 V",
    "볼록껍질": "플래티넘 V",
    "선분교차": "골드 III",
    
    # 누적 합
    "1차원누적합": "실버 III",
    "2차원누적합": "실버 I",
    
    # 동적 계획법
    "0_1배낭문제": "골드 V",
    "LCS": "골드 V",
    "LIS": "실버 II",
    "LIS_NlogN": "골드 II",
    "RGB거리": "실버 I",
    "가장큰정사각형": "골드 IV",
    "격자경로": "실버 II",
    "계단오르기": "실버 III",
    "내리막길": "골드 III",
    "다중배낭문제": "골드 IV",
    "돌놓기": "골드 V",
    "동전교환": "골드 V",
    "무한배낭문제": "골드 V",
    "바이토닉수열": "골드 IV",
    "비트마스킹DP": "골드 I",
    "연속합": "실버 II",
    "자릿수DP": "골드 I",
    "타일링": "실버 III",
    "트리DP": "골드 III",
    "팰린드롬DP": "골드 IV",
    "편집거리": "골드 III",
    "포도주시식": "실버 I",
    "행렬곱셈순서": "골드 III",
    
    # 문자열 & 문자열_매칭
    "KMP_문자열매칭": "골드 I",
    "Trie": "골드 V",
    "KMP": "골드 I",
    "트라이": "골드 V",
    
    # 백트래킹
    "N_Queen": "골드 IV",
    "부분집합_합": "실버 II",
    "순열": "실버 III",
    
    # 분할 정복
    "행렬_거듭제곱": "골드 IV",
    
    # 비트마스킹
    "비트마스크_기초": "실버 V",
    
    # 수학
    "에라토스테네스의체": "실버 III",
    "유클리드호제법": "브론즈 I",
    
    # 이분 탐색
    "Lower_Upper_Bound": "실버 II",
    "매개_변수_탐색": "실버 II",
    "이진탐색": "실버 II",
    "파라메트릭서치": "실버 II",
    
    # 자료구조
    "괄호검사": "실버 IV",
    "세그먼트_트리": "골드 I",
    "세그먼트_트리_Lazy": "플래티넘 IV",
    "유니온파인드": "골드 IV",
    "펜윅_트리": "골드 I",
    
    # 정렬
    "병합_정렬": "실버 V",
    
    # 최단 경로
    "다익스트라": "골드 V",
    "벨만포드": "골드 IV",
    "플로이드워셜": "골드 IV",
    
    # 투 포인터
    "투포인터": "실버 III",
    
    # 트리
    "LCA": "골드 III",
    "트리_순회": "실버 I",
    "트리의_지름": "골드 IV"
}

def get_required_headers(code):
    headers = []
    
    if any(re.search(rf"\b{kw}\b", code) for kw in ["cin", "cout", "ios_base", "endl"]):
        headers.append("iostream")
        
    if re.search(r"\bvector\b", code):
        headers.append("vector")
        
    if re.search(r"\bstring\b", code):
        headers.append("string")
        
    algo_keywords = ["sort", "min", "max", "reverse", "fill", "binary_search", 
                     "lower_bound", "upper_bound", "next_permutation", "prev_permutation",
                     "swap", "unique"]
    if any(re.search(rf"\b{kw}\b", code) for kw in algo_keywords):
        headers.append("algorithm")
        
    if re.search(r"\bqueue\b|\bpriority_queue\b", code):
        headers.append("queue")
        
    if re.search(r"\bstack\b", code):
        headers.append("stack")
        
    math_keywords = ["sqrt", "pow", "abs", "sin", "cos", "tan", "log", "exp", "floor", "ceil", "round"]
    if any(re.search(rf"\b{kw}\b", code) for kw in math_keywords):
        headers.append("cmath")
        
    limit_keywords = ["INT_MAX", "INT_MIN", "LLONG_MAX", "LLONG_MIN", "CHAR_BIT"]
    if any(re.search(rf"\b{kw}\b", code) for kw in limit_keywords):
        headers.append("climits")
        
    string_funcs = ["memset", "memcpy", "strlen", "strcpy"]
    if any(re.search(rf"\b{kw}\b", code) for kw in string_funcs):
        headers.append("cstring")
        
    numeric_keywords = ["iota", "accumulate", "gcd", "lcm", "inner_product", "partial_sum"]
    if any(re.search(rf"\b{kw}\b", code) for kw in numeric_keywords):
        headers.append("numeric")
        
    if re.search(r"\bmap\b|unordered_map", code):
        headers.append("map")
        
    if re.search(r"\bset\b|unordered_set", code):
        headers.append("set")
        
    if any(re.search(rf"\b{kw}\b", code) for kw in ["tuple", "make_tuple", "get"]):
        headers.append("tuple")

    if not headers:
        headers = ["iostream"]
        
    return "\n".join(f"#include <{h}>" for h in headers)

def update_docstring(docstring, tier):
    lines = docstring.split('\n')
    
    has_tag = False
    for i, line in enumerate(lines):
        if "백준 난이도" in line or "백준난이도" in line:
            lines[i] = f"- 백준 난이도: {tier}"
            has_tag = True
            break
            
    if not has_tag:
        if len(lines) > 0:
            lines.insert(1, f"- 백준 난이도: {tier}")
        else:
            lines = [f"- 백준 난이도: {tier}"]
            
    return '\n'.join(lines)

def process_file(path, file_name, tier):
    ext = os.path.splitext(file_name)[1]
    
    with open(path, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
    
    content = content.lstrip('\ufeff')
        
    docstring = ""
    rest_code = content
    match_found = False
    
    if ext == '.py':
        match = re.match(r"^(\s*)(['\"]{3})([\s\S]*?)\2(\s*)", content)
        if match:
            indent = match.group(1)
            quotes = match.group(2)
            docstring = match.group(3).strip()
            rest_code = content[match.end():]
            match_found = True
    elif ext == '.cpp':
        match = re.match(r"^(\s*)/\*([\s\S]*?)\*/(\s*)", content)
        if match:
            docstring = match.group(2).strip()
            rest_code = content[match.end():]
            match_found = True
            
    if match_found:
        updated_doc = update_docstring(docstring, tier)
        
        if ext == '.py':
            new_content = f"{indent}{quotes}\n{updated_doc}\n{quotes}\n{rest_code.lstrip()}"
        else:
            cpp_code = rest_code.lstrip()
            
            # Find and clean all #include lines
            include_pattern = re.compile(r"^#include\s*<[^>]+>\s*", re.MULTILINE)
            cleaned_code, num_subs = include_pattern.subn("", cpp_code)
            
            # Dynamically determine required headers
            required_headers = get_required_headers(cleaned_code)
            
            new_content = f"/*\n{updated_doc}\n*/\n\n{required_headers}\n\n{cleaned_code.lstrip()}"
            
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file_name}")
    else:
        print(f"Warning: No docstring found in {file_name}")

modified_files = []

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.py') or file.endswith('.cpp'):
            base_name = os.path.splitext(file)[0]
            if base_name in difficulty_map:
                tier = difficulty_map[base_name]
                path = os.path.join(root, file)
                process_file(path, file, tier)
                modified_files.append(os.path.relpath(path, os.path.dirname(base_dir)))
            else:
                print(f"Warning: No difficulty mapping for {file}")

print(f"\nSuccessfully processed {len(modified_files)} files.")
