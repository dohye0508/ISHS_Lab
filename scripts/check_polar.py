"""Independent derivations and production-LaTeX-grader regression checks.

Invoked by check_polar.cjs. Requires sympy and antlr4-python3-runtime==4.11.1.
"""
import json
import math
import sys

import mpmath as mp
import sympy as s
from sympy.parsing.latex import parse_latex

payload = json.load(sys.stdin)
problems = {p['id']: p for p in payload['problems']}
t = s.symbols('t', real=True)
x, y = s.symbols('x y', real=True)
pi = s.pi
mp.mp.dps = 35
results = {}


def check(key, derived):
    answer = parse_latex(problems[key]['solution']).subs(s.Symbol('pi'), pi)
    assert not answer.free_symbols, (key, 'unparsed answer', answer)
    error = abs(complex(s.N(answer, 20)) - complex(derived))
    assert error < 1e-10, (key, answer, derived, error)
    results[key] = True


def quad(fn, *bounds):
    return mp.quad(fn, bounds)


# Hidden trigonometric identity: check symbolically after rationalizing in tan(t/2).
u = s.symbols('u', real=True)
c, sn = (1-u*u)/(1+u*u), 2*u/(1+u*u)
cos5, sin5 = 16*c**5-20*c**3+5*c, 16*sn**5-20*sn**3+5*sn
cos4 = 8*c**4-8*c*c+1
assert s.factor((cos5-sin5)/(c-sn)-2*cos4+3-2*(c-sn)**2) == 0
check('polar_hidden_circles', quad(lambda a: (mp.cos(a)-mp.sin(a))**2, 0, mp.pi/4, mp.pi/2))
ys = s.solve(y*y+4*y-16, y)
check('polar_parabola_secant', s.prod(5-v for v in ys))
xs = s.solve(7*x*x-6*x-9, x)
check('polar_ellipse_chord', 2*(xs[1]-xs[0])**2)
# Integrate the circular segment in coordinates normal to the image line.
check('polar_inversion_cap', quad(lambda z: 2*mp.sqrt(1-z*z), 1/mp.sqrt(5), 1))
check('polar_absolute_radius', 2**2+2*(s.Rational(2, 3))**2)

# Two nonzero Fourier frequencies of P are 11/7 and 3/7; both must recur.
k = next(k for k in range(1, 30) if (11*k) % 14 == 0 and (3*k) % 14 == 0)
check('polar_position_period', k*pi)
axes = sorted({(-s.Rational(7, 20)+s.Rational(j, 5)) % 1 for j in range(5)})
check('polar_reflection_axis', axes[0]*pi)
# Verify the sufficient reflection identity for all candidate axes, not just maxima.
for axis in axes:
    candidates = [2*axis + j for j in range(14)]
    assert any((s.Rational(5, 7)*shift+s.Rational(1, 2)-j) % 2 == 0
               for j, shift in enumerate(candidates))
check('polar_rose_crossing_angle', s.Rational(abs(-3*1-3*1), abs(-3*3+1*1)))
angles = [pi/8+k*pi/4 for k in range(8)]
vertices = [(s.cos(a)/s.sqrt(2), s.sin(a)/s.sqrt(2)) for a in angles]
area = sum(vertices[i][0]*vertices[(i+1)%8][1]-vertices[(i+1)%8][0]*vertices[i][1] for i in range(8))/2
check('polar_even_rose_intersections', s.simplify(area))
f = 2*u*(1-u*u)
critical = [-1, 1] + s.solve(s.diff(f, u), u)
values = [f.subs(u, v) for v in critical]
check('polar_support_line', max(values)-min(values))

check('polar_circle_cardioid_overlap', quad(lambda a: min(1+mp.cos(a), 3*mp.cos(a))**2, 0, mp.pi/3, mp.pi/2))
# Express inner/outer loops in the SAME physical direction, independently of trace area.
check('polar_limacon_between_loops',
      quad(lambda a: ((1+2*mp.cos(a))**2-(2*mp.cos(a)-1)**2)/2, -mp.pi/3, mp.pi/3)
      + 2*quad(lambda a: (1+2*mp.cos(a))**2/2, mp.pi/3, 2*mp.pi/3))
check('polar_lemniscate_disk_difference', 2*quad(lambda a: (4*mp.cos(2*a)-2)/2, -mp.pi/6, mp.pi/6))
check('polar_rose_clipped_petals', 3*quad(lambda a: (mp.sin(3*a)**2-mp.mpf(1)/4)/2, mp.pi/18, 5*mp.pi/18))
check('polar_three_boundary_region', quad(lambda a: (4-max(2*mp.cos(a), 2*mp.sin(a))**2)/2, 0, mp.pi/4, mp.pi/2))

xx = (1+s.cos(t))*s.cos(t)
yy = (1+s.cos(t))*s.sin(t)
tangent = s.trigsimp((xx+1)*s.diff(yy,t)-yy*s.diff(xx,t))
assert s.trigsimp(tangent-3*s.cos(t)*(1+s.cos(t))) == 0
check('polar_external_tangents', s.Abs(s.det(s.Matrix([[1,1],[1,-1]])))/2)
r = s.sqrt(2)+s.cos(t)
xx, yy = r*s.cos(t), r*s.sin(t)
numerator = s.trigsimp(s.diff(xx,t)*s.diff(yy,t,2)-s.diff(yy,t)*s.diff(xx,t,2))
assert s.trigsimp(numerator-(4+3*s.sqrt(2)*s.cos(t))) == 0
cc = -2*s.sqrt(2)/3
check('polar_inflection_pair', 4*(s.sqrt(2)+cc)**2*(1-cc**2))
check('polar_overlap_perimeter', 2*quad(lambda a: 2*abs(mp.cos(a/2)), mp.pi/2, mp.pi, 3*mp.pi/2))
rr = s.cos(t/3)**3
assert s.trigsimp(rr**2+s.diff(rr,t)**2-s.cos(t/3)**4) == 0
check('polar_fractional_arc', quad(lambda a: mp.cos(a/3)**2, 0, 3*mp.pi/2))
check('polar_parabola_arc', quad(lambda v: mp.sqrt(1+v*v), -2, 0, 2))
assert len(results) == len(problems) == 20
print('PASS: 20 independent mathematical checks (identities, geometry, derivatives, quadrature).')

namespace = {}
exec(payload['pythonGrader'], namespace)
grade = namespace['grade']
for key, p in problems.items():
    answer = p['solution']
    equivalent = r'\frac{2\left(' + answer + r'\right)}{2}'
    wrong = r'\left(' + answer + r'\right)+1'
    assert grade(answer, answer, False) == 'CORRECT', (key, 'exact')
    assert grade(equivalent, answer, False) == 'CORRECT', (key, 'equivalent', grade(equivalent, answer, False))
    assert grade(wrong, answer, False).startswith('INCORRECT'), (key, 'wrong accepted')
    assert grade('0', answer, False).startswith('INCORRECT'), (key, 'zero accepted')
print('PASS: 80 production-grader cases (exact, equivalent, incorrect offset, zero).')
