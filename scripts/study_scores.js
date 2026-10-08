// Shared authenticated study statistics for Integral Studio and Advanced Math Studio.
(() => {
    const config = window.STUDIO_SCORE_CONFIG;
    if (!config?.studio) return;
    const endpoint = 'api/study_scores.php';
    let pendingCompletion = null;
    let history = new Map();
    let historyStatus = 'loading';
    let historyRequest = null;
    function historyLabel(id, total) {
        if (historyStatus === 'loading') return '불러오는 중…';
        if (historyStatus === 'error') return '기록 조회 실패';
        const best = history.get(`${id}:${total}`);
        return best === undefined ? 'Not started' : `Best: ${best} / ${total}`;
    }
    function renderHistory() {
        document.querySelectorAll('.collection-card[data-total-count]').forEach(card => {
            const badge = card.querySelector('.collection-score');
            if (!badge) return;
            const label = historyLabel(card.dataset.id, card.dataset.totalCount);
            badge.textContent = label;
            badge.classList.toggle('has-score', label.startsWith('Best:'));
        });
    }
    async function refreshHistory() {
        if (historyRequest) return historyRequest;
        historyRequest = (async () => {
            try {
                const payload = await request('history');
                history = new Map(payload.records.map(row => [`${row.collection_id}:${row.total_count}`, row.best_correct]));
                historyStatus = 'ready';
            } catch (error) {
                history.clear();
                historyStatus = 'error';
            }
            renderHistory();
        })();
        try { await historyRequest; } finally { historyRequest = null; }
    }
    const request = async (action, method = 'GET', data = null) => {
        const url = method === 'GET'
            ? `${endpoint}?action=${encodeURIComponent(action)}&studio=${encodeURIComponent(config.studio)}`
            : `${endpoint}?action=${encodeURIComponent(action)}`;
        const response = await fetch(url, method === 'GET' ? { credentials: 'same-origin', cache: 'no-store' } : {
            method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || payload.status !== 'success') throw new Error(payload.message || '점수 정보를 불러오지 못했습니다.');
        return payload;
    };
    const number = value => Number(value || 0).toLocaleString('ko-KR');
    const escapeHtml = value => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    async function refreshSummary() {
        try {
            const payload = await request('summary');
            return payload.summary;
        } catch (error) { throw error; }
    }

    function resultMessage(message, retry = false) {
        let target = document.getElementById('score-save-message');
        if (!target) return;
        target.innerHTML = '';
        target.className = retry ? 'score-save-message error' : 'score-save-message success';
        target.append(document.createTextNode(message));
        if (retry) {
            const button = document.createElement('button');
            button.type = 'button'; button.className = 'btn secondary score-retry-button'; button.textContent = '다시 저장';
            button.addEventListener('click', () => submitPending());
            target.append(button);
        }
    }

    async function submitPending() {
        if (!pendingCompletion) return;
        const submit = pendingCompletion;
        resultMessage('점수를 저장하고 있습니다…');
        try {
            const payload = await request('complete', 'POST', submit);
            pendingCompletion = null;
            resultMessage('점수가 학습 기록에 저장되었습니다.');
            if (typeof config.onSaved === 'function') config.onSaved();
            if (historyRequest) await historyRequest;
            await refreshHistory();
        } catch (error) {
            resultMessage(`점수 저장에 실패했습니다. ${error.message}`, true);
        }
    }

    async function startAttempt({ collectionId, totalCount }) {
        const payload = await request('start', 'POST', {
            studio: config.studio, collection_id: collectionId, total_count: totalCount
        });
        return payload.attempt;
    }

    function renderLeaderboardRow(row) {
        const active = row.is_current_user ? ' current-user' : '';
        return `<tr class="${active}"><td>${row.rank}</td><td>${escapeHtml(row.nickname)}</td><td>${number(row.correct_total)} / ${number(row.attempted_total)}</td><td>${row.accuracy}%</td></tr>`;
    }

    async function openLeaderboard() {
        const modal = document.getElementById('study-leaderboard-modal');
        const body = document.getElementById('study-leaderboard-body');
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        body.innerHTML = '<p class="study-leaderboard-loading">순위표를 불러오는 중입니다…</p>';
        try {
            const payload = await request('leaderboard');
            const rows = payload.leaderboard.rows || [];
            const current = payload.leaderboard.current;
            const mine = current
                ? `<section class="study-my-score"><span>내 성적</span><strong>${current.accuracy}%</strong><span>${number(current.correct_total)} / ${number(current.attempted_total)} 정답 · ${current.rank}위</span></section>`
                : '<section class="study-my-score empty">아직 완료한 문제집이 없습니다.</section>';
            body.innerHTML = mine + (rows.length ? `<table><thead><tr><th>순위</th><th>닉네임</th><th>누적 정답</th><th>정답률</th></tr></thead><tbody>${rows.map(renderLeaderboardRow).join('')}</tbody></table>` : '');
        } catch (error) {
            body.innerHTML = `<p class="study-leaderboard-loading">${escapeHtml(error.message)}</p>`;
        }
    }

    function closeLeaderboard() {
        document.getElementById('study-leaderboard-modal').hidden = true;
        document.body.style.overflow = '';
    }

    function mount() {
        if (!document.getElementById('theme-toggle')) return;
        const label = { integral: 'Integral Studio', advanced_math: 'Advanced Math Studio', general_physics: 'General Physics Studio' }[config.studio] || 'Studio';
        const panel = document.createElement('section');
        panel.id = 'study-score-panel';
        panel.className = 'study-score-panel';
        panel.setAttribute('aria-label', `${label} 학습 성적`);
        panel.innerHTML = `<button type="button" class="study-leaderboard-button" aria-label="${label} 순위표 열기" title="순위표"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 21h8"></path><path d="M12 17v4"></path><path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"></path><path d="M7 6H4v1a4 4 0 0 0 4 4"></path><path d="M17 6h3v1a4 4 0 0 1-4 4"></path></svg></button>`;
        document.body.append(panel);
        panel.querySelector('button').addEventListener('click', openLeaderboard);
        const modal = document.createElement('div');
        modal.id = 'study-leaderboard-modal'; modal.className = 'study-leaderboard-modal'; modal.hidden = true;
        modal.innerHTML = `<div class="study-leaderboard-dialog" role="dialog" aria-modal="true" aria-labelledby="study-leaderboard-title"><div class="study-leaderboard-header"><h2 id="study-leaderboard-title">${label} 순위표</h2><button type="button" aria-label="순위표 닫기">×</button></div><div id="study-leaderboard-body"></div></div>`;
        document.body.append(modal);
        modal.addEventListener('click', event => { if (event.target === modal) closeLeaderboard(); });
        modal.querySelector('button').addEventListener('click', closeLeaderboard);
        document.addEventListener('keydown', event => { if (event.key === 'Escape' && !modal.hidden) closeLeaderboard(); });
    }

    window.studyScores = { startAttempt, completeAttempt(attempt, result) {
        pendingCompletion = { studio: config.studio, attempt_id: attempt.id, attempt_token: attempt.token, ...result };
        return submitPending();
    }, refreshSummary, closeLeaderboard, historyLabel, refreshHistory };
    document.addEventListener('DOMContentLoaded', mount);
    document.addEventListener('DOMContentLoaded', refreshHistory);
    window.addEventListener('pageshow', () => { refreshHistory(); });
    window.addEventListener('focus', () => { refreshHistory(); });
})();
