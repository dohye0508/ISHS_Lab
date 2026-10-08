// Run: node scripts/check_polar.cjs <python-with-sympy-and-antlr4>
// No web server, database, or network calls are made by this check.
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const context = vm.createContext({ window: {} });
vm.runInContext(read('data/math/adv_collections_final.js'), context);
assert(!context.window.generatedCollections.some(c => c.id.startsWith('adv_col2_')));
const original = JSON.stringify(context.window.generatedCollections);
vm.runInContext(read('data/math/polar_collections.js'), context);
const all = context.window.generatedCollections;
const polar = all.filter(c => c.id.startsWith('adv_col2_v2_'));
assert.equal(JSON.stringify(all.filter(c => !c.id.startsWith('adv_col2_'))), original);
assert.equal(polar.length, 4);
assert(polar.every(c => c.problems.length === 5));
const problems = polar.flatMap(c => c.problems);
assert.equal(new Set(problems.map(p => p.template)).size, 20);
assert.equal(new Set(problems.map(p => p.latex)).size, 20);
assert(problems.every(p => p.level >= 4 && p.explanation && p.title));

const page = read('adv_math.php');
assert(page.indexOf('data/math/polar_collections.js') > page.indexOf('data/math/adv_collections_final.js'));
assert(page.indexOf('data/math/polar_collections.js') < page.indexOf('scripts/logic.js'));
const renderer = page.slice(page.indexOf('        function escapeHtmlText'), page.indexOf('        // Override logic.js\'s renderMath'));
vm.runInContext(renderer, context);
for (const p of problems) {
    for (const latex of [p.latex, p.explanation]) {
        assert(!latex.includes('$'), p.id + ': unmatched authoring delimiter');
        let depth = 0;
        for (const c of latex) { if (c === '{') depth++; if (c === '}') depth--; assert(depth >= 0); }
        assert.equal(depth, 0, p.id + ': unbalanced LaTeX braces');
        const html = context.buildProblemHtml(latex);
        assert(html.includes('problem-statement-text'));
        assert(!/\\text\{[^}]*[가-힣]/.test(html), p.id + ': prose was not unwrapped');
    }
}

// Exercise shared startGame + the actual results renderer with lightweight DOM stubs.
const elements = new Map();
const element = id => {
    if (!elements.has(id)) elements.set(id, { value: '', style: {}, innerHTML: '', innerText: '',
        classList: { toggle() {} }, addEventListener() {}, querySelectorAll() { return []; } });
    return elements.get(id);
};
context.document = { getElementById: element, addEventListener() {}, querySelectorAll() { return []; } };
context.localStorage = { getItem() { return null; } };
context.setTimeout = () => 0;
context.alert = message => { throw Error(message); };
vm.runInContext(read('scripts/logic.js'), context);
vm.runInContext('function normalizeLatex(l) { return l; }', context);
element('sel-collection-value').value = polar[0].id;
vm.runInContext('startGame()', context);
assert.equal(vm.runInContext('state.totalCount', context), 5);
assert.equal(vm.runInContext('state.problems[0].explanation', context), problems[0].explanation);
vm.runInContext(page.slice(page.indexOf('        function renderResult(res)'), page.indexOf('        function readHistory')), context);
context.testDetails = problems.slice(0, 5).map((p, i) => ({ id: i + 1, isCorrect: i % 2 === 0 }));
vm.runInContext('renderResult({details: testDetails, comment: "test"})', context);
assert.equal((element('detail-list').innerHTML.match(/<details /g) || []).length, 5);
assert(element('detail-list').innerHTML.includes('삼각식의 약분'));

// Get the same Python source that the browser's JS template literal sends to Pyodide.
vm.runInContext(read('scripts/grader.js'), context);
const pythonGrader = vm.runInContext('pythonGraderCode', context);
const result = spawnSync(process.argv[2] || 'python', [path.join(__dirname, 'check_polar.py')], {
    cwd: root, input: JSON.stringify({ problems, pythonGrader }), encoding: 'utf8', maxBuffer: 4 * 1024 * 1024
});
process.stdout.write(result.stdout || '');
process.stderr.write(result.stderr || '');
if (result.error) throw result.error;
assert.equal(result.status, 0, 'Independent mathematics / production grader checks failed');
console.log('PASS: 4 collections / 20 distinct problems; loading, rendering, explanations, and grading integration.');
