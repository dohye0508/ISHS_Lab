import json
import codecs
import random
import sympy as sp

random.seed(2026)

algebra_raw = []

t_sym = sp.symbols('t')


def mat_latex(M):
    rows = []
    for i in range(M.rows):
        rows.append(' & '.join(sp.latex(sp.nsimplify(M[i, j])) for j in range(M.cols)))
    return r'\begin{pmatrix}' + r'\\'.join(rows) + r'\end{pmatrix}'


def vec_latex(entries):
    return r'\begin{pmatrix}' + r'\\'.join(sp.latex(sp.nsimplify(e)) for e in entries) + r'\end{pmatrix}'


def unimodular_matrix(n, ops):
    """Integer matrix with det = +-1, built from elementary row ops on I.
    Guarantees an integer inverse (no ugly fractions)."""
    while True:
        M = sp.eye(n)
        for _ in range(ops):
            kind = random.choice(['add', 'add', 'swap', 'negate'])
            if kind == 'add':
                i, j = random.sample(range(n), 2)
                c = random.choice([x for x in range(-3, 4) if x != 0])
                M[i, :] = M[i, :] + c * M[j, :]
            elif kind == 'swap':
                i, j = random.sample(range(n), 2)
                M.row_swap(i, j)
            else:
                i = random.randrange(n)
                M[i, :] = -M[i, :]
        zero_count = sum(1 for v in M if v == 0)
        max_abs = max(abs(v) for v in M)
        if zero_count <= (1 if n == 2 else 2) and max_abs <= 9:
            return M


def singular_matrix(n):
    """Integer matrix guaranteed det = 0, via a genuine (non-trivial) linear
    dependency between rows -- not just an all-zero row, which would be too
    easy to spot by inspection."""
    while True:
        if n == 2:
            base = sp.Matrix(1, 2, lambda i, j: random.randint(-4, 5))
            c = random.choice([x for x in range(-3, 4) if x not in (0, 1, -1)])
            M = sp.Matrix.vstack(base, c * base)
        else:
            base = sp.Matrix(2, 3, lambda i, j: random.randint(-4, 5))
            c1 = random.choice([x for x in range(-2, 3) if x != 0])
            c2 = random.choice([x for x in range(-2, 3) if x != 0])
            dep_row = c1 * base.row(0) + c2 * base.row(1)
            M = sp.Matrix.vstack(base, dep_row)
            perm = list(range(3))
            random.shuffle(perm)
            M = M[perm, :]
        if all(abs(v) <= 12 for v in M) and sum(1 for v in M if v == 0) <= 2:
            return M


def rand_invertible_int_matrix(n, low=-4, high=5):
    while True:
        M = sp.Matrix(n, n, lambda i, j: random.randint(low, high))
        zero_count = sum(1 for v in M if v == 0)
        if M.det() != 0 and zero_count <= 1:
            return M


VAR_NAMES = [sp.symbols('x'), sp.symbols('y'), sp.symbols('z')]


def system_latex(A, b):
    lines = []
    n = A.rows
    for i in range(n):
        expr = sum(A[i, j] * VAR_NAMES[j] for j in range(n))
        lines.append(f'{sp.latex(expr)} = {sp.latex(b[i])}')
    return r'\begin{cases}' + r'\\'.join(lines) + r'\end{cases}'


# ---------- Level 1: 가우스 소거법으로 연립일차방정식의 해 구하기 (유일해) ----------
for i in range(14):
    n = 2 if i % 3 == 0 else 3
    A = rand_invertible_int_matrix(n)
    xv = sp.Matrix([random.choice([v for v in range(-6, 7) if v != 0]) for _ in range(n)])
    b = A * xv
    prob = (f'\\text{{가우스 소거법을 이용하여 다음 연립일차방정식의 해를 구하시오 (첨가행렬 }} '
            f'[A|B] \\text{{ 를 기약 행사다리꼴로 변형하시오): }} {system_latex(A, b)}')
    algebra_raw.append({'level': 1, 'template': 'sys_unique', 'latex': prob, 'solution': vec_latex(xv)})

# ---------- Level 2: 가우스-요르단 소거법으로 역행렬 계산 (가역/특이 판별 포함) ----------
for i in range(15):
    n = 2 if i % 2 == 0 else 3
    if i % 4 == 3:
        # singular branch
        A = singular_matrix(n)
        prob = f'\\text{{첨가행렬 }} [A|I] \\text{{ 에 기본 행연산을 적용하여 다음 행렬 }} A \\text{{ 의 역행렬을 구하시오 (역행렬이 존재하지 않으면 "포기" 버튼을 이용하시오): }} A={mat_latex(A)}'
        algebra_raw.append({'level': 2, 'template': 'mat_inverse', 'latex': prob, 'solution': '역행렬없음'})
    else:
        A = unimodular_matrix(n, ops=7 if n == 2 else 10)
        Ainv = A.inv()
        prob = f'\\text{{첨가행렬 }} [A|I] \\text{{ 에 기본 행연산을 적용하여 다음 행렬 }} A \\text{{ 의 역행렬을 구하시오: }} A={mat_latex(A)}'
        algebra_raw.append({'level': 2, 'template': 'mat_inverse', 'latex': prob, 'solution': mat_latex(Ainv)})

