// Run: node scripts/check_final.cjs [--structure-only] [--complete] [--payload] [python]
// Final-exam collections (data/math/final/*.js): structure, rendering, then independent
// SymPy verification of every answer in check_final.py. No server, database, or network.
const fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
const assert = require('node:assert/strict'), { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const args = process.argv.slice(2);
const flag = name => args.includes(name);

const context = vm.createContext({ window: {} });
vm.runInContext(read('scripts/adv_final_grading.js'), context);
// FINAL_FILES=ode,series,algebra_11 처럼 주면 그 데이터 파일만 읽는다(단원별로 따로 작업할 때).
const onlyFiles = process.env.FINAL_FILES ? process.env.FINAL_FILES.split(',') : null;
for (const name of ['ode', 'series', 'algebra_11', 'algebra_12']) {
    if (onlyFiles && !onlyFiles.includes(name)) continue;
    const file = `data/math/final/${name}.js`;
    if (fs.existsSync(path.join(root, file))) vm.runInContext(read(file), context);
}
const collections = context.window.finalCollections || [];
assert(collections.length > 0, 'no final collections');
const grading = context.window.finalGrading;

const page = read('adv_math.php');
vm.runInContext(page.slice(page.indexOf('        function escapeHtmlText'), page.indexOf('        // Override logic.js\'s renderMath')), context);

const UNITS = {
    series: { prefix: 'fin_ser_', pages: [98, 155] },
    ode: { prefix: 'fin_ode_', pages: [156, 191] },
    // 고급대수는 교과서 쪽수 대신 참고자료 PDF의 단원과 쪽을 source로 적는다 (예: '참고자료 11장 p.5').
    algebra: { prefix: 'fin_alg_', source: /^참고자료 1[12]장 p\.\d+$/ },
};
// 사용자 요청으로 난이도를 올렸다: 모든 세트가 Level 3·4·4·5·5.
const SET_LEVELS = [3, 4, 4, 5, 5];
const TOOLS = new Set(['verdict', 'interval', 'value', 'expr', 'matrix']);
const VERDICTS = new Set(['절대수렴', '조건수렴', '수렴', '발산']);
const ids = new Set();

function checkText(id, field, value) {
    assert(typeof value === 'string' && value.length > 0, `${id}: empty ${field}`);
    assert(!value.includes('$'), `${id}: ${field} still contains $`);
    let depth = 0;
    for (const c of value) { if (c === '{') depth++; if (c === '}') depth--; assert(depth >= 0, `${id}: ${field} braces`); }
    assert.equal(depth, 0, `${id}: ${field} braces`);
    assert(/\\text\{[^}]*[가-힣]/.test(value), `${id}: ${field} has no Korean prose`);
    const html = context.buildProblemHtml(value);
    assert(html.includes('problem-statement-text'), `${id}: ${field} not rendered as prose`);
    assert(!/\\text\{[^}]*[가-힣]/.test(html), `${id}: ${field} leaves Korean inside math`);
}

for (const col of collections) {
    const unit = UNITS[col.unit];
    assert(unit, `${col.id}: unknown unit ${col.unit}`);
    assert(/^fin_(ser|ode|alg)_\d{2}_v\d+$/.test(col.id) && col.id.startsWith(unit.prefix), `${col.id}: bad collection id`);
    assert(!ids.has(col.id), `${col.id}: duplicate id`); ids.add(col.id);
    assert(col.name && col.description, `${col.id}: name/description`);
    assert.equal(col.problems.length, SET_LEVELS.length, `${col.id}: problem count`);
    const levels = Array.from(col.problems, p => p.level).sort((a, b) => a - b); // this realm's Array for deepEqual
    assert.deepEqual(levels, SET_LEVELS, `${col.id}: levels`);
    for (const p of col.problems) {
        assert(p.id.startsWith(col.id + '_') && /^[a-z0-9_]+$/.test(p.id.slice(col.id.length + 1)), `${p.id}: bad problem id`);
        assert(!ids.has(p.id), `${p.id}: duplicate id`); ids.add(p.id);
        assert.equal(p.template, p.id, `${p.id}: template`);
        assert.equal(p.answerMode, 'exact', `${p.id}: answerMode`);
        assert(p.title, `${p.id}: title`);
        assert(TOOLS.has(p.tools), `${p.id}: tools ${p.tools}`);
        if (unit.source) assert(unit.source.test(p.source || '') && p.page === undefined, `${p.id}: source ${p.source}`);
        else assert(Number.isInteger(p.page) && p.page >= unit.pages[0] && p.page <= unit.pages[1], `${p.id}: page ${p.page}`);
        const kind = grading.answerKind(p.solution);
        if (kind === 'verdict') {
            const v = p.solution.slice('verdict:'.length);
            assert(VERDICTS.has(v), `${p.id}: verdict ${v}`);
            assert(v === '발산' ? ['verdict', 'value'].includes(p.tools) : p.tools === 'verdict', `${p.id}: tools for ${v}`);
        } else {
            assert.notEqual(p.tools, 'verdict', `${p.id}: verdict tools without verdict answer`);
        }
        assert.equal(kind === 'interval', p.tools === 'interval', `${p.id}: interval answer <-> interval tools`);
        if (kind === 'interval') assert(grading.parseInterval(p.solution.slice('interval:'.length)), `${p.id}: unparsable interval`);
        if (p.tools === 'expr') assert(/x/.test(p.solution), `${p.id}: expr answer without x`);
        assert.equal(p.tools === 'matrix', /\\begin\{[bp]matrix\}/.test(p.solution), `${p.id}: matrix answer <-> matrix tools`);
        checkText(p.id, 'latex', p.latex);
        checkText(p.id, 'explanation', p.explanation);
    }
}
// 문항 제목은 결과 화면의 해설 요약에 나오고, 예전 카드형 목록에서는 첫 문항 제목이 미리 보였다.
// 판정 문제의 첫 문항 제목이 판정 결과나 쓸 판정법을 드러내지 않도록 계속 막아 둔다.
const SPOILERS = ['수렴', '발산', '절댓값', '판정', '조화급수', '누르기'];
for (const col of collections) {
    const first = col.problems[0];
    if (grading.answerKind(first.solution) !== 'verdict') continue;
    const hit = SPOILERS.filter(w => first.title.includes(w));
    assert.deepEqual(hit, [], `${first.id}: card preview title gives away the verdict (${first.title})`);
}
const problems = collections.flatMap(c => c.problems.map(p => ({ ...p, collection: c.id, unit: c.unit })));

if (flag('--complete')) {
    const count = unit => collections.filter(c => c.unit === unit).length;
    assert.deepEqual([count('series'), count('ode'), count('algebra')], [14, 2, 7], 'set counts');
}
console.log(`PASS: structure (${collections.length} collections, ${problems.length} problems)`);
if (flag('--structure-only')) process.exit(0);

vm.runInContext(read('scripts/grader.js'), context);
const payload = JSON.stringify({ problems, pythonGrader: vm.runInContext('pythonGraderCode', context) });
if (flag('--payload')) { process.stdout.write(payload); process.exit(0); }
const python = args.find(a => !a.startsWith('--')) || 'python';
const result = spawnSync(python, [path.join(__dirname, 'check_final.py')], {
    cwd: root, input: payload, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
});
process.stdout.write(result.stdout || ''); process.stderr.write(result.stderr || '');
if (result.error) throw result.error;
assert.equal(result.status, 0, 'check_final.py failed');
