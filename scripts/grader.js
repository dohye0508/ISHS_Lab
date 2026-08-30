
const workerScript = `
importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");

self.isCodeLoaded = false;

async function loadPyodideAndPackages() {
    try {
        self.pyodide = await loadPyodide();
        await self.pyodide.loadPackage(["micropip"]);
        const micropip = self.pyodide.pyimport("micropip");
        await micropip.install("antlr4-python3-runtime==4.11.1");
        await self.pyodide.loadPackage("sympy");
        self.postMessage({ type: 'ready' });
        
    } catch(e) {
         self.postMessage({ type: 'error', msg: "Init Failed: " + e.toString() + "\\n(ANTLR 설치 실패)" });
    }
}

self.onmessage = async function(e) {
    if (e.data.type === 'init') {
        await loadPyodideAndPackages();
        self.gradingCode = e.data.code;
        // Don't run code here immediately to avoid race with 'ready' message
        
    } else if (e.data.userTex) {
        if (!self.pyodide || !self.gradingCode) {
             self.postMessage({ type: 'error', msg: "Worker not ready or no code" });
             return;
        }
        try {
            // Lazy load the code if not already loaded
            if (!self.isCodeLoaded) {
                await self.pyodide.runPythonAsync(self.gradingCode);
                self.isCodeLoaded = true;
            }

            self.pyodide.globals.set("py_u", e.data.userTex);
            self.pyodide.globals.set("py_s", e.data.solTex);
            self.pyodide.globals.set("py_strict", e.data.strictC);
            
            const res = await self.pyodide.runPythonAsync("grade(py_u, py_s, py_strict)");
            self.postMessage({ type: 'result', content: res });
        } catch(err) {
            self.postMessage({ type: 'result', content: "Runtime Error: " + err });
        }
    }
};
`;

