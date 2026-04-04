/**
 * Background Animation Function Database - Refined & Expanded (50 Functions)
 * All functions are differentiable (smooth) to avoid 'cusps'.
 * The first function is fixed to 0.1(x^3-4x) per user request.
 */
window.BG_FUNCS = [
    // [0] Fixed Start Function
    { latex: "0.1(x^3-4x)", func: (x) => 0.1 * (x*x*x - 4*x), color: "#8e8e8e", xMin: -4, xMax: 4, yMax: 3 },

    // Classics & Refined
    { latex: "e^{-x^2}", func: (x) => Math.exp(-x*x), color: "#8e7f7a", xMin: -3, xMax: 3, yMax: 1.2 },
    { latex: "5\\text{sinc}(x)", func: (x) => x === 0 ? 5 : 5 * Math.sin(x) / x, color: "#7a8e7f", xMin: -15, xMax: 15, yMax: 6 },
    { latex: "2\\tanh(x)", func: (x) => 2 * Math.tanh(x), color: "#7a838e", xMin: -5, xMax: 5, yMax: 3 },
    { latex: "3\\text{sech}(x)", func: (x) => 3 / Math.cosh(x), color: "#8a7a8e", xMin: -4, xMax: 4, yMax: 4 },
    { latex: "e^{-x/4}\\sin(4x)", func: (x) => Math.exp(-x/4) * Math.sin(4*x), color: "#8e8a7a", xMin: 0, xMax: 8, yMax: 1.2 },
    { latex: "\\frac{1}{12}x(x^2-11)", func: (x) => 0.08 * x * (x*x - 11), color: "#7a8e8e", xMin: -5, xMax: 5, yMax: 3 },
    { latex: "\\ln(x^2+1)", func: (x) => Math.log(x*x + 1), color: "#8e847a", xMin: -10, xMax: 10, yMax: 5 },
    { latex: "2\\sin(x^2/4)", func: (x) => 2 * Math.sin(x*x / 4), color: "#7a8e84", xMin: -10, xMax: 10, yMax: 3 },
    { latex: "4/(1+x^2)", func: (x) => 4 / (1 + x*x), color: "#8e7a83", xMin: -5, xMax: 5, yMax: 5 },
    { latex: "(x+2) e^{-x/2}", func: (x) => (x+2) * Math.exp(-x/2), color: "#7a858e", xMin: -2, xMax: 8, yMax: 2 },
    { latex: "\\sin(x)+\\sin(1.2x)", func: (x) => Math.sin(x) + Math.sin(1.2*x), color: "#868e7a", xMin: 0, xMax: 30, yMax: 2.5 },
    { latex: "0.01(x^4-10x^2)", func: (x) => 0.01 * (Math.pow(x, 4) - 10 * x*x), color: "#827a8e", xMin: -5, xMax: 5, yMax: 1 },
    { latex: "x\\cos(x)e^{-x^2/20}", func: (x) => x * Math.cos(x) * Math.exp(-x*x/20), color: "#7a8e8b", xMin: -10, xMax: 10, yMax: 4 },
    { latex: "2\\cos(x)e^{-0.1x}", func: (x) => 2 * Math.cos(x) * Math.exp(-0.1*x), color: "#8e7c7a", xMin: 0, xMax: 20, yMax: 3 },
    { latex: "x^2 e^{-x^2/4}", func: (x) => x*x * Math.exp(-x*x/4) * 2, color: "#8e7a8e", xMin: -6, xMax: 6, yMax: 3 },
    { latex: "5x/(1+x^2)", func: (x) => 5 * x / (1 + x*x), color: "#8e887a", xMin: -10, xMax: 10, yMax: 3 },
    { latex: "3\\text{sech}(x/2)", func: (x) => 3 / Math.cosh(x/2), color: "#7d7a8e", xMin: -8, xMax: 8, yMax: 4 },
    { latex: "\\sin(x)x^2 e^{-x^2/10}", func: (x) => Math.sin(x) * x*x * Math.exp(-x*x/10), color: "#7e8e8e", xMin: -10, xMax: 10, yMax: 3 },
    { latex: "2\\text{Arctan}(x)", func: (x) => 2 * Math.atan(x), color: "#8e8e7a", xMin: -10, xMax: 10, yMax: 4 },
    { latex: "3\\cos(x)/(1+0.05x^2)", func: (x) => 3 * Math.cos(x) / (1 + 0.05 * x*x), color: "#7a7a8e", xMin: -15, xMax: 15, yMax: 4 },
    { latex: "3\cos(x)e^{-x^2/30}", func: (x) => 3 * Math.cos(x) * Math.exp(-x*x/30), color: "#8e7a7a", xMin: -15, xMax: 15, yMax: 4 },
    { latex: "\\sin(x)/\\sqrt{1+0.1x^2}", func: (x) => 5 * Math.sin(x) / Math.sqrt(1 + 0.1*x*x), color: "#7a7a7a", xMin: -15, xMax: 15, yMax: 5 },
    { latex: "2\\cos(x^2/15)", func: (x) => 2 * Math.cos(x*x / 15), color: "#7c8e7a", xMin: -10, xMax: 10, yMax: 3 },
    { latex: "3\\sin(x)e^{-x^2/40}", func: (x) => 3 * Math.sin(x) * Math.exp(-x*x / 40), color: "#8e7a8e", xMin: -15, xMax: 15, yMax: 4 },
    { latex: "3\\tanh(x/3)\\cos(x)", func: (x) => 3 * Math.tanh(x/3) * Math.cos(x), color: "#7a8e8e", xMin: -15, xMax: 15, yMax: 4 },
    { latex: "2\\sin(x/3)+2\\cos(x/2)", func: (x) => 2*Math.sin(x/3) + 2*Math.cos(x/2), color: "#8e847a", xMin: -20, xMax: 20, yMax: 5 },
    { latex: "3\\sin(x/2)^2", func: (x) => 3 * Math.pow(Math.sin(x/2), 2), color: "#868e7a", xMin: -15, xMax: 15, yMax: 4 },
    { latex: "4\\sin(x)\\sin(x/5)", func: (x) => 4 * Math.sin(x) * Math.sin(x/5), color: "#7a8e8b", xMin: 0, xMax: 40, yMax: 5 },
    { latex: "6/(1+x^2/6)", func: (x) => 6 / (1 + x*x/6), color: "#8e7c7a", xMin: -10, xMax: 10, yMax: 7 },

    // New Additions (Up to 50)
    { latex: "4\\text{sig}(x)-2", func: (x) => 4 / (1 + Math.exp(-x)) - 2, color: "#7f8e8a", xMin: -6, xMax: 6, yMax: 3 },
    { latex: "x^3 e^{-x^2/8}", func: (x) => 0.2 * x*x*x * Math.exp(-x*x/8), color: "#8a8e7f", xMin: -8, xMax: 8, yMax: 2 },
    { latex: "3J_0(x) \\text{ variant}", func: (x) => 3 * Math.sin(x)/x * Math.cos(x/5), color: "#7f858e", xMin: -20, xMax: 20, yMax: 4 },
    { latex: "\\cos(x/2)^3 * 3", func: (x) => 3 * Math.pow(Math.cos(x/2), 3), color: "#8e7f85", xMin: -10, xMax: 10, yMax: 4 },
    { latex: "\\frac{x}{2} + \\sin(x)", func: (x) => x/2 + Math.sin(x), color: "#848e7a", xMin: -10, xMax: 10, yMax: 6 },
    { latex: "4e^{-(x-2)^2} + 4e^{-(x+2)^2}", func: (x) => 4*Math.exp(-Math.pow(x-2,2)) + 4*Math.exp(-Math.pow(x+2,2)), color: "#7a8a8e", xMin: -6, xMax: 6, yMax: 6 },
    { latex: "2\\sin(x) + \\cos(2x)", func: (x) => 2*Math.sin(x) + Math.cos(2*x), color: "#8e7a8e", xMin: -10, xMax: 10, yMax: 4 },
    { latex: "x^4 e^{-x^2/5}", func: (x) => 0.1 * Math.pow(x,4) * Math.exp(-x*x/5), color: "#8e8e7a", xMin: -6, xMax: 6, yMax: 2 },
    { latex: "3\\tanh(x) \\sin(x)", func: (x) => 3 * Math.tanh(x) * Math.sin(x), color: "#7a7a7a", xMin: -10, xMax: 10, yMax: 4 },
    { latex: "e^{-x/10}(2\\sin(x)+\\cos(3x))", func: (x) => Math.exp(-x/10)*(2*Math.sin(x)+Math.cos(3*x)), color: "#7a8e7a", xMin: 0, xMax: 20, yMax: 4 },
    { latex: "1/(1+e^{-x})", func: (x) => 4 / (1+Math.exp(-x)), color: "#8e8e8e", xMin: -10, xMax: 10, yMax: 5 },
    { latex: "x^2 \\sin(x) / 10", func: (x) => x*x * Math.sin(x) / 10, color: "#8e7a7a", xMin: -10, xMax: 10, yMax: 5 },
    { latex: "5 / \\cosh(x)", func: (x) => 5 / Math.cosh(x), color: "#7a8e7a", xMin: -5, xMax: 5, yMax: 6 },
    { latex: "2\\sin(x) - x/3", func: (x) => 2*Math.sin(x) - x/3, color: "#7a7a8e", xMin: -15, xMax: 15, yMax: 6 },
    { latex: "3\\sin(x/4) + \\cos(x)", func: (x) => 3*Math.sin(x/4) + Math.cos(x), color: "#8e8e7a", xMin: -20, xMax: 20, yMax: 5 },
    { latex: "x e^{-x^2/10}", func: (x) => 4 * x * Math.exp(-x*x/10), color: "#8e7a8e", xMin: -10, xMax: 10, yMax: 4 },
    { latex: "2\\tanh(x-3) + 2\\tanh(x+3)", func: (x) => 2*Math.tanh(x-3) + 2*Math.tanh(x+3), color: "#7a8e8e", xMin: -8, xMax: 8, yMax: 5 },
    { latex: "3\\sin(x/2) \\cos(x/3)", func: (x) => 3 * Math.sin(x/2) * Math.cos(x/3), color: "#8e847a", xMin: -20, xMax: 20, yMax: 4 },
    { latex: "4/(1+0.1x^4)", func: (x) => 4 / (1 + 0.1 * Math.pow(x,4)), color: "#868e7a", xMin: -5, xMax: 5, yMax: 5 },
    { latex: "\\sin(x)^3 * 4", func: (x) => 4 * Math.pow(Math.sin(x), 3), color: "#827a8e", xMin: -10, xMax: 10, yMax: 5 }
];
