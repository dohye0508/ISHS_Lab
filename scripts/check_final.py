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


def _bounded_initial_value():
    # y' = y - x^2: general solution x^2+2x+2+C e^x. y <= x^2+2x+3 for all x >= 0 iff C <= 0.
    general = s.dsolve(f(x).diff(x) - f(x) + x**2, f(x)).rhs
    c = [sym for sym in general.free_symbols if sym != x][0]
    gap = s.simplify(general - (x**2 + 2 * x + 3))
    assert s.simplify(gap - (c * s.exp(x) - 1)) == 0, gap
    assert s.limit(gap.subs(c, s.Rational(1, 1000)), x, s.oo) == s.oo  # any C > 0 eventually breaks the bound
    return general.subs(c, 0).subs(x, 0)


def _time(solution, t, value):
    roots = [r for r in s.solve(s.Eq(solution, value), t) if r.is_real and r > 0]
    assert len(roots) == 1, roots
    return roots[0]


t = s.Symbol('t', positive=True)
k = s.Symbol('k', positive=True)


def _decay_half():
    rate = s.solve(s.Eq(s.exp(-10 * k), s.Rational(7, 10)), k)[0]
    return _time(s.exp(-rate * t), t, s.Rational(1, 2))


def _cooling_unknown_ambient():
    A, q = s.symbols('A q', positive=True)
    (amb, ratio), = [sol for sol in s.solve([(90 - A) * q - (70 - A), (90 - A) * q**2 - (58 - A)], [A, q], dict=False) if 0 < sol[1] < 1]
    assert amb == 40 and ratio == s.Rational(3, 5), (amb, ratio)
    return _time(amb + (90 - amb) * ratio**(t / 10), t, 50)


def _stokes_half_terminal():
    m, g, v_terminal = 80, 10, 50
    r = s.Rational(m * g, v_terminal)
    v = s.dsolve(m * f(t).diff(t) - (m * g - r * f(t)), f(t), ics={f(0): 0}).rhs
    assert s.limit(v, t, s.oo) == v_terminal
    return _time(v, t, s.Rational(v_terminal, 2))


def _torricelli_cone_tail():
    # 원뿔(반지름=높이)에서 V=(pi/3)y^3이므로 dV/dt = pi y^2 y' = -c sqrt(y), 즉 pi y^(3/2) dy = -c dt.
    y = s.Symbol('y', positive=True)
    c = s.integrate(s.pi * y**s.Rational(3, 2), (y, 1, 4)) / 31  # 4m -> 1m 에 31분
    return s.integrate(s.pi * y**s.Rational(3, 2), (y, 0, 1)) / c


def _logistic_fastest_growth():
    # dsolve returns a wrong constant for this equation (SymPy 1.14), so take the textbook form
    # M/(1+A e^{-rt}) and check that it really solves the IVP before using it.
    P = 1000 / (1 + 9 * s.exp(-t / 5))
    assert s.simplify(P.diff(t) - s.Rational(1, 5) * P * (1 - P / 1000)) == 0 and P.subs(t, 0) == 100
    p = s.Symbol('p', positive=True)
    rate = s.Rational(1, 5) * p * (1 - p / 1000)
    p_peak, = s.solve(s.diff(rate, p), p)  # 증가 속도는 P의 이차식, 꼭짓점에서 최대
    when = _time(P, t, p_peak)
    speed = lambda tt: s.N(rate.subs(p, P.subs(t, tt)), 30)
    assert speed(when) > speed(when - s.Rational(1, 10)) and speed(when) > speed(when + s.Rational(1, 10))
    return when


def seq_limit(expr):
    return s.limit(expr, n, s.oo)


def _recursive_limit():
    # a1 = 3/2, a_{n+1} = (a_n^2+2)/3: stays in (1,2), decreases, so it must pick the fixed point 1.
    fixed = sorted(s.solve(s.Eq(x, (x**2 + 2) / 3), x))
    a, prev = s.Rational(3, 2), None
    for _ in range(300):
        prev, a = a, (a**2 + 2) / 3
        a = s.Float(a, 60)
        assert 1 < a < prev, 'not monotone in (1, 2)'
    near = [p for p in fixed if close(a, p, s.Rational(1, 10**30))]
    assert len(near) == 1, (fixed, a)
    return near[0]


