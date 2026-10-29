"""Independent SymPy targets for data/math/final/algebra_11.js (참고자료 11장 선형사상과 선형변환).

Merged into TARGETS by scripts/check_final.py. Every target is recomputed from the problem's own
definition (images of a basis, rotation/reflection built from cos/sin or unit vectors, linear systems),
never copied from the stored answer.
"""
import random
import sympy as s

C = 'fin_alg_01_v1_'
M = 'fin_alg_02_v1_'
V = 'fin_alg_03_v1_'


def col(*entries):
    return s.Matrix(entries)


def standard_matrix(domain, images):
    """Standard matrix of the linear map sending each domain vector (column) to its image (column)."""
    B = s.Matrix.hstack(*[col(*v) for v in domain])
    assert B.det() != 0, 'domain vectors are not a basis'
    return s.Matrix.hstack(*[col(*w) for w in images]) * B.inv()


# ---------------------------------------------------------------- 1 · 사상과 선형사상

def _count_linear_maps():
    """Check additivity and homogeneity symbolically; for non-linear maps also find a numeric counterexample."""
    a = s.Symbol('a', real=True)
    t = s.Symbol('t', real=True)

    def vec(n, name):
        return list(s.symbols(f'{name}0:{n}', real=True))

    def mat(name):
        return s.Matrix(2, 2, s.symbols(f'{name}0:4', real=True))

    poly_x = s.Symbol('px')

    def poly(name):
        c = s.symbols(f'{name}0:3', real=True)
        return c[0] + c[1] * poly_x + c[2] * poly_x**2

    maps = {
        '가': (lambda v: [v[0] - 2 * v[1], 3 * v[0] + v[1]], lambda nm: vec(2, nm)),
        '나': (lambda v: [v[0] + v[1], v[0] * v[1]], lambda nm: vec(2, nm)),
        '다': (lambda v: [v[0] - v[1] + 2 * v[2]], lambda nm: vec(3, nm)),
        '라': (lambda v: [v[0] + 1, v[1] - 1], lambda nm: vec(2, nm)),
        '마': (lambda A: list(A + A.T), mat),
        '바': (lambda A: [A.det()], mat),
        '사': (lambda p: [p.subs(poly_x, 1) + s.diff(p, poly_x).subs(poly_x, 0)], poly),
        '아': (lambda v: [s.Abs(v[0] + v[1]), 0], lambda nm: vec(2, nm)),
    }

    def add(u, w):
        return u + w if not isinstance(u, list) else [p + q for p, q in zip(u, w)]

    def scale(c, u):
        return c * u if not isinstance(u, list) else [c * p for p in u]

    def free(u):
        return set().union(*[s.sympify(e).free_symbols for e in u]) if isinstance(u, list) else s.sympify(u).free_symbols

    def is_zero(entries):
        return all(s.simplify(s.expand(e)) == 0 for e in entries)

    rng = random.Random(11)
    count = 0
    for label, (T, make) in maps.items():
        u, w = make('u'), make('w')
        additive = is_zero([p - q for p, q in zip(T(add(u, w)), add(T(u), T(w)))])
        homogeneous = is_zero([p - q for p, q in zip(T(scale(a, u)), scale(a, T(u)))])
        linear = additive and homogeneous
        if not linear:  # make sure it really fails at some concrete point
            syms = free(u) | free(w) | {a}
            found = False
            for _ in range(50):
                sub = {sym: s.Rational(rng.randint(-5, 5), rng.randint(1, 3)) for sym in syms}
                d1 = [s.sympify(p - q).subs(sub) for p, q in zip(T(add(u, w)), add(T(u), T(w)))]
                d2 = [s.sympify(p - q).subs(sub) for p, q in zip(T(scale(a, u)), scale(a, T(u)))]
                if any(e != 0 for e in d1 + d2):
                    found = True
                    break
            assert found, (label, 'symbolic check failed but no counterexample')
        count += linear
    return s.Integer(count)