const pythonGraderCode = `
import sympy
from sympy import *
from sympy.parsing.latex import parse_latex
import re

result_log = []

def log(s):
    result_log.append(str(s))

def preprocess_for_sympy_parser(tex):
    s = str(tex)
    # 1. \\sqrtN -> \\sqrt{N}
    s = re.sub(r"\\\\sqrt\\s*([0-9a-zA-Z])", r"\\\\sqrt{\\1}", s)
    # 2. \\fracAB -> \\frac{A}{B}
    s = re.sub(r"\\\\frac\\s*([0-9a-zA-Z])\\s*([0-9a-zA-Z])", r"\\\\frac{\\1}{\\2}", s)
    # 3. |...| norm
    # 3. |...| norm
    s = s.replace(r"\\left|", "|").replace(r"\\right|", "|")
    # 4. Remove extra \\left \\right
    s = s.replace(r"\\left", "").replace(r"\\right", "")
    # EXPERIMENTAL: Explicitly handle arc functions first to avoid bracing issues
    # Handle \\text{arcsec}, \\operatorname{arcsec}, etc.
    s = s.replace(r"\\text{arcsec}", r"\\sec^{-1}")
    s = s.replace(r"\\text{arccsc}", r"\\csc^{-1}")
    s = s.replace(r"\\text{arccot}", r"\\cot^{-1}")
    
    # Inverse hyperbolic functions
    s = s.replace(r"\\text{arsinh}", r"\\sinh^{-1}")
    s = s.replace(r"\\text{arcosh}", r"\\cosh^{-1}")
    s = s.replace(r"\\text{artanh}", r"\\tanh^{-1}")
    
    s = s.replace(r"\\operatorname{arcsec}", r"\\sec^{-1}")
    s = s.replace(r"\\operatorname{arccsc}", r"\\csc^{-1}")
    s = s.replace(r"\\operatorname{arccot}", r"\\cot^{-1}")

    s = s.replace(r"\\operatorname{arsinh}", r"\\sinh^{-1}")
    s = s.replace(r"\\operatorname{arcosh}", r"\\cosh^{-1}")
    s = s.replace(r"\\operatorname{artanh}", r"\\tanh^{-1}")

    # Handle bare names
    s = s.replace("arcsec", r"\\sec^{-1}")
    s = s.replace("arccsc", r"\\csc^{-1}")
    s = s.replace("arccot", r"\\cot^{-1}")
    
    s = s.replace("arsinh", r"\\sinh^{-1}")
    s = s.replace("arcosh", r"\\cosh^{-1}")
    s = s.replace("artanh", r"\\tanh^{-1}")

    # sympy's parser DOES understand bare "\\sech(x)"/"\\coth(x)"/"\\csch(x)" natively as
    # real functions (confirmed directly) -- MathLive's own inline shortcuts serialize
    # typed "sech"/"coth"/"csch" down to exactly this bare-macro form. What it does NOT
    # understand is a \\text{}/\\operatorname{}/\\mathrm{}-wrapped or fully bare (no
    # backslash) form, e.g. the stored solution's "\\text{csch}(5x)" parses as literal
    # letter-by-letter multiplication, not the function.
    #
    # A previous version of this block used a bare "sech"/"csch"/"coth" alternative with no
    # boundary check, which matched the SAME text *inside* a legitimate "\\sech(x)" macro
    # (regex doesn't care that a backslash precedes it) and mangled it into an unparseable
    # "\\\\frac{...}" (a literal double backslash) -- silently marking a student's already-
    # correct, cleanly-typed answer wrong. Flatten one level of \\operatorname{\\mathrm{X}}
    # nesting (an odd but observed MathLive re-serialization) first, then handle the two
    # remaining cases separately: \\sec/\\cot/\\csc immediately followed by "h" (zero
    # whitespace = MathLive's own native \\sech/\\coth/\\csch macro; nonzero whitespace =
    # the shortcut firing on the shorter \\sec/\\cot/\\csc before the trailing "h" is typed
    # -- both convert to the identical reciprocal identity, so one pattern covers both and
    # must run first so no backslash-prefixed occurrence remains for the next step), and
    # the wrapped/bare forms (bare alternative requires NOT preceded by a backslash, so it
    # can never fire inside an already-valid native macro again).
    s = re.sub(r"\\\\operatorname\\{\\\\mathrm\\{([a-z]+)\\}\\}", r"\\\\operatorname{\\1}", s)
    s = re.sub(r"\\\\mathrm\\{\\\\operatorname\\{([a-z]+)\\}\\}", r"\\\\operatorname{\\1}", s)

    # MathLive itself ships "ch" as a built-in shortcut (-> \\operatorname{ch}, presumably
    # for the European cosh notation). Typing "sech"/"csch" letter by letter can trigger
    # THAT shortcut on the trailing 2 letters before the full 4-letter word is recognized,
    # leaving the first 2 letters bare and only the last 2 wrapped -- confirmed directly
    # from a reported raw answer: "cs\\operatorname{\\mathrm{ch}}(5x)" for what should have
    # been "csch(5x)". Catch the bare-prefix + ch-shortcut split for both words ending "ch".
    CH_WRAP = r"(?:\\\\operatorname\\{ch\\}|\\\\mathrm\\{ch\\}|\\\\text\\{ch\\}|ch)"
    s = re.sub(r"(?<![a-zA-Z])cs" + CH_WRAP + r"\\s*\\(([^()]*)\\)", r"\\\\frac{1}{\\\\sinh(\\1)}", s)
    s = re.sub(r"(?<![a-zA-Z])se" + CH_WRAP + r"\\s*\\(([^()]*)\\)", r"\\\\frac{1}{\\\\cosh(\\1)}", s)

    s = re.sub(r"\\\\sec\\s*h\\s*\\(([^()]*)\\)", r"\\\\frac{1}{\\\\cosh(\\1)}", s)
    s = re.sub(r"\\\\csc\\s*h\\s*\\(([^()]*)\\)", r"\\\\frac{1}{\\\\sinh(\\1)}", s)
    s = re.sub(r"\\\\cot\\s*h\\s*\\(([^()]*)\\)", r"\\\\frac{\\\\cosh(\\1)}{\\\\sinh(\\1)}", s)
    s = re.sub(r"(?:\\\\text\\{sech\\}|\\\\operatorname\\{sech\\}|\\\\mathrm\\{sech\\}|(?<!\\\\)sech)\\s*\\(([^()]*)\\)", r"\\\\frac{1}{\\\\cosh(\\1)}", s)
    s = re.sub(r"(?:\\\\text\\{csch\\}|\\\\operatorname\\{csch\\}|\\\\mathrm\\{csch\\}|(?<!\\\\)csch)\\s*\\(([^()]*)\\)", r"\\\\frac{1}{\\\\sinh(\\1)}", s)
    s = re.sub(r"(?:\\\\text\\{coth\\}|\\\\operatorname\\{coth\\}|\\\\mathrm\\{coth\\}|(?<!\\\\)coth)\\s*\\(([^()]*)\\)", r"\\\\frac{\\\\cosh(\\1)}{\\\\sinh(\\1)}", s)

    # Cleanup remaining wrappers
    s = s.replace(r"\\text", "")
    s = s.replace(r"\\operatorname", "")
    s = s.replace(r"\\mathrm", "")
    
    # CRITICAL: Remove extra braces around the functions (e.g. {{\\sec^{-1}}} -> \\sec^{-1})
    # MathLive or replacements might leave layers of braces that confuse parse_latex
    s = re.sub(r"\\{+(\\\\(?:sec|csc|cot|sinh|cosh|tanh)\\^\\{-1\\})\\}+", r"\\1", s)

    # 6. x(...) -> x \\cdot (...) to prevent Function interpretation
    # Only target 'x' to avoid breaking \\ln, \\cos, etc.
    # Case A: x(
    s = re.sub(r"x\\s*\\(", r"x \\\\cdot (", s)
    # Case B: x\\left(
    s = re.sub(r"x\\s*\\\\left\\(", r"x \\\\cdot \\\\left(", s)
    
    return s

def check_strict_c(u_in):
    # Check for +C, +c, or C if it stands alone or follows +
    stripped = u_in.replace(" ", "")
    if "+C" in stripped or "+c" in stripped:
        return True
    return False

def parse_matrix_latex(s):
    s = str(s)
    m = re.search(r'\\\\begin\\{(?:p|b)matrix\\}(.*?)\\\\end\\{(?:p|b)matrix\\}', s, re.S)
    if not m:
        return None
    body = m.group(1)
    row_strs = [r for r in body.split('\\\\\\\\') if r.strip() != '']
    if not row_strs:
        return None
    rows = []
    for row_str in row_strs:
        cells = row_str.split('&')
        row_exprs = []
        for cell in cells:
            cell = cell.strip()
            cell_prep = preprocess_for_sympy_parser(cell)
            expr = parse_latex(cell_prep)
            e_sym2 = symbols('e')
            pi_sym2 = symbols('pi')
            if expr.has(e_sym2):
                expr = expr.subs(e_sym2, sympy.E)
            if expr.has(pi_sym2):
                expr = expr.subs(pi_sym2, sympy.pi)
            row_exprs.append(expr)
        rows.append(row_exprs)
    ncols = len(rows[0])
    if any(len(r) != ncols for r in rows):
        return None
    return sympy.Matrix(rows)


def grade_matrix_or_special(u_in, s_in):
    s_nospace = s_in.replace(" ", "")

    # A single generic "포기" (give up) answer is accepted for every give-up-style sentinel
    # in this app -- unintegrable calculus problems ("적포"), no-inverse matrices, and
    # no-solution systems -- alongside each one's own specific wording, so a student never
    # has to remember which exact phrase applies to which problem type.
    if s_nospace == "적포":
        u_nospace = u_in.replace(" ", "")
        markers = ["적포", "포기", "impossible"]
        return "CORRECT" if any(mk in u_nospace for mk in markers) else "INCORRECT"

    if s_nospace == "역행렬없음":
        u_nospace = u_in.replace(" ", "")
        markers = ["특이", "존재하지않", "존재안", "없음", "불가능", "포기"]
        return "CORRECT" if any(mk in u_nospace for mk in markers) else "INCORRECT"

    if s_nospace == "해없음":
        u_nospace = u_in.replace(" ", "")
        markers = ["해없음", "없음", "불능", "포기"]
        return "CORRECT" if any(mk in u_nospace for mk in markers) else "INCORRECT"

    if "matrix" in s_in:
        try:
            Mu = parse_matrix_latex(u_in)
            Ms = parse_matrix_latex(s_in)
        except Exception as e:
            return f"FATAL: Matrix Parse Failed. {e}"
        if Mu is None or Ms is None:
            return "INCORRECT"
        if Mu.shape != Ms.shape:
            return "INCORRECT"
        t_symbol = symbols('t')
        all_ok = True
        for i in range(Ms.rows):
            for j in range(Ms.cols):
                cu = Mu[i, j]
                cs = Ms[i, j]
                if cu.has(t_symbol) or cs.has(t_symbol):
                    ok = True
                    for tv in [-2, -1, 0, 1, 2, 3, sympy.Rational(1, 2)]:
                        try:
                            vu = complex(cu.subs(t_symbol, tv).evalf(15))
                            vs = complex(cs.subs(t_symbol, tv).evalf(15))
                            if abs(vu - vs) > 1e-4:
                                ok = False
                                break
                        except Exception:
                            ok = False
                            break
                    if not ok:
                        all_ok = False
                elif cu.free_symbols or cs.free_symbols:
                    all_ok = False
                else:
                    try:
                        diff = complex(sympy.simplify(cu - cs).evalf(15))
                        if abs(diff) > 1e-4:
                            all_ok = False
                    except Exception:
                        all_ok = False
        return "CORRECT" if all_ok else "INCORRECT"

    return None

def grade(u_in, s_in, strict_c=False):
    global result_log
    result_log = []
    
    # 1. Fast Track: Empty Input
    if not u_in or not str(u_in).strip():
        return "EMPTY INPUT"

    # Strict C Check (Pre-check)
    has_c = check_strict_c(u_in)
    
    # P259 Exception
    if "cdot" in s_in and "^" in s_in: 
        return "SKIP (Infinite Exponent)"

    # 2. Fast Track: Exact String Match (Normalized)
    def norm(t): 
        return str(t).replace(" ", "").replace("\\\\,", "").replace("+C", "").replace("+c", "").strip()
    
    if norm(u_in) == norm(s_in):
        if strict_c and not has_c:
            # Exception for "적포" (Integral Impossible)
            if "적포" in s_in or "impossible" in s_in.lower():
                 return "CORRECT"
            # Exception for definite integrals (no 'x' in solution)
            if "x" not in s_in:
                 return "CORRECT"
            return "INCORRECT (Missing Constant of Integration)"
        return "CORRECT"

    # Matrix / vector answers (Gauss-Jordan inverses, PA=I, solution vectors -- including
    # ones with a free parameter t) and Korean-text sentinels ("역행렬 없음", "해 없음")
    # aren't single scalar expressions, so parse_latex below can't handle them at all.
    special_result = grade_matrix_or_special(u_in, s_in)
    if special_result is not None:
        return special_result

    try:
        # Preprocessing
        u_prep = preprocess_for_sympy_parser(u_in.replace("C", "0"))
        s_prep = preprocess_for_sympy_parser(s_in.replace("C", "0"))
        
        try:
            u_expr = parse_latex(u_prep)
            s_expr = parse_latex(s_prep)
        except Exception as e:
            return f"FATAL: Parse Failed. {e}"

        e_sym = symbols('e')
        if u_expr.has(e_sym): u_expr = u_expr.subs(e_sym, sympy.E)
        if s_expr.has(e_sym): s_expr = s_expr.subs(e_sym, sympy.E)

        # parse_latex turns \\pi into a plain Symbol('pi'), not the numeric constant
        # sympy.pi (same trap as 'e' above) -- left unresolved, any answer containing
        # pi never numerically evaluates, so two DIFFERENT pi-multiples of terms can
        # cancel down to "just a constant" and slip past the equality checks below.
        pi_sym = symbols('pi')
        if u_expr.has(pi_sym): u_expr = u_expr.subs(pi_sym, sympy.pi)
        if s_expr.has(pi_sym): s_expr = s_expr.subs(pi_sym, sympy.pi)

        # Numerical Consistency Check
        # Robust Substitution Helper
        def eval_at(expr, val):
            try:
                # Find all symbols with name 'x'
                syms = [s for s in expr.free_symbols if s.name == 'x']
                subbed = expr
                for s in syms:
                    subbed = subbed.subs(s, val)
                return subbed.evalf(15)
            except:
                 return None

        points = [-10, -5, -1, -0.5, 0.5, 1, 5, 10, sympy.pi, 0.001, -0.001, 0.002, -0.002]
        diffs = []
        
        for p in points:
            try:
                val_u = eval_at(u_expr, p)
                val_s = eval_at(s_expr, p)
                
                if val_u is None or val_s is None: continue
                if not getattr(val_u, 'is_number', True) or not getattr(val_s, 'is_number', True): continue
                if "nan" in str(val_u) or "inf" in str(val_u): continue
                if "nan" in str(val_s) or "inf" in str(val_s): continue

                d = val_u - val_s
                diffs.append(d)
            except: 
                pass
        
        is_correct_math = False

        # Pure-number answers (distances, angles, slopes, coordinates -- anything with no
        # free symbol left at all, e.g. the whole polar pool) have no x/theta to vary the
        # probe points over, so every "sample" above is identical and their difference is
        # trivially "constant" no matter what the two numbers actually are. That makes the
        # consistency checks below pass for ANY two constants (right or wrong). Only a pure
        # number needs this: require the values to actually be numerically equal instead.
        if not u_expr.free_symbols and not s_expr.free_symbols:
            try:
                num_diff = complex(sympy.simplify(u_expr - s_expr).evalf(15))
                is_correct_math = abs(num_diff) < 1e-4
            except Exception:
                pass
        elif len(diffs) < 3:
             try:
                 sim_diff = sympy.simplify(u_expr - s_expr)
                 if sim_diff.is_constant():
                     is_correct_math = True
             except: pass
        else:
            # Consistency Check
            c_diffs = [complex(d) for d in diffs]
            re_vals = [z.real for z in c_diffs]
            im_vals = [z.imag for z in c_diffs]
            
            re_range = max(re_vals) - min(re_vals)
            im_range = max(im_vals) - min(im_vals)
            
            tol = 1e-4
            
            if abs(re_range) < tol and abs(im_range) < tol:
                is_correct_math = True

        if is_correct_math:
            if strict_c and not has_c:
                 if "x" not in s_in:
                      return "CORRECT"
                 return "INCORRECT (Missing Constant of Integration)"
            return "CORRECT"
        else:
            return "INCORRECT"

    except Exception as e:
        return f"System Error: {e}"
`;

