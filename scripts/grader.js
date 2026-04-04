
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
    
    s = s.replace(r"\\operatorname{arcsec}", r"\\sec^{-1}")
    s = s.replace(r"\\operatorname{arccsc}", r"\\csc^{-1}")
    s = s.replace(r"\\operatorname{arccot}", r"\\cot^{-1}")

    # Handle bare arcsec
    s = s.replace("arcsec", r"\\sec^{-1}")
    s = s.replace("arccsc", r"\\csc^{-1}")
    s = s.replace("arccot", r"\\cot^{-1}")

    # Cleanup remaining wrappers
    s = s.replace(r"\\text", "")
    s = s.replace(r"\\operatorname", "")
    s = s.replace(r"\\mathrm", "")
    
    # CRITICAL: Remove extra braces around the functions (e.g. {{\\sec^{-1}}} -> \\sec^{-1})
    # MathLive or replacements might leave layers of braces that confuse parse_latex
    s = re.sub(r"\\{+(\\\\(?:sec|csc|cot)\\^\\{-1\\})\\}+", r"\\1", s)

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
            return "INCORRECT (Missing Constant of Integration)"
        return "CORRECT"

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
        
        if len(diffs) < 3:
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
