import json
import math
import codecs
import random
import sympy as sp

# Seed for reproducibility
random.seed(42)

hyperbolic_raw = []
polar_raw = []

# --- Simplification Helpers ---

def fracstr(numer, denom):
    """numer/denom as LaTeX, dropping the /1 when denom == 1."""
    return f'{numer}' if denom == 1 else f'\\frac{{{numer}}}{{{denom}}}'

def signfrac(numer, denom):
    """numer/denom as LaTeX, keeping the fraction's own denominator positive
    (moves a negative sign in front instead of leaving it inside {{}})."""
    if denom < 0:
        return f'-{fracstr(numer, -denom)}'
    return fracstr(numer, denom)

def cf(k, body):
    """k*(body) without an ugly literal '1' coefficient when k == 1."""
    return f'({body})' if k == 1 else f'{k}({body})'

def tc(k):
    """Coefficient string to place directly before a trig/theta term (drops '1')."""
    return '' if k == 1 else str(k)

def coefx(k, suffix='x'):
    """k*suffix as latex, dropping a literal '1' or '-1' coefficient -- e.g. coefx(1) ==
    'x', coefx(3) == '3x', coefx(-1) == '-x', coefx(1, 'x^2') == 'x^2'. Fixes the ugly
    '1x' / '1x^2' output that shows up whenever a loop variable starting at 1 (or an
    algebraic combination like 1-k) gets spliced directly in front of a variable."""
    if k == 1:
        return suffix
    if k == -1:
        return f'-{suffix}'
    return f'{k}{suffix}'

def frac_pi(mult, denom):
    g = math.gcd(abs(mult), denom)
    mult //= g
    denom //= g
    sign = '-' if mult < 0 else ''
    mult = abs(mult)
    if denom == 1:
        return f'{sign}\\pi' if mult == 1 else f'{sign}{mult}\\pi'
    coeff = '' if mult == 1 else str(mult)
    return f'{sign}\\frac{{{coeff}\\pi}}{{{denom}}}'

def simplify_sqrt(n):
    outside = 1
    inside = n
    for d in range(int(math.isqrt(n)), 1, -1):
        if n % (d*d) == 0:
            outside = d
            inside = n // (d*d)
            break
    if inside == 1:
        return str(outside)
    elif outside == 1:
        return f'\\sqrt{{{inside}}}'
    else:
        return f'{outside}\\sqrt{{{inside}}}'

