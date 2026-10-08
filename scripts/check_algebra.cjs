// Run: node scripts/check_algebra.cjs <python-with-sympy-and-antlr4-4.11>
// Read-only regression: no server, database, or network requests.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const context = vm.createContext({ window: {} });
vm.runInContext(read('data/math/algebra_collections.js'), context);
vm.runInContext(read('data/math/algebra_orthogonal.js'), context);
const collections = context.window.algebraCollections;
const problems = collections.flatMap(c => c.problems);
assert.equal(collections.length, 12);
assert.equal(problems.length, 90);
assert.equal(new Set(problems.map(p => p.id)).size, 90);
assert.equal(new Set(problems.map(p => p.latex)).size, 90);
for (const c of collections) {
    assert.match(c.id, /^(alg_col_v3_|alg_orth_col_v1_)/); // New sets have independent score IDs.
    // 1–9단원 문제집은 10문항, 10단원(정사영) 문제집은 5문항이다.
    assert.deepEqual(Array.from(c.problems, p => p.level).sort(), c.id.startsWith('alg_col_v3_') ?
        [3, 3, 4, 4, 4, 4, 4, 4, 5, 5] : [3, 4, 4, 4, 5]);
}
assert.equal(new Set(problems.flatMap(p => p.references)).size, 10);
const page = read('adv_math.php');
assert(page.includes('algebra_collections.js?v=20261006_v5'));
assert(page.includes('algebra_orthogonal.js?v=20260928_v1'));
assert(page.includes('insertMatrixTemplate(4,1)'));
vm.runInContext(page.slice(page.indexOf('        function escapeHtmlText'),
    page.indexOf('        // Override logic.js\'s renderMath')), context);
for (const p of problems) {
    assert.equal(p.answerMode, 'exact');
    assert(p.title && p.explanation && p.references.length, p.id);
    for (const tex of [p.latex, p.solution, p.explanation]) {
        let depth = 0;
        for (const char of tex) {
            if (char === '{') depth++;
            if (char === '}') depth--;
            assert(depth >= 0, p.id + ': braces');
        }
        assert.equal(depth, 0, p.id + ': braces');
        const stack = [];
        for (const match of tex.matchAll(/\\(begin|end)\{([^}]+)\}/g)) {
            if (match[1] === 'begin') stack.push(match[2]);
            else assert.equal(stack.pop(), match[2], p.id + ': environments');
        }
        assert.equal(stack.length, 0);
        assert(!/[\u3040-\u30ff]/.test(tex), p.id + ': non-Korean prose');
    }
    for (const tex of [p.latex, p.explanation]) {
        const html = context.buildProblemHtml(tex);
        assert(html.includes('problem-statement-text'), p.id);
        assert(!/\\text\{[^}]*[가-힣]/.test(html), p.id + ': unrendered prose');
    }
}

const elements = new Map();
const element = id => {
    if (!elements.has(id)) elements.set(id, { value: '', style: {}, innerHTML: '', innerText: '',
        classList: { remove() {}, toggle() {} }, addEventListener() {} });
    return elements.get(id);
};
context.document = { getElementById: element, addEventListener() {}, querySelectorAll() { return []; } };
context.localStorage = { getItem() { return null; } };
context.setTimeout = () => 0;
context.alert = message => { throw Error(message); };
context.window.studyScores = { async startAttempt(input) { return { ...input, token: 'test' }; } };
vm.runInContext(read('scripts/logic.js'), context);
vm.runInContext(page.slice(page.indexOf('        function normalizeLatex'),
    page.indexOf('        // 문장형')), context);
vm.runInContext(page.slice(page.indexOf('        async function startAlgebraGame'),
    page.indexOf('        // Single "Get Started"')), context);
vm.runInContext(page.slice(page.indexOf('        function renderResult(res)'),
    page.indexOf('        function readHistory')), context);

(async () => {
    for (const col of collections) {
        element('sel-collection-value-algebra').value = col.id;
        await vm.runInContext('startAlgebraGame()', context);
        const loaded = vm.runInContext('state.problems', context);
        assert.equal(loaded.length, col.problems.length);
        for (let i = 0; i < loaded.length; i++) {
            assert.equal(loaded[i].answerMode, 'exact', 'Exact polynomial grading lost during start');
            assert.equal(loaded[i].latex, col.problems[i].latex);
            assert.equal(loaded[i].explanation, col.problems[i].explanation);
        }
        context.details = loaded.map(p => ({ id: p.id, isCorrect: true }));
        vm.runInContext('renderResult({ details, comment: "test" })', context);
        assert.equal((element('detail-list').innerHTML.match(/<details /g) || []).length, col.problems.length);
    }
    // Exercise the exact Python program shipped to the browser worker.
    vm.runInContext(read('scripts/grader.js'), context);
    const pythonGrader = vm.runInContext('pythonGraderCode', context);
    if (process.argv[2] === '--json') {
        // Shell piping also works in environments that restrict nested child processes.
        process.stdout.write(JSON.stringify({ problems, pythonGrader }));
        return;
    }
    for (const test of ['check_algebra.py', 'check_orthogonal.py']) {
    const result = spawnSync(process.argv[2] || 'python', [path.join(__dirname, test)], {
        cwd: root, input: JSON.stringify({ problems, pythonGrader }), encoding: 'utf8', maxBuffer: 4 * 1024 * 1024
    });
    process.stdout.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    if (result.error) throw result.error;
    assert.equal(result.status, 0, 'Mathematics / grading checks failed');
    }
    console.log('PASS: 12 balanced collections, 90 unique questions, session loading, exact-answer mode, and explanations.');
})().catch(error => { console.error(error); process.exitCode = 1; });
