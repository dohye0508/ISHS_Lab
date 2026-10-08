"""Independent algebra derivations plus the production grader; invoked by check_algebra.cjs."""
import json
import sys
import sympy as s
from sympy.parsing.latex import parse_latex

data = json.load(sys.stdin)
bank = {p['id'].removeprefix('alg_v3_'): p for p in data['problems'] if p['id'].startswith('alg_v3_')}
namespace = {}
exec(data['pythonGrader'], namespace)
grade = namespace['grade']
matrix_parser = namespace['parse_matrix_latex']
M, I = s.Matrix, s.eye
x, y, z, t, a, b, k = s.symbols('x y z t a b k')
checked = set()


def check(key, derived):
    tex = bank[key]['solution']
    actual = matrix_parser(tex) if 'matrix' in tex else parse_latex(tex)
    difference = actual - derived
    if isinstance(difference, s.MatrixBase):
        assert all(s.simplify(v) == 0 for v in difference), (key, actual, derived)
    else:
        assert s.simplify(difference) == 0, (key, actual, derived)
    checked.add(key)


# 1. Systems: solve the stated equations and classify every branch.
A = M([[2, 1, -1], [1, -1, 2], [3, 2, 1]])
check('gauss_unique', A.solve(M([0, 9, 7])))
E = M([[1, -2, 1], [0, 1, -3], [0, 0, 0]])
sol = s.solve(list(E*M([x, y, t])-M([3, -2, 0])), [x, y])
check('echelon_read', M([sol[x], sol[y], t]))
A, rhs = M([[1, 1, 1], [1, 2, 3], [2, 3, k]]), M([2, 5, 8])
bad = [kv for kv in s.solve(A.det(), k) if A.subs(k, kv).rank() < A.subs(k, kv).row_join(rhs).rank()]
assert len(bad) == 1
check('no_solution', bad[0])
A, rhs = M([[1, 2, -1], [2, 5, 1], [1, 3, a]]), M([1, 4, b])
av = s.solve(A.det(), a)[0]
bv = [v for v in range(-10, 11) if A.subs(a, av).row_join(rhs.subs(b, v)).rank() == 2]
assert len(bv) == 1
check('infinite', av+bv[0])
A = M([[1, 1, k], [1, k, 1], [k, 1, 1]])
kv = [r for r in s.solve(A.det(), k) if r < 0]
assert len(kv) == 1
basis = A.subs(k, kv[0]).nullspace()
assert len(basis) == 1
check('homog', basis[0]/basis[0][0]*t)

# 2. Inverses: direct inversion and explicit elementary matrices.
check('inverse', M([[1, 2, 3], [0, 1, 4], [5, 6, 0]]).inv())
E1, E2, E3 = I(3), I(3)[[2, 1, 0], :], I(3)
E1[1, 1], E3[2, 0] = 3, -2
check('elementary', (E3*E2*E1).inv())
A, B = M([[2, 1], [5, 3]]), M([[1, 4], [2, -1]])
X = M(2, 2, s.symbols('u:4'))
check('xa_equals_b', X.subs(s.solve(list(X*A-B), list(X))))
A = M([[4, -1], [2, 1]])
assert A*A-5*A+6*I(2) == s.zeros(2)
check('relation', A.inv())
A, B = M([[2, 1], [1, 1]]).inv(), M([[1, 0], [3, 1]]).inv()
check('properties', (2*B*A.T).inv())

# 3. Special matrices.
D = s.diag(1, -1, 2)
check('diag_det', (D**5+D.inv()).det())
check('triangular_inverse', M([[1, 2, 3], [0, 1, 4], [0, 0, 1]]).inv())
AB = M([[1, 2], [2, 3]])*M([[k, 1], [1, 2]])
check('symmetric_product', s.solve(AB[0, 1]-AB[1, 0], k)[0])
A = M([[1, x-1, 2], [3, 2, y+1], [z, 4, 3]])
check('symmetric_entries', A.subs(s.solve(list(A-A.T), [x, y, z])).det())
check('triangular_power', (M([[2, 1], [0, 1]])**10)[0, 1])