def _parameter_makes_linear():
    a, b, x, y, c = s.symbols('a b x y c', real=True)

    def T(p, q, aa=a, bb=b):
        return [(aa - 1) * p**2 + 2 * q + bb**2 - 4, aa * p + (bb - 2) * s.Abs(q)]

    # necessary conditions: T(0)=0, T(2,0)=2T(1,0), T(0,-1)=-T(0,1)
    eqs = T(0, 0) + [p - 2 * q for p, q in zip(T(2, 0), T(1, 0))] + [p + q for p, q in zip(T(0, -1), T(0, 1))]
    sols = s.solve(eqs, [a, b], dict=True)
    assert len(sols) == 1, sols
    a0, b0 = sols[0][a], sols[0][b]
    # and they are sufficient: the map is then linear for all inputs
    x2, y2 = s.symbols('x2 y2', real=True)
    lhs = T(x + x2, y + y2, a0, b0)
    rhs = [p + q for p, q in zip(T(x, y, a0, b0), T(x2, y2, a0, b0))]
    assert all(s.simplify(p - q) == 0 for p, q in zip(lhs, rhs))
    assert all(s.simplify(p - c * q) == 0 for p, q in zip(T(c * x, c * y, a0, b0), T(x, y, a0, b0)))
    return col(*T(3, -1, a0, b0))


def _consistent_third_image():
    k = s.Symbol('k')
    A = standard_matrix([(1, 2), (2, 1)], [(3, 1), (0, k)])
    sol = s.solve(list(A * col(1, 1) - col(1, 2)), k, dict=True)
    assert len(sol) == 1, sol
    return sol[0][k]


def _polynomial_basis_image():
    x = s.Symbol('x')
    al, be, ga = s.symbols('alpha beta gamma')
    basis = [s.Integer(1), 1 + x, 1 + x + x**2]
    images = [1 + x, x**2, 2 - x]
    target = 3 + x - 2 * x**2
    coeffs = s.solve(s.Poly(al * basis[0] + be * basis[1] + ga * basis[2] - target, x).all_coeffs(), [al, be, ga], dict=True)
    assert len(coeffs) == 1
    c = coeffs[0]
    image = s.expand(c[al] * images[0] + c[be] * images[1] + c[ga] * images[2])
    return col(*[image.coeff(x, j) for j in range(3)])


def _image_not_whole_space():
    k = s.Symbol('k')
    A = standard_matrix([(1, 1, 0), (0, 1, 1), (1, 0, 1)], [(1, 2, 1), (2, 1, -1), (1, -1, k)])
    roots = s.solve(s.Eq(A.det(), 0), k)  # im T != R^3  <=>  rank A < 3
    assert len(roots) == 1, roots
    A0 = A.subs(k, roots[0])
    assert A0.rank() == 2
    return A0 * col(1, 2, 3)


# ---------------------------------------------------------------- 2 · 행렬변환과 표준행렬

def _formula_standard_matrix():
    x1, x2, x3 = s.symbols('x1 x2 x3')
    T = lambda v: col(v[2] - 2 * v[0], v[0] + 4 * v[1] - v[2])
    E = s.eye(3)
    return s.Matrix.hstack(*[T(E[:, j]) for j in range(3)])


def _solve_matrix(rows, cols, conditions):
    """Unknown rows x cols matrix A with A u = w for each (u, w); solved entry by entry."""
    A = s.Matrix(rows, cols, s.symbols(f'm0:{rows * cols}'))
    eqs = []
    for u, w in conditions:
        eqs += list(A * col(*u) - col(*w))
    sol = s.solve(eqs, list(A), dict=True)
    assert len(sol) == 1, sol
    return A.subs(sol[0])


def _two_images():
    return _solve_matrix(2, 2, [((2, 1), (1, 4)), ((3, 2), (0, 5))])


def _three_images():
    return _solve_matrix(2, 3, [((1, 1, 1), (2, -1)), ((0, 1, 1), (1, 2)), ((0, 0, 1), (-1, 1))])


def _plane_fixed_map():
    # basis of the plane x+y+z=0 from its nullspace, each fixed; plus (1,0,0) -> (0,1,0)
    plane = s.Matrix([[1, 1, 1]]).nullspace()
    assert len(plane) == 2
    conditions = [(tuple(v), tuple(v)) for v in plane] + [((1, 0, 0), (0, 1, 0))]
    A = _solve_matrix(3, 3, conditions)
    p, q = s.symbols('p q')
    point = col(p, q, -p - q)
    assert s.simplify(A * point - point) == s.zeros(3, 1)
    return A


