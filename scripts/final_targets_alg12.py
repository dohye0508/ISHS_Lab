"""Independent SymPy targets for data/math/final/algebra_12.js (참고자료 12장 행렬변환의 합성, 교환, 가역).

check_final.py merges TARGETS into its own table. Every target is rebuilt from the problem's
definition (standard matrices of the named transformations, products, inverses, projection
formulas), never from the answer string in the data file.
"""
import sympy as s

I2, I3 = s.eye(2), s.eye(3)
x, y, z = s.symbols('x y z')


def std(images, vars_):
    """Standard matrix of the map whose coordinate formulas are given in 'images'."""
    return s.Matrix([[s.diff(f, v) for v in vars_] for f in images])


def rot(deg):
    t = s.rad(deg)
    return s.Matrix([[s.cos(t), -s.sin(t)], [s.sin(t), s.cos(t)]])


def line_proj(u):
    u = s.Matrix(u)
    return u * u.T / (u.T * u)[0]


def line_refl(u):
    return 2 * line_proj(u) - s.eye(len(u))


def plane_proj(n):
    n = s.Matrix(n)
    return s.eye(len(n)) - n * n.T / (n.T * n)[0]


def plane_refl(n):
    return 2 * plane_proj(n) - s.eye(len(n))


def order(M, limit=50):
    P = M
    for k in range(1, limit + 1):
        if s.simplify(P - s.eye(M.rows)) == s.zeros(M.rows):
            return s.Integer(k)
        P = s.simplify(P * M)
    raise AssertionError('no finite order')


def solve_unknown_matrix(n, conditions):
    """Solve for an n x n matrix B from a list of callables B -> list of equations; must be unique."""
    syms = s.symbols(f'b0:{n * n}')
    B = s.Matrix(n, n, syms)
    eqs = []
    for c in conditions:
        eqs += list(c(B))
    sol = s.solve(eqs, syms, dict=True)
    assert len(sol) == 1 and set(sol[0]) == set(syms), sol
    return B.subs(sol[0])


# ---------- fin_alg_04 합성 ----------
def _triple_composition():
    A1 = std([x - y + 2 * z, 2 * x + z], [x, y, z])        # T1: R^3 -> R^2
    A2 = std([x + y, x - 2 * y, 3 * y], [x, y])            # T2: R^2 -> R^3
    return A1 * A2 * A1                                    # T1 o T2 o T1, applied right to left


def _scaled_rotation_power():
    A = s.Matrix([[1, -s.sqrt(3)], [s.sqrt(3), 1]])
    return s.simplify(A ** 10)


def _two_reflections_order():
    T1 = line_refl([1, 1])                  # y = x
    T2 = line_refl([1, s.sqrt(3)])          # y = sqrt(3) x
    return order(s.simplify(T2 * T1))


def _nilpotent_power():
    S = line_proj([1, 1])                   # projection onto y = x
    R = rot(90)
    T = I2 + S * R
    return s.simplify(T ** 10)


def _conjugated_reflection_slope():
    M = s.simplify(rot(60) * line_refl([1, 1]) * rot(-60))
    assert s.simplify(M * M) == I2 and s.simplify(M.det()) == -1     # it is a reflection
    v = (M - I2).nullspace()[0]
    return s.nsimplify(s.simplify(v[1] / v[0]))


# ---------- fin_alg_05 교환 ----------
def _unknown_entries_sum():
    A = s.Matrix([[1, 2], [3, 0]])
    c, d = s.symbols('c d')
    B = s.Matrix([[1, 4], [c, d]])
    sol = s.solve(list(A * B - B * A), [c, d], dict=True)
    assert len(sol) == 1
    return sol[0][c] + sol[0][d]


def _reflection_rotation_angle_sum():
    th = s.symbols('theta', real=True)
    H = line_refl([1, s.sqrt(3)])
    R = s.Matrix([[s.cos(th), -s.sin(th)], [s.sin(th), s.cos(th)]])
    D = (H * R - R * H).applyfunc(s.simplify)
    sols = set(s.Interval.Ropen(0, 2 * s.pi).intersect(s.solveset(D[0, 0], th, s.Interval.Ropen(0, 2 * s.pi))))
    sols = {t for t in sols if all(s.simplify(e.subs(th, t)) == 0 for e in D)}
    return s.simplify(sum(sols))


def _projection_commutant():
    P = line_proj([1, 2])
    return solve_unknown_matrix(2, [lambda B: B * P - P * B,
                                    lambda B: B * s.Matrix([1, 0]) - s.Matrix([1, 2])])


def _reflection_projection_slopes():
    m = s.symbols('m', real=True)
    H = line_refl([1, m])
    P = line_proj([1, 2])
    D = (H * P - P * H).applyfunc(s.simplify)
    sols = {d[m] for d in s.solve([s.numer(s.together(e)) for e in D if e != 0], m, dict=True)}
    assert sols == {2, -s.Rational(1, 2)}, sols
    return sum(sols)


