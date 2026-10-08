"""Independent derivations for the 30 reference-10 exercises, plus production grading."""
import json
import sys
import sympy as s
from sympy.parsing.latex import parse_latex

data = json.load(sys.stdin)
bank = {p['id'].removeprefix('alg_orth_v1_'): p for p in data['problems'] if p['id'].startswith('alg_orth_v1_')}
ns = {}
exec(data['pythonGrader'], ns)
parse_matrix, grade = ns['parse_matrix_latex'], ns['grade']
M = s.Matrix
t, a, b, c, z = s.symbols('t a b c z', real=True)
checked = set()

def equal(x,y):
    d=x-y
    return all(s.simplify(e)==0 for e in d) if isinstance(d,s.MatrixBase) else s.simplify(d)==0

def check(key, derived):
    tex=bank[key]['solution']
    stored=parse_matrix(tex) if 'matrix' in tex else parse_latex(tex)
    stored=stored.subs({v:t for v in stored.free_symbols if str(v)=='t'})
    assert equal(stored,derived),(key,stored,derived)
    checked.add(key)

def projection(vectors,x):
    # Solve the defining perpendicularity equations, independently of stored answers.
    coeff=s.symbols('c:'+str(len(vectors)))
    p=sum((coef*v for coef,v in zip(coeff,vectors)),s.zeros(x.rows,1))
    sol=s.solve([(x-p).dot(v) for v in vectors],coeff)
    p=p.subs(sol)
    assert all(s.simplify((x-p).dot(v))==0 for v in vectors)
    return s.simplify(p)

def gs(vectors):
    orth=[]
    for v in vectors:
        r=v.copy()
        for u in orth:r-=v.dot(u)/u.dot(u)*u
        orth.append(s.simplify(r))
    assert all(equal(orth[i].dot(orth[j]),0) for i in range(len(orth)) for j in range(i))
    return orth

# Length/inner-product constraints and continuous-function example.
sol=s.solve([9+a+2*b-25,9+a-2*b-9],[a,b])
check('norm',36+sol[a]-4*sol[b])
u,v=M([1,0,1]),M([1,1,0]);x=a*u+b*v
sol=s.solve([x.dot(u)-3,x.dot(v)],[a,b]);check('reconstruct',x.subs(sol))
av=s.solve(s.integrate(z*z-a,(z,-1,1)),a)[0]
check('function',M([av,s.integrate((z*z-av)**2,(z,-1,1))]))
n,d=M([1,1,1]),M([1,-1,0]);fixed=2*n/n.dot(n)
remaining=4-fixed.dot(fixed);maximum=s.sqrt(remaining*d.dot(d))
witness=fixed+s.sqrt(remaining/d.dot(d))*d
assert equal(witness.dot(witness),4) and equal(witness.dot(n),2)
check('constrained_dot',maximum)
sol=s.solve([1+2*a+2*c,a+2+2*b,c+2*b+2],[a,b,c]);check('three_units',M([sol[a],sol[b],sol[c]]))
u,v=M([1,0,0]),M([-s.Rational(1,4),s.sqrt(15)/4,0]);w=-(u+2*v)/2
assert equal(w.dot(w),1) and equal(v.dot(w),sol[b])

# Angles: retain signs, not just squared equations.
u,v=M([1,0,-1,0]),M([2,1,0,-1]);check('angle4',u.dot(v)/s.sqrt(u.dot(u)*v.dot(v)))
u,v=M([1,t,1]),M([t,1,-1]);roots=s.solve(2*u.dot(v)-u.dot(u),t)
assert roots==[2] and u.dot(v).subs(t,2)>0;check('angle_parameter',roots[0])
u,v=M([2,0]),M([s.Rational(1,2),s.sqrt(3)/2]);p,q=u+v,u-v
check('sum_difference_angle',p.dot(q)/s.sqrt(p.dot(p)*q.dot(q)))
sol=s.solve([2-b+c,2-2*b-3*c],[b,c]);check('two_orthogonality',M([sol[b],sol[c]/s.sqrt(sol[b])]))
vectors=[M([1,1,0]),M([1,0,1])];x=M([0,0,1]);p=projection(vectors,x)
check('plane_angle',s.sqrt(p.dot(p)))
assert equal(p.dot(x),p.dot(p)) # witness attains the Cauchy bound

# Straight lines, inverse data and parameter extrema.
u,v=M([2,1,1]),M([1,-1,2]);check('line_residual',v-projection([u],v))
A,B,d=M([1,2,-1]),M([0,1,1]),M([1,-1,2]);r=A-B-projection([d],A-B);check('affine_line',r.dot(r))
x=M([a,b,c]);sol=s.solve([x.dot(M([1,1,0]))-4,x.dot(M([1,0,1]))+2,x.dot(M([1,-1,1]))],[a,b,c]);check('inverse_projection',x.subs(sol))
x=M([a,1,2]);u,v=M([1,0,0]),M([1,1,0]);err=projection([u],x)+projection([v],x)-projection([u,v],x)
E=s.expand(err.dot(err));amin=s.solve(s.diff(E,a),a)[0];assert s.diff(E,a,2)>0;check('false_sum',E.subs(a,amin))
u=M([1,t,t*t]);x=M([0,1,0]);r=x-projection([u],x);D=s.factor(r.dot(r))
assert equal(D-s.Rational(2,3),(t*t-1)**2/(3*(t**4+t*t+1)))
check('moving_line',M([-1,1,D.subs(t,1)]))

