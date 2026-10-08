"""Check each answer against independent numerical integrals/derivatives and real grading."""
import json, sys
import sympy as s
import mpmath as m
from sympy.parsing.latex import parse_latex
m.mp.dps = 30
payload = json.load(sys.stdin)
ns = {}
exec(payload['pythonGrader'], ns)
x = s.Symbol('x')
targets = {
    'double': m.sin(2*m.acos(m.mpf(3)/5)),
    'atan_derivative': lambda z: m.diff(lambda t: t*m.atan(t)-m.log(1+t*t)/2, z),
    'atan_composite': m.diff(lambda t: m.atan(m.cos(t)/(1+m.sin(t))), m.mpf('.7')),
    'exp_substitution': m.quad(lambda t: m.exp(t)/(1+m.exp(2*t)), [0,m.log(2)]),
    'symmetry': m.quad(lambda t: 1/((1+t*t)*(1+m.exp(t))), [-1,1]),
    'acosh_value': m.acosh(2),
    'acosh_sign': lambda z: m.diff(lambda t: m.acosh(1/m.cos(t)), z),
    'hyp_equation': m.findroot(lambda t: m.asinh(t)-m.acosh(2*t), (.55,.65)),
    'hyp_integral': m.quad(lambda t: 1/m.sqrt(t*t+16), [0,4]),
    'sixth_power': m.quad(lambda t: 1/(t*m.sqrt(1-t**6)), [m.mpf('.5'),2**(-m.mpf(1)/3)]),
    'improper_root': m.quad(lambda t: 1/m.sqrt(t), [0,1]),
    'improper_exp': m.quad(lambda t: t*m.exp(-t), [0,1,m.inf]),
    # t=u^3 removes the integrable singularities before numerical quadrature.
    'internal_singularity': m.quad(lambda u: 3, [0,1])+m.quad(lambda u: 3, [0,m.root(2,3)]),
    'log_endpoint': m.quad(m.log, [0,1]),
    'reciprocal_symmetry': m.quad(lambda t: m.log(t)/(1+t*t), [0,1,m.inf]),
    'washer': 2*m.pi*m.quad(lambda t: t*(t-t*t), [0,1]),
    'sine_shell': 2*m.pi*m.quad(lambda t: t*m.sin(t*t), [0,m.sqrt(m.pi)]),
    'shifted_disk': m.pi*m.quad(lambda t: (4-t*t)**2, [-2,2]),
    'shifted_shell': 2*m.pi*m.quad(lambda t: (2-t)*(m.exp(t)-1), [0,1]),
    'oblique_volume': 2*m.pi*m.quad(lambda t: m.quad(lambda y: (t-y)/m.sqrt(2), [t*t,t]), [0,1]),
    'surface_root': 2*m.pi*m.quad(lambda t: 2*m.sqrt(t)*m.sqrt(1+1/t), [1,2]),
    'surface_cosh': 2*m.pi*m.quad(lambda t: m.cosh(t)*m.sqrt(1+m.sinh(t)**2), [0,1]),
    'cycloid': 2*m.pi*m.quad(lambda t: (1-m.cos(t))*m.sqrt((1-m.cos(t))**2+m.sin(t)**2), [0,m.pi,2*m.pi]),
    'surface_setup': lambda t: (t**3+1)*m.sqrt(1+(3*t*t)**2),
    'astroid_surface': 2*m.pi*m.quad(lambda t: (1-m.cos(t)**3)*m.sqrt(9*m.cos(t)**4*m.sin(t)**2+9*m.sin(t)**4*m.cos(t)**2), [0,m.pi/2]),
}
assert len(targets) == len(payload['problems'])
for p in payload['problems']:
    key = p['id'].removeprefix('lesson_')
    answer = p['solution']
    parsed = parse_latex(ns['preprocess_for_sympy_parser'](answer)).subs({s.Symbol('pi'): s.pi, s.Symbol('e'): s.E})
    target = targets[key]
    if callable(target):
        samples = [-.8,-.3] if key == 'acosh_sign' else [.2,.7]
        for value in samples:
            actual = float(parsed.subs(x,value).evalf())
            assert abs(actual-float(target(value))) < 1e-9, (key, actual, target(value))
    else:
        assert not parsed.free_symbols, (key, parsed)
        try:
            actual = float(parsed.evalf())
        except Exception as error:
            raise AssertionError((key, parsed)) from error
        assert abs(actual-float(target)) < 1e-9, (key, parsed, target)
    grade = ns['grade']
    assert grade(answer, answer, False, True) == 'CORRECT', (key, 'exact')
    assert grade(r'\frac{2\left('+answer+r'\right)}{2}', answer, False, True) == 'CORRECT', (key, 'equivalent')
    assert grade(r'\left('+answer+r'\right)+1', answer, False, True).startswith('INCORRECT'), (key, 'wrong')
assert ns['grade']('x^2+5', 'x^2', False) == 'CORRECT', 'legacy antiderivative constants'
assert ns['grade']('x^2+5', 'x^2', False, True) == 'INCORRECT', 'exact functions'
print('PASS: 25 independent mathematical checks and 75 production grading cases.')