let graderWorker = null;
let isGraderReady = false;

function initGrader() {
    if (graderWorker) {
        graderWorker.terminate();
    }

    const blob = new Blob([workerScript], { type: 'application/javascript' });
    graderWorker = new Worker(URL.createObjectURL(blob));

    graderWorker.onmessage = function(e) {
        const d = e.data;
        if (d.type === 'error') {
            console.error("Worker Error: " + d.msg);
        } else if (d.type === 'ready') {
            isGraderReady = true;
        }
    };

    graderWorker.postMessage({ type: 'init', code: pythonGraderCode });
}

async function gradeProblem(userTex, solTex, strictC, timeoutMs = 30000) {
    if (!userTex || !userTex.trim()) {
        return Promise.resolve("EMPTY INPUT");
    }

    if (!isGraderReady) {
        let retries = 0;
        while (!isGraderReady && retries < 60) { 
            await new Promise(r => setTimeout(r, 500));
            retries++;
        }
        if (!isGraderReady) {
            return Promise.resolve("System Error: Grader failed to initialize");
        }
    }

    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            graderWorker.terminate();
            console.error("Worker Timeout (30s)! Restarting...");
            isGraderReady = false;
            initGrader(); 
            resolve("TIMEOUT"); 
        }, timeoutMs);

        const oldHandler = graderWorker.onmessage;
        graderWorker.onmessage = function(e) {
            const d = e.data;
            if (d.type === 'result') {
                clearTimeout(timeoutId);
                graderWorker.onmessage = oldHandler;
                resolve(d.content);
            } else if (d.type === 'log') {
                // No log
            } else if (d.type === 'error') {
               clearTimeout(timeoutId); // FAIL FAST
               graderWorker.onmessage = oldHandler;
               console.error("Worker Error during grade: " + d.msg);
               resolve("System Error: " + d.msg);
            } else {
                if (oldHandler) oldHandler(e);
            }
        };

        graderWorker.postMessage({ userTex: userTex, solTex: solTex, strictC: strictC });
    });
}
