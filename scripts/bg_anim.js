/**
 * Background Riemann Sum Animation
 * Ported from test.php for integral.php
 */

const ENABLE_BG_ANIMATION = true; // Set to false to disable animation

if (ENABLE_BG_ANIMATION) {
    // --- Configuration ---
    // --- Background Functions Data ---
    // Loaded from bg_funcs.js
    const BG_FUNCS = window.BG_FUNCS || [
        { latex: "e^{-x^2}", func: (x) => Math.exp(-x*x), color: "#8e7f7a", xMin: -3, xMax: 3, yMax: 1.2 }
    ];

    const RECT_COUNT = 150; 
    const ANIM_DURATION = 6000; 
    const FADE_DURATION = 800;  // Time to fade out area (Faster)
    const MORPH_DURATION = 1500; // Faster, dynamic morphing
    const PAUSE_DURATION = 2000;
    const RECT_ALPHA_START = 0;
    const RECT_ALPHA_MAX = 0.5;

    // --- State ---
    let bgCtx = null;
    let bgW, bgH;
    // Start with 0.1(x^3-4x) function (index 0 in the new BG_FUNCS)
    let bgCurrentIndex = 0; 
    let bgNextIndex = 0;
    let bgStartTime = 0;
    let bgAnimId = null;
    let bgState = 'drawing'; // 'drawing' | 'fading' | 'morphing' | 'paused'

    // Easing functions
    const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const easeInOutExpo = t => t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;

    window.addEventListener('load', function() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;
        
        bgCtx = canvas.getContext('2d');
        
        function resizeCanvas() {
            if (window.innerWidth <= 1200) {
                canvas.width = 0;
                canvas.height = 0;
                return;
            }
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            bgW = canvas.width;
            bgH = canvas.height;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        startBgSequence();
    });

    function startBgSequence() {
        // Use fixed initial index if possible, otherwise keep current (random pick removed for fixed start)
        bgNextIndex = bgCurrentIndex;
        bgStartTime = performance.now();
        bgState = 'drawing';
        if(bgAnimId) cancelAnimationFrame(bgAnimId);
        bgLoop();
    }

    function bgLoop() {
        const now = performance.now();
        const elapsed = now - bgStartTime;

        if (bgState === 'drawing') {
            let progress = elapsed / ANIM_DURATION;
            if (progress >= 1) {
                renderBg(1, 0, 1);
                bgState = 'paused';
                bgStartTime = now;
                setTimeout(() => {
                    bgState = 'fading';
                    bgStartTime = performance.now();
                    bgLoop();
                }, PAUSE_DURATION);
                return;
            }
            renderBg(progress, 0, 1);
        }
        else if (bgState === 'fading') {
            let progress = elapsed / FADE_DURATION;
            if (progress >= 1) {
                renderBg(1, 0, 0);
                bgState = 'morphing';
                // Pick a NEW random index (different from current)
                let next;
                do { next = Math.floor(Math.random() * BG_FUNCS.length); } while (next === bgCurrentIndex && BG_FUNCS.length > 1);
                bgNextIndex = next;
                bgStartTime = performance.now();
            } else {
                renderBg(1, 0, 1 - progress); 
            }
        }
        else if (bgState === 'morphing') {
            let progress = elapsed / MORPH_DURATION;
            const easedP = easeInOutExpo(Math.min(1, progress));
            if (progress >= 1) {
                renderBg(0, 1, 0); // Reset draw progress for next func
                bgCurrentIndex = bgNextIndex;
                bgState = 'drawing';
                bgStartTime = performance.now();
            } else {
                renderBg(0, easedP, 0);
            }
        }

        if (bgState !== 'paused') {
            bgAnimId = requestAnimationFrame(bgLoop);
        }
    }

    function hexToRgb(hex) {
        const r = parseInt(hex.substr(1,2), 16);
        const g = parseInt(hex.substr(3,2), 16);
        const b = parseInt(hex.substr(5,2), 16);
        return {r, g, b};
    }

    function renderBg(drawProgress, morphProgress, fadeOpacity) {
        const ctx = bgCtx;
        const cur = BG_FUNCS[bgCurrentIndex];
        const nxt = BG_FUNCS[bgNextIndex];
        
        ctx.clearRect(0, 0, bgW, bgH);
        
        // --- Dynamic Vertical Balancing ---
        // We want y=0 to be exactly at the vertical center of the viewport
        const viewXMin = cur.xMin + (nxt.xMin - cur.xMin) * morphProgress;
        const viewXMax = cur.xMax + (nxt.xMax - cur.xMax) * morphProgress;
        const xRange = viewXMax - viewXMin;

        // Use a symmetric Y-range based on the larger of current or next yMax to prevent jitter
        const currentYMax = cur.yMax + (nxt.yMax - cur.yMax) * morphProgress;
        const viewYMax = currentYMax * 1.3; // 30% headroom
        const viewYMin = -viewYMax;         // Create a symmetric range [-Y, Y] to center y=0

        const toX = (v) => ((v - viewXMin) / xRange) * bgW;
        // Map [-viewYMax, viewYMax] to [0.1bgH, 0.9bgH] (80% of height, centered)
        const toY = (v) => bgH * 0.5 - (v / viewYMax) * (bgH * 0.35);

        // --- 1. Axes (Sharp, Clear, Centered with Ticks) ---
        ctx.strokeStyle = "#888"; 
        ctx.lineWidth = 1.5; // Fixed thickness
        ctx.globalAlpha = 0.6; 
        const py0 = toY(0);
        const px0 = toX(0);
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(0, py0); ctx.lineTo(bgW, py0);
        ctx.stroke();

        // Y-axis
        if (px0 >= 0 && px0 <= bgW) {
            ctx.beginPath(); ctx.moveTo(px0, 0); ctx.lineTo(px0, bgH); ctx.stroke();
        }

        // Draw Ticks (Unit marking)
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;
        
        // X-ticks (every 1 unit)
        for (let x = Math.ceil(viewXMin); x <= Math.floor(viewXMax); x++) {
            if (x === 0) continue;
            const px = toX(x);
            ctx.beginPath();
            ctx.moveTo(px, py0 - 5); ctx.lineTo(px, py0 + 5);
            ctx.stroke();
        }
        
        // Y-ticks (every 1 unit)
        for (let y = Math.ceil(viewYMin); y <= Math.floor(viewYMax); y++) {
            if (y === 0) continue;
            const py = toY(y);
            ctx.beginPath();
            ctx.moveTo(px0 - 5, py); ctx.lineTo(px0 + 5, py);
            ctx.stroke();
        }

        // Color Morph
        const c1 = hexToRgb(cur.color);
        const c2 = hexToRgb(nxt.color);
        const r = Math.round(c1.r + (c2.r - c1.r) * morphProgress);
        const g = Math.round(c1.g + (c2.g - c1.g) * morphProgress);
        const b = Math.round(c1.b + (c2.b - c1.b) * morphProgress);
        const colorStr = `rgb(${r}, ${g}, ${b})`;

        const alphaCap = RECT_ALPHA_MAX * fadeOpacity;

        // --- 2. Area Fill (Continuous Solid Fill) ---
        if (alphaCap > 0.005) {
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alphaCap * 0.6})`; 
            ctx.globalAlpha = 1.0;
            const currentMaxX = viewXMin + xRange * drawProgress;
            ctx.beginPath();
            ctx.moveTo(toX(viewXMin), py0);
            const areaStep = xRange / 150;
            for (let x = viewXMin; x <= currentMaxX; x += areaStep) {
                const yVal = cur.func(x) + (nxt.func(x) - cur.func(x)) * morphProgress;
                ctx.lineTo(toX(x), toY(yVal));
            }
            ctx.lineTo(toX(currentMaxX), py0);
            ctx.closePath();
            ctx.fill();
        }

        // --- 3. Draw Curve (Always Visible) ---
        ctx.beginPath();
        const step = xRange / 150;
        let first = true;
        for(let x=viewXMin; x<=viewXMax; x+=step) {
            const y = cur.func(x) + (nxt.func(x) - cur.func(x)) * morphProgress;
            if (first) { ctx.moveTo(toX(x), toY(y)); first=false; }
            else ctx.lineTo(toX(x), toY(y));
        }
        ctx.strokeStyle = colorStr;
        ctx.lineWidth = 4;
        ctx.globalAlpha = 0.85; 
        ctx.stroke();
        
        ctx.globalAlpha = 1.0;
    }
}
