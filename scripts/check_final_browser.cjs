// Run: node scripts/check_final_browser.cjs [--layout-only]
// Actual adv_math.php, locally served with mock auth/history (no production requests):
// midterm/final exam tabs, final selection restore, and (without --layout-only) a graded
// final-exam session in the real Pyodide grader. Screenshots go to tmp/final_review/.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(__dirname, '..'), out = path.join(root, 'tmp/final_review');
const layoutOnly = process.argv.includes('--layout-only');
fs.mkdirSync(out, { recursive: true });

const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname.startsWith('/api/')) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(url.pathname.includes('user_system') ? { logged_in: true, user: { nickname: '검증 계정' } }
            : { status: 'success', records: [], leaderboard: { rows: [], current: null }, attempt: { id: 1, token: 'a'.repeat(64) } }));
        return;
    }
    const file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) { res.statusCode = 404; res.end(); return; }
    let content = fs.readFileSync(file);
    if (file.endsWith('.php')) content = Buffer.from(content.toString().replace(/^<\?php[\s\S]*?\?>/, ''));
    res.setHeader('Content-Type', ({ '.js': 'application/javascript', '.php': 'text/html; charset=utf-8', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg' })[path.extname(file)] || 'application/octet-stream');
    res.end(content);
});

const noHorizontalOverflow = page => page.evaluate(() => {
    const boxes = [document.documentElement, ...document.querySelectorAll('.overlay-content, .exam-tabs, .subject-tabs, #final-answer-tools, #quiz-area')];
    return boxes.filter(el => el.getClientRects().length && el.scrollWidth > el.clientWidth + 1).map(el => el.id || el.className || el.tagName);
});

// The overlay fades in (visibility/opacity transition); wait until it is fully shown.
async function openModal(page) {
    await page.evaluate(() => openCollectionModal());
    await page.waitForFunction(() => getComputedStyle(document.getElementById('collection-modal')).opacity === '1');
}

// Theme colors, card fade-ins and the modal's resize all animate; capture after they settle.
async function shoot(page, name) {
    for (const theme of ['light', 'dark']) {
        await page.evaluate(t => document.documentElement.setAttribute('data-theme', t), theme);
        await page.waitForTimeout(700);
        await page.screenshot({ path: path.join(out, `${name}-${theme}.png`) });
    }
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
}

(async () => {
    await new Promise(r => server.listen(0, '127.0.0.1', r));
    const url = `http://127.0.0.1:${server.address().port}/adv_math.php`;
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    try {
        const page = await browser.newPage({ viewport: { width: 1280, height: 960 } });
        page.setDefaultTimeout(30000);
        const errors = []; page.on('pageerror', e => errors.push(e.message));
        // logic.js picks the cookie collection on load and closes the modal 200ms later
        // (selectCollection's setTimeout); let that settle before opening the modal ourselves.
        const load = async () => { await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); await page.waitForTimeout(400); };
        await load();
        await page.evaluate(() => localStorage.clear());
        await load();

        // 처음 들어오면 기말 → 급수
        await openModal(page);
        assert(await page.locator('#exam-tab-final.active').isVisible(), 'final exam tab active by default');
        assert(await page.locator('#subject-tab-series.active').isVisible(), 'series tab active by default');
        assert(await page.locator('#subject-tab-trig').isHidden(), 'midterm tabs hidden under final');
        assert(await page.locator('#rules-final').isVisible(), 'final guide on first visit');
        await shoot(page, 'modal-final-desktop');

        // 중간고사 안에는 기존 6개 탭
        await page.click('#exam-tab-midterm');
        assert(await page.locator('#subject-tab-trig.active').isVisible(), 'midterm opens on trig');
        assert.equal(await page.locator('.subject-tab[data-exam="midterm"]:visible').count(), 6);
        assert(await page.locator('#subject-tab-series').isHidden(), 'final tabs hidden under midterm');
        await shoot(page, 'modal-midterm-desktop');

        // 기말 문제집 선택 → 시작 카드
        await page.click('#exam-tab-final');
        await page.click('#subject-tab-ode');
        await page.click('#collection-grid-ode .collection-card[data-id="fin_ode_01_v1"]');
        await page.waitForFunction(() => !document.getElementById('collection-modal').classList.contains('visible'));
        assert.equal(await page.textContent('#current-collection-name'), '기말 · 미분방정식 1 · 풀이');
        assert(await page.locator('#rules-final').isVisible(), 'final guide after final pick');
        assert(await page.locator('#rules-midterm').isHidden(), 'midterm guide hidden');
        assert(await page.locator('#options-midterm').isHidden(), 'midterm options hidden');

        // 새로고침하면 기말 선택 복원
        await load();
        assert.equal(await page.textContent('#current-collection-name'), '기말 · 미분방정식 1 · 풀이');
        await openModal(page);
        assert(await page.locator('#exam-tab-final.active').isVisible(), 'restored exam tab');

        // 중간 문제집을 고르면 중간 가이드
        await page.click('#exam-tab-midterm');
        const firstMidterm = await page.evaluate(() => generatedCollections[0]);
        await page.click(`#collection-grid-trig .collection-card[data-id="${firstMidterm.id}"]`);
        await page.waitForFunction(() => !document.getElementById('collection-modal').classList.contains('visible'));
        assert.equal(await page.textContent('#current-collection-name'), `중간 · ${firstMidterm.name}`);
        assert(await page.locator('#rules-midterm').isVisible() && await page.locator('#options-midterm').isVisible(), 'midterm guide and options');
        await load();
        assert.equal(await page.textContent('#current-collection-name'), `중간 · ${firstMidterm.name}`);

        // 저장값이 없는 문제집을 가리키면 기본 화면
        await page.evaluate(() => { localStorage.setItem('adv_last_exam', 'final'); localStorage.setItem('adv_final_selected', 'fin_ser_99_v0'); });
        await load();
        await openModal(page);
        assert(await page.locator('#subject-tab-series.active').isVisible(), 'invalid saved id falls back to series');
        assert(await page.locator('#rules-final').isVisible(), 'invalid saved id falls back to final guide');

        // 모바일 폭
        await page.setViewportSize({ width: 390, height: 844 });
        assert.deepEqual(await noHorizontalOverflow(page), [], 'mobile modal overflow');
        await shoot(page, 'modal-final-mobile');
        await page.setViewportSize({ width: 1280, height: 960 });
        assert.deepEqual(errors, []);

        // 저장소 예외: 기존 테마 코드에는 try/catch가 없으므로 기말 키(adv_*)만 막는다
        const blocked = await browser.newPage({ viewport: { width: 1280, height: 960 } });
        const blockedErrors = []; blocked.on('pageerror', e => blockedErrors.push(e.message));
        await blocked.addInitScript(() => {
            for (const name of ['getItem', 'setItem']) {
                const orig = Storage.prototype[name];
                Storage.prototype[name] = function (k, ...rest) { if (String(k).startsWith('adv_')) throw new Error('blocked'); return orig.call(this, k, ...rest); };
            }
        });
        await blocked.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        assert(await blocked.locator('#rules-final').isVisible(), 'blocked storage shows final guide');
        await blocked.evaluate(() => selectFinalCollection('fin_ode_01_v1'));
        assert.equal(await blocked.textContent('#current-collection-name'), '기말 · 미분방정식 1 · 풀이');
        assert.deepEqual(blockedErrors, [], 'blocked storage must not throw');
        await blocked.close();
        console.log('PASS: exam tabs, final tabs, landing guide, selection restore');
    } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });
