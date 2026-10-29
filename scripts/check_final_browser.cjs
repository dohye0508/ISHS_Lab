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
        // 증명 해설 옵션은 증명 탭에서 쓰므로 기말이 기본일 때도 보여야 하고, 적분상수 옵션만 숨긴다
        assert(await page.locator('#chk-proof-keep-open').isVisible(), 'proof option visible on final');
        assert(await page.locator('#chk-strict-c').isHidden(), 'constant-of-integration option hidden on final');

        // 문제집은 카드 격자가 아니라 단원별로 묶인 한 줄 목록이다 (번호 · 짧은 제목 · 설명 · 문항 수 · 점수)
        const listOf = id => page.evaluate(gridId => {
            const grid = document.getElementById(gridId);
            return {
                groups: [...grid.querySelectorAll('.collection-group-title')].map(h => h.textContent.trim()),
                rows: grid.querySelectorAll('.collection-row').length,
                firstTitle: grid.querySelector('.collection-row .collection-row-title')?.textContent.trim(),
                firstNo: grid.querySelector('.collection-row .collection-row-no')?.textContent.trim(),
                lastNo: [...grid.querySelectorAll('.collection-row .collection-row-no')].pop()?.textContent.trim(),
            };
        }, id);
        const series = await listOf('collection-grid-series');
        assert.equal(series.groups.length, 3, 'series grouped into 3 units');
        assert(series.groups[0].startsWith('수렴 판정'), series.groups[0]);
        assert.deepEqual([series.rows, series.firstNo, series.lastNo, series.firstTitle], [14, '01', '14', '수열의 극한']);
        const ode = await listOf('collection-grid-ode');
        assert.deepEqual([ode.groups.length, ode.rows], [0, 2], 'single-group tab has no group header');
        const falg = await listOf('collection-grid-falgebra');
        assert.deepEqual([falg.groups.length, falg.rows], [2, 7], '고급대수: 11장 3세트 + 12장 4세트');
        assert(falg.groups[0].startsWith('11장'), falg.groups[0]);
        assert(await page.locator('#subject-tab-falgebra').isVisible(), '고급대수 tab under 기말');
        // (logic.js still fills its hidden #collection-grid with old cards; only visible previews matter)
        assert.equal(await page.locator('#collection-modal .problem-preview:visible').count(), 0, 'no math previews in the picker');
        assert.equal(await page.textContent('#collection-grid-series .collection-row .collection-row-page'), 'p.101–105', 'textbook pages shown as row meta');
        await shoot(page, 'modal-final-desktop');

        // 중간고사 안에는 기존 6개 탭
        await page.click('#exam-tab-midterm');
        assert(await page.locator('#subject-tab-trig.active').isVisible(), 'midterm opens on trig');
        assert.equal(await page.locator('.subject-tab[data-exam="midterm"]:visible').count(), 6);
        assert(await page.locator('#subject-tab-series').isHidden(), 'final tabs hidden under midterm');
        const trig = await listOf('collection-grid-trig');
        assert.deepEqual([trig.groups, trig.rows], [['기본', '심화'], 10]);
        assert.equal(trig.groups.length && (await listOf('collection-grid-algebra')).groups.length, 2, 'algebra grouped in two');
        assert.equal((await listOf('collection-grid-proof')).rows, 10, 'proof chapters as rows');
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
        if (layoutOnly) return;

        await page.waitForFunction(() => isGraderReady, {}, { timeout: 150000 });
        // 모든 기말 문항: 정답 입력은 정답, 대표 오답은 오답 (실제 Pyodide 채점)
        const bad = await page.evaluate(async () => {
            state.exam = 'final';
            const out = [];
            for (const c of finalCollections) for (const p of c.problems) {
                const kind = finalGrading.answerKind(p.solution);
                const right = kind === 'verdict' ? '\\text{' + p.solution.slice(8) + '}' : kind === 'interval' ? p.solution.slice(9) : p.solution;
                const wrong = kind === 'verdict' ? '포기 ' : kind === 'interval' ? right.replace(/^[[(]/, m => m === '[' ? '(' : '[')
                    : /\\begin\{[bp]matrix\}/.test(p.solution) ? p.solution.replace(/\\begin\{([bp])matrix\}/, '\\begin{$1matrix}9&') // 첫 행 열 수가 달라짐
                    : '(' + p.solution + ')+1';
                if (await gradeProblem(right, p.solution, false, 30000, true) !== 'CORRECT') out.push(p.id + ' right');
                if (await gradeProblem(wrong, p.solution, false, 30000, true) === 'CORRECT') out.push(p.id + ' wrong');
            }
            state.exam = undefined;
            return out;
        });
        assert.deepEqual(bad, []);

        // 모든 기말 문항의 문제·해설이 MathJax에서 오류 없이 렌더링되는지
        const renderErrors = await page.evaluate(async () => {
            const box = document.createElement('div');
            box.style.cssText = 'position:absolute;left:-10000px;width:900px';
            document.body.appendChild(box);
            const out = [];
            for (const c of finalCollections) for (const p of c.problems) {
                box.innerHTML = buildProblemHtml(p.latex) + buildProblemHtml(p.explanation);
                await MathJax.typesetPromise([box]);
                if (box.querySelector('mjx-merror,[data-mjx-error]')) out.push(p.id);
            }
            box.remove();
            return out;
        });
        assert.deepEqual(renderErrors, [], 'MathJax errors in final problems');

        // 실제 흐름: fin_ode_01_v1 시작
        await page.evaluate(() => selectFinalCollection('fin_ode_01_v1'));
        await page.waitForTimeout(300);
        await page.evaluate(() => startSelectedGame());
        await page.waitForFunction(() => state.exam === 'final' && state.problems.length === 5 && document.getElementById('app-view').style.display === 'block');
        assert.equal(await page.textContent('#slogan-text'), 'Solve the flow');

        // 도구 버튼을 누른 뒤 Enter: 포커스가 입력칸에 남아 답이 한 번만 들어가고 다음 문제로 넘어가야 한다
        await page.evaluate(() => { const f = document.getElementById('math-input'); f.value = ''; renderFinalTools('value'); f.focus(); });
        await page.click('#final-answer-tools [data-insert="infty"]');
        await page.keyboard.press('Enter');
        await page.waitForFunction(() => state.currentIndex === 1, {}, { timeout: 5000 });
        assert.equal(await page.evaluate(() => state.problems[0].userAnswer), '\\infty', 'tool click then Enter');
        await page.evaluate(() => { prevProblem(); renderFinalTools('verdict'); });
        await page.click('#final-answer-tools [data-verdict="발산"]');
        await page.keyboard.press('Enter');
        await page.waitForFunction(() => state.currentIndex === 1, {}, { timeout: 5000 });
        assert.equal(await page.evaluate(() => state.problems[0].userAnswer), '\\text{발산}', 'verdict click then Enter');
        await page.evaluate(() => { prevProblem(); state.problems[0].userAnswer = ''; loadCurrentProblem(); });

        // 구간 템플릿을 실제로 눌러 입력한 값이 정답 처리되는지 (MathLive 표기 정규화)
        await page.evaluate(() => renderFinalTools('interval'));
        await page.click('#final-answer-tools [data-template="[a,b)"]');
        await page.keyboard.type('-1');
        await page.keyboard.press('Tab');
        await page.keyboard.type('1');
        const typed = await page.evaluate(() => document.getElementById('math-input').value);
        assert.equal(await page.evaluate(v => gradeProblem(v, 'interval:[-1,1)', false, 30000, true), typed), 'CORRECT', `template value ${typed}`);
        await page.evaluate(() => renderFinalTools('verdict'));
        await page.click('#final-answer-tools [data-verdict="조건수렴"]');
        assert.equal(await page.evaluate(() => document.getElementById('math-input').value), '\\text{조건수렴}');
        // 고급대수 행렬 답: 행렬 버튼 6개, 누르면 입력칸에 빈 행렬 틀이 들어간다
        await page.evaluate(() => { document.getElementById('math-input').value = ''; renderFinalTools('matrix'); document.getElementById('math-input').focus(); });
        assert.equal(await page.locator('#final-answer-tools [data-matrix]').count(), 6);
        await page.click('#final-answer-tools [data-matrix="2x2"]');
        assert(/matrix/.test(await page.evaluate(() => document.getElementById('math-input').value)), 'matrix template inserted');
        await page.evaluate(() => { document.getElementById('math-input').value = ''; saveAnswer(); loadCurrentProblem(); });

        // #math-input itself is 6px wider than a 390px viewport on midterm problems too (pre-existing),
        // so check what the final exam adds: the widest tools row and the problem statement.
        await page.setViewportSize({ width: 390, height: 844 });
        await page.evaluate(() => renderFinalTools('interval'));
        const wide = await page.evaluate(() => [...document.querySelectorAll('#final-answer-tools button, #problem-area')]
            .filter(el => el.getBoundingClientRect().right > innerWidth + 1).map(el => el.id || el.textContent));
        assert.deepEqual(wide, [], 'mobile final tools/problem overflow');
        await shoot(page, 'quiz-final-mobile');
        await page.evaluate(() => loadCurrentProblem());
        await page.setViewportSize({ width: 1280, height: 960 });

        for (let i = 0; i < 5; i++) {
            const p = await page.evaluate(() => state.problems[state.currentIndex]);
            assert(await page.locator('#btn-giveup').isHidden(), `giveup hidden on Q${i + 1}`);
            assert.equal(await page.locator('#final-answer-tools').isVisible(), p.tools !== 'expr', `tools row on Q${i + 1}`);
            if (p.tools === 'verdict') await page.click(`#final-answer-tools [data-verdict="${p.solution.slice(8)}"]`);
            else await page.evaluate(sol => { document.getElementById('math-input').value = sol.startsWith('interval:') ? sol.slice(9) : sol; saveAnswer(); }, p.solution);
            if (i < 4) await page.evaluate(() => nextProblem());
        }
        await page.evaluate(() => finishTest());
        await page.waitForFunction(() => document.getElementById('result-view').style.display === 'block', {}, { timeout: 150000 });
        assert.equal(await page.textContent('#score-area'), 'Score: 5 / 5');
        const detail = await page.textContent('#detail-list');
        assert(!detail.includes('verdict:') && !detail.includes('interval:'), 'raw answer prefixes in results');
        assert(detail.includes('교과서 p.'), 'textbook page in results');
        await shoot(page, 'result-final-desktop');

        // 결과 화면에서 홈 → 다른 기말 문제집 시작: 이전 결과가 아니라 새 문제가 보여야 한다
        await page.evaluate(() => { returnToCollections(); selectFinalCollection('fin_ode_02_v1'); });
        await page.waitForTimeout(300);
        await page.evaluate(() => startSelectedGame());
        await page.waitForFunction(() => state.exam === 'final' && document.getElementById('app-view').style.display === 'block'
            && state.problems[0]?.solution === finalCollections.find(c => c.id === 'fin_ode_02_v1').problems[0].solution);
        assert(await page.locator('#quiz-area').isVisible(), 'quiz shown for the next final set');
        assert(await page.locator('#result-view').isHidden(), 'previous result hidden for the next final set');

        // 기말을 푼 뒤 같은 페이지에서 중간 문제집으로 돌아가기
        await page.evaluate(() => { returnToCollections(); selectMidtermCollection(generatedCollections[0].id); });
        await page.waitForTimeout(300);
        await page.evaluate(() => startSelectedGame());
        await page.waitForFunction(() => state.exam === 'midterm' && document.getElementById('app-view').style.display === 'block' && state.problems[0]?.solution === generatedCollections[0].problems[0].solution);
        assert.equal(await page.evaluate(() => gradeProblem('포기', '발산', false, 30000, false)), 'CORRECT', 'midterm give-up grading unchanged');
        assert(await page.evaluate(() => document.getElementById('final-answer-tools').classList.contains('hidden')), 'final tools hidden in midterm');
        const giveupShown = await page.evaluate(() => {
            state.currentIndex = state.problems.findIndex(p => p.level >= 3);
            updateHeader(); loadCurrentProblem();
            return !document.getElementById('btn-giveup').classList.contains('hidden');
        });
        assert(giveupShown, 'midterm give-up button back on level 3+');
        assert.deepEqual(errors, []);
        console.log('PASS: final session grading, tools, results, and midterm return');
    } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });
