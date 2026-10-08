// node scripts/check_lesson_calculus.cjs [python]
const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const path = require('node:path'), { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const context = vm.createContext({ window: {} });
vm.runInContext(read('data/math/adv_collections_final.js'), context);
const before = JSON.stringify(context.window.generatedCollections);
vm.runInContext(read('data/math/lesson_calculus_collections.js'), context);
const original = JSON.parse(before);
assert.equal(context.window.generatedCollections.length, original.length);
const problems = context.window.generatedCollections.flatMap(c => c.problems).filter(p => p.id?.startsWith('lesson_'));
assert.equal(new Set(problems.map(p => p.id)).size, 25);
const originalIds = new Set(original.flatMap(c => c.problems.map(p => p.id)).filter(Boolean));
assert(problems.every(p => !originalIds.has(p.id)));
assert(context.window.generatedCollections.every(c => c.problems.length >= 5 && c.problems.length <= 10));
const page = read('adv_math.php');
assert(page.includes('data/math/lesson_calculus_collections.js?v=20260921_v1'));
vm.runInContext(page.slice(page.indexOf('        function escapeHtmlText'), page.indexOf('        // Override logic.js\'s renderMath')), context);
for (const p of problems) {
    assert(p.level >= 1 && p.level <= 5 && p.title && p.solution && p.explanation);
    for (const value of [p.latex, p.explanation]) {
        assert(!value.includes('$'));
        let depth = 0;
        for (const c of value) { if (c === '{') depth++; if (c === '}') depth--; assert(depth >= 0); }
        assert.equal(depth, 0, p.id);
        const html = context.buildProblemHtml(value);
        assert(html.includes('problem-statement-text'));
        assert(!/\\text\{[^}]*[가-힣]/.test(html), p.id);
    }
}
const elements = new Map();
const element = id => {
    if (!elements.has(id)) elements.set(id, {value: '', checked: true, style: {}, innerHTML: '', innerText: '',
        classList: {toggle() {}, remove() {}}, addEventListener() {}, querySelectorAll() {return [];}});
    return elements.get(id);
};
context.document = {getElementById: element, addEventListener() {}, querySelectorAll() {return [];}};
context.localStorage = {getItem() {return null;}};
context.setTimeout = () => 0;
context.alert = message => {throw Error(message);};
vm.runInContext(read('scripts/logic.js'), context);
vm.runInContext('function normalizeLatex(l) {return l;}', context);
element('sel-collection-value').value = 'adv_col1a_1';
vm.runInContext('startGame()', context);
assert(vm.runInContext('state.problems.length === 8 && state.problems.filter(p => p.id > 5).every(p => p.answerMode === "exact" && p.explanation)', context));
assert(read('scripts/logic.js').includes("p.answerMode === 'exact'"));
vm.runInContext(read('scripts/grader.js'), context);
if (process.argv.includes('--payload')) {
    process.stdout.write(JSON.stringify({problems, pythonGrader: vm.runInContext('pythonGraderCode', context)}));
    process.exit(0);
}
const result = spawnSync(process.argv[2] || 'python', [path.join(__dirname, 'check_lesson_calculus.py')], {
    cwd: root, input: JSON.stringify({problems, pythonGrader: vm.runInContext('pythonGraderCode', context)}),
    encoding: 'utf8', maxBuffer: 4 * 1024 * 1024
});
process.stdout.write(result.stdout || ''); process.stderr.write(result.stderr || '');
if (result.error) throw result.error;
assert.equal(result.status, 0);
console.log('PASS: 25 lesson problems distributed across standard collections, with routing and prose/math rendering.');