# 4. Determinants by direct computation.
check('cofactor_expand', M([[2, 0, 1, 3], [1, 0, -1, 2], [3, 4, 2, 1], [0, 0, 5, -1]]).det())
check('proportional_rows', M([[3, -1, 4, -5], [6, -2, 5, 2], [5, 8, 1, 4], [-9, 3, -12, 16]]).det())
A = M([[1, 0, 0, 2], [3, 5, 0, 6], [0, 2, 4, 0], [4, 1, 3, k]])
check('column_ops', s.solve(A.det()-160, k)[0])
r1, r2, r3 = (M(1, 3, s.symbols(f'{c}:3')) for c in 'pqr')
A, B = M.vstack(r1, r2, r3), M.vstack(r3, 2*r2, r1-4*r3)
assert s.expand(B.det()+2*A.det()) == 0
check('row_rules', -2*5)
X = M(4, 4, lambda i, j: x if i == j else 1)
check('constant_matrix', min(s.solve(X.det(), x)))

# 5. Determinant properties on concrete matrices with the stated determinants.
A, B = s.diag(2, 1, 1), s.diag(-3, 1, 1)
assert A.det() == 2 and B.det() == -3
check('det_product', (2*A.inv()*B.T).det())
check('inverse_entry', M([[3, 2, -1], [1, 6, 3], [2, -4, 0]]).inv()[1, 2])
check('singular_param', sum(set(s.solve(M([[1, k, 2], [k, 4, 4], [1, 2, k]]).det(), k))))
adj = M([[3, -2, 1], [-2, 4, -2], [1, -2, 3]])
cands = [d*adj.inv() for d in (s.sqrt(adj.det()), -s.sqrt(adj.det()))]
cands = [C for C in cands if C.det() > 0 and C.adjugate() == adj]
assert len(cands) == 1
check('recover_from_adj', cands[0])
A = s.diag(-2, 1, 1)
check('adj_scaled', (2*A).adjugate().det())

# 6. Independence, coordinates, dimension, transition.
check('dependence', s.solve(M([[1, 5, 3], [2, 6, 2], [3, 1, k]]).det(), k)[0])
check('coordinates', M([[1, 2, 3], [2, 9, 3], [1, 0, 4]]).solve(M([1, 10, -2])))
check('nullspace_dim', len(M([[1, 2, 0, 1, -1], [2, 4, 1, 3, 0], [1, 2, 1, 2, 1]]).nullspace()))
check('transition', M([[1, 1], [2, 3]]).inv()*M([[1, 2], [1, 1]]))
check('span_dim', M([[1, 2, 0, 1], [2, 4, 1, 1], [0, 0, 1, -1], [3, 6, 2, 1]]).rank())

