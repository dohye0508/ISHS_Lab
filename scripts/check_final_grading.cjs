// Run: node scripts/check_final_grading.cjs
// Final-exam answer rules (verdict / interval / infinity) without a browser or Pyodide.
const fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync(path.join(root, 'scripts/adv_final_grading.js'), 'utf8'), context);
const g = context.window.finalGrading;
assert(g, 'window.finalGrading is not defined');
// Stand-in for the SymPy grader: exact text match after removing whitespace.
const stub = (u, s) => Promise.resolve(u.replace(/\s/g, '') === s.replace(/\s/g, '') ? 'CORRECT' : 'INCORRECT');

(async () => {
    const cases = [
        ['\\text{절대수렴}', 'verdict:절대수렴', 'CORRECT'],
        ['절대 수렴', 'verdict:절대수렴', 'CORRECT'],
        ['\\text{ 조건수렴 }', 'verdict:조건수렴', 'CORRECT'],
        ['\\text{절대수렴}', 'verdict:수렴', 'CORRECT'],
        ['\\text{수렴}', 'verdict:절대수렴', 'INCORRECT'],
        ['\\text{조건수렴}', 'verdict:수렴', 'INCORRECT'],
        ['절대수렴함', 'verdict:절대수렴', 'INCORRECT'],
        ['포기 ', 'verdict:발산', 'INCORRECT'],
        ['', 'verdict:발산', 'EMPTY INPUT'],
        ['[-1,1)', 'interval:[-1,1)', 'CORRECT'],
        ['\\left\\lbrack -1,1\\right)', 'interval:[-1,1)', 'CORRECT'],
        ['\\mleft[-1,1\\mright)', 'interval:[-1,1)', 'CORRECT'],
        ['(-1,1)', 'interval:[-1,1)', 'INCORRECT'],
        ['[-1,1]', 'interval:[-1,1)', 'INCORRECT'],
        ['(-\\infty,\\infty)', 'interval:(-\\infty,\\infty)', 'CORRECT'],
        ['(-\\infty,2)', 'interval:(-\\infty,\\infty)', 'INCORRECT'],
        ['-1\\le x<1', 'interval:[-1,1)', 'INCORRECT'],
        ['\\infty', '\\infty', 'CORRECT'],
        ['+\\infty', '\\infty', 'CORRECT'],
        ['∞', '\\infty', 'CORRECT'],
        ['-\\infty', '\\infty', 'INCORRECT'],
        ['포기', '\\infty', 'INCORRECT'],
        ['\\frac{1}{6}', '\\frac{1}{6}', 'CORRECT'],
    ];
    for (const [u, s, want] of cases) assert.equal(await g.gradeFinal(u, s, stub), want, `${u} vs ${s}`);

    let calls = 0;
    await g.gradeFinal('포기', 'verdict:발산', () => { calls++; return Promise.resolve('CORRECT'); });
    assert.equal(calls, 0, 'verdict answers must never reach the SymPy grader');

    assert.equal(g.answerKind('verdict:발산'), 'verdict');
    assert.equal(g.answerKind('interval:[-1,1)'), 'interval');
    assert.equal(g.answerKind('\\infty'), 'infinity');
    assert.equal(g.answerKind('\\frac{1}{6}'), 'plain');
    assert.deepEqual({ ...g.parseInterval('\\left(-\\infty, 3\\right]') }, { left: '(', a: '-\\infty', b: '3', right: ']' });
    assert.equal(g.parseInterval('\\lbrace 0\\rbrace'), null);
    assert.equal(g.displaySolution('verdict:조건수렴'), '\\text{조건수렴}');
    assert.equal(g.displaySolution('interval:[-1,1)'), '[-1,1)');
    assert.equal(g.displaySolution('\\frac{1}{6}'), '\\frac{1}{6}');
    console.log('PASS: final grading rules');
})().catch(error => { console.error(error); process.exit(1); });