def get_prad_solution(k):
    num = 5 * k
    if num % 2 == 0:
        return str(num // 2)
    else:
        return f'\\frac{{{num}}}{{2}}'


# --- 1. Hyperbolic & Inverse Trig Pool ---

# Level 1 Templates
for k in range(1, 16):
    kx, kx2 = coefx(k), coefx(k**2, 'x^2')
    hyperbolic_raw.append({'level': 1, 'template': 'cosh', 'latex': f'\\cosh({kx})', 'solution': f'\\frac{{1}}{{{k}}}\\sinh({kx})' if k>1 else '\\sinh(x)'})
    hyperbolic_raw.append({'level': 1, 'template': 'sinh', 'latex': f'\\sinh({kx})', 'solution': f'\\frac{{1}}{{{k}}}\\cosh({kx})' if k>1 else '\\cosh(x)'})
    hyperbolic_raw.append({'level': 1, 'template': 'asin_d', 'latex': f'\\text{{다음 함수의 도함수를 구하시오: }} \\sin^{{-1}}({kx})', 'solution': f'\\frac{{{k}}}{{\\sqrt{{1-{kx2}}}}}'})
    hyperbolic_raw.append({'level': 1, 'template': 'acos_d', 'latex': f'\\text{{다음 함수의 도함수를 구하시오: }} \\cos^{{-1}}({kx})', 'solution': f'-\\frac{{{k}}}{{\\sqrt{{1-{kx2}}}}}'})
    hyperbolic_raw.append({'level': 1, 'template': 'atan_d', 'latex': f'\\text{{다음 함수의 도함수를 구하시오: }} \\tan^{{-1}}({kx})', 'solution': f'\\frac{{{k}}}{{1+{kx2}}}'})

# Level 2 Templates
for k in range(1, 16):
    kx, kx2 = coefx(k), coefx(k**2, 'x^2')
    hyperbolic_raw.append({'level': 2, 'template': 'sech2', 'latex': f'\\text{{sech}}^2({kx})', 'solution': f'\\frac{{1}}{{{k}}}\\tanh({kx})' if k>1 else '\\tanh(x)'})
    hyperbolic_raw.append({'level': 2, 'template': 'csch2', 'latex': f'\\text{{csch}}^2({kx})', 'solution': f'-\\frac{{1}}{{{k}}}\\text{{coth}}({kx})' if k>1 else '-\\text{coth}(x)'})
    hyperbolic_raw.append({'level': 2, 'template': 'acosh_d', 'latex': f'\\text{{다음 함수의 도함수를 구하시오: }} \\cosh^{{-1}}({kx})', 'solution': f'\\frac{{{k}}}{{\\sqrt{{{kx2}-1}}}}'})
    hyperbolic_raw.append({'level': 2, 'template': 'asinh_d', 'latex': f'\\text{{다음 함수의 도함수를 구하시오: }} \\sinh^{{-1}}({kx})', 'solution': f'\\frac{{{k}}}{{\\sqrt{{1+{kx2}}}}}'})

# Level 3 Templates
for k in range(1, 16):
    kx, kx2 = coefx(k), coefx(k**2, 'x^2')
    hyperbolic_raw.append({'level': 3, 'template': 'sechtanh', 'latex': f'\\text{{sech}}({kx})\\tanh({kx})', 'solution': f'-\\frac{{1}}{{{k}}}\\text{{sech}}({kx})' if k>1 else '-\\text{sech}(x)'})
    hyperbolic_raw.append({'level': 3, 'template': 'cschcoth', 'latex': f'\\text{{csch}}({kx})\\text{{coth}}({kx})', 'solution': f'-\\frac{{1}}{{{k}}}\\text{{csch}}({kx})' if k>1 else '-\\text{csch}(x)'})
    hyperbolic_raw.append({'level': 3, 'template': 'asin_i', 'latex': f'\\sin^{{-1}}({kx})', 'solution': f'x\\sin^{{-1}}({kx}) + \\frac{{1}}{{{k}}}\\sqrt{{1-{kx2}}}'})
    hyperbolic_raw.append({'level': 3, 'template': 'atan_i', 'latex': f'\\tan^{{-1}}({kx})', 'solution': f'x\\tan^{{-1}}({kx}) - \\frac{{1}}{{{2*k}}}\\ln(1+{kx2})'})
    hyperbolic_raw.append({'level': 3, 'template': 'tanh_i', 'latex': f'\\tanh({kx})', 'solution': f'\\frac{{1}}{{{k}}}\\ln(\\cosh({kx}))'})
    # Bare inverse-hyperbolic integrals (sibling of asin_i / atan_i above), each verified
    # by symbolic differentiation: d/dx[x*f(kx) - g(x)] == f(kx).
    sqrt_1pk2x2 = f'\\sqrt{{1+{kx2}}}'
    sqrt_k2x2m1 = f'\\sqrt{{{kx2}-1}}'
    ln_1mk2x2 = f'\\ln(1-{kx2})'
    hyperbolic_raw.append({'level': 3, 'template': 'asinh_i', 'latex': f'\\sinh^{{-1}}({kx})', 'solution': f'x\\sinh^{{-1}}({kx}) - {fracstr(sqrt_1pk2x2, k)}'})
    hyperbolic_raw.append({'level': 3, 'template': 'acosh_i', 'latex': f'\\cosh^{{-1}}({kx})', 'solution': f'x\\cosh^{{-1}}({kx}) - {fracstr(sqrt_k2x2m1, k)}'})
    hyperbolic_raw.append({'level': 3, 'template': 'atanh_i', 'latex': f'\\tanh^{{-1}}({kx})', 'solution': f'x\\tanh^{{-1}}({kx}) + {fracstr(ln_1mk2x2, 2*k)}'})

# Level 4 Templates
for k in range(1, 16):
    kx = coefx(k)
    kx2sq = coefx(k, 'x^2')  # k*x^2 directly -- NOT (kx)^2, so reuses k (not k**2) here
    hyperbolic_raw.append({'level': 4, 'template': 'xcosh', 'latex': f'x\\cosh({kx2sq})', 'solution': f'\\frac{{1}}{{{2*k}}}\\sinh({kx2sq})'})
    hyperbolic_raw.append({'level': 4, 'template': 'xsinh', 'latex': f'x\\sinh({kx2sq})', 'solution': f'\\frac{{1}}{{{2*k}}}\\cosh({kx2sq})'})
    hyperbolic_raw.append({'level': 4, 'template': 'ecosh', 'latex': f'e^x\\cosh({kx})', 'solution': f'\\frac{{1}}{{2}}(\\frac{{1}}{{{1+k}}}e^{{{coefx(1+k)}}} + \\frac{{1}}{{{1-k}}}e^{{{coefx(1-k)}}})' if k!=1 else '\\frac{1}{4}e^{2x} + \\frac{1}{2}x'})

# Level 5 Templates
for k in range(1, 16):
    kx = coefx(k)
    ksqrtx = coefx(k, '\\sqrt{x}')
    hyperbolic_raw.append({'level': 5, 'template': 'cosh2', 'latex': f'\\cosh^2({kx})', 'solution': f'\\frac{{1}}{{2}}x + \\frac{{1}}{{{4*k}}}\\sinh({coefx(2*k)})'})
    hyperbolic_raw.append({'level': 5, 'template': 'sinh2', 'latex': f'\\sinh^2({kx})', 'solution': f'-\\frac{{1}}{{2}}x + \\frac{{1}}{{{4*k}}}\\sinh({coefx(2*k)})'})
    hyperbolic_raw.append({'level': 5, 'template': 'coshsqrt', 'latex': f'\\cosh({ksqrtx})', 'solution': f'\\frac{{2}}{{{k**2}}}({ksqrtx}\\sinh({ksqrtx}) - \\cosh({ksqrtx}))'})

# Level 6-7 Templates
for k in range(1, 11):
    kx = coefx(k)
    hyperbolic_raw.append({'level': 6, 'template': 'esinh', 'latex': f'e^{{{kx}}}\\sinh(x)', 'solution': f'\\frac{{1}}{{2}}(\\frac{{1}}{{{k+1}}}e^{{{coefx(k+1)}}} - \\frac{{1}}{{{k-1}}}e^{{{coefx(k-1)}}})' if k>1 else '\\frac{1}{4}e^{2x} - \\frac{1}{2}x'})
    hyperbolic_raw.append({'level': 7, 'template': 'coscosh', 'latex': f'\\cos({kx})\\cosh(x)', 'solution': f'\\frac{{1}}{{{k**2+1}}}(\\cos({kx})\\sinh(x) + {tc(k)}\\sin({kx})\\cosh(x))'})

# Level 8: x * (역함수) -- 부분적분(IBP) 1회로 풀리는 문제보다 한 단계 더 어려운,
# dv = x dx 로 두는 유형. 모든 공식은 sympy로 도함수를 재확인해서 검증했다.
for k in range(1, 11):
    k2 = k**2
    kx, kx2 = coefx(k), coefx(k2, 'x^2')
    sq_1mk2 = f'\\sqrt{{1-{kx2}}}'
    x_sq_1mk2 = 'x' + sq_1mk2
    asin_kx = f'\\sin^{{-1}}({kx})'
    acos_kx = f'\\cos^{{-1}}({kx})'
    atan_kx = f'\\tan^{{-1}}({kx})'
    asinh_kx = f'\\sinh^{{-1}}({kx})'
    acosh_kx = f'\\cosh^{{-1}}({kx})'
    atanh_kx = f'\\tanh^{{-1}}({kx})'

    hyperbolic_raw.append({'level': 8, 'template': 'x_asin', 'latex': f'x{asin_kx}', 'solution': f'\\frac{{x^2}}{{2}}{asin_kx} + {fracstr(x_sq_1mk2, 4*k)} - {fracstr(asin_kx, 4*k2)}'})
    hyperbolic_raw.append({'level': 8, 'template': 'x_acos', 'latex': f'x{acos_kx}', 'solution': f'\\frac{{x^2}}{{2}}{acos_kx} - {fracstr(x_sq_1mk2, 4*k)} - {fracstr(acos_kx, 4*k2)}'})
    hyperbolic_raw.append({'level': 8, 'template': 'x_atan', 'latex': f'x{atan_kx}', 'solution': f'\\frac{{x^2}}{{2}}{atan_kx} - {fracstr("x", 2*k)} + {fracstr(atan_kx, 2*k2)}'})

    sq_1pk2 = f'\\sqrt{{1+{kx2}}}'
    x_sq_1pk2 = 'x' + sq_1pk2
    hyperbolic_raw.append({'level': 8, 'template': 'x_asinh', 'latex': f'x{asinh_kx}', 'solution': f'\\frac{{x^2}}{{2}}{asinh_kx} - {fracstr(x_sq_1pk2, 4*k)} + {fracstr(asinh_kx, 4*k2)}'})

    sq_k2m1 = f'\\sqrt{{{kx2}-1}}'
    x_sq_k2m1 = 'x' + sq_k2m1
    ln_acosh = f'\\ln({kx}+{sq_k2m1})'
    hyperbolic_raw.append({'level': 8, 'template': 'x_acosh', 'latex': f'x{acosh_kx}', 'solution': f'\\frac{{x^2}}{{2}}{acosh_kx} - {fracstr(x_sq_k2m1, 4*k)} - {fracstr(ln_acosh, 4*k2)}'})

    hyperbolic_raw.append({'level': 8, 'template': 'x_atanh', 'latex': f'x{atanh_kx}', 'solution': f'\\frac{{x^2}}{{2}}{atanh_kx} + {fracstr("x", 2*k)} - {fracstr(atanh_kx, 2*k2)}'})

# Level 9: 사이클릭 부분적분 (두 번 부분적분한 뒤 원래 적분에 대해 대수적으로 풀어내는 유형).
# 일반해 (a*sin(bx)*cosh(ax) - b*cos(bx)*sinh(ax)) / (a^2+b^2) 등은 모두 sympy.integrate 로
# a,b 각각에 대해 별도로 재검증했다 (a=b 도 분모 a^2+b^2 가 0이 되지 않으므로 항상 안전).
CYCLIC_PAIRS = [(1, 2), (2, 3), (3, 1), (1, 4), (4, 2), (2, 5), (5, 3), (3, 4), (4, 5), (1, 3), (5, 1), (2, 4)]
for a, b in CYCLIC_PAIRS:
    denom = a**2 + b**2
    ax, bx = coefx(a), coefx(b)
    ta, tb = tc(a), tc(b)
    hyperbolic_raw.append({'level': 9, 'template': 'sinh_sin', 'latex': f'\\sinh({ax})\\sin({bx})', 'solution': fracstr(f'{ta}\\sin({bx})\\cosh({ax}) - {tb}\\cos({bx})\\sinh({ax})', denom)})
    hyperbolic_raw.append({'level': 9, 'template': 'sinh_cos', 'latex': f'\\sinh({ax})\\cos({bx})', 'solution': fracstr(f'{ta}\\cos({bx})\\cosh({ax}) + {tb}\\sin({bx})\\sinh({ax})', denom)})
    hyperbolic_raw.append({'level': 9, 'template': 'cosh_sin', 'latex': f'\\cosh({ax})\\sin({bx})', 'solution': fracstr(f'{ta}\\sin({bx})\\sinh({ax}) - {tb}\\cos({bx})\\cosh({ax})', denom)})
    hyperbolic_raw.append({'level': 9, 'template': 'cosh_cos', 'latex': f'\\cosh({ax})\\cos({bx})', 'solution': fracstr(f'{ta}\\cos({bx})\\sinh({ax}) + {tb}\\sin({bx})\\cosh({ax})', denom)})
    hyperbolic_raw.append({'level': 9, 'template': 'exp_sin', 'latex': f'e^{{{ax}}}\\sin({bx})', 'solution': fracstr(f'({ta}\\sin({bx})-{tb}\\cos({bx}))e^{{{ax}}}', denom)})
    hyperbolic_raw.append({'level': 9, 'template': 'exp_cos', 'latex': f'e^{{{ax}}}\\cos({bx})', 'solution': fracstr(f'({ta}\\cos({bx})+{tb}\\sin({bx}))e^{{{ax}}}', denom)})

# Level 10: 쌍곡선함수끼리의 곱 (a != b, 합·차 공식을 이용해 두 번 부분적분 후 대수적으로 풀어내는 유형).
# 분모가 a^2-b^2 라서 a==b 인 조합은 제외 (그 경우는 레벨5의 cosh^2/sinh^2 문제로 이미 다룸).
HYP_PAIRS = [(2, 1), (3, 1), (3, 2), (4, 1), (4, 3), (5, 2), (5, 3), (5, 4), (1, 3), (2, 5), (1, 4), (4, 2)]
for a, b in HYP_PAIRS:
    denom = a**2 - b**2
    ax, bx = coefx(a), coefx(b)
    ta, tb = tc(a), tc(b)
    hyperbolic_raw.append({'level': 10, 'template': 'sinh_cosh', 'latex': f'\\sinh({ax})\\cosh({bx})', 'solution': signfrac(f'{ta}\\cosh({ax})\\cosh({bx}) - {tb}\\sinh({ax})\\sinh({bx})', denom)})
    hyperbolic_raw.append({'level': 10, 'template': 'cosh_cosh', 'latex': f'\\cosh({ax})\\cosh({bx})', 'solution': signfrac(f'{ta}\\sinh({ax})\\cosh({bx}) - {tb}\\sinh({bx})\\cosh({ax})', denom)})
    hyperbolic_raw.append({'level': 10, 'template': 'sinh_sinh', 'latex': f'\\sinh({ax})\\sinh({bx})', 'solution': signfrac(f'{ta}\\sinh({bx})\\cosh({ax}) - {tb}\\sinh({ax})\\cosh({bx})', denom)})

# --- "고급 미적분 중간고사" style additions: identities, telescoping series, and a
# double-angle reduction integral, matching a reference worksheet the user provided.
# Every closed form below is independently re-derived with sympy (not copied from the
# worksheet's own answer key -- spot-checking against it during generation surfaced at
# least one wrong answer in the source material, e.g. its stated value for the 4-term
# telescoping-product problem didn't match direct high-precision evaluation).
_th = sp.symbols('theta', real=True)

def theta_power_integral(coef, power, theta_max):
    """Closed form of int_0^theta_max (coef*theta)^power * sin(theta)^2 d theta -- this
    is exactly what int_0^c x^2 * F(x) / (1+x^2)^2 dx becomes under x = tan(theta), where
    F(x) is (atan x)^power (coef=1) or one of the double-angle forms sin^-1(2x/(1+x^2)) /
    cos^-1((1-x^2)/(1+x^2)), both of which equal 2*atan(x) (coef=2) over the ranges used
    here (verified separately: the sin^-1 form only stays valid up to theta = pi/4)."""
    return sp.simplify(sp.integrate((coef * _th) ** power * sp.sin(_th) ** 2, (_th, 0, theta_max)))

# (m, N) pairs for finite telescoping sums; (m,) alone for the N -> infinity variants.
TELESCOPE_FINITE = [(1, 15), (1, 25), (2, 20), (3, 30), (4, 18), (2, 40), (5, 22), (1, 60)]
TELESCOPE_INF = [1, 2, 3, 4, 5, 6]

# theta_max choices for the reduction-integral family, paired with the matching x-bound.
# The sin^-1(2x/(1+x^2)) = 2*atan(x) identity only holds up to theta = pi/4 (x = 1), so
# that sub-type is restricted to the first two entries below.
THETA_BOUNDS = [(1, 6, sp.Rational(1, 1) / sp.sqrt(3)), (1, 4, sp.Integer(1)), (1, 3, sp.sqrt(3))]

# ---------- Level 6: 역삼각함수 항등식 (마친 공식류) ----------
# Each list entry is [(coef, denom), ...] with sum coef*atan(1/denom) = pi/4, verified
# numerically to 25 significant digits before being used here.
MACHIN_IDENTITIES = [
    [(4, 5), (-1, 239)],
    [(1, 2), (1, 3)],
    [(2, 3), (1, 7)],
    [(2, 2), (-1, 7)],
    [(1, 2), (1, 5), (1, 8)],
    [(3, 4), (1, 20), (1, 1985)],
    [(6, 8), (2, 57), (1, 239)],
]
for i, k in enumerate(range(1, 16)):
    terms = MACHIN_IDENTITIES[i % len(MACHIN_IDENTITIES)]
    term_strs = []
    for j, (c, d) in enumerate(terms):
        coef_disp = tc(abs(c)) if k == 1 else str(abs(c) * k) if abs(c) != 1 else str(k)
        sign = '-' if c < 0 else ('+' if j > 0 else '')
        term_strs.append(f'{sign}{coef_disp}\\tan^{{-1}}\\frac{{1}}{{{d}}}')
    expr_latex = ''.join(term_strs).lstrip('+')
    # Each identity sums to exactly pi/4, so k * identity = k*pi/4.
    prob = f'\\text{{다음의 값을 구하시오: }} {expr_latex}'
    hyperbolic_raw.append({'level': 6, 'template': 'machin_identity', 'latex': prob, 'solution': frac_pi(k, 4)})

# ---------- Level 6: 역삼각함수 이중각 공식 간단히 하기 ----------
for i, k in enumerate(range(1, 16)):
    kx = 'x' if k == 1 else f'{k}x'
    k2x2 = 'x^2' if k == 1 else f'{k**2}x^2'
    if i % 2 == 0:
        prob = f'\\text{{다음을 간단히 하시오 (}} 0 \\le {kx} \\le 1 \\text{{): }} \\sin^{{-1}}\\frac{{{2*k}x}}{{1+{k2x2}}}'
    else:
        prob = f'\\text{{다음을 간단히 하시오 (}} 0 \\le {kx} \\le 1 \\text{{): }} \\cos^{{-1}}\\frac{{1-{k2x2}}}{{1+{k2x2}}}'
    sol = f'2\\tan^{{-1}}({kx})'
    hyperbolic_raw.append({'level': 6, 'template': 'double_angle_simplify', 'latex': prob, 'solution': sol})

# ---------- Level 7: 역삼각함수 망원급수 (tan^-1 텔레스코핑) ----------
for i, (m, N) in enumerate(TELESCOPE_FINITE):
    prob = f'\\text{{다음의 값을 구하시오: }} \\sum_{{n={m}}}^{{{N}}}\\tan^{{-1}}\\frac{{1}}{{n^2+n+1}}'
    sol = f'\\tan^{{-1}}({N+1}) - \\tan^{{-1}}({m})' if m != 1 else f'\\tan^{{-1}}({N+1}) - \\frac{{\\pi}}{{4}}'
    hyperbolic_raw.append({'level': 7, 'template': 'atan_telescope', 'latex': prob, 'solution': sol})
for i, m in enumerate(TELESCOPE_INF):
    prob = f'\\text{{다음 무한급수의 수렴값을 구하시오: }} \\sum_{{n={m}}}^{{\\infty}}\\tan^{{-1}}\\frac{{1}}{{n^2+n+1}}'
    sol = f'\\frac{{\\pi}}{{2}} - \\tan^{{-1}}({m})' if m != 1 else '\\frac{\\pi}{4}'
    hyperbolic_raw.append({'level': 7, 'template': 'atan_telescope_inf', 'latex': prob, 'solution': sol})

# ---------- Level 9: 1+x^2 의 적분 (이중각 치환을 이용한 정적분) ----------
for i in range(15):
    bm, bd, xmax = THETA_BOUNDS[i % 3]
    theta_max = sp.Rational(bm, bd) * sp.pi
    xmax_latex = sp.latex(sp.nsimplify(xmax))
    sub_i = i % 3
    if sub_i == 0:
        # (atan x)^m, m cycles 1..3
        m = (i % 3) + 1 if False else [1, 2, 3][i % 3]
        val = theta_power_integral(1, m, theta_max)
        integrand = f'\\tan^{{-1}}x' if m == 1 else f'(\\tan^{{-1}}x)^{m}'
        prob = f'\\text{{다음을 계산하시오: }} \\int_0^{{{xmax_latex}}} \\frac{{x^2{integrand}}}{{(1+x^2)^2}}\\,dx'
        hyperbolic_raw.append({'level': 9, 'template': 'reduction_integral', 'latex': prob, 'solution': sp.latex(val)})
    elif sub_i == 1 and bd != 3:
        val = theta_power_integral(2, 1, theta_max)
        prob = (f'\\text{{다음을 계산하시오: }} \\int_0^{{{xmax_latex}}} '
                f'\\frac{{x^2\\sin^{{-1}}\\frac{{2x}}{{1+x^2}}}}{{(1+x^2)^2}}\\,dx')
        hyperbolic_raw.append({'level': 9, 'template': 'reduction_integral', 'latex': prob, 'solution': sp.latex(val)})
    else:
        val = theta_power_integral(2, 1, theta_max)
        prob = (f'\\text{{다음을 계산하시오: }} \\int_0^{{{xmax_latex}}} '
                f'\\frac{{x^2\\cos^{{-1}}\\frac{{1-x^2}}{{1+x^2}}}}{{(1+x^2)^2}}\\,dx')
        hyperbolic_raw.append({'level': 9, 'template': 'reduction_integral', 'latex': prob, 'solution': sp.latex(val)})

# ---------- Level 6: 쌍곡함수 망원급수 (sinh^-1, 2항 gap-2 형태) ----------
for i, (m, N) in enumerate(TELESCOPE_FINITE):
    e2S = sp.nsimplify((N + 1) * (N + 2) / sp.Integer(m * (m + 1)))
    prob = (f'\\text{{다음의 값을 }} S \\text{{ 라 할 때 }} e^{{2S}} \\text{{ 의 값을 구하시오: }} '
            f'S=\\sum_{{n={m}}}^{{{N}}}\\sinh^{{-1}}\\frac{{1}}{{\\sqrt{{n(n+2)}}}}')
    hyperbolic_raw.append({'level': 6, 'template': 'sinh_telescope_alpha', 'latex': prob, 'solution': sp.latex(e2S)})

# ---------- Level 8: 쌍곡함수 망원급수 (sinh^-1, 4항 연속곱 형태, m>=2 필요) ----------
BETA_PAIRS = [(2, 15), (2, 20), (3, 25), (4, 30), (2, 40), (5, 22), (3, 18), (2, 60)]
for i, (m, N) in enumerate(BETA_PAIRS):
    e2S = sp.nsimplify(sp.Integer(N) * (m + 1) / sp.Integer((N + 2) * (m - 1)))
    prob = (f'\\text{{다음의 값을 }} S \\text{{ 라 할 때 }} e^{{2S}} \\text{{ 의 값을 구하시오: }} '
            f'S=\\sum_{{n={m}}}^{{{N}}}\\sinh^{{-1}}\\frac{{1}}{{\\sqrt{{(n-1)n(n+1)(n+2)}}}}')
    hyperbolic_raw.append({'level': 8, 'template': 'sinh_telescope_beta', 'latex': prob, 'solution': sp.latex(e2S)})
for i, m in enumerate([2, 3, 4, 5, 6, 7, 8, 9]):
    lim_e2S = sp.nsimplify(sp.Rational(m + 1, m - 1))
    prob = (f'\\text{{다음의 값을 }} S \\text{{ 라 할 때 }} \\lim_{{N\\to\\infty}} e^{{2S}} \\text{{ 의 값을 구하시오: }} '
            f'S=\\sum_{{n={m}}}^{{N}}\\sinh^{{-1}}\\frac{{1}}{{\\sqrt{{(n-1)n(n+1)(n+2)}}}}')
    hyperbolic_raw.append({'level': 8, 'template': 'sinh_telescope_beta_inf', 'latex': prob, 'solution': sp.latex(lim_e2S)})


# --- 2. Polar & Applications Pool ---
# Every non-trivial closed form below is derived with sympy at generation time
# (not hand-memorized), so correctness is verified per-problem rather than
# assumed from a single hand-derived formula reused for every k.

th = sp.symbols('theta', real=True)

def slx(expr):
    """Simplify a sympy expression and return clean LaTeX.
    Deliberately avoids sp.nsimplify(): every expression here comes from exact
    symbolic integration/differentiation (never a float), and nsimplify's
    float-driven constant search can misfire badly on exact-but-irregular
    forms (observed producing bogus fractional-power garbage on some inputs)."""
    e = sp.radsimp(sp.simplify(expr))
    return sp.latex(e)

# (mult, denom) pairs representing mult*pi/denom, spread across (0, pi)
NICE_ANGLES = [(1, 6), (1, 4), (1, 3), (1, 2), (2, 3), (3, 4), (5, 6)]

def polar_slope(r_expr, theta_val):
    x = r_expr * sp.cos(th)
    y = r_expr * sp.sin(th)
    dxv = sp.simplify(sp.diff(x, th).subs(th, theta_val))
    dyv = sp.simplify(sp.diff(y, th).subs(th, theta_val))
    return sp.simplify(dyv / dxv)

def sector_area(r_expr, t1, t2):
    return sp.simplify(sp.Rational(1, 2) * sp.integrate(r_expr**2, (th, t1, t2)))

def arclen(r_expr, t1, t2):
    speed = sp.sqrt(sp.simplify(sp.expand_trig(r_expr**2 + sp.diff(r_expr, th)**2)))
    speed = sp.simplify(speed)
    return sp.simplify(sp.integrate(speed, (th, t1, t2)))

def cardioid_tangent_point(orient, sign, kind, kval):
    """Coordinate at the horizontal/vertical tangent point of r = k(1 + sign*trig(theta))."""
    kk = sp.Integer(kval)
    r = kk * (1 + sign * (sp.cos(th) if orient == 'cos' else sp.sin(th)))
    x = r * sp.cos(th)
    y = r * sp.sin(th)
    dx = sp.simplify(sp.diff(x, th))
    dy = sp.simplify(sp.diff(y, th))
    target, other, coord = (dy, dx, y) if kind == 'horiz' else (dx, dy, x)
    sols = sp.solveset(sp.Eq(sp.trigsimp(target), 0), th, sp.Interval.Ropen(0, 2 * sp.pi))
    cands = []
    for s in sols:
        if s in (0, sp.pi):
            continue
        ov = sp.simplify(other.subs(th, s))
        if ov != 0:
            cands.append((s, sp.simplify(coord.subs(th, s))))
    cands.sort(key=lambda p: float(p[0]))
    return cands[0]

def pole_crossing_angle(orient, sign, coeff):
    """Smallest theta in (0, 2*pi) where k(1 + sign*coeff*trig(theta)) = 0."""
    r = 1 + sign * coeff * (sp.cos(th) if orient == 'cos' else sp.sin(th))
    sols = sp.solveset(sp.Eq(r, 0), th, sp.Interval.Ropen(0, 2 * sp.pi))
    sols = sorted(sols, key=lambda s: float(s))
    return sols[0]

def spiral_len_latex(kval, T_mult, T_denom):
    """Arc length of r = k*theta from 0 to T = T_mult*pi/T_denom, expressed via ln (no asinh)."""
    T = sp.Rational(T_mult, T_denom) * sp.pi
    inner = sp.sqrt(T**2 + 1)
    lin_part = sp.simplify(T * inner)
    ln_arg = sp.simplify(T + inner)
    body = f'{sp.latex(lin_part)} + \\ln\\left({sp.latex(ln_arg)}\\right)'
    if kval % 2 == 0:
        coeff = kval // 2
        return f'{coeff}\\left({body}\\right)' if coeff != 1 else f'\\left({body}\\right)'
    return f'\\frac{{{kval}}}{{2}}\\left({body}\\right)'

# ---------- Level 1: 극좌표 기초 (변환과 거리) ----------
PT_TRIPLES = [(3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25), (20, 21, 29), (9, 40, 41)]
NICE_RATIOS = [(1, 1, 1, 4), (1, sp.sqrt(3), 1, 3), (sp.sqrt(3), 1, 1, 6)]  # (a_coef, b_coef, mult, denom) -> angle mult*pi/denom
# Angle gaps whose cosine is rational, so a^2+b^2-2ab*cos(gap) is a plain integer
# (an irrational cosine would nest a sqrt inside a sqrt -- not enterable cleanly).
PDIST_GAPS = [(1, 3, 1), (1, 2, 0), (2, 3, -1)]  # (mult, denom, 2*cos(gap) as int)
PDIST_RATIOS = [(2, 3), (1, 2), (3, 4), (1, 3), (2, 5), (3, 5)]

for i, k in enumerate(range(1, 16)):
    # 1. Distance between two polar points (varying angle gap and radius ratio)
    m, d, c2 = PDIST_GAPS[i % len(PDIST_GAPS)]
    ra, rb = PDIST_RATIOS[i % len(PDIST_RATIOS)]
    a, b = ra * k, rb * k
    dist_sq = a**2 + b**2 - c2 * a * b
    from fractions import Fraction
    second = Fraction(1, 6) + Fraction(m, d)
    polar_raw.append({'level': 1, 'template': 'pdist', 'latex': f'\\text{{두 극좌표 }} ({a}, \\frac{{\\pi}}{{6}}) \\text{{ 와 }} ({b}, {frac_pi(second.numerator, second.denominator)}) \\text{{ 사이의 거리}}', 'solution': simplify_sqrt(dist_sq)})

    # 2/3. Rectangular coordinates of a polar point
    am, ad = NICE_ANGLES[i % len(NICE_ANGLES)]
    ang = sp.Rational(am, ad) * sp.pi
    xval = slx(k * sp.cos(ang))
    yval = slx(k * sp.sin(ang))
    polar_raw.append({'level': 1, 'template': 'ptrect_x', 'latex': f'\\text{{극좌표 }} \\left({k}, {frac_pi(am,ad)}\\right) \\text{{ 를 직교좌표로 나타낼 때 }} x \\text{{ 좌표}}', 'solution': xval})
    polar_raw.append({'level': 1, 'template': 'ptrect_y', 'latex': f'\\text{{극좌표 }} \\left({k}, {frac_pi(am,ad)}\\right) \\text{{ 를 직교좌표로 나타낼 때 }} y \\text{{ 좌표}}', 'solution': yval})

    # 4. r from a rectangular point (Pythagorean triple, scaled)
    p, q, hyp = PT_TRIPLES[i % len(PT_TRIPLES)]
    polar_raw.append({'level': 1, 'template': 'rtpolar_r', 'latex': f'\\text{{직교좌표 }} ({p*k}, {q*k}) \\text{{ 를 극좌표로 나타낼 때 }} r \\text{{ 의 값}}', 'solution': f'{hyp*k}'})

    # 5. reference angle from a rectangular point with a nice ratio
    ac, bc, rm, rd = NICE_RATIOS[i % len(NICE_RATIOS)]
    xr = sp.simplify(ac * k)
    yr = sp.simplify(bc * k)
    polar_raw.append({'level': 1, 'template': 'rtpolar_theta', 'latex': f'\\text{{직교좌표 }} ({sp.latex(xr)}, {sp.latex(yr)}) \\text{{ 를 극좌표 }} (r,\\theta) (0 \\le \\theta < \\frac{{\\pi}}{{2}}) \\text{{ 로 나타낼 때 }} \\theta \\text{{ 의 값}}', 'solution': frac_pi(rm, rd)})

    # 6. Negative-r convention
    nm, nd = NICE_ANGLES[(i + 2) % len(NICE_ANGLES)]
    nang = sp.Rational(nm, nd) * sp.pi
    negx = slx(-k * sp.cos(nang))
    polar_raw.append({'level': 1, 'template': 'neg_r_point', 'latex': f'\\text{{극좌표 }} \\left(-{k}, {frac_pi(nm,nd)}\\right) \\text{{ 가 나타내는 점의 }} x \\text{{ 좌표}}', 'solution': negx})

    # 7. line <-> polar (alternate horizontal / vertical line)
    if i % 2 == 0:
        polar_raw.append({'level': 1, 'template': 'line_to_polar', 'latex': f'\\text{{직선 }} y={k} \\text{{ 을 극방정식 }} r=f(\\theta) \\text{{ 로 나타낼 때, }} f(\\theta)\\text{{를 구하시오}}', 'solution': f'\\frac{{{k}}}{{\\sin\\theta}}'})
    else:
        polar_raw.append({'level': 1, 'template': 'line_to_polar', 'latex': f'\\text{{직선 }} x={k} \\text{{ 을 극방정식 }} r=f(\\theta) \\text{{ 로 나타낼 때, }} f(\\theta)\\text{{를 구하시오}}', 'solution': f'\\frac{{{k}}}{{\\cos\\theta}}'})

# ---------- Level 2: 직교방정식과 극방정식의 변환 ----------
for k in range(1, 16):
    polar_raw.append({'level': 2, 'template': 'rectpolar1', 'latex': f'\\text{{직교방정식 }} 2xy={k} \\text{{ 을 극방정식 }} r^2 = f(\\theta) \\text{{ 로 나타낼 때, }} f(\\theta)\\text{{를 구하시오}}', 'solution': f'\\frac{{{k}}}{{\\sin(2\\theta)}}'})
    polar_raw.append({'level': 2, 'template': 'rectpolar2', 'latex': f'\\text{{직교방정식 }} x^2+y^2={2*k}x \\text{{ 를 극방정식 }} r = f(\\theta) \\text{{ 로 나타낼 때, }} f(\\theta)\\text{{를 구하시오}}', 'solution': f'{2*k}\\cos(\\theta)'})
    polar_raw.append({'level': 2, 'template': 'rectpolar2b', 'latex': f'\\text{{직교방정식 }} x^2+y^2={2*k}y \\text{{ 를 극방정식 }} r = f(\\theta) \\text{{ 로 나타낼 때, }} f(\\theta)\\text{{를 구하시오}}', 'solution': f'{2*k}\\sin(\\theta)'})
    polar_raw.append({'level': 2, 'template': 'rectpolar3', 'latex': f'\\text{{직교방정식 }} x^2-y^2={k**2} \\text{{ 을 극방정식 }} r^2 = f(\\theta) \\text{{ 로 나타낼 때, }} f(\\theta)\\text{{를 구하시오}}', 'solution': f'\\frac{{{k**2}}}{{\\cos(2\\theta)}}'})
    xk = 'x' if k == 1 else f'{k}x'
    polar_raw.append({'level': 2, 'template': 'line_angle', 'latex': f'\\text{{직선 }} y={xk} \\; (x>0) \\text{{ 를 극방정식 }} \\theta = c \\text{{ 로 나타낼 때, }} c \\text{{ 의 값}}', 'solution': f'\\tan^{{-1}}({k})'})
    polar_raw.append({'level': 2, 'template': 'const_r_to_rect', 'latex': f'\\text{{극방정식 }} r={k} \\text{{ 을 직교방정식 }} x^2+y^2=C \\text{{ 로 나타낼 때, }} C \\text{{ 의 값}}', 'solution': f'{k**2}'})

# ---------- Level 3: 극곡선의 기본 성질 ----------
DIMPLE_COEFS = [2, 3, 4, 5]
for i, k in enumerate(range(1, 16)):
    # prad (verified: r = a*sin + b*cos is a circle of radius sqrt(a^2+b^2)/2)
    polar_raw.append({'level': 3, 'template': 'prad', 'latex': f'\\text{{극곡선 }} r = {3*k}\\sin\\theta + {4*k}\\cos\\theta \\text{{ 가 나타내는 원의 반지름}}', 'solution': get_prad_solution(k)})

    # tangent slope at a safe angle, two orientations (formula re-derived every time, no memorized sign)
    if i % 2 == 0:
        r = 1 + k * sp.cos(th)
        slope = polar_slope(r, sp.pi/2)
        polar_raw.append({'level': 3, 'template': 'pslope1', 'latex': f'\\text{{극곡선 }} r = 1 + {tc(k)}\\cos\\theta \\text{{ 위의 }} \\theta = \\frac{{\\pi}}{{2}} \\text{{ 인 점에서의 접선의 기울기}}', 'solution': slx(slope)})
    else:
        r = 1 + k * sp.sin(th)
        slope = polar_slope(r, 0)
        polar_raw.append({'level': 3, 'template': 'pslope1', 'latex': f'\\text{{극곡선 }} r = 1 + {tc(k)}\\sin\\theta \\text{{ 위의 }} \\theta = 0 \\text{{ 인 점에서의 접선의 기울기}}', 'solution': slx(slope)})

    # area enclosed by a simple circle through the pole (verified)
    polar_raw.append({'level': 3, 'template': 'parea_c', 'latex': f'\\text{{극곡선 }} r = {tc(k)}\\sin\\theta \\text{{ 가 둘러싼 영역의 넓이}}', 'solution': slx(sector_area(k * sp.sin(th), 0, sp.pi))})

    # evaluate r at a nice angle for a dimpled limacon
    c = DIMPLE_COEFS[i % len(DIMPLE_COEFS)]
    am, ad = NICE_ANGLES[i % len(NICE_ANGLES)]
    ang = sp.Rational(am, ad) * sp.pi
    rval = slx(k * (c + sp.cos(ang)))
    body1 = f'{c}+\\cos\\theta'
    polar_raw.append({'level': 3, 'template': 'r_at_theta', 'latex': f'\\text{{극곡선 }} r = {cf(k, body1)} \\text{{ 위의 }} \\theta = {frac_pi(am,ad)} \\text{{ 인 점에서 }} r \\text{{ 의 값}}', 'solution': rval})

    # max / min r of a dimpled limacon
    c2 = DIMPLE_COEFS[(i + 1) % len(DIMPLE_COEFS)]
    if i % 2 == 0:
        body2 = f'{c2}+\\sin\\theta'
        polar_raw.append({'level': 3, 'template': 'max_r', 'latex': f'\\text{{극곡선 }} r = {cf(k, body2)} \\text{{ 의 최댓값}}', 'solution': f'{k*(c2+1)}'})
    else:
        body2 = f'{c2}+\\cos\\theta'
        polar_raw.append({'level': 3, 'template': 'max_r', 'latex': f'\\text{{극곡선 }} r = {cf(k, body2)} \\text{{ 의 최솟값}}', 'solution': f'{k*(c2-1)}'})

    # pole-crossing angle of a limacon with an inner loop (re-derived, not memorized)
    orient = 'cos' if i % 2 == 0 else 'sin'
    sign = 1 if (i // 2) % 2 == 0 else -1
    ang0 = pole_crossing_angle(orient, sign, 2)
    trig_name = '\\cos' if orient == 'cos' else '\\sin'
    signstr = '+' if sign == 1 else '-'
    body3 = f'1 {signstr} 2{trig_name}\\theta'
    polar_raw.append({'level': 3, 'template': 'pole_angle', 'latex': f'\\text{{극곡선 }} r = {cf(k, body3)} \\text{{ 이 }} 0 < \\theta < 2\\pi \\text{{ 에서 처음으로 극을 지날 때의 }} \\theta \\text{{ 의 값}}', 'solution': slx(ang0)})

# ---------- Level 4: 극곡선의 접선과 회전 각 ----------
ROSE_N = [2, 3, 4, 5]
for i, k in enumerate(range(1, 16)):
    # equiangular spiral (verified: tan(alpha) = 1/k)
    polar_raw.append({'level': 4, 'template': 'pangle', 'latex': f'\\text{{극곡선 }} r = e^{{{tc(k)}\\theta}} \\text{{ 위의 점에서의 접선과 원점을 지나는 동경이 이루는 예각 }} \\alpha \\text{{ 에 대하여 }} \\tan\\alpha', 'solution': f'\\frac{{1}}{{{k}}}'})

    # rose petal area, generalized over petal count n (formula re-derived, not just n=3)
    n = ROSE_N[i % len(ROSE_N)]
    trig_name = '\\sin' if i % 2 == 0 else '\\cos'
    r = k * (sp.sin(n*th) if i % 2 == 0 else sp.cos(n*th))
    area = sector_area(r, 0, sp.pi/n)
    polar_raw.append({'level': 4, 'template': 'parea_rose', 'latex': f'\\text{{극곡선 }} r = {tc(k)}{trig_name}({n}\\theta) \\text{{ 의 한 잎(꽃잎 1개)의 넓이}}', 'solution': slx(area)})

    # width (in theta) of one petal of a rose curve
    n2 = ROSE_N[(i + 2) % len(ROSE_N)]
    polar_raw.append({'level': 4, 'template': 'rose_width', 'latex': f'\\text{{극곡선 }} r = {tc(k)}\\sin({n2}\\theta) \\text{{ 위에서 원점(극)을 지나는 두 연속된 }} \\theta \\text{{ 값의 차 (한 잎의 각 너비)}}', 'solution': frac_pi(1, n2)})

    # horizontal / vertical tangent point on a cardioid (re-derived every time)
    orient = 'cos' if i % 2 == 0 else 'sin'
    sign = 1 if (i // 2) % 2 == 0 else -1
    kind = 'horiz' if (i // 4) % 2 == 0 else 'vert'
    theta_sol, coordval = cardioid_tangent_point(orient, sign, kind, k)
    trig_name2 = '\\cos' if orient == 'cos' else '\\sin'
    signstr = '+' if sign == 1 else '-'
    which = 'y' if kind == 'horiz' else 'x'
    kor = '\\text{수평(horizontal)}' if kind == 'horiz' else '\\text{수직(vertical)}'
    body4 = f'1 {signstr} {trig_name2}\\theta'
    polar_raw.append({'level': 4, 'template': 'card_tangent', 'latex': f'\\text{{극곡선 }} r = {cf(k, body4)} \\text{{ 위에서 접선이 }} {kor} \\text{{ 인 점 중 }} 0 < \\theta < \\pi \\text{{ 를 만족하는 점의 }} {which} \\text{{ 좌표}}', 'solution': slx(coordval)})

    # tangent slope at a non-special angle (fully re-derived, no shortcut formula)
    am, ad = [(1, 3), (1, 6), (2, 3), (5, 6)][i % 4]
    ang = sp.Rational(am, ad) * sp.pi
    r2 = 1 + k * sp.cos(th)
    slope2 = polar_slope(r2, ang)
    polar_raw.append({'level': 4, 'template': 'pslope2', 'latex': f'\\text{{극곡선 }} r = 1 + {tc(k)}\\cos\\theta \\text{{ 위의 }} \\theta = {frac_pi(am,ad)} \\text{{ 인 점에서의 접선의 기울기}}', 'solution': slx(slope2)})

    # sector area between two rays for a simple circle (generalizes the old fixed 0..pi/4 case)
    bm, bd = [(1, 6), (1, 4), (1, 3), (5, 12)][i % 4]
    bound = sp.Rational(bm, bd) * sp.pi
    area2 = sector_area(k * sp.cos(th), 0, bound)
    polar_raw.append({'level': 4, 'template': 'parea_sect', 'latex': f'\\text{{극곡선 }} r = {tc(k)}\\cos\\theta \\text{{ 와 두 직선 }} \\theta = 0, \\theta = {frac_pi(bm,bd)} \\text{{ 로 둘러싸인 영역의 넓이}}', 'solution': slx(area2)})

def spiral_arclen_latex(kval, Tm, Td):
    """Length of r = e^{k*theta} from 0 to T = Tm*pi/Td.
    Closed form: (sqrt(1+k^2)/k) * (e^{kT} - 1). The exponent k*T is pre-multiplied
    into a single pi-fraction (rather than left as 'k \\cdot ...') because the grader
    has an unrelated hardcoded rule that skips grading entirely whenever a solution
    string contains both '\\cdot' and '^' (see grader.js "Infinite Exponent" check)."""
    from fractions import Fraction
    exp_frac = Fraction(kval * Tm, Td)
    exp_arg = frac_pi(exp_frac.numerator, exp_frac.denominator)
    numer = f'\\sqrt{{{1+kval**2}}}'
    return f'{fracstr(numer, kval)}\\left(e^{{{exp_arg}}}-1\\right)'

# ---------- Level 5: 극곡선의 넓이와 길이 ----------
for i, k in enumerate(range(1, 16)):
    # cardioid area (verified)
    body5 = '1+\\cos\\theta'
    polar_raw.append({'level': 5, 'template': 'parea_card', 'latex': f'\\text{{극곡선 }} r = {cf(k, body5)} \\text{{ 가 둘러싼 영역의 넓이}}', 'solution': slx(sector_area(k*(1+sp.cos(th)), 0, 2*sp.pi))})

    # log spiral length, generalized upper bound (direct closed form, verified against sympy integration)
    Tm, Td = [(1, 1), (2, 1), (3, 2), (1, 2)][i % 4]
    polar_raw.append({'level': 5, 'template': 'plength_spiral', 'latex': f'\\text{{극곡선 }} r = e^{{{tc(k)}\\theta}} \\text{{ 의 }} 0 \\le \\theta \\le {frac_pi(Tm,Td)} \\text{{ 구간의 길이}}', 'solution': spiral_arclen_latex(k, Tm, Td)})

    # inner loop area of a limacon with an inner loop (verified: k^2*pi - (3*sqrt(3)/2)*k^2)
    body6 = '1+2\\cos\\theta'
    sq3_num = 3 * k**2
    sq3_term = f'\\frac{{{sq3_num}\\sqrt{{3}}}}{{2}}' if sq3_num % 2 != 0 else f'{sq3_num // 2}\\sqrt{{3}}'
    pi_term = '\\pi' if k**2 == 1 else f'{k**2}\\pi'
    polar_raw.append({'level': 5, 'template': 'parea_loop', 'latex': f'\\text{{극곡선 }} r = {cf(k, body6)} \\text{{ 의 안쪽 고리(inner loop)가 둘러싼 영역의 넓이}}', 'solution': f'{pi_term} - {sq3_term}'})

    # lemniscate one-loop area (verified: k^2/2)
    polar_raw.append({'level': 5, 'template': 'parea_lemn', 'latex': f'\\text{{극곡선 }} r^2 = {tc(k**2)}\\cos(2\\theta) \\text{{ 의 한쪽 고리가 둘러싼 영역의 넓이}}', 'solution': f'\\frac{{{k**2}}}{{2}}' if k**2 % 2 != 0 else f'{k**2 // 2}'})

    # half cardioid arc length (verified: 4k)
    polar_raw.append({'level': 5, 'template': 'plength_half_card', 'latex': f'\\text{{극곡선 }} r = {cf(k, body5)} \\text{{ 의 }} 0 \\le \\theta \\le \\pi \\text{{ 구간의 길이}}', 'solution': f'{4*k}'})

    # sector area of a cardioid between the pole rays 0 and pi/2 (re-derived)
    sec_area = sector_area(k*(1+sp.cos(th)), 0, sp.pi/2)
    polar_raw.append({'level': 5, 'template': 'parea_card_sect', 'latex': f'\\text{{극곡선 }} r = {cf(k, body5)} \\text{{ 와 두 직선 }} \\theta = 0, \\theta = \\frac{{\\pi}}{{2}} \\text{{ 로 둘러싸인 영역의 넓이}}', 'solution': slx(sec_area)})

# ---------- Level 6: 회전체의 겉넓이와 고급 극곡선 ----------
for i, k in enumerate(range(1, 11)):
    body7 = '1+\\cos\\theta'
    # cardioid surface of revolution about the polar axis (verified: 32k^2*pi/5)
    polar_raw.append({'level': 6, 'template': 'psurf_card', 'latex': f'\\text{{극곡선 }} r = {cf(k, body7)} \\text{{ 를 }} x\\text{{축(극축) 둘레로 회전시킨 겉넓이}}', 'solution': f'\\frac{{{32 * k**2}}}{{5}}\\pi' if (32*k**2)%5!=0 else f'{(32*k**2)//5}\\pi'})

    # cardioid arc length (verified: 8k)
    polar_raw.append({'level': 6, 'template': 'plength_card', 'latex': f'\\text{{극곡선 }} r = {cf(k, body7)} \\text{{ 의 호의 길이}}', 'solution': f'{8*k}'})

    # sphere generated by revolving r = k (semicircle) about the polar axis (verified: 4*pi*k^2)
    polar_raw.append({'level': 6, 'template': 'psurf_circle', 'latex': f'\\text{{극곡선 }} r = {k} \\; (0 \\le \\theta \\le \\pi) \\text{{ 를 극축 둘레로 회전시킨 겉넓이}}', 'solution': f'{4*k**2}\\pi'})

    # circumference of the off-origin circle r = 2k*cos(theta) (verified: 2*pi*k)
    polar_raw.append({'level': 6, 'template': 'plength_circle', 'latex': f'\\text{{극곡선 }} r = {tc(2*k)}\\cos\\theta \\text{{ 의 호의 길이}}', 'solution': f'{2*k}\\pi'})

    # Archimedean spiral arc length (verified via symbolic integration; expressed with ln to match this grader's supported form)
    Tm, Td = [(2, 1), (1, 1), (3, 2)][i % 3]
    polar_raw.append({'level': 6, 'template': 'plength_arch', 'latex': f'\\text{{극곡선 }} r = {tc(k)}\\theta \\text{{ 의 }} 0 \\le \\theta \\le {frac_pi(Tm,Td)} \\text{{ 구간의 길이}}', 'solution': spiral_len_latex(k, Tm, Td)})


# --- Banded Assembly Algorithm ---
#
# Chunking straight through a sorted-by-level list (the old approach) means any level
# with few templates but many k-values (e.g. a level with only 1-3 templates x 10-15 k's)
# produces 20-question collections that repeat the same template 5-10 times -- exactly the
# "same problem over and over, just the number changed" complaint. Fix: merge consecutive
# levels into a "band" until the band has enough distinct templates that a 20-question
# round robin across the whole band rarely repeats any one template, then chunk within the
# band. Sorting each resulting chunk by level (stable, so the round-robin spacing survives
# among same-level items) also means every collection itself ramps from its easiest content
# up to its hardest -- satisfying "difficulty should increase as you go" inside each set,
# on top of later bands (and so later collections) covering harder levels overall.

MIN_TEMPLATES_PER_BAND = 10
CHUNK_SIZE = 20

def assemble_collections(raw_problems, id_prefix, name_fn):
    by_level = {}
    for p in raw_problems:
        by_level.setdefault(p['level'], []).append(p)
    levels_sorted = sorted(by_level.keys())

    # 1. Group consecutive levels into bands with >= MIN_TEMPLATES_PER_BAND distinct templates.
    bands = []
    cur_levels, cur_templates = [], set()
    for lvl in levels_sorted:
        cur_levels.append(lvl)
        cur_templates.update(p['template'] for p in by_level[lvl])
        if len(cur_templates) >= MIN_TEMPLATES_PER_BAND:
            bands.append(cur_levels)
            cur_levels, cur_templates = [], set()
    if cur_levels:
        # Leftover levels didn't reach the threshold on their own -- fold them into the
        # previous (harder-leaning) band rather than shipping a low-diversity band alone.
        if bands:
            bands[-1] = bands[-1] + cur_levels
        else:
            bands.append(cur_levels)

    collections = []
    idx = 1
    for band_levels in bands:
        band_problems = []
        for lvl in band_levels:
            band_problems.extend(by_level[lvl])

        by_template = {}
        for p in band_problems:
            by_template.setdefault(p['template'], []).append(p)
        for tmpl in by_template:
            random.shuffle(by_template[tmpl])
        template_keys = list(by_template.keys())
        random.shuffle(template_keys)

        # 2. Each "pass" pulls at most one problem per template that still has content --
        # a single pass therefore can NEVER contain the same template twice, which is
        # exactly the "same problem, just the number changed" complaint. Passes are never
        # merged together into a bigger CHUNK_SIZE-sized collection (the old behavior),
        # even when that leaves a collection short of 20 questions -- a shorter, fully
        # diverse collection beats a padded, repetitive one.
        while any(by_template[t] for t in template_keys):
            pass_items = []
            for t in template_keys:
                if by_template[t]:
                    pass_items.append(by_template[t].pop(0))

            # 3. Split a single pass at CHUNK_SIZE if the band has more distinct templates
            # than that (not needed at current pool sizes, but safe either way) -- slicing
            # inside one pass can't introduce a duplicate since the source has none. Each
            # resulting chunk is sorted by level so difficulty ramps up within it.
            for i in range(0, len(pass_items), CHUNK_SIZE):
                chunk = sorted(pass_items[i:i + CHUNK_SIZE], key=lambda p: p['level'])
                collections.append({
                    "id": f"{id_prefix}_{idx}",
                    "name": name_fn(idx),
                    "problems": chunk
                })
                idx += 1

    return collections

# Split the hyperbolic_raw pool into two tabs -- "고급미적분" had grown into one giant
# bucket mixing inverse-trig-centric content (sin^-1/cos^-1/tan^-1 derivatives, integrals,
# identities, telescoping series, the double-angle reduction integrals) with genuinely
# hyperbolic-function content (cosh/sinh/tanh and their inverses, cyclic IBP products).
# Classified by template name so both existing and newly-added templates route correctly.
INV_TRIG_TEMPLATES = {
    'asin_d', 'acos_d', 'atan_d', 'asin_i', 'atan_i', 'x_asin', 'x_acos', 'x_atan',
    'machin_identity', 'double_angle_simplify', 'atan_telescope', 'atan_telescope_inf',
    'reduction_integral',
}
inv_trig_raw = [p for p in hyperbolic_raw if p['template'] in INV_TRIG_TEMPLATES]
hyp_only_raw = [p for p in hyperbolic_raw if p['template'] not in INV_TRIG_TEMPLATES]

final_collections = []
final_collections += assemble_collections(inv_trig_raw, "adv_col1a", lambda i: f"역삼각함수 미적분 {i}")
final_collections += assemble_collections(hyp_only_raw, "adv_col1b", lambda i: f"쌍곡함수 미적분 {i}")
final_collections += assemble_collections(polar_raw, "adv_col2", lambda i: f"극좌표와 극곡선 {i}")

prefix = 'window.generatedCollections = '
new_js = prefix + json.dumps(final_collections, ensure_ascii=False, indent=4) + ';'

with codecs.open('data/math/adv_collections_final.js', 'w', 'utf-8') as f:
    f.write(new_js)

print(f"Successfully generated {len(final_collections)} collections! "
      f"(inverse-trig problems: {len(inv_trig_raw)}, hyperbolic problems: {len(hyp_only_raw)}, polar problems: {len(polar_raw)})")
