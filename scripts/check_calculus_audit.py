"""Recompute the 70 base hyperbolic/application answers from their defining geometry."""
import json, sys
import sympy as s
import mpmath as m
from sympy.parsing.latex import parse_latex
payload = json.load(sys.stdin)
ns = {}
exec(payload['pythonGrader'], ns)
m.mp.dps = 25
P, E = m.pi, m.e
Q = m.quad
# Two valid parameter choices exercise formulas as well as numerical answers.
for sample in [1, 2]:
    a, b, r, R, d, h, alpha, z = (m.mpf(v) for v in (
        (2, 1, 1, 3, 4, .4, .5, .6) if sample == 1 else (3, 2, 2, 5, 6, .7, .8, 1.2)))
    values = {
      'adv_col1b_1': [0,3, m.diff(lambda x:m.atan(m.sinh(x)),z), m.sinh(1)+1/m.cosh(1), m.cosh(z)**4-m.sinh(z)**4],
      'adv_col1b_2': [Q(lambda x:m.sinh(x)/m.cosh(x)**2,[0,m.log(2)]), Q(lambda x:m.cosh(x)**2,[0,1]), Q(lambda x:x*m.sinh(x),[0,m.log(2)]),Q(lambda x:1/m.sqrt(x*x+4),[0,2]),Q(lambda x:1/m.cosh(x),[0,m.log(3)])],
      'adv_col1b_3': [P*Q(lambda x:m.cosh(x)**2,[0,1]),2*P*Q(lambda x:m.cosh(x)*m.sqrt(1+m.sinh(x)**2),[0,m.log(2)]),2*P*Q(lambda x:x*m.sinh(x),[0,1]),1,Q(lambda x:a*m.cosh(x/a),[0,a])/a**2],
      'adv_col1b_5': [m.asinh(m.mpf(3)/4),Q(lambda x:1/m.sqrt(x*x+1),[0,1]),Q(lambda x:1/m.sqrt(x*x-1),[2,3]),Q(lambda x:1/m.cosh(x),[0,m.inf]),Q(lambda x:1/(1-x*x),[0,.5])],
      'adv_col3_1': [Q(lambda x:m.sqrt(3)/4*(6*m.sqrt(1-x*x/16))**2,[-4,4]),Q(lambda x:2*(r*r-x*x),[-r,r]),Q(lambda x:x*m.sin(x),[0,P]),Q(lambda x:(a*a-x*x)*m.tan(alpha)/2,[-a,a]),Q(lambda x:4*(R*R-x*x),[-R,R])],
      'adv_col3_2': [2*P*Q(lambda x:x*m.sin(x),[0,P]),2*P*Q(lambda x:x*m.exp(-x*x),[0,a]),2*P*Q(lambda x:(x+1)*m.log(x),[1,E]),2*P*Q(lambda x:x*x*m.cos(x),[0,P/2]),2*P*Q(lambda x:x*2*m.sqrt(max(0,r*r-(x-R)**2)),[R-r,R+r])],
      'adv_col3_3': [Q(lambda t:t*t*(3*t*t+1),[0,1]),m.mpf(4)/9,2*P*Q(lambda x:x*m.atan(x),[0,1]),P*Q(lambda x:(m.exp(x)-1)**2-m.log(1+x)**2,[0,1]),1],
      'adv_col3_4': [P/m.sqrt(2)*Q(lambda x:(x-x*x)**2,[0,1]),P/m.sqrt(2)*Q(lambda x:(m.sqrt(x)-x)**2,[0,1]),2*P*d*P*r*r,m.sqrt(2)*P*Q(lambda x:x*(x-x*x)+(x-x*x)**2/2,[0,1]),Q(lambda x:x*(m.sin(x)-m.cos(x)),[P/4,5*P/4])/Q(lambda x:m.sin(x)-m.cos(x),[P/4,5*P/4])],
      'adv_col3_5': [Q(lambda x:m.sqrt(1+m.tan(x)**2),[0,P/3]),Q(lambda x:m.sqrt(1+(x-1/(4*x))**2),[1,2]),Q(lambda t:a*m.sqrt((1-m.cos(t))**2+m.sin(t)**2),[0,P,2*P]),4*Q(lambda t:3*a*m.sin(t)*m.cos(t),[0,P/2]),Q(lambda x:m.sqrt(1+m.sinh(x)**2),[0,a])],
      'adv_col3_6': [2*P*Q(lambda x:m.cosh(x)*m.sqrt(1+m.sinh(x)**2),[0,1]),2*P*Q(lambda t:a*(1-m.cos(t))*a*m.sqrt((1-m.cos(t))**2+m.sin(t)**2),[0,P,2*P]),2*P*Q(lambda t:(R+r*m.cos(t))*r,[0,2*P]),2*P*Q(lambda t:a*m.sin(t)**3*3*a*abs(m.sin(t)*m.cos(t)),[0,P/2,P]),2*P*R*(b-a)],
      'adv_col3_7': [P*Q(lambda x:m.exp(-2*x),[0,m.inf]),.5,P*Q(lambda x:1/(1+x*x),[-m.inf,0,m.inf]),P*Q(lambda x:1/x**2,[1,m.inf]),2*P*Q(lambda x:-x*m.log(x),[0,1])],
      'adv_col3_8': [P*Q(lambda x:x*m.sin(x),[0,P]),P*Q(lambda x:x*(1-m.cos(x)),[0,2*P]),Q(lambda x:m.sqrt(1+m.cos(2*x)),[0,P/4]),Q(lambda x:m.sqrt(x**3),[1,2]),2*P*Q(lambda x:x*m.exp(x),[0,m.log(2)])],
      'adv_col3_9': [P*Q(lambda t:m.sin(2*t)**2*m.cos(t),[0,P/2]),Q(lambda t:(1+2*m.cos(t))**2/2,[2*P/3,4*P/3]),2*P*Q(lambda t:(t-t**3/3)*m.sqrt(4*t*t+(1-t*t)**2),[0,m.sqrt(3)]),P*Q(lambda y:a*a*(1-y*y/b**2),[-b,b]),2*P*Q(lambda t:(a*m.cos(t)**3)**2*3*a*m.sin(t)**2*m.cos(t),[0,P/2])],
      'adv_col3_10': [1,2*z,2*P*Q(lambda x:x*(m.exp(x)-E*x),[0,1]),P*Q(lambda x:r*r-x*x,[h,r]),m.sqrt(2)*P*Q(lambda x:x*m.sin(x)-m.sin(x)**2/2,[0,P])],
    }
    # The spherical-zone question has its own endpoints: -R < a < b < R.
    zone_a, zone_b = -R/3, R/2
    values['adv_col3_6'][4] = 2*P*R*(zone_b-zone_a)
    substitutions = dict(a=a,b=b,r=r,R=R,d=d,h=h,alpha=alpha,x=z)
    for col in payload['base']:
        for i,p in enumerate(col['problems']):
            key=(col['id'],i+1)
            parsed=parse_latex(ns['preprocess_for_sympy_parser'](p['solution']))
            parsed=parsed.subs({s.Symbol('pi'):s.pi,s.Symbol('e'):s.E})
            sub = substitutions.copy()
            if key == ('adv_col3_6',5): sub.update(a=zone_a,b=zone_b)
            evaluated=parsed.subs({s.Symbol(k):float(v) for k,v in sub.items()})
            try: actual=complex(evaluated.evalf())
            except Exception as error: raise AssertionError((key,parsed)) from error
            expected=complex(values[col['id']][i])
            assert abs(actual-expected)<1e-8*max(1,abs(expected)),(key,actual,expected)
            if sample == 1:
                answer=p['solution']
                equivalent=r'\frac{2\left('+answer+r'\right)}{2}'
                wrong=r'\left('+answer+r'\right)+1'
                assert ns['grade'](equivalent,answer,False,True)=='CORRECT',(key,'equivalent')
                assert ns['grade'](wrong,answer,False,True).startswith('INCORRECT'),(key,'wrong')
for entered, expected in [
    (r'\sech x', r'\frac{1}{\cosh(x)}'),
    (r'\text{sech} x', r'\frac{1}{\cosh(x)}'),
    (r'\operatorname{csch} x', r'\frac{1}{\sinh(x)}'),
    (r'\coth x', r'\frac{\cosh(x)}{\sinh(x)}'),
    (r'\sinh^{-1}(1)', r'\ln(1+\sqrt2)'),
    (r'\cosh^{-1}(3)-\cosh^{-1}(2)', r'\ln((3+\sqrt8)/(2+\sqrt3))'),
    (r'\pi(1+2)', r'3\pi'),
]:
    assert ns['grade'](entered, expected, False, True) == 'CORRECT', (entered, expected)
assert ns['grade']('x^2+5','x^2',False) == 'CORRECT', 'indefinite integrals keep their constant allowance'
print('PASS: 70 base answers, two parameter sets, 140 exact-mode grading cases and function-notation regressions.')
