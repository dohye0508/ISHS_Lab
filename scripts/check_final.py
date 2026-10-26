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


u = s.Symbol('u', positive=True)


def p_series(exponent):
    return '수렴' if exponent > 1 else '발산'


def limit_compare(term, exponent):
    """Positive-term verdict by limit comparison with sum 1/n^exponent."""
    ratio = seq_limit(term * n**exponent)
    assert ratio.is_positive and ratio.is_finite, (term, ratio)
    return p_series(exponent)


def param_range(classify, interval, samples):
    """Check a verdict function on sample parameters against the claimed convergence interval."""
    left, a, b, right = interval
    for value in samples:
        inside = (a < value or (left == '[' and a == value)) and (value < b or (right == ']' and b == value))
        got = classify(value)
        assert got == ('수렴' if inside else '발산'), (interval, value, got)
    return interval


def _log_power(p):
    # sum 1/(n (ln n)^q), q = 2p-1: with u = ln x the test integral is int u^{-q} du.
    q = 2 * p - 1
    if q <= 0:
        return '발산'  # (ln n)^{-q} >= 1 for n >= 3, so the terms are at least 1/n
    return '수렴' if s.integrate(u**(-q), (u, s.log(2), s.oo)).is_finite else '발산'


def _cube_remainder_n():
    import mpmath as mp
    N = 1
    while not s.Rational(1, 2 * N**2) < s.Rational(1, 10**4):
        N += 1
    true_tail = mp.zeta(3) - mp.fsum(mp.mpf(1) / k**3 for k in range(1, N + 1))
    assert 0 < true_tail < mp.mpf(1) / (2 * N**2)
    return N


def _sqrt_gap_power(a):
    return limit_compare(n**a * (s.sqrt(n**2 + 1) - n)**2, 2 - a)


def _log_tower():
    # (ln n)^{ln n} = n^{ln ln n} >= n^2 once ln ln n >= 2, i.e. n >= e^{e^2}
    assert s.simplify(s.expand_log(s.log(s.log(n)**s.log(n)), force=True) - s.log(n) * s.log(s.log(n))) == 0
    assert s.log(s.log(s.exp(s.exp(2)))) == 2
    return p_series(2)


def _root_minus_one(p):
    assert seq_limit((n**(1 / n) - 1) / (s.log(n) / n)) == 1  # same verdict as sum (ln n / n)^p
    if p <= 0:
        return '발산'  # terms do not tend to 0
    if p > 1:
        assert seq_limit(s.log(n)**p / n**((p - 1) / 2)) == 0  # (ln n/n)^p <= 1/n^{(p+1)/2} eventually
        return p_series((p + 1) / 2)
    return p_series(p)  # ln n >= 1 for n >= 3, so terms >= 1/n^p


def ratio_limit(a):
    return seq_limit(s.combsimp(a.subs(n, n + 1) / a))


def by_limit(L):
    assert L != 1, 'test inconclusive'
    return '수렴' if L < 1 else '발산'


def _ratio_inconclusive():
    a = s.factorial(2 * n) / (4**n * s.factorial(n)**2)
    assert ratio_limit(a) == 1
    return limit_compare(a, s.Rational(1, 2))  # a_n * sqrt(n) -> 1/sqrt(pi)


def _root_parameter(a):
    L = seq_limit(s.Abs(a * n + 1) / (2 * n + 3))
    if L != 1:
        return by_limit(L)
    assert seq_limit(s.Abs((a * n + 1) / (2 * n + 3))**n) != 0  # |a| = 2: terms do not tend to 0
    return '발산'


def alternating(abs_term, decreasing_from):
    """(-1)^n |a_n| with |a_n| -> 0, eventually decreasing: classify absolute/conditional."""
    xs = s.Symbol('xs', positive=True)
    f = abs_term.subs(n, xs)
    assert seq_limit(abs_term) == 0
    for v in [decreasing_from, decreasing_from + 1, 10, 1000]:
        assert s.diff(f, xs).subs(xs, v) < 0, ('not decreasing', v)
    return abs_term