# ---------- Level 2: 기본행렬의 곱을 명시하여 연립일차방정식 풀기 (해는 동일한 방식으로 채점) ----------
for i in range(13):
    n = 2 if i % 3 == 1 else 3
    A = rand_invertible_int_matrix(n)
    xv = sp.Matrix([random.choice([v for v in range(-6, 7) if v != 0]) for _ in range(n)])
    b = A * xv
    prob = (f'\\text{{연립일차방정식을 첨가행렬 }} M \\text{{ 로 나타내고, 기본 행연산에 대응하는 기본행렬 }} '
            f'E_1, E_2, \\ldots \\text{{ 을 차례로 곱하는 과정을 통해 해를 구하시오: }} {system_latex(A, b)}')
    algebra_raw.append({'level': 2, 'template': 'sys_elem_matrix', 'latex': prob, 'solution': vec_latex(xv)})

# ---------- Level 3: 기약 행사다리꼴 해석 (해가 무수히 많음 / 해가 없음) ----------
for i in range(14):
    n = 3
    a, b_, c_, d, e_ = [random.randint(-4, 4) for _ in range(5)]
    if a == 0:
        a = 1
    if d == 0:
        d = 1
    if i % 2 == 0:
        # infinite solutions: bottom row is 0 = 0
        M = sp.Matrix([[1, a, b_, c_], [0, 1, d, e_], [0, 0, 0, 0]])
        eqs = [sp.Eq(VAR_NAMES[0] + a * VAR_NAMES[1] + b_ * VAR_NAMES[2], c_),
               sp.Eq(VAR_NAMES[1] + d * VAR_NAMES[2], e_)]
        sol_set = list(sp.linsolve(eqs, VAR_NAMES))[0]
        xt, yt, zt = [sp.nsimplify(expr).subs(VAR_NAMES[2], t_sym) for expr in sol_set]
        sol_latex = vec_latex([xt, yt, zt])
    else:
        # no solution: bottom row is 0 = f, f != 0
        f = random.choice([v for v in range(-5, 6) if v != 0])
        M = sp.Matrix([[1, a, b_, c_], [0, 1, d, e_], [0, 0, 0, f]])
        sol_latex = '해없음'
    Mcoef = M[:, :3]
    Mrhs = M[:, 3]
    prob = (f'\\text{{연립일차방정식을 행렬로 나타내고 가우스 소거법을 이용하여 다음과 같은 행렬을 얻었을 때, }} '
            f'\\text{{주어진 연립일차방정식의 해를 구하시오 (해가 무수히 많으면 자유변수를 }} t \\text{{ 로 두고, 해가 없으면 "포기" 버튼을 이용하시오): }} '
            f'{mat_latex(Mcoef)}{vec_latex([VAR_NAMES[0], VAR_NAMES[1], VAR_NAMES[2]])} = {vec_latex(Mrhs)}')
    algebra_raw.append({'level': 3, 'template': 'rref_interpret', 'latex': prob, 'solution': sol_latex})

# ---------- Level 3: PA=I 를 만족하는 P를 기본행렬의 곱으로 나타내기 (P = A^-1) ----------
for i in range(13):
    n = 2 if i % 3 == 0 else 3
    A = unimodular_matrix(n, ops=7 if n == 2 else 10)
    P = A.inv()
    prob = (f'\\text{{행렬 }} A \\text{{ 를 가우스 소거법을 이용하여 단위행렬로 변형하고, }} '
            f'PA=I \\text{{ 를 만족시키는 행렬 }} P \\text{{ 를 기본행렬의 곱으로 나타내시오: }} A={mat_latex(A)}')
    algebra_raw.append({'level': 3, 'template': 'mat_P_transform', 'latex': prob, 'solution': mat_latex(P)})


# --- Banded assembly (same diversity/difficulty-progression approach as the calculus pools) ---
CHUNK_SIZE = 10

def assemble(raw_problems, id_prefix, name_fn):
    by_template = {}
    for p in raw_problems:
        by_template.setdefault(p['template'], []).append(p)
    for tmpl in by_template:
        random.shuffle(by_template[tmpl])
    template_keys = list(by_template.keys())
    random.shuffle(template_keys)

    # Each "pass" pulls at most one problem per template still holding content, so a
    # single pass can never repeat a template -- passes are never merged into a bigger
    # CHUNK_SIZE-sized collection (the old behavior), even if that leaves a collection
    # short of CHUNK_SIZE questions. A shorter, fully diverse collection beats a padded,
    # repetitive one (with only 5 templates and CHUNK_SIZE=10, the old approach combined
    # two passes per collection, so every template appeared twice in every collection).
    collections = []
    idx = 1
    while any(by_template[t] for t in template_keys):
        pass_items = []
        for t in template_keys:
            if by_template[t]:
                pass_items.append(by_template[t].pop(0))
        for i in range(0, len(pass_items), CHUNK_SIZE):
            chunk = sorted(pass_items[i:i + CHUNK_SIZE], key=lambda p: p['level'])
            collections.append({"id": f"{id_prefix}_{idx}", "name": name_fn(idx), "problems": chunk})
            idx += 1
    return collections


final_collections = assemble(algebra_raw, "alg_col", lambda i: f"행렬과 연립일차방정식 {i}")

prefix = 'window.algebraCollections = '
new_js = prefix + json.dumps(final_collections, ensure_ascii=False, indent=4) + ';'
with codecs.open('data/math/algebra_collections.js', 'w', 'utf-8') as f:
    f.write(new_js)

print(f"Successfully generated {len(final_collections)} algebra collections! (total problems: {len(algebra_raw)})")