def _factorial_ratio_root():
    # log of the n-th root is a Riemann sum (1/n) sum_{k=n+1}^{3n} ln(k/n) -> int_1^3 ln x dx.
    exact = s.exp(s.integrate(s.log(x), (x, 1, 3)))
    import mpmath as mp
    big = 10**6
    approx = mp.e**((mp.loggamma(3 * big + 1) - mp.loggamma(big + 1) - 2 * big * mp.log(big)) / big)
    assert abs(approx - mp.mpf(str(s.N(exact, 30)))) < 1e-3, approx
    return exact


def _cubic_log_product():
    # partial product prod_{n=2}^{N} (n^3-1)/(n^3+1) = 2(N^2+N+1)/(3N(N+1)), checked by induction
    N = s.Symbol('N', integer=True, positive=True)
    F = 2 * (N**2 + N + 1) / (3 * N * (N + 1))
    term = (N**3 - 1) / (N**3 + 1)
    assert F.subs(N, 2) == term.subs(N, 2)
    assert s.simplify(F / F.subs(N, N - 1) - term) == 0
    return s.log(s.limit(F, N, s.oo))


def _periodic_cosine_sum():
    # sum cos(n pi/2)/2^n: only even n survive, n = 2k gives (-1)^k/4^k
    exact = s.summation((-1)**n / 4**n, (n, 1, s.oo))
    import mpmath as mp
    mp.mp.dps = 40
    direct = mp.fsum(mp.cos(j * mp.pi / 2) / mp.mpf(2)**j for j in range(1, 201))  # tail < 2^-200
    assert abs(direct - mp.mpf(str(s.N(exact, 40)))) < 1e-30, direct
    return exact


def _diverges_by_nth_term(term):
    def verdict():
        assert seq_limit(term) != 0
        return '발산'
    return verdict


TARGETS = {
    # 급수 1 · 수열의 극한
    'fin_ser_01_v1_rationalize_limit': ('value', seq_limit(n * (s.sqrt(n**2 + 2 * n) - n - 1))),
    'fin_ser_01_v1_nth_root_dominant': ('value', s.exp(seq_limit(s.log(n**2 * 2**n + 3**n) / n))),
    'fin_ser_01_v1_e_type_limit': ('value', seq_limit((1 + 2 / n + 1 / n**2)**(3 * n))),
    'fin_ser_01_v1_monotone_recursive': ('value', _recursive_limit()),
    'fin_ser_01_v1_factorial_ratio_root': ('value', _factorial_ratio_root()),
    # 급수 2 · 급수의 합과 일반항판정법
    'fin_ser_02_v1_telescoping_cubic': ('value', s.summation(1 / (n * (n + 1) * (n + 2)), (n, 1, s.oo))),
    'fin_ser_02_v1_periodic_cosine_sum': ('value', _periodic_cosine_sum()),
    'fin_ser_02_v1_nth_term_trap': ('verdict', _diverges_by_nth_term((1 - 1 / n)**n)),
    'fin_ser_02_v1_factorial_quadratic': ('value', s.summation(n**2 / s.factorial(n + 1), (n, 1, s.oo))),
    'fin_ser_02_v1_log_cubic_telescoping': ('value', _cubic_log_product()),
    # 미분방정식 1 · 풀이
    'fin_ode_01_v1_euler_three_steps': ('value', euler(lambda X, Y: X - Y**2, 0, 1, s.Rational(1, 2), 3)),
    'fin_ode_01_v1_separable_tangent_sum': ('ode', (lambda y: y.diff(x) - (1 + y**2) / (1 + x**2), 0, 1)),
    'fin_ode_01_v1_separable_equilibrium': ('value', _equilibrium_half()),
    'fin_ode_01_v1_linear_bounded_initial': ('value', _bounded_initial_value()),
    'fin_ode_01_v1_bernoulli_ivp': ('ode', (lambda y: y.diff(x) + y - s.exp(x) * y**2, 0, 1)),
    # 미분방정식 2 · 활용
    'fin_ode_02_v1_decay_half': ('value', _decay_half()),
    'fin_ode_02_v1_cooling_unknown_ambient': ('value', _cooling_unknown_ambient()),
    'fin_ode_02_v1_stokes_half_terminal': ('value', _stokes_half_terminal()),
    'fin_ode_02_v1_torricelli_cone_tail': ('value', _torricelli_cone_tail()),
    'fin_ode_02_v1_logistic_fastest_growth': ('value', _logistic_fastest_growth()),
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
