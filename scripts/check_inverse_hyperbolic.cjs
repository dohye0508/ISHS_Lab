// Run: node scripts/check_inverse_hyperbolic.cjs [python]
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const context = vm.createContext({ window: {} });
vm.runInContext(read('data/math/adv_collections_final.js'), context);
const original = JSON.stringify(context.window.generatedCollections);
vm.runInContext(read('data/math/inverse_hyperbolic_collections.js'), context);
const all = context.window.generatedCollections;
const inverse = all.filter(c => c.id.startsWith('adv_col1a'));
const hyperbolic = all.filter(c => c.id.startsWith('adv_col1b'));
const added = all.filter(c => /^adv_col1[ab]_v2_/.test(c.id));
const problems = added.flatMap(c => c.problems);
assert.equal(inverse.length, 10);
assert.equal(hyperbolic.length, 9);
assert(inverse.every(c => c.problems.length === 5));
assert(hyperbolic.every(c => c.problems.length === (c.id === 'adv_col1b_v2_10' ? 4 : 5)));
assert.equal(added.length, 10);
assert.equal(problems.length, 49);
assert.equal(new Set(problems.map(p => p.id)).size, 49);
assert.equal(new Set(problems.map(p => p.latex)).size, 49);
assert(problems.every(p => p.level === 5 && p.title && p.explanation && p.solution));
assert.equal(JSON.stringify(all.slice(0, JSON.parse(original).length)), original);

const page = read('adv_math.php');
assert(page.includes('data/math/inverse_hyperbolic_collections.js?v=20260922_audit'));
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

const elements = new Map();
const element = id => {
    if (!elements.has(id)) elements.set(id, { value: '', style: {}, innerHTML: '', innerText: '',
        classList: { toggle() {}, remove() {} }, addEventListener() {}, querySelectorAll() { return []; } });
    return elements.get(id);
};
context.document = { getElementById: element, addEventListener() {}, querySelectorAll() { return []; } };
context.localStorage = { getItem() { return null; } };
context.setTimeout = () => 0;
context.alert = message => { throw Error(message); };
vm.runInContext(read('scripts/logic.js'), context);
vm.runInContext('function normalizeLatex(l) { return l; }', context);
element('sel-collection-value').value = 'adv_col1a_v2_6';
vm.runInContext('startGame()', context);
assert.equal(vm.runInContext('state.totalCount', context), 5);
assert(vm.runInContext('state.problems.every(p => p.explanation && p.title)', context));
vm.runInContext(page.slice(page.indexOf('        function renderResult(res)'), page.indexOf('        function readHistory')), context);
context.testDetails = vm.runInContext('state.problems.map(p => ({id: p.id, isCorrect: false}))', context);
vm.runInContext('renderResult({details: testDetails, comment: "test"})', context);
assert.equal((element('detail-list').innerHTML.match(/<details /g) || []).length, 5);

vm.runInContext(read('scripts/grader.js'), context);
const pythonGrader = vm.runInContext('pythonGraderCode', context);
if (process.argv.includes('--payload')) {
    process.stdout.write(JSON.stringify({problems, pythonGrader}));
    process.exit(0);
}
if (process.argv.includes('--structure-only')) {
    console.log('PASS: loading, uniqueness, rendering, and 10 inverse + 9 hyperbolic collections.');
    process.exit(0);
}
const result = spawnSync(process.argv[2] || 'python', [path.join(__dirname, 'check_inverse_hyperbolic.py')], {
    cwd: root, input: JSON.stringify({ problems, pythonGrader }), encoding: 'utf8', maxBuffer: 4 * 1024 * 1024
});
process.stdout.write(result.stdout || '');
process.stderr.write(result.stderr || '');
if (result.error) throw result.error;
assert.equal(result.status, 0, 'Mathematics or production grader checks failed');
console.log('PASS: 10 inverse-trigonometric + 9 hyperbolic collections, 94 total problems.');