def _cos_pi_over_n():
    t_ = s.Symbol('t_', positive=True)
    assert s.limit((1 - s.cos(s.pi * t_)) / t_**2, t_, 0, '+') == s.pi**2 / 2  # |a_n| ~ pi^2/(2 n^2)
    return '절대수렴'


def _alternating_error_n():
    N = 1
    while not s.Rational(1, (N + 1) * 2**(N + 1)) < s.Rational(1, 10**4):
        N += 1
    assert s.summation((-1)**(n + 1) / (n * 2**n), (n, 1, s.oo)) == s.log(s.Rational(3, 2))
    return N


def _non_monotone_alternating():
    # (-1)^n/(sqrt n + (-1)^n) = (-1)^n sqrt(n)/(n-1) - 1/(n-1): convergent alternating part minus a divergent part.
    for parity in (0, 1):
        k = 2 * n + parity
        sign = (-1)**parity
        assert s.simplify(sign / (s.sqrt(k) + sign) - (sign * s.sqrt(k) / (k - 1) - 1 / (k - 1))) == 0
    alternating(s.sqrt(n) / (n - 1), 2)
    assert limit_compare(1 / (n - 1), 1) == '발산'
    return '발산'


def radius(c, power=1):
    """Radius of sum c_n x^{power*n} from lim |c_n / c_{n+1}|."""
    r = seq_limit(s.combsimp(c / c.subs(n, n + 1)))
    return s.oo if r == s.oo else r**s.Rational(1, power)


def endpoint(term):
    """Verdict for a power series at an interval endpoint: '[' or ']' when the series converges there."""
    abs_term = s.Abs(term)
    if s.simplify(term - abs_term) == 0:  # positive terms
        return limit_compare(term, 1) == '수렴'
    return alternating(s.simplify(abs_term), 2) is not None  # alternating with |a_n| -> 0 decreasing


def _interval_shifted():
    # sum (2x+1)^n/(n 4^n): |2x+1| < 4 -> (-5/2, 3/2)
    assert radius(1 / (n * 4**n)) == 4
    right = endpoint((4**n / (n * 4**n)).simplify())     # x = 3/2 -> 1/n
    left = endpoint(((-4)**n / (n * 4**n)).simplify())   # x = -5/2 -> (-1)^n/n
    return ('[' if left else '(', -s.Rational(5, 2), s.Rational(3, 2), ']' if right else ')')


def _interval_cubic_powers():
    # sum x^{3n}/(n 8^n): |x|^3 < 8 -> |x| < 2
    assert radius(1 / (n * 8**n), 3) == 2
    right = endpoint((2**(3 * n) / (n * 8**n)).simplify())
    left = endpoint(((-2)**(3 * n) / (n * 8**n)).simplify())
    return ('[' if left else '(', -2, 2, ']' if right else ')')


def _expect(value, wanted):
    assert value == wanted, (value, wanted)
    return None


