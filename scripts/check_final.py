"""Recompute every final-exam answer independently, then run the production grader on it.

Run through `node scripts/check_final.cjs [python]`, which pipes the payload in.
TARGETS maps a problem id to (kind, target):
  value     exact SymPy number                     -> parsed answer must equal it
  infinity  None                                   -> answer must be \\infty
  expr      (f(x) -> SymPy expr, [x samples])      -> answer must match f at the samples
  ode       (residual(y), x0, y0)                  -> answer solves the ODE and the initial value
  verdict   callable -> '절대수렴'|'조건수렴'|'수렴'|'발산'
  interval  (left, a, b, right), endpoints may be s.oo / -s.oo
"""
import json, sys
import sympy as s
from sympy.parsing.latex import parse_latex

payload = json.loads(sys.stdin.buffer.read().decode('utf-8'))
ns = {}
exec(payload['pythonGrader'], ns)
grade = ns['grade']
x = s.Symbol('x')
n = s.Symbol('n', integer=True, positive=True)
f = s.Function('f')


def parse(tex):
    expr = parse_latex(ns['preprocess_for_sympy_parser'](tex))
    return expr.subs({s.Symbol('pi'): s.pi, s.Symbol('e'): s.E})


def close(a, b, tol=s.Rational(1, 10**20)):
    return abs(s.N(a - b, 50)) < tol


def euler(slope, x0, y0, h, steps):
    for _ in range(steps):
        y0 += h * slope(x0, y0)
        x0 += h
    return y0


def ivp(rhs, x0, y0):
    """Solve y' = rhs(f(x), x) with y(x0) = y0 by dsolve (independent of the stored answer)."""
    return s.dsolve(f(x).diff(x) - rhs(f(x), x), f(x), ics={f(x0): y0}).rhs


def solve_for_x(expr, value):
    roots = [r for r in s.solve(s.Eq(expr, value), x) if r.is_real]
    assert len(roots) == 1, roots
    return roots[0]


def _equilibrium_half():
    y = ivp(lambda y, x: y * (4 - y), 0, 1)
    limit = s.limit(y, x, s.oo)
    assert limit == 4, limit
    return solve_for_x(y, limit / 2)


TARGETS = {
    # 미분방정식 1 · 풀이
    'fin_ode_01_v1_euler_two_steps': ('value', euler(lambda X, Y: 2 * X - Y, 0, 1, s.Rational(1, 2), 2)),
    'fin_ode_01_v1_separable_ivp': ('ode', (lambda y: y.diff(x) - 2 * x * (1 + y**2), 0, 0)),
    'fin_ode_01_v1_separable_equilibrium': ('value', _equilibrium_half()),
    'fin_ode_01_v1_linear_integrating_factor': ('ode', (lambda y: y.diff(x) + 2 * x * y - x, 0, 2)),
    'fin_ode_01_v1_bernoulli_ivp': ('ode', (lambda y: y.diff(x) + y - s.exp(x) * y**2, 0, 1)),
}

problems = payload['problems']
ids = {p['id'] for p in problems}
assert set(TARGETS) == ids, ('TARGETS keys != problem ids', sorted(set(TARGETS) ^ ids))

ODE_SAMPLES = [s.Rational(1, 10), s.Rational(3, 10), s.Rational(9, 20)]
graded = 0
for p in problems:
    pid, answer = p['id'], p['solution']
    kind, target = TARGETS[pid]
    prefixed = answer.startswith(('verdict:', 'interval:')) or answer == r'\infty'
    assert prefixed == (kind in ('verdict', 'interval', 'infinity')), (pid, 'kind does not match answer format')

    if kind == 'verdict':
        assert answer == 'verdict:' + target(), (pid, answer, target())
        continue
    if kind == 'infinity':
        assert answer == r'\infty', (pid, answer)
        continue
    if kind == 'interval':
        left, a, b, right = target
        body = answer[len('interval:'):]
        assert body[0] == left and body[-1] == right, (pid, body, target)
        ends = body[1:-1].split(',')
        assert len(ends) == 2, (pid, body)
        for tex, want in zip(ends, (a, b)):
            if want in (s.oo, -s.oo):
                assert tex.strip() == (r'\infty' if want == s.oo else r'-\infty'), (pid, tex, want)
            else:
                assert close(parse(tex), want), (pid, tex, want)
                assert grade(tex, tex, False, True) == 'CORRECT', (pid, tex, 'endpoint exact')
                assert grade(r'\left(' + tex + r'\right)+1', tex, False, True).startswith('INCORRECT'), (pid, tex, 'endpoint wrong')
                graded += 2
        continue

    parsed = parse(answer)
    if kind == 'value':
        assert not parsed.free_symbols, (pid, parsed)
        assert close(parsed, target), (pid, parsed, target)
    elif kind == 'expr':
        fn, samples = target
        for v in samples:
            assert close(parsed.subs(x, v), fn(v)), (pid, v, parsed)
    elif kind == 'ode':
        residual, x0, y0 = target
        r = s.simplify(residual(parsed))
        if r != 0:
            for v in ODE_SAMPLES:
                assert close(r.subs(x, v), 0), (pid, 'residual', v, r)
        assert s.simplify(parsed.subs(x, x0) - y0) == 0, (pid, 'initial value')
    else:
        raise AssertionError((pid, 'unknown kind', kind))
    assert grade(answer, answer, False, True) == 'CORRECT', (pid, 'exact')
    assert grade(r'\frac{2\left(' + answer + r'\right)}{2}', answer, False, True) == 'CORRECT', (pid, 'equivalent')
    assert grade(r'\left(' + answer + r'\right)+1', answer, False, True).startswith('INCORRECT'), (pid, 'wrong')
    graded += 3

print(f'PASS: {len(problems)} final answers verified and graded ({graded} production grading cases)')