def _rotation_3d_commutant():
    Rz = s.Matrix([[0, -1, 0], [1, 0, 0], [0, 0, 1]])
    return solve_unknown_matrix(3, [lambda B: B * Rz - Rz * B,
                                    lambda B: B * s.Matrix([1, 1, 1]) - s.Matrix([3, 1, 2])])


# ---------- fin_alg_06 가역 ----------
def _inverse_three_equations():
    A = std([x + y, y + z, x + 2 * z], [x, y, z])
    return A.inv()


def _inverse_of_composition():
    S = std([x + 2 * y, y], [x, y])         # shear, applied first
    T = rot(60)                             # rotation, applied second
    return s.simplify((T * S).inv())


def _singular_k_sum():
    k = s.symbols('k')
    A = s.Matrix([[1, k, 1], [k, 1, 1], [1, 1, k]])
    roots = set(s.solve(A.det(), k))
    assert all(r.is_real for r in roots)
    return sum(roots)


def _nilpotent_preimage():
    N = s.Matrix([[0, 1, 2], [0, 0, 3], [0, 0, 0]])
    T = I3 + 2 * N
    return T.LUsolve(s.Matrix([1, 1, 1]))


def _circle_image_coefficients():
    R = std([y, x], [x, y])                 # reflection in y = x, applied first
    S = std([x + 2 * y, y], [x, y])         # shear, applied second
    A = S * R
    X, Y = s.symbols('X Y')
    pre = A.inv() * s.Matrix([X, Y])
    poly = s.Poly(s.expand(pre[0] ** 2 + pre[1] ** 2), X, Y)
    return s.Matrix([poly.coeff_monomial(X ** 2), poly.coeff_monomial(X * Y), poly.coeff_monomial(Y ** 2)])


# ---------- fin_alg_07 정사영과 대칭 ----------
def _plane_projection():
    return plane_proj([1, 2, -2])


def _span_projection():
    A = s.Matrix([[1, 1], [1, 0], [0, 1]])
    return A * (A.T * A).inv() * A.T


def _line_reflection_point():
    H = line_refl([1, 2, 2])
    return H * s.Matrix([3, 0, 0])


def _two_plane_reflections_order():
    H1 = plane_refl([1, -1, 0])
    H2 = plane_refl([0, 1, -1])
    return order(H2 * H1)


def _line_then_plane_projection():
    Q = line_proj([1, 1, 0])
    P = plane_proj([1, 1, 1])
    return P * Q


TARGETS = {
    'fin_alg_04_v1_triple_composition': ('matrix', _triple_composition()),
    'fin_alg_04_v1_scaled_rotation_power': ('matrix', _scaled_rotation_power()),
    'fin_alg_04_v1_two_reflections_order': ('value', _two_reflections_order()),
    'fin_alg_04_v1_nilpotent_power': ('matrix', _nilpotent_power()),
    'fin_alg_04_v1_conjugated_reflection_slope': ('value', _conjugated_reflection_slope()),

    'fin_alg_05_v1_unknown_entries_sum': ('value', _unknown_entries_sum()),
    'fin_alg_05_v1_reflection_rotation_angles': ('value', _reflection_rotation_angle_sum()),
    'fin_alg_05_v1_projection_commutant': ('matrix', _projection_commutant()),
    'fin_alg_05_v1_reflection_projection_slopes': ('value', _reflection_projection_slopes()),
    'fin_alg_05_v1_rotation_3d_commutant': ('matrix', _rotation_3d_commutant()),

    'fin_alg_06_v1_inverse_three_equations': ('matrix', _inverse_three_equations()),
    'fin_alg_06_v1_inverse_of_composition': ('matrix', _inverse_of_composition()),
    'fin_alg_06_v1_singular_k_sum': ('value', _singular_k_sum()),
    'fin_alg_06_v1_nilpotent_preimage': ('matrix', _nilpotent_preimage()),
    'fin_alg_06_v1_circle_image': ('matrix', _circle_image_coefficients()),

    'fin_alg_07_v1_plane_projection': ('matrix', _plane_projection()),
    'fin_alg_07_v1_span_projection': ('matrix', _span_projection()),
    'fin_alg_07_v1_line_reflection_point': ('matrix', _line_reflection_point()),
    'fin_alg_07_v1_two_plane_reflections': ('value', _two_plane_reflections_order()),
    'fin_alg_07_v1_line_then_plane': ('matrix', _line_then_plane_projection()),
}

if __name__ == '__main__':
    for k, (kind, t) in TARGETS.items():
        print(k, kind, s.latex(t))
