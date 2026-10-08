"""Validate the 49 remaining supplementary answers and production grader."""
import json
import sys
import sympy as s
from sympy.parsing.latex import parse_latex

payload = json.load(sys.stdin)
problems = {p['id']: p for p in payload['problems']}
pi = s.pi
expected = {
    'inv_branch_rational_acos': pi-2*s.log(2),
    'inv_branch_tan3x': pi**2/24,
    'inv_branch_roots_unity': 24*pi/7,
    'inv_branch_triangle_wave': 3*pi**2/4,
    'inv_branch_double_angle': pi/2-s.log(2),
    'inv_series_asin_x9': s.Rational(35,1152),
    'inv_series_atan_derivative7': -720,
    'inv_series_asin_remainder': s.Rational(3,40),
    'inv_series_asin_square': s.Rational(4,35),
    'inv_series_binomial_sum': pi/2,
    'inv_param_improper_atan': pi*s.log(2)/2,
    'inv_param_I_derivative': s.Rational(1,2)-pi/4,
    'inv_param_sqrt_atan': pi/2-s.log(2),
    'inv_param_asin_over_x': pi*s.log(2)/2,
    'inv_param_second_derivative': s.Rational(1,2)-s.log(2),
    'inv_geo_between_inverse_curves': 2-s.sqrt(2),
    'inv_geo_centroid_x': pi/(4*(pi-2)),
    'inv_geo_centroid_y': (pi**2-8)/(4*(pi-2)),
    'inv_geo_atan_area': pi*s.sqrt(3)/3-s.log(2),
    'inv_geo_acos_shell_volume': pi**2/4,
    'inv_limit_atan_cubic': s.Rational(1,3),
    'inv_limit_acos_endpoint': s.sqrt(2),
    'inv_limit_riemann_atan': pi/4-s.log(2)/2,
    'inv_limit_atan_infinity': 1,
    'inv_limit_asin_atan_fifth': -s.Rational(1,8),
    'hyp_branch_acosh_cosh': 4,
    'hyp_branch_atanh_double': 2*s.log(2),
    'hyp_branch_acosh_logabs': 2-2/s.E,
    'hyp_branch_three_logs': 3*s.log(2),
    'hyp_branch_acosh_quadratic': 2*s.log(1+s.sqrt(2))-2*s.sqrt(2)+2,
    'hyp_comp_tanh_asinh': s.sqrt(2)-1,
    'hyp_comp_sech_acosh': s.log(2),
    'hyp_comp_cusp_derivatives': -1,
    'hyp_comp_tanh_sech_max': s.Rational(1,2),
    'hyp_comp_double_angle': 1/s.sqrt(2),
    'hyp_improper_x_sech2': s.log(2),
    'hyp_improper_x_over_sinh': pi**2/4,
    'hyp_improper_x2_sech2': pi**2/12,
    'hyp_improper_sech3': pi/4,
    'hyp_improper_tanh_defect': 2*s.log(2)-1,
    'hyp_ode_global_min': s.sqrt(3),
    'hyp_ode_dirichlet_slope': 1/s.sinh(1),
    'hyp_ode_forced_max': 1-1/s.cosh(1),
    'hyp_ode_logistic_integral': s.log(s.Rational(5,3)),
    'hyp_ode_fundamental_determinant': s.Rational(13,12),
    'hyp_geo_distance_hyperbola': s.Rational(37,72),
    'hyp_geo_sector_area': s.log(s.Rational(3,2))/2,
    'hyp_geo_rapidity_addition': s.Rational(4,5),
    'hyp_geo_tangent_intercepts': s.Rational(8,15),
}
assert set(expected) == set(problems)

namespace = {}
exec(payload['pythonGrader'], namespace)
preprocess = namespace['preprocess_for_sympy_parser']
grade = namespace['grade']
for key, target in expected.items():
    answer = problems[key]['solution']
    parsed = parse_latex(preprocess(answer)).subs({s.Symbol('pi'): pi, s.Symbol('e'): s.E})
    assert s.simplify(parsed-target) == 0, (key, answer, parsed, target)
    equivalent = r'\frac{2\left(' + answer + r'\right)}{2}'
    wrong = r'\left(' + answer + r'\right)+1'
    assert grade(answer, answer, False) == 'CORRECT', (key, 'exact')
    assert grade(equivalent, answer, False) == 'CORRECT', (key, 'equivalent', grade(equivalent, answer, False))
    assert grade(wrong, answer, False).startswith('INCORRECT'), (key, 'wrong accepted')
print('PASS: 49 independently specified exact answers and 147 production-grader cases.')
