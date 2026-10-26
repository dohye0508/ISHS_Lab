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


def _skip_two_telescoping():
    # closed-form partial sum of 1/(n(n+2)(n+4)) up to N, then N -> oo
    N = s.Symbol('N', integer=True, positive=True)
    return s.limit(s.summation(1 / (n * (n + 2) * (n + 4)), (n, 1, N)), N, s.oo)


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


def _rational_remainder_n():
    # sum n/(n^2+1)^2: f(X) = X/(X^2+1)^2 decreases on [1, oo), so R_N <= int_N^oo f(X) dX.
    import mpmath as mp
    X, N = s.Symbol('X', positive=True), s.Symbol('N', positive=True)
    fx = X / (X**2 + 1)**2
    num, den = s.fraction(s.together(s.diff(fx, X)))
    assert s.expand(num.subs(X, 1 + u)).is_negative and den.is_positive  # f' < 0 for X > 1
    bound = s.integrate(fx, (X, N, s.oo))
    M = 1
    while not bound.subs(N, M) < s.Rational(1, 10**4):
        M += 1
    true_tail = mp.nsum(lambda j: j / (j**2 + 1)**2, [M + 1, mp.inf])
    assert 0 < true_tail < mp.mpf(str(s.N(bound.subs(N, M), 30)))
    return M


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


def _alternating_root_minus_one():
    # b_n = n^{1/n} - 1 decreases only from n = 3 on, tends to 0, and b_n * n -> oo (sum b_n diverges).
    b = n**(1 / n) - 1
    alternating(b, 3)
    assert b.subs(n, 2) < b.subs(n, 3), 'b_2 < b_3: not decreasing from the start'
    assert seq_limit(n * b) == s.oo  # b_n / (1/n) -> oo, so |terms| dominate the harmonic series
    return '조건수렴'


def _non_monotone_alternating():
    # (-1)^n/(n^{1/3} + (-1)^n) = (-1)^n n^{1/3}/(n^{2/3}-1) - 1/(n^{2/3}-1):
    # convergent alternating part minus a divergent part.
    for parity in (0, 1):
        k = 2 * n + parity
        sign = (-1)**parity
        c = s.cbrt(k)
        assert s.simplify(sign / (c + sign) - (sign * c / (c**2 - 1) - 1 / (c**2 - 1))) == 0
    alternating(s.cbrt(n) / (s.cbrt(n)**2 - 1), 2)
    assert limit_compare(1 / (s.cbrt(n)**2 - 1), s.Rational(2, 3)) == '발산'
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


def _interval_factorial_ratio():
    # sum n!/n^n x^n: radius e; at x = +-e the ratio test gives 1 and |terms| n! e^n/n^n -> oo.
    c = s.factorial(n) / n**n
    r = radius(c)
    assert r == s.E, r
    mag = c * r**n
    assert seq_limit(s.combsimp(mag.subs(n, n + 1) / mag)) == 1  # ratio test is inconclusive there
    assert seq_limit(mag) == s.oo  # terms do not tend to 0 at either endpoint
    return ('(', -r, r, ')')


def _interval_central_binomial():
    # sum (n!)^2/(2n)! x^{2n}: radius 2; at x = +-2 the terms 4^n (n!)^2/(2n)! increase from 2.
    c = s.factorial(n)**2 / s.factorial(2 * n)
    r = radius(c, 2)
    assert r == 2, r
    mag = c * (r**2)**n
    growth = s.combsimp(mag.subs(n, n + 1) / mag)
    assert s.simplify(growth - 1).is_positive and mag.subs(n, 1) == 2  # terms >= 2, never -> 0
    return ('(', -r, r, ')')


def _expect(value, wanted):
    assert value == wanted, (value, wanted)
    return None


def at_points(term, start=1):
    return lambda v: s.summation(term.subs(x, v), (n, start, s.oo))


def taylor(expr, center, order):
    """Taylor polynomial of the given order (terms up to (x-center)^order) as a function for 'expr' targets."""
    poly = s.series(expr, x, center, order + 1).removeO()
    return (lambda v: poly.subs(x, v)), [s.Rational(1, 3), s.Rational(1, 2), 2]


def _exp_remainder_degree():
    # Lagrange: |R_n(x)| <= e^c x^{n+1}/(n+1)! < 3/(n+1)! on [0, 1]
    N = 0
    while not s.Rational(3) / s.factorial(N + 1) < s.Rational(1, 10**6):
        N += 1
    true_error = s.N(s.E - sum(1 / s.factorial(k) for k in range(N + 1)), 30)
    assert true_error < s.Rational(3) / s.factorial(N + 1)
    return N