# Second half of every collection (10 per set).
check('gauss_jordan', M([[1, 1, 2], [2, 4, -3], [3, 6, -5]]).solve(M([9, 1, 0])))
check('curve_fit', M([[1, 1, 1], [4, 2, 1], [1, -1, 1]]).solve(M([2, 7, 4])))
A = M([[1, 1, 2], [1, 0, 1], [2, 1, 3]])
check('consistency_rhs', s.solve((A.T.nullspace()[0].T*M([2, k, 5]))[0], k)[0])
x1, x2, x3, x4 = s.symbols('x1:5')
A = M([[1, 2, -1, 3], [2, 4, 1, 3], [1, 2, 2, 0]])
assert A.rank() == 2
sol = s.solve(list(A*M([x1, x2, x3, x4])), [x1, x3])
check('two_free', (sol[x1]+sol[x3]).subs({x2: 1, x4: 1}))
A, rhs = M([[1, 1, -1], [1, 2, 1], [1, 1, a**2-5]]), M([2, 3, a])
inf = [av for av in s.solve(A.det(), a) if A.subs(a, av).rank() == A.subs(a, av).row_join(rhs.subs(a, av)).rank()]
assert inf == [2]
sol = s.solve(list(A.subs(a, 2)*M([x, y, t])-rhs.subs(a, 2)), [x, y])
check('parameter_cases', M([sol[x], sol[y], t]))
A = M([[1, 2, 3], [2, 5, 3], [1, 0, 8]])
assert A.inv() == M([[-40, 16, 9], [13, -5, -3], [5, -2, -1]])
check('solve_by_inverse', A.solve(M([5, 3, 17])))
check('scaled_inverse', M([[-3, 7], [1, -2]]).inv()/7)
check('shifted_recover', (M([[-1, 2], [4, 5]]).inv()-I(2))/2)
E1, E2, E3 = I(3), I(3)[[2, 1, 0], :], I(3)
E1[1, 0], E3[2, 2] = -2, s.Rational(1, 2)
check('elementary_recover', (E3*E2*E1).inv())
A = M([[0, 2, 1], [0, 0, 3], [0, 0, 0]])
assert A**3 == s.zeros(3)
check('nilpotent_sum', (I(3)-A).inv())
D, B = s.diag(2, -1, 3), M([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
check('diag_commutator', (D*B-B*D)[1, 2])
A = M([[1, 4, -2], [0, 3, 5], [6, 1, 2]])
S, K = (A+A.T)/2, (A-A.T)/2
assert S == S.T and K == -K.T
check('sym_decompose', S)
A = M([[k-1, 2, 3], [0, k+2, 4], [0, 0, k**2-4]])
check('triangular_singular', sum(set(s.solve(A.det(), k))))
A = M([[1, 2, 0], [0, 1, 1]])
check('gram_inverse', (A*A.T).inv())
check('unipotent_power', (M([[1, 2, 3], [0, 1, 4], [0, 0, 1]])**5)[0, 2])
check('sarrus', M([[1, 2, 3], [-4, 5, 6], [7, -8, 9]]).det())
check('triangularize', M([[1, 0, 0, 3], [2, 7, 0, 6], [0, 6, 3, 0], [7, 3, 1, -5]]).det())
check('block_triangular', M([[1, 2, 0, 0], [3, 4, 0, 0], [5, 6, 2, 1], [7, 8, 1, 3]]).det())
check('vandermonde', sum(set(s.solve(M([[1, 1, 1], [1, 2, x], [1, 4, x**2]]).det(), x))))
check('tridiagonal', M(6, 6, lambda i, j: 3 if i == j else (1 if abs(i-j) == 1 else 0)).det())
A = M([[1, 0, 2], [-3, 4, 6], [-1, -2, 3]])
check('cramer', A.solve(M([6, 30, 8]))[1])
A = M([[3, 1, -4], [2, 5, 6], [1, 4, 8]])
check('alien_cofactor', sum(c*A.cofactor(0, j) for j, c in enumerate([1, 2, 3])))
A = M([[2, 1, 0], [1, 1, 3], [0, 1, 8]])
assert A.det() == 2
check('adj_transpose', (A.inv()*A.adjugate().T).det())
AB = M([[1, k], [2, 3]])*M([[k, 1], [1, 1]])
check('product_invertible', sum(set(s.solve(AB.det(), k))))
check('inverse_plus_adj', (A.inv()+A.adjugate()).det())
check('combination', M([[1, 6], [2, 4], [-1, 2]]).gauss_jordan_solve(M([9, 2, 7]))[0])
G = M([[1, 1, 2], [1, 0, 1], [2, 1, 3]])
assert G.rank() == 2
check('span_membership', s.solve(G[:2, :].T.row_join(M([1, k, 4])).det(), k)[0])
check('poly_coordinates', M([[1, 0, 1], [1, 1, 0], [0, 1, 1]]).solve(M([5, 3, 4])))
check('coordinate_change', M([[1, 2], [1, 1]]).solve(3*M([1, 2])-M([1, 3])))
u = s.symbols('u')
poly = s.Poly(s.expand((3-x+2*x**2).subs(x, u-1)), u)
check('shifted_basis', M([poly.coeff_monomial(u**i) for i in range(3)]))
assert checked == set(bank), ('Unverified questions', set(bank)-checked)

# Grade equivalent inputs that bypass the exact-string shortcut, and wrong answers.
for key, problem in bank.items():
    tex = problem['solution']
    if 'matrix' in tex:
        answer = matrix_parser(tex)
        equivalent = s.latex(answer, mat_str='bmatrix', mat_delim=None)
        wrong = answer.copy()
        wrong[0, 0] += 1
        wrong_tex = s.latex(wrong, mat_str='pmatrix', mat_delim=None)
    else:
        equivalent = '(' + tex + ')+0'
        wrong_tex = '(' + tex + ')+1'
    assert grade(equivalent, tex, False, True) == 'CORRECT', (key, equivalent)
    assert grade(wrong_tex, tex, False, True).startswith('INCORRECT'), (key, wrong_tex)
print(f'PASS: {len(checked)} independently derived answers; {len(bank)} equivalent answers accepted; {len(bank)} wrong answers rejected.')