def _preimage_infinitely_many():
    k, m = s.symbols('k m')
    A = s.Matrix([[1, 2, -1], [2, 5, 1], [3, 7, k]])
    ks = s.solve(A.det(), k)  # infinitely many solutions needs a singular A
    assert len(ks) == 1, ks
    A0 = A.subs(k, ks[0])
    left = A0.T.nullspace()  # consistency: b orthogonal to the left nullspace
    assert len(left) == 1
    ms = s.solve(left[0].dot(col(1, 3, m)), m)
    assert len(ms) == 1, ms
    aug = A0.row_join(col(1, 3, ms[0]))
    assert A0.rank() == aug.rank() == 2  # consistent and rank < 3 -> infinitely many
    return ks[0] + ms[0]


# ---------------------------------------------------------------- 3 · 여러 가지 선형변환

def rotation(theta):
    return s.Matrix([[s.cos(theta), -s.sin(theta)], [s.sin(theta), s.cos(theta)]])


def reflection_along(direction):
    u = col(*direction) / s.sqrt(sum(c**2 for c in direction))
    return 2 * u * u.T - s.eye(2)


def _rotate_point():
    return (rotation(5 * s.pi / 6) * col(2, -1)).applyfunc(s.nsimplify)


def _reflect_line_matrix():
    theta = s.atan(3)  # line y = 3x makes angle atan 3 with the x-axis
    H = s.Matrix([[s.cos(2 * theta), s.sin(2 * theta)], [s.sin(2 * theta), -s.cos(2 * theta)]]).applyfunc(lambda e: s.simplify(s.expand_trig(e)))
    assert (H - reflection_along((1, 3))).applyfunc(s.simplify) == s.zeros(2, 2)
    return H


def _projection_segment_length():
    u = col(1, -2) / s.sqrt(5)
    P = u * u.T
    images = [P * col(*v) for v in [(0, 0), (3, 1), (1, 4)]]
    # image of a convex set under a linear map onto a line is the segment between the extreme images
    best = max(((images[i] - images[j]).norm(), i, j) for i in range(3) for j in range(3))
    return s.nsimplify(s.simplify(best[0]))


def _rotation_dilation_matrix():
    k = s.Symbol('k', positive=True)
    th = s.Symbol('theta', real=True)
    # T = k R_theta with T(3,1) = (2,6): lengths give k, then the angle from the direction
    k0 = s.solve(s.Eq(k * col(3, 1).norm(), col(2, 6).norm()), k)
    assert len(k0) == 1
    angle = s.atan2(6, 2) - s.atan2(1, 3)
    T = k0[0] * rotation(angle)
    T = T.applyfunc(lambda e: s.nsimplify(s.simplify(s.expand_trig(e))))
    assert T * col(3, 1) == col(2, 6)
    return T


def _reflection_from_point_pair():
    p, q = col(5, 0), col(3, 4)
    assert p.norm() == q.norm()  # a reflection keeps the length
    H = reflection_along(tuple(p + q))  # axis through the midpoint of p and its mirror image
    assert H * p == q
    return H * col(1, 2)


TARGETS = {
    C + 'count_linear_maps': ('value', _count_linear_maps()),
    C + 'parameter_makes_linear': ('matrix', _parameter_makes_linear()),
    C + 'consistent_third_image': ('value', _consistent_third_image()),
    C + 'polynomial_basis_image': ('matrix', _polynomial_basis_image()),
    C + 'image_not_whole_space': ('matrix', _image_not_whole_space()),
    M + 'formula_standard_matrix': ('matrix', _formula_standard_matrix()),
    M + 'two_images': ('matrix', _two_images()),
    M + 'three_images': ('matrix', _three_images()),
    M + 'plane_fixed_map': ('matrix', _plane_fixed_map()),
    M + 'preimage_infinitely_many': ('value', _preimage_infinitely_many()),
    V + 'rotate_point': ('matrix', _rotate_point()),
    V + 'reflect_line_matrix': ('matrix', _reflect_line_matrix()),
    V + 'projection_segment_length': ('value', _projection_segment_length()),
    V + 'rotation_dilation_matrix': ('matrix', _rotation_dilation_matrix()),
    V + 'reflection_from_point_pair': ('matrix', _reflection_from_point_pair()),
}

if __name__ == '__main__':
    for key, (kind, target) in TARGETS.items():
        print(key, kind, target)
