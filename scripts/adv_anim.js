/**
 * Background animation for adv_math.php.
 * Cycles through three scenes, one per topic area the studio actually covers,
 * crossfading between them so something is always moving (never freezes
 * between states like a plain hold-then-snap cycle):
 *   - Calculus act: a hyperbolic/inverse-function curve draws in, then a
 *     glowing point keeps tracing back and forth along it.
 *   - Polar act: a polar curve (cardioid / rose / limaçon / lemniscate /
 *     log spiral) sweeps out over a polar grid, same tracing treatment.
 *   - Algebra act: a coordinate grid is warped by a continuously oscillating
 *     2x2 matrix, with sparkling transformed lattice points and glowing
 *     basis vectors.
 */

const ENABLE_ADV_ANIMATION = true;

if (ENABLE_ADV_ANIMATION) {
    // yMin/yMax are each curve's real extent over its domain (not assumed
    // symmetric about 0) so mostly-one-sided curves like cosh/sech still get
    // vertically centered instead of pinned to the top of the canvas.
    const CURVES = [
        { f: x => Math.cosh(x), xMin: -2.2, xMax: 2.2, yMin: 1, yMax: 4.568 },
        { f: x => Math.sinh(x), xMin: -2.2, xMax: 2.2, yMin: -4.457, yMax: 4.457 },
        { f: x => Math.tanh(x), xMin: -3, xMax: 3, yMin: -0.995, yMax: 0.995 },
        { f: x => 1 / Math.cosh(x), xMin: -3.2, xMax: 3.2, yMin: 0.081, yMax: 1 },
        { f: x => Math.log(x + Math.sqrt(x * x + 1)), xMin: -4, xMax: 4, yMin: -2.095, yMax: 2.095 },
        { f: x => 1 / (1 + x * x), xMin: -4, xMax: 4, yMin: 0.059, yMax: 1 },
        { f: x => Math.asin(x), xMin: -1, xMax: 1, yMin: -Math.PI / 2, yMax: Math.PI / 2 },
        { f: x => Math.acos(x), xMin: -1, xMax: 1, yMin: 0, yMax: Math.PI },
        { f: x => Math.atan(x), xMin: -4, xMax: 4, yMin: -1.326, yMax: 1.326 },
        { f: x => 1 / Math.sinh(x), xMin: 0.3, xMax: 3.5, yMin: 0.061, yMax: 3.284 },      // csch
        { f: x => Math.cosh(x) / Math.sinh(x), xMin: 0.3, xMax: 3.5, yMin: 1.002, yMax: 3.432 }, // coth
    ];

    const POLARS = [
        { r: th => 1 + Math.cos(th), thetaMax: Math.PI * 2, rMax: 2 },                 // cardioid
        { r: th => Math.cos(3 * th), thetaMax: Math.PI, rMax: 1 },                      // 3-petal rose
        { r: th => Math.cos(2 * th), thetaMax: Math.PI * 2, rMax: 1 },                  // 4-petal rose
        { r: th => Math.sin(5 * th), thetaMax: Math.PI, rMax: 1 },                      // 5-petal rose
        { r: th => 0.6 + Math.cos(th), thetaMax: Math.PI * 2, rMax: 1.6 },              // limacon with inner loop
        { r: th => 1.3 + Math.cos(th), thetaMax: Math.PI * 2, rMax: 2.3 },              // dimpled limacon
        { r: th => 2 * Math.cos(th), thetaMax: Math.PI, rMax: 2 },                      // circle off the pole
        { r: th => { const c = Math.cos(2 * th); return c >= 0 ? Math.sqrt(c) : NaN; }, thetaMax: Math.PI * 2, rMax: 1 }, // lemniscate
        { r: th => Math.exp(0.11 * th), thetaMax: Math.PI * 3.4, rMax: Math.exp(0.11 * Math.PI * 3.4) }, // log spiral
    ];

    // Distinct oscillation "personalities" for the algebra act, so the grid
    // doesn't always warp the same way cycle to cycle.
    const MATRIX_MODES = [
        t => { // rotation-dominant, gentle breathing scale
            const s = 1 + 0.15 * Math.sin(t * 0.0009);
            const a = t * 0.0006;
            return [Math.cos(a) * s, -Math.sin(a) * s, Math.sin(a) * s, Math.cos(a) * s];
        },
        t => [1, 0.9 * Math.sin(t * 0.0006), 0.9 * Math.sin(t * 0.0005 + 2), 1], // shear-oscillate
        t => [1 + 0.8 * Math.sin(t * 0.0005), 0, 0, 1 + 0.8 * Math.cos(t * 0.00045)], // scale-pulse
        t => [ // chaotic mix, occasionally near-singular
            1 + 0.55 * Math.sin(t * 0.00055),
            0.6 * Math.sin(t * 0.00038 + 1.3),
            0.6 * Math.sin(t * 0.00047 + 2.6),
            1 + 0.55 * Math.cos(t * 0.0005 + 0.5),
        ],
    ];

    const DRAW_IN = 1800;
    const TRACER_SPEED = 0.0009;
    const TRANSITION = 900;

    let ctx = null, W, H, unit;
    let cycleStart = 0;
    let curveIdx = 0, polarIdx = 0, matrixModeIdx = 0;

    function isDark() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    }

    function hueColor(t, alpha) {
        const hue = 260 + 30 * Math.sin(t * 0.00008);
        const light = isDark() ? 70 : 50;
        return `hsla(${hue}, 68%, ${light}%, ${alpha})`;
    }

    // Drives both the fill/stroke reveal front AND the tracer dot from the
    // exact same progress value while the curve is being drawn, so the two
    // never drift apart. Once the reveal finishes, the tracer keeps drifting
    // back and forth on its own at a matched, gentle pace.
    function sweepT(elapsed) {
        const drawProgress = Math.min(1, elapsed / DRAW_IN);
        const eased = 1 - Math.pow(1 - drawProgress, 3);
        const tracer = drawProgress < 1
            ? eased
            : (Math.sin((elapsed - DRAW_IN) * TRACER_SPEED - Math.PI / 2) + 1) / 2;
        return { reveal: eased, tracer };
    }

    function pickNext(len, excludeIdx) {
        if (len <= 1) return 0;
        let next;
        do { next = Math.floor(Math.random() * len); } while (next === excludeIdx);
        return next;
    }

    const ACTS = [
        { duration: 6200, render: renderCurveScene },
        { duration: 6200, render: renderPolarScene },
        { duration: 6200, render: renderMatrixScene },
    ];
    const N = ACTS.length;
    const START = [];
    {
        let acc = 0;
        for (let i = 0; i < N; i++) { START.push(acc); acc += ACTS[i].duration + TRANSITION; }
    }
    const TOTAL = START[N - 1] + ACTS[N - 1].duration + TRANSITION;

    window.addEventListener('load', function () {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        if (!ctx) return;

        function resizeCanvas() {
            if (window.innerWidth <= 1200) {
                canvas.width = 0;
                canvas.height = 0;
                return;
            }
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            W = canvas.width;
            H = canvas.height;
            unit = Math.min(W, H) / 7;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        cycleStart = performance.now();
        curveIdx = Math.floor(Math.random() * CURVES.length);
        polarIdx = Math.floor(Math.random() * POLARS.length);
        matrixModeIdx = Math.floor(Math.random() * MATRIX_MODES.length);
        requestAnimationFrame(loop);
    });

    function loop(now) {
        requestAnimationFrame(loop);
        if (!ctx || !W) return;

        let elapsed = now - cycleStart;
        if (elapsed >= TOTAL) {
            cycleStart = now;
            elapsed = 0;
            curveIdx = pickNext(CURVES.length, curveIdx);
            polarIdx = pickNext(POLARS.length, polarIdx);
            matrixModeIdx = pickNext(MATRIX_MODES.length, matrixModeIdx);
        }

        ctx.clearRect(0, 0, W, H);

        for (let i = 0; i < N; i++) {
            const s = START[i], solidEnd = s + ACTS[i].duration, transEnd = solidEnd + TRANSITION;
            if (elapsed >= s && elapsed < solidEnd) {
                ACTS[i].render(now, elapsed - s, 1);
            } else if (elapsed >= solidEnd && elapsed < transEnd) {
                const p = (elapsed - solidEnd) / TRANSITION;
                ACTS[i].render(now, elapsed - s, 1 - p);
                ACTS[(i + 1) % N].render(now, 0, p);
            }
        }
    }

    // ---------- Calculus act ----------
    function renderCurveScene(now, elapsed, alpha) {
        const cur = CURVES[curveIdx];
        const yMid = (cur.yMin + cur.yMax) / 2;
        const ySpan = (cur.yMax - cur.yMin) * 1.35;
        const xRange = cur.xMax - cur.xMin;
        const toX = x => ((x - cur.xMin) / xRange) * W;
        const toY = y => H * 0.5 - ((y - yMid) / ySpan) * (H * 0.7);

        const { reveal, tracer } = sweepT(elapsed);

        ctx.save();

        ctx.strokeStyle = isDark() ? '#666' : '#999';
        ctx.globalAlpha = 0.25 * alpha;
        ctx.lineWidth = 1.2;
        const py0 = toY(0);
        ctx.beginPath();
        ctx.moveTo(0, py0); ctx.lineTo(W, py0);
        ctx.stroke();

        const color = hueColor(now, 1);
        const frontX = cur.xMin + xRange * reveal;

        const grad = ctx.createLinearGradient(toX(cur.xMin), 0, Math.max(toX(cur.xMin) + 1, toX(frontX)), 0);
        grad.addColorStop(0, hueColor(now, 0));
        grad.addColorStop(1, hueColor(now, 0.11));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(toX(cur.xMin), py0);
        const fillStep = xRange / 140;
        for (let x = cur.xMin; x <= frontX; x += fillStep) {
            ctx.lineTo(toX(x), toY(cur.f(x)));
        }
        ctx.lineTo(toX(frontX), py0);
        ctx.closePath();
        ctx.fill();

        ctx.shadowColor = color;
        ctx.shadowBlur = 16;
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.9 * alpha;
        ctx.beginPath();
        const step = xRange / 160;
        let first = true;
        for (let x = cur.xMin; x <= frontX; x += step) {
            const y = toY(cur.f(x));
            if (first) { ctx.moveTo(toX(x), y); first = false; }
            else ctx.lineTo(toX(x), y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        const tx = cur.xMin + xRange * tracer;
        const tPx = toX(tx), tPy = toY(cur.f(tx));
        drawTracer(tPx, tPy, color, alpha);

        ctx.restore();
    }

    // ---------- Polar act ----------
    function renderPolarScene(now, elapsed, alpha) {
        const cur = POLARS[polarIdx];
        const cx = W / 2, cy = H / 2;
        const maxPx = Math.min(W, H) * 0.4;
        const scale = maxPx / cur.rMax;
        const toPt = th => {
            const r = cur.r(th);
            if (!isFinite(r)) return null;
            return [cx + r * Math.cos(th) * scale, cy - r * Math.sin(th) * scale];
        };

        ctx.save();

        // polar reference grid: concentric rings + spokes
        ctx.strokeStyle = isDark() ? '#666' : '#999';
        ctx.globalAlpha = 0.22 * alpha;
        ctx.lineWidth = 1;
        for (let k = 1; k <= 3; k++) {
            ctx.beginPath();
            ctx.arc(cx, cy, maxPx * (k / 3), 0, Math.PI * 2);
            ctx.stroke();
        }
        for (let s = 0; s < 8; s++) {
            const a = s * Math.PI / 4;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + maxPx * Math.cos(a), cy - maxPx * Math.sin(a));
            ctx.stroke();
        }

        const { reveal, tracer } = sweepT(elapsed);
        const thetaFront = cur.thetaMax * reveal;
        const color = hueColor(now, 1);

        // sector glow under the swept portion
        const rGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxPx);
        rGrad.addColorStop(0, hueColor(now, 0.15 * alpha));
        rGrad.addColorStop(1, hueColor(now, 0.015 * alpha));
        ctx.globalAlpha = 1;
        ctx.fillStyle = rGrad;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        const fillStep = cur.thetaMax / 200;
        let any = false;
        for (let th = 0; th <= thetaFront; th += fillStep) {
            const pt = toPt(th);
            if (pt) { ctx.lineTo(pt[0], pt[1]); any = true; }
        }
        if (any) { ctx.closePath(); ctx.fill(); }

        // glowing curve stroke, breaking across NaN gaps (e.g. lemniscate)
        ctx.shadowColor = color;
        ctx.shadowBlur = 16;
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.9 * alpha;
        ctx.beginPath();
        const step = cur.thetaMax / 240;
        let drawing = false;
        let lastPt = null;
        for (let th = 0; th <= thetaFront; th += step) {
            const pt = toPt(th);
            if (pt) {
                if (!drawing) { ctx.moveTo(pt[0], pt[1]); drawing = true; }
                else ctx.lineTo(pt[0], pt[1]);
                lastPt = pt;
            } else {
                drawing = false;
            }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        const tracerPt = toPt(cur.thetaMax * tracer) || lastPt;
        if (tracerPt) drawTracer(tracerPt[0], tracerPt[1], color, alpha);

        ctx.restore();
    }

    // ---------- Algebra act ----------
    function apply(m, x, y) {
        return [m[0] * x + m[1] * y, m[2] * x + m[3] * y];
    }

    function renderMatrixScene(now, elapsed, alpha) {
        const toScreen = (x, y) => [W / 2 + x * unit, H / 2 - y * unit];
        const m = MATRIX_MODES[matrixModeIdx](elapsed);
        const color = hueColor(now, 1);

        ctx.save();

        ctx.strokeStyle = isDark() ? '#666' : '#999';
        ctx.globalAlpha = 0.22 * alpha;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2);
        ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H);
        ctx.stroke();

        const range = 3;

        const o = toScreen(...apply(m, 0, 0));
        const p1 = toScreen(...apply(m, 1, 0));
        const p2 = toScreen(...apply(m, 1, 1));
        const p3 = toScreen(...apply(m, 0, 1));
        const cx = (o[0] + p2[0]) / 2, cy = (o[1] + p2[1]) / 2;
        const rGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, unit * 1.6);
        rGrad.addColorStop(0, hueColor(now, 0.18 * alpha));
        rGrad.addColorStop(1, hueColor(now, 0.03 * alpha));
        ctx.globalAlpha = 1;
        ctx.fillStyle = rGrad;
        ctx.beginPath();
        ctx.moveTo(o[0], o[1]);
        ctx.lineTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.lineTo(p3[0], p3[1]);
        ctx.closePath();
        ctx.fill();

        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.3;
        ctx.globalAlpha = 0.45 * alpha;
        for (let k = -range; k <= range; k++) {
            const a1 = toScreen(...apply(m, k, -range));
            const a2 = toScreen(...apply(m, k, range));
            ctx.beginPath(); ctx.moveTo(a1[0], a1[1]); ctx.lineTo(a2[0], a2[1]); ctx.stroke();

            const b1 = toScreen(...apply(m, -range, k));
            const b2 = toScreen(...apply(m, range, k));
            ctx.beginPath(); ctx.moveTo(b1[0], b1[1]); ctx.lineTo(b2[0], b2[1]); ctx.stroke();
        }
        ctx.shadowBlur = 0;

        ctx.fillStyle = color;
        for (let ix = -2; ix <= 2; ix++) {
            for (let iy = -2; iy <= 2; iy++) {
                const [sx, sy] = toScreen(...apply(m, ix, iy));
                const phase = (ix * 3 + iy * 7);
                const pulse = 0.5 + 0.5 * Math.sin(now * 0.003 + phase);
                ctx.globalAlpha = (0.15 + 0.35 * pulse) * alpha;
                ctx.beginPath();
                ctx.arc(sx, sy, 1.6 + pulse * 1.6, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.globalAlpha = 0.95 * alpha;
        ctx.lineWidth = 2.6;
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
        drawArrow(toScreen(0, 0), toScreen(...apply(m, 1, 0)), color);
        drawArrow(toScreen(0, 0), toScreen(...apply(m, 0, 1)), color);
        ctx.shadowBlur = 0;

        ctx.restore();
    }

    function drawArrow(from, to, color) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(from[0], from[1]);
        ctx.lineTo(to[0], to[1]);
        ctx.stroke();

        const angle = Math.atan2(to[1] - from[1], to[0] - from[0]);
        const headLen = 9;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(to[0], to[1]);
        ctx.lineTo(to[0] - headLen * Math.cos(angle - Math.PI / 7), to[1] - headLen * Math.sin(angle - Math.PI / 7));
        ctx.lineTo(to[0] - headLen * Math.cos(angle + Math.PI / 7), to[1] - headLen * Math.sin(angle + Math.PI / 7));
        ctx.closePath();
        ctx.fill();
    }

    // ---------- Shared ----------
    function drawTracer(x, y, color, alpha) {
        ctx.globalAlpha = 0.9 * alpha;
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.globalAlpha = 0.25 * alpha;
        ctx.beginPath();
        ctx.arc(x, y, 11, 0, Math.PI * 2);
        ctx.fill();
    }
}
