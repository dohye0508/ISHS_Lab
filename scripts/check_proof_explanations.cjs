// Run: node scripts/check_proof_explanations.cjs
// Checks every loaded proof and exercises the actual page handlers without login/network.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const elements = new Map();
function element(id) {
    if (!elements.has(id)) {
        const classes = new Set();
        elements.set(id, {
            innerHTML: '', innerText: '', textContent: '', hidden: false, style: {},
            attributes: {},
            setAttribute(key, value) { this.attributes[key] = value; },
            classList: {
                toggle(name, force) { force ? classes.add(name) : classes.delete(name); },
                contains(name) { return classes.has(name); }
            }
        });
    }
    return elements.get(id);
}
const typesetCalls = [];
const keyListeners = [];
const context = vm.createContext({
    window: {}, document: { getElementById: element, createElement() { return {}; }, addEventListener(type, fn) { if (type === 'keydown') keyListeners.push(fn); } },
    MathJax: { typesetClear() {}, typesetPromise(nodes) { typesetCalls.push(nodes); return Promise.resolve(); } },
    openCollectionModal() {}, closeCollectionModal() {}
});
context.window.MathJax = context.MathJax;
for (const name of ['proof_theorems', 'proof_theorems_extended', 'proof_explanations', 'proof_theorems_supplement', 'proof_theorems_advanced', 'proof_change_of_basis', 'proof_levels', 'proof_orthogonal', 'proof_sources']) {
    vm.runInContext(read(`data/math/${name}.js`), context, { filename: name });
}
const chapters = context.window.proofTheorems;
const theorems = chapters.flatMap(ch => ch.theorems);
assert.equal(chapters.length, 10);
assert.equal(theorems.length, 215);
assert.equal(chapters[9].theorems.length, 36);
assert.equal(chapters[8].theorems.length, 21);
assert.equal(theorems.filter(t => t.basisId).length, 21);
assert.equal(theorems.filter(t => t.supplementId).length, 24);
assert.equal(theorems.filter(t => t.advancedId).length, 15);
chapters.slice(0, 5).forEach(chapter => assert.equal(chapter.theorems.filter(t => t.advancedId).length, 3));
assert(!JSON.stringify(theorems).includes('setminus'), 'Set difference uses a minus sign');
const productProof = chapters[4].theorems[0].explanation.join('\n');
for (const required of ['보조정리 1', '보조정리 2', '보조정리 3', '경우 1', '경우 2']) {
    assert(productProof.includes(required), `Product proof is missing ${required}`);
}
for (const sourceNum of [1, 19, 25, 33, 45, 69, 70, 71, 72]) {
    assert(!theorems.some(t => t.sourceNum === sourceNum), `Excluded source ${sourceNum} must not appear`);
}
assert(!/무한|직합|\\oplus|rank|U\s*\+\s*W/.test(JSON.stringify(theorems)), 'Excluded concepts must not appear in propositions or explanations');
chapters.forEach((chapter, c) => chapter.theorems.forEach((theorem, i) => {
    assert.equal(theorem.num, `${c + 1}.${i + 1}`, 'Number must match chapter and position');
}));
assert.equal(new Set(theorems.map(t => t.num)).size, theorems.length);
for (const t of theorems) {
    assert(Number.isInteger(t.level) && t.level >= 1 && t.level <= 5, `${t.num}: missing/invalid level`);
    assert(Array.isArray(t.explanation) && t.explanation.length, `${t.num}: missing explanation`);
    for (const paragraph of t.explanation) {
        assert(paragraph.trim().length > 0, `${t.num}: empty paragraph`);
        assert(!/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(paragraph), `${t.num}: bad string escape`);
        const formulaPattern = /\\\((.*?)\\\)|\\\[(.*?)\\\]/gs;
        const prose = paragraph.replace(formulaPattern, (_, inline, display) => {
            const formula = inline ?? display;
            let depth = 0;
            for (let i = 0; i < formula.length; i++) {
                if (formula[i] === '\\') { i++; continue; }
                if (formula[i] === '{') depth++;
                if (formula[i] === '}') depth--;
                assert(depth >= 0, `${t.num}: unbalanced math braces`);
            }
            assert.equal(depth, 0, `${t.num}: unbalanced math braces`);
            return '';
        });
        assert(!/\\[()[\]]/.test(prose), `${t.num}: unpaired math delimiters`);
    }
}
const page = read('adv_math.php');
for (const match of page.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
    new vm.Script(match[1]);
}
assert(page.indexOf('data/math/proof_explanations.js') > page.indexOf('data/math/proof_theorems_extended.js'));
assert(page.indexOf('data/math/proof_theorems_supplement.js') > page.indexOf('data/math/proof_explanations.js'));
assert(page.indexOf('data/math/proof_theorems_advanced.js') > page.indexOf('data/math/proof_theorems_supplement.js'));
assert(page.indexOf('data/math/proof_change_of_basis.js') > page.indexOf('data/math/proof_theorems_advanced.js'));
assert(page.indexOf('data/math/proof_levels.js') > page.indexOf('data/math/proof_change_of_basis.js'));
assert(page.indexOf('data/math/proof_orthogonal.js') > page.indexOf('data/math/proof_levels.js'));
vm.runInContext(page.slice(page.indexOf('        function escapeHtmlText'), page.indexOf('        function buildProblemHtml')), context);
vm.runInContext(page.slice(page.indexOf('        const proofState ='), page.indexOf("        window.addEventListener('DOMContentLoaded'", page.indexOf('        const proofState ='))), context);
const run = code => vm.runInContext(code, context);
// Keyboard navigation: ←/→ and Enter move between theorems only while the proof view is open.
assert.equal(keyListeners.length, 1);
const press = (key, target = { tagName: 'BODY' }) => keyListeners[0]({ key, target, preventDefault() {} });
run('startProofChapter(0)');
element('proof-view').style.display = 'block';
press('ArrowRight'); assert.equal(run('proofState.index'), 1);
press('Enter'); assert.equal(run('proofState.index'), 2);
press('ArrowLeft'); assert.equal(run('proofState.index'), 1);
press('Enter', { tagName: 'BUTTON' }); assert.equal(run('proofState.index'), 1, 'Focused buttons keep their own Enter');
element('proof-view').style.display = 'none';
press('ArrowRight'); assert.equal(run('proofState.index'), 1, 'Keys are ignored outside the proof view');
assert.equal(theorems.filter(t => t.referenceSource).length, 41);
run('startProofChapter(1)');
assert(element('proof-problem-area').innerHTML.includes('proof-ref-num'), 'Reference theorems highlight their number');
assert(element('proof-problem-area').innerHTML.includes('정리 1.2.1'));
run('startProofChapter(0)');
assert(!element('proof-problem-area').innerHTML.includes('proof-ref-num'));
vm.runInContext(page.slice(page.indexOf('        function buildProofChapterCard'), page.indexOf('        const proofState =')), context);
assert.equal(chapters[4].theorems[0].level, 5, 'Three-lemma product proof should be Level 5');
for (const level of [1, 2, 3, 4, 5]) assert(theorems.some(t => t.level === level));
for (let c = 0; c < chapters.length; c++) {
    const card = run(`buildProofChapterCard(window.proofTheorems[${c}], ${c})`);
    for (const level of [1, 2, 3, 4, 5]) {
        const count = chapters[c].theorems.filter(t => t.level === level).length;
        if (count) assert(card.innerHTML.includes(`Level ${level} · ${count}개`));
    }
}
const panel = element('proof-explanation');
const button = element('proof-btn-explanation');
for (let c = 0; c < chapters.length; c++) {
    run(`startProofChapter(${c})`);
    for (let i = 0; i < chapters[c].theorems.length; i++) {
        assert.equal(run('proofState.index'), i);
        assert(panel.hidden);
        assert.equal(panel.innerHTML, '');
        assert.equal(button.attributes['aria-expanded'], 'false');
        assert.equal(button.textContent, '해설');
        assert.equal(element('proof-btn-prev').classList.contains('hidden'), i === 0);
        assert.equal(element('proof-btn-next').classList.contains('hidden'), i === chapters[c].theorems.length - 1);
        const theorem = chapters[c].theorems[i];
        assert.equal(element('proof-level-badge').textContent, `Level ${theorem.level}`);
        assert.equal(element('proof-level-badge').title, context.window.proofLevelDescriptions[theorem.level]);
        context.currentTheorem = theorem;
        const problemHtml = element('proof-problem-area').innerHTML;
        assert(problemHtml.includes(run('escapeHtmlText(currentTheorem.hypothesis)')));
        if (theorem.statement) assert(problemHtml.includes(run('escapeHtmlText(currentTheorem.statement)')));
        if (theorem.sourceNum === 83) {
            assert.equal(theorem.num, `7.${i + 1}`);
            assert(problemHtml.includes('r&lt;m_i'), 'Hermite inequality must not become an HTML tag');
            assert(problemHtml.includes('유일하게 존재함을 증명하시오.'), 'Hermite statement must remain complete');
            assert(!problemHtml.includes('<m_i'));
        }
        run('toggleProofExplanation()');
        assert(!panel.hidden);
        assert.equal(button.attributes['aria-expanded'], 'true');
        assert(panel.innerHTML.includes(`정리 ${chapters[c].theorems[i].num} 해설`));
        assert.equal(typesetCalls.at(-1)[0], panel);
        run('toggleProofExplanation()');
        assert(panel.hidden);
        run('toggleProofExplanation(); nextProofTheorem()');
    }
    const last = chapters[c].theorems.length - 1;
    assert.equal(run('proofState.index'), last);
    run('prevProofTheorem()');
    assert.equal(run('proofState.index'), Math.max(0, last - 1));
    assert(panel.hidden);
}
run('startProofChapter(0); prevProofTheorem()');
assert.equal(run('proofState.index'), 0);
element('chk-proof-keep-open').checked = true;
for (let c = 0; c < chapters.length; c++) {
    run(`startProofChapter(${c})`);
    for (let i = 0; i < chapters[c].theorems.length; i++) {
        assert(!panel.hidden, 'Checked option should reveal every new proof');
        assert.equal(button.attributes['aria-expanded'], 'true');
        assert(panel.innerHTML.includes(`정리 ${c + 1}.${i + 1} 해설`));
        run('nextProofTheorem()');
    }
    run('prevProofTheorem()');
    assert(!panel.hidden, 'Previous should keep explanations open too');
}
run('toggleProofExplanation()');
assert(panel.hidden, 'Manual collapse remains available');
run('nextProofTheorem()');
assert(!panel.hidden, 'The following proof follows the checked preference');
element('chk-proof-keep-open').checked = false;
run('prevProofTheorem()');
assert(panel.hidden, 'Unchecking restores initially collapsed explanations');
// Rendering still works before MathJax becomes available, and escapes authored HTML.
context.window.MathJax = undefined;
run("proofState.index = 0; proofState.theorems = [{ num: 'test', title: '<img>', hypothesis: '', explanation: ['<script>alert(1)</script>'] }]; loadCurrentProofTheorem(); toggleProofExplanation()");
assert(panel.innerHTML.includes('&lt;script&gt;'));
assert(!panel.innerHTML.includes('<script>'));
console.log(`PASS: ${chapters.length} chapters, ${theorems.length} complete explanations; JS syntax, math delimiters, reveal/collapse, navigation, reset, and HTML escaping.`);