def at_points(term, start=1):
    return lambda v: s.summation(term.subs(x, v), (n, start, s.oo))


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
    # 급수 3 · 적분판정법과 p-급수
    'fin_ser_03_v1_p_series_verdict': ('verdict', lambda: limit_compare(1 / (s.sqrt(n) * n**s.Rational(2, 3)), s.Rational(7, 6))),
    'fin_ser_03_v1_integral_test_log': ('verdict', lambda: '수렴' if s.integrate(1 / s.sqrt(u), (u, s.log(2), s.oo)).is_finite else '발산'),
    'fin_ser_03_v1_log_power_range': ('interval', param_range(_log_power, ('(', 1, s.oo, ')'), [s.Rational(1, 2), 1, s.Rational(101, 100), 3])),
    'fin_ser_03_v1_remainder_bound': ('value', _cube_remainder_n()),
    'fin_ser_03_v1_exponent_range': ('interval', param_range(_sqrt_gap_power, ('(', -s.oo, 1, ')'), [-5, s.Rational(9, 10), 1, 2])),
    # 급수 4 · 비교판정법과 극한비교판정법
    'fin_ser_04_v1_direct_comparison': ('verdict', lambda: p_series(s.Rational(3, 2))),  # 0 <= sin^2 n / n^{3/2} <= 1/n^{3/2}
    'fin_ser_04_v1_limit_comparison_sine': ('verdict', lambda: limit_compare(s.sin(1 / s.sqrt(n)) / s.sqrt(n), 1)),
    'fin_ser_04_v1_limit_comparison_cosine': ('verdict', lambda: limit_compare(n * (1 - s.cos(1 / n)), 1)),
    'fin_ser_04_v1_log_power_tower': ('verdict', _log_tower),
    'fin_ser_04_v1_root_minus_one_range': ('interval', param_range(_root_minus_one, ('(', 1, s.oo, ')'), [-1, s.Rational(1, 2), 1, s.Rational(11, 10), 3])),
    # 급수 5 · 비판정법과 근판정법
    'fin_ser_05_v1_ratio_polynomial_exponential': ('verdict', lambda: by_limit(ratio_limit(n**3 * 2**n / 3**n))),
    'fin_ser_05_v1_ratio_limit_value': ('value', ratio_limit(s.factorial(2 * n) / (n**n * s.factorial(n)))),
    'fin_ser_05_v1_root_test': ('verdict', lambda: by_limit(seq_limit((n / (n + 1))**n))),
    'fin_ser_05_v1_ratio_inconclusive': ('verdict', _ratio_inconclusive),
    'fin_ser_05_v1_root_parameter_range': ('interval', param_range(_root_parameter, ('(', -2, 2, ')'), [-3, -2, 0, s.Rational(3, 2), 2, s.Rational(5, 2)])),
    # 급수 6 · 절대수렴, 조건수렴, 교대급수
    'fin_ser_06_v1_alternating_rational': ('verdict', lambda: '조건수렴' if limit_compare(alternating(n / (n**2 + 1), 2), 1) == '발산' else '절대수렴'),
    'fin_ser_06_v1_absolute_cosine': ('verdict', _cos_pi_over_n),
    'fin_ser_06_v1_alternating_nonzero_term': ('verdict', lambda: '발산' if seq_limit(n**(1 / n)) != 0 else None),
    'fin_ser_06_v1_alternating_error_terms': ('value', _alternating_error_n()),
    'fin_ser_06_v1_non_monotone_alternating': ('verdict', _non_monotone_alternating),
    # 급수 7 · 수렴반경과 수렴구간
    'fin_ser_07_v1_radius_even_powers': ('value', radius(2**n / n, 2)),
    'fin_ser_07_v1_interval_shifted': ('interval', _interval_shifted()),
    'fin_ser_07_v1_radius_infinite': ('infinity', _expect(radius(1 / s.sqrt(s.factorial(n))), s.oo)),
    'fin_ser_07_v1_interval_cubic_powers': ('interval', _interval_cubic_powers()),
    'fin_ser_07_v1_radius_central_binomial': ('value', radius(s.factorial(n)**2 / s.factorial(2 * n), 2)),
    # 급수 8 · 멱급수의 기본 성질
    'fin_ser_08_v1_differentiate_geometric': ('expr', (at_points(n * x**(2 * n)), [s.Rational(1, 3), s.Rational(1, 2)])),
    'fin_ser_08_v1_integrate_geometric': ('expr', (at_points((-1)**(n + 1) * x**(2 * n) / n), [s.Rational(1, 3), s.Rational(1, 2)])),
    'fin_ser_08_v1_weighted_sum_value': ('value', s.summation((n + 1)**2 / 2**n, (n, 1, s.oo))),
    'fin_ser_08_v1_arctan_series_value': ('value', s.summation((-1)**n / ((2 * n + 1) * 3**n), (n, 0, s.oo))),
    'fin_ser_08_v1_double_integral_sum': ('value', s.summation(1 / (n * (n + 1) * 2**n), (n, 1, s.oo))),
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
