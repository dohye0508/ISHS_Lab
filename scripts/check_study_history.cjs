const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
let records = [{collection_id: 'test', total_count: 5, best_correct: 4}];
function browser() {
    const badge = {textContent: '', classList: {toggle() {}}};
    const card = {dataset: {id: 'test', totalCount: '5'}, querySelector: () => badge};
    const context = vm.createContext({
        window: {STUDIO_SCORE_CONFIG: {studio: 'integral'}, addEventListener() {}},
        document: {addEventListener() {}, querySelectorAll: () => [card]},
        fetch: async (url, options) => {
            assert(url.includes('studio=integral'));
            assert.equal(options.cache, 'no-store');
            return {ok: true, json: async () => ({status: 'success', records})};
        }
    });
    vm.runInContext(fs.readFileSync('scripts/study_scores.js', 'utf8'), context);
    return {api: context.window.studyScores, badge};
}
(async () => {
    const first = browser(), second = browser();
    await first.api.refreshHistory();
    await second.api.refreshHistory();
    assert.equal(first.badge.textContent, 'Best: 4 / 5');
    assert.equal(second.badge.textContent, first.badge.textContent);
    assert.equal(first.api.historyLabel('test', 10), 'Not started');
    records = [{collection_id: 'test', total_count: 5, best_correct: 5}];
    await second.api.refreshHistory();
    assert.equal(second.badge.textContent, 'Best: 5 / 5');
    records = [{collection_id: 'test', total_count: 5, best_correct: 0}];
    await second.api.refreshHistory();
    assert.equal(second.badge.textContent, 'Best: 0 / 5');
    records = [];
    await first.api.refreshHistory();
    assert.equal(first.badge.textContent, 'Not started');
    const sql = fs.readFileSync('api/study_scores.php', 'utf8');
    assert(sql.includes('MAX(correct_count) AS best_correct'));
    assert(sql.includes('WHERE user_id = ? AND studio = ? AND completed_at IS NOT NULL GROUP BY collection_id, total_count'));
    console.log('PASS: independent browsers, refresh, zero scores, changed collection size, and empty account history.');
})().catch(error => {console.error(error); process.exitCode = 1;});