def _sin_square_integral():
    two_terms = s.series(s.sin(x**2), x, 0, 10).removeO()  # x^2 - x^6/6
    assert s.expand(two_terms - (x**2 - x**6 / 6)) == 0
    approx = s.integrate(two_terms, (x, 0, 1))
    assert abs(s.N(s.Integral(s.sin(x**2), (x, 0, 1)) - approx, 30)) < s.Rational(1, 1320)  # next term
    return approx


def _log_factorial_alternating():
    # |a_n| = 1/ln(n!) decreases to 0 (ln n! increases without bound) -> the alternating series converges.
    # ln n! <= n ln n gives |a_n| >= 1/(n ln n), whose sum diverges (int du/u with u = ln x).
    assert all(s.log(s.factorial(k)) <= k * s.log(k) for k in range(2, 60))
    assert s.integrate(1 / u, (u, s.log(2), s.oo)) == s.oo
    assert seq_limit(1 / s.log(s.factorial(n))) == 0
    return '조건수렴'


def _alternating_log_power(p):
    # sum (-1)^n/(n^p ln n): converges iff |terms| -> 0 (then they also decrease: alternating series test).
    b = 1 / (n**p * s.log(n))
    if seq_limit(b) != 0:
        return '발산'
    alternating(b, 2)
    return '수렴'


def _double_factorial_interval():
    a = s.factorial(2 * n) / (4**n * s.factorial(n)**2)  # 1*3*...*(2n-1) / (2*4*...*(2n))
    assert radius(a) == 1
    right = limit_compare(a, s.Rational(1, 2)) == '수렴'           # x = 1: a_n ~ 1/sqrt(pi n)
    assert s.simplify(a.subs(n, n + 1) / a - (2 * n + 1) / (2 * n + 2)) == 0  # decreasing
    left = seq_limit(a) == 0                                          # x = -1: alternating, -> 0
    return ('[' if left else '(', -1, 1, ']' if right else ')')


def _arctan_telescoping():
    # arctan(2/n^2) = arctan(n+1) - arctan(n-1); partial sum = arctan(N+1) + arctan(N) - arctan(0) - arctan(1)
    for k in range(1, 30):
        assert close(s.atan(s.Rational(2, k**2)), s.atan(k + 1) - s.atan(k - 1), s.Rational(1, 10**40))
    N = s.Symbol('N', positive=True)
    return s.limit(s.atan(N + 1) + s.atan(N) - s.atan(0) - s.atan(1), N, s.oo)


def _two_geometric_interval():
    # sum (3^n + (-2)^n) x^n / n: |x| < 1/3 (3^n dominates)
    assert seq_limit(((-2)**n / 3**n)) == 0 and seq_limit((3**n / n)**(1 / n)) == 3
    r = s.Rational(1, 3)
    right = endpoint((3**n * r**n / n).simplify())                    # x = 1/3: 1/n (+ convergent part)
    assert s.summation((-2)**n * r**n / n, (n, 1, s.oo)).is_finite
    left = endpoint(((-3)**n * r**n / n).simplify())                  # x = -1/3: (-1)^n/n (+ convergent part)
    assert s.summation(2**n * r**n / n, (n, 1, s.oo)).is_finite
    return ('[' if left else '(', -r, r, ']' if right else ')')


def _cos_remainder_bound():
    p4 = s.series(s.cos(x), x, 0, 5).removeO()
    p5 = s.series(s.cos(x), x, 0, 6).removeO()
    assert s.expand(p4 - p5) == 0  # so the R_5 bound applies to P_4
    bound = s.Rational(1, 2)**6 / s.factorial(6)
    assert s.N(abs(s.cos(s.Rational(1, 2)) - p4.subs(x, s.Rational(1, 2))), 30) < bound
    return bound