# Subspace membership and orthogonality, including all-real parameter denominators.
check('plane_projection',projection([M([1,1,0]),M([1,0,1])],M([1,2,3])))
constraints=M([[1,1,0,1],[0,1,1,1]]);x=M([1,2,3,4]);p=projection(constraints.nullspace(),x)
assert constraints*p==s.zeros(2,1);check('four_projection',p)
p=M([1,2,3]);normal=M([1,1,-1]);x=p+t*normal
ts=s.solve(x.dot(x)-26,t);valid=[x.subs(t,k) for k in ts if x.subs(t,k)[0]>0];assert len(valid)==1;check('projection_inverse_norm',valid[0])
x=M([1,0,1]);r=x-projection([M([1,t,0]),M([0,1,t])],x);D=s.factor(r.dot(r))
assert equal(s.Rational(4,3)-D,(t*t-1)**2/(3*(t**4+t*t+1)));check('moving_plane',D.subs(t,1))
u,v,w,x=M([1,1,0,0]),M([0,1,1,0]),M([0,0,1,1]),M([1,0,0,1])
r=x-projection([u,v],x);R=x-projection([u,v,w],x);check('enlarge_space',r.dot(r)-R.dot(R))

# Coordinates relative to explicitly normalized bases.
vectors=[M([1,-1,1]),M([1,0,-1]),M([1,2,1])];x=M([2,-3,-2]);Q=M.hstack(*(v/s.sqrt(v.dot(v)) for v in vectors))
assert equal(Q.T*Q,s.eye(3));check('normalized_coordinates',Q.T*x)
q=M([a,b,c]);sol=s.solve([a+b+c,a-b,q.dot(q)-1],[a,b,c]);valid=[M(row) for row in sol if row[2]>0];assert len(valid)==1;check('complete_basis',valid[0])
Q=M.hstack(M([1,1,0])/s.sqrt(2),M([1,-1,2])/s.sqrt(6),M([1,-1,-1])/s.sqrt(3))
assert equal(Q.T*Q,s.eye(3));check('orthogonal_change',Q.T*M([2,-1,3]))
x=M([3,2,s.sqrt(12)]);r=x-projection([M([1,1,0]),M([0,0,1])],x);check('distance_coordinates',r.dot(r))
x=a*M([1,1,0])+b*M([0,1,1])+c*M([1,0,1]);sol=s.solve([a+b+c-1,a-b-1],[a,b]);E=s.expand(x.subs(sol).dot(x.subs(sol)));cv=s.solve(s.diff(E,c),c)[0]
assert s.diff(E,c,2)>0;check('nonorthogonal_coordinates',E.subs(c,cv))

# Direct Gram-Schmidt, parameter breakdown and input order.
vectors=[M([1,1,0]),M([1,0,1]),M([1,1,1])];orth=gs(vectors);check('gs_third',orth[2]/s.sqrt(orth[2].dot(orth[2])))
orth=gs([M([1,1,0]),M([1,t,1]),M([0,1,1])]);check('gs_parameter',orth[2].dot(orth[2]));assert equal(orth[2].subs(t,2),s.zeros(3,1))
assert equal(orth[1].dot(orth[1]),((t-1)**2+2)/2)
vectors4=[M([1,1,0,0]),M([1,0,1,0]),M([1,0,0,1])];x=M([1,2,3,4]);check('gs_four',projection(vectors4,x))
orth=gs(vectors);rev=gs([vectors[1],vectors[0],vectors[2]])
unit=lambda u:u/s.sqrt(u.dot(u))
check('gs_order',M([unit(orth[1]).dot(unit(rev[1])),unit(orth[2]).dot(unit(rev[2]))]))
v1,v2,v3=M([1,1,1]),M([a,1,0]),M([0,1,1]);r=v2-projection([v1],v2)
vals=[av for av in s.solve(r.dot(r)-2,a) if r.dot(v3).subs(a,av)>0];assert vals==[-1]
third=gs([v1,v2.subs(a,vals[0]),v3])[2];check('gs_inverse',M([vals[0],*unit(third)]))
assert checked==set(bank),set(bank)-checked

for key,p in bank.items():
    tex=p['solution']
    if 'matrix' in tex:
        parsed=parse_matrix(tex);equivalent=s.latex(parsed,mat_str='bmatrix',mat_delim=None)
        wrong=parsed.copy();wrong[0,0]+=1;wrong_tex=s.latex(wrong,mat_str='pmatrix',mat_delim=None)
    else:equivalent='('+tex+')+0';wrong_tex='('+tex+')+1'
    assert grade(equivalent,tex,False,True)=='CORRECT',(key,equivalent)
    assert grade(wrong_tex,tex,False,True).startswith('INCORRECT'),(key,wrong_tex)
# Typical misconceptions: wrong sign, unnormalized coordinates and generic projection sum.
for key,wrong in [('gs_third',r'\begin{pmatrix}1/\sqrt{3}\\-1/\sqrt{3}\\-1/\sqrt{3}\end{pmatrix}'),
                  ('normalized_coordinates',r'\begin{pmatrix}1\\2\\-1\end{pmatrix}'),
                  ('gs_parameter',r'(t-2)^2'),('function',r'\begin{pmatrix}1/3\\0\end{pmatrix}')]:
    assert grade(wrong,bank[key]['solution'],False,True).startswith('INCORRECT'),key
print('PASS: 30 reference-10 answers independently derived; equivalent/wrong answers, parameter boundaries, signs and normalization checked.')