def _erf_terms_needed():
    # int_0^{1/2} e^{-x^2} dx = sum (-1)^k (1/2)^{2k+1}/((2k+1) k!); first N terms (k < N) leave error <= term(N)
    term = lambda k: s.Rational(1, 2)**(2 * k + 1) / ((2 * k + 1) * s.factorial(k))
    assert all(term(k + 1) < term(k) for k in range(20))
    N = 1
    while not term(N) < s.Rational(1, 10**5):
        N += 1
    approx = sum((-1)**k * term(k) for k in range(N))
    exact = s.N(s.Integral(s.exp(-x**2), (x, 0, s.Rational(1, 2))), 40)
    assert abs(exact - approx) < term(N) < s.Rational(1, 10**5)
    return N


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
    'fin_ser_02_v1_telescoping_skip_two': ('value', _skip_two_telescoping()),
    'fin_ser_02_v1_periodic_cosine_sum': ('value', _periodic_cosine_sum()),
    'fin_ser_02_v1_nth_term_trap': ('verdict', _diverges_by_nth_term(((n**2 + 1) / (n**2 + n))**n)),
    'fin_ser_02_v1_factorial_quadratic': ('value', s.summation(n**2 / s.factorial(n + 1), (n, 1, s.oo))),
    'fin_ser_02_v1_log_cubic_telescoping': ('value', _cubic_log_product()),
    # 급수 3 · 적분판정법과 p-급수
    'fin_ser_03_v1_p_series_verdict': ('verdict', lambda: limit_compare(1 / (s.sqrt(n) * n**s.Rational(2, 3)), s.Rational(7, 6))),
    'fin_ser_03_v1_integral_test_log': ('verdict', lambda: '수렴' if s.integrate(1 / s.sqrt(u), (u, s.log(2), s.oo)).is_finite else '발산'),
    'fin_ser_03_v1_log_power_range': ('interval', param_range(_log_power, ('(', 1, s.oo, ')'), [s.Rational(1, 2), 1, s.Rational(101, 100), 3])),
    'fin_ser_03_v1_remainder_bound': ('value', _rational_remainder_n()),
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
    'fin_ser_05_v1_root_test_dominant': ('verdict', lambda: by_limit(seq_limit(s.exp(s.expand_log(s.log(3**n * (1 - 1 / n)**(n**2)), force=True) / n)))),
    'fin_ser_05_v1_ratio_inconclusive': ('verdict', _ratio_inconclusive),
    'fin_ser_05_v1_root_parameter_range': ('interval', param_range(_root_parameter, ('(', -2, 2, ')'), [-3, -2, 0, s.Rational(3, 2), 2, s.Rational(5, 2)])),
    # 급수 6 · 절대수렴, 조건수렴, 교대급수
    'fin_ser_06_v1_alternating_rational': ('verdict', lambda: '조건수렴' if limit_compare(alternating(n / (n**2 + 1), 2), 1) == '발산' else '절대수렴'),
    'fin_ser_06_v1_absolute_cosine': ('verdict', _cos_pi_over_n),
    'fin_ser_06_v1_alternating_error_terms': ('value', _alternating_error_n()),
    'fin_ser_06_v1_alternating_root_minus_one': ('verdict', _alternating_root_minus_one),
    'fin_ser_06_v1_non_monotone_alternating': ('verdict', _non_monotone_alternating),
    # 급수 7 · 수렴반경과 수렴구간
    'fin_ser_07_v1_radius_even_powers': ('value', radius(2**n / n, 2)),
    'fin_ser_07_v1_interval_shifted': ('interval', _interval_shifted()),
    'fin_ser_07_v1_radius_infinite': ('infinity', _expect(radius(1 / s.sqrt(s.factorial(n))), s.oo)),
    'fin_ser_07_v1_interval_factorial_ratio': ('interval', _interval_factorial_ratio()),
    'fin_ser_07_v1_interval_central_binomial': ('interval', _interval_central_binomial()),
    # 급수 8 · 멱급수의 기본 성질
    'fin_ser_08_v1_differentiate_geometric': ('expr', (at_points(n * x**(2 * n)), [s.Rational(1, 3), s.Rational(1, 2)])),
    'fin_ser_08_v1_integrate_geometric': ('expr', (at_points((-1)**(n + 1) * x**(2 * n) / n), [s.Rational(1, 3), s.Rational(1, 2)])),
    'fin_ser_08_v1_weighted_sum_value': ('value', s.summation((n + 1)**2 / 2**n, (n, 1, s.oo))),
    'fin_ser_08_v1_arctan_series_value': ('value', s.summation((-1)**n / ((2 * n + 1) * 3**n), (n, 0, s.oo))),
    'fin_ser_08_v1_double_integral_sum': ('value', s.summation(1 / (n * (n + 1) * 2**n), (n, 1, s.oo))),
    # 급수 9 · 테일러 다항식과 테일러급수
    'fin_ser_09_v1_maclaurin_product': ('expr', taylor(s.exp(2 * x) * s.cos(x), 0, 3)),
    'fin_ser_09_v1_taylor_shifted_center': ('expr', taylor(x * s.log(x), 1, 3)),
    'fin_ser_09_v1_high_derivative_from_series': ('value', s.diff(x**3 * s.exp(-x**2), x, 9).subs(x, 0)),
    'fin_ser_09_v1_remainder_degree': ('value', _exp_remainder_degree()),
    'fin_ser_09_v1_tan_seventh_coefficient': ('value', s.series(s.tan(x), x, 0, 9).removeO().coeff(x, 7)),
    # 급수 10 · 테일러급수의 활용
    'fin_ser_10_v1_limit_sine_cubic': ('value', s.limit((s.sin(x) - x * s.cos(x)) / x**3, x, 0)),
    'fin_ser_10_v1_limit_tan_over_sine_gap': ('value', s.limit((s.tan(x) - x) / (x - s.sin(x)), x, 0)),
    'fin_ser_10_v1_integral_approx': ('value', _sin_square_integral()),
    'fin_ser_10_v1_recognize_cosine_value': ('value', s.simplify(s.summation((-1)**n * s.pi**(2 * n) / (4**n * s.factorial(2 * n + 2)), (n, 0, s.oo)))),
    'fin_ser_10_v1_composite_derivative': ('value', s.diff(s.exp(x**2) * s.sin(x), x, 5).subs(x, 0)),
    # 급수 11 · 심화 판정 종합
    'fin_ser_11_v1_root_alternating_absolute': ('verdict', lambda: '절대수렴' if by_limit(seq_limit(n / (2 * n + 1))) == '수렴' else None),
    'fin_ser_11_v1_log_factorial_alternating': ('verdict', _log_factorial_alternating),
    'fin_ser_11_v1_harmonic_log_difference': ('verdict', lambda: limit_compare(1 / n - s.log(1 + 1 / n), 2)),
    'fin_ser_11_v1_alternating_log_power_range': ('interval', param_range(_alternating_log_power, ('[', 0, s.oo, ')'), [-1, -s.Rational(1, 2), 0, s.Rational(1, 2), 1, 2])),
    'fin_ser_11_v1_double_factorial_interval': ('interval', _double_factorial_interval()),
    # 급수 12 · 심화 급수의 합
    'fin_ser_12_v1_exponential_weighted': ('value', s.summation((n + 1) / s.factorial(n), (n, 0, s.oo))),
    'fin_ser_12_v1_alternating_weighted': ('value', s.summation((-1)**(n + 1) * n / 3**n, (n, 1, s.oo))),
    'fin_ser_12_v1_odd_reciprocal_powers': ('value', s.summation(1 / ((2 * n - 1) * 4**n), (n, 1, s.oo))),
    'fin_ser_12_v1_cosine_derivative_value': ('value', s.summation((-1)**n * n * s.pi**(2 * n) / (9**n * s.factorial(2 * n)), (n, 1, s.oo))),
    'fin_ser_12_v1_arctan_telescoping': ('value', _arctan_telescoping()),
    # 급수 13 · 심화 멱급수와 테일러
    'fin_ser_13_v1_exponential_sum_function': ('expr', (at_points((n + 1) * x**n / s.factorial(n), 0), [s.Rational(1, 3), s.Rational(1, 2), 2])),
    'fin_ser_13_v1_two_geometric_interval': ('interval', _two_geometric_interval()),
    'fin_ser_13_v1_shifted_log_sum_function': ('expr', (at_points(x**n / (n + 1)), [s.Rational(1, 3), s.Rational(1, 2)])),
    'fin_ser_13_v1_log_quadratic_derivative': ('value', s.diff(s.log(1 + x + x**2), x, 6).subs(x, 0)),
    'fin_ser_13_v1_cos_remainder_bound': ('value', _cos_remainder_bound()),
    # 급수 14 · 심화 극한과 근사
    'fin_ser_14_v1_limit_exp_cos': ('value', s.limit((s.exp(x) - 1 - x) / (1 - s.cos(x)), x, 0)),
    'fin_ser_14_v1_limit_log_sine': ('value', s.limit((s.log(1 + x) - s.sin(x)) / x**2, x, 0)),
    'fin_ser_14_v1_e_sequence_correction': ('value', seq_limit(n * (s.E - (1 + 1 / n)**n))),
    'fin_ser_14_v1_limit_reciprocal_squares': ('value', s.limit(1 / s.sin(x)**2 - 1 / x**2, x, 0)),
    'fin_ser_14_v1_integral_error_terms': ('value', _erf_terms_needed()),
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
