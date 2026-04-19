// Global State
window.engScore = 0;
window.currentMode = ''; 
window.currentAnswer = null; 
window.engSelectedMode = 'memorize';
window.isHintVisible = false;
window.isAnswerVisible = false;

// Word Practice State
window.wordPracticeSelectedMainMode = 'memorize'; // 'quiz' or 'memorize'
window.wordPracticeSelectedCount = 10;
window.wordPracticeQueue = [];
window.wordPracticeCurrentIndex = 0;
window.isWordPracticeMode = false;
window.isMemorizeMode = false;
window.isSentenceMemorizeMode = false;
window.sentenceMemorizeIndex = 0;
window.showKoreanText = true;
window.showVocabHighlights = true;

// Collection Management
window.currentPassageData = typeof english_3221m !== 'undefined' ? english_3221m : [];
window.currentVocabData = typeof english_3221m_vocab !== 'undefined' ? english_3221m_vocab : [];

window.MODES = ['order', 'blank_choice', 'blank_input'];

const STOP_WORDS = [
    'the', 'a', 'an', 'and', 'but', 'or', 'yet', 'so', 'for', 'nor',
    'is', 'are', 'was', 'were', 'am', 'be', 'been', 'being',
    'in', 'on', 'at', 'to', 'from', 'by', 'of', 'with', 'off', 'up', 'down',
    'his', 'her', 'its', 'my', 'your', 'our', 'their', 'this', 'that', 'these', 'those',
    'which', 'who', 'whom', 'whose', 'what', 'where', 'when', 'how', 'why',
    'not', 'no', 'yes', 'it', 'they', 'he', 'she', 'we', 'you', 'me', 'him', 'them', 'us'
];

// UI State Management
window.setEngMode = function(mode) {
    console.log("Setting English Mode:", mode);
    window.engSelectedMode = mode;
    
    const btns = document.querySelectorAll('.eng-mode-selector .mode-btn');
    btns.forEach(btn => {
        if (btn.getAttribute('data-mode') === mode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
};

window.setWordPracticeMode = function(mode, value) {
    window.wordPracticeSelectedMainMode = mode;
    if (value) window.wordPracticeSelectedCount = value;

    const btns = document.querySelectorAll('.word-card .mode-btn');
    btns.forEach(btn => btn.classList.remove('active'));

    if (mode === 'memorize') {
        document.getElementById('btn-word-mode-memorize').classList.add('active');
    } else {
        document.getElementById('btn-word-mode-' + value).classList.add('active');
    }
};

window.handleStartWordPractice = function() {
    if (window.wordPracticeSelectedMainMode === 'memorize') {
        window.startMemorize();
    } else {
        window.startWordGame();
    }
};

window.loadPassageCollection = function(id, name) {
    console.log("Loading collection:", id, name);
    const badge = document.getElementById('current-passage-name');
    if (badge) badge.textContent = name;
    
    // Map IDs to actual data variables
    if (id === '3221m') {
        window.currentPassageData = english_3221m;
        window.currentVocabData = english_3221m_vocab;
    }
    // More can be added here
};

window.toggleHint = function() {
    window.isHintVisible = !window.isHintVisible;
    window.applyHintVisibility();
};

window.toggleAnswer = function() {
    window.isAnswerVisible = !window.isAnswerVisible;
    window.applyAnswerVisibility();
};

window.applyHintVisibility = function() {
    const hintContainer = document.getElementById('eng-korean-hint-container');
    const hintBtn = document.getElementById('btn-hint-toggle');
    if (!hintContainer || !hintBtn) return;

    const hintSpan = hintBtn.querySelector('span');
    
    if (window.isHintVisible) {
        hintContainer.classList.add('visible');
        hintBtn.classList.add('active');
        if (hintSpan) hintSpan.textContent = '한글 해석 숨기기 (Hide Hint)';
    } else {
        hintContainer.classList.remove('visible');
        hintBtn.classList.remove('active');
        if (hintSpan) hintSpan.textContent = '한글 해석 보기 (Show Hint)';
    }
};

window.applyAnswerVisibility = function() {
    const answerContainer = document.getElementById('eng-answer-container');
    const answerBtn = document.getElementById('btn-answer-toggle');
    if (!answerContainer || !answerBtn) return;

    const answerSpan = answerBtn.querySelector('span');
    
    if (window.isAnswerVisible) {
        answerContainer.classList.add('visible');
        answerBtn.classList.add('active');
        if (answerSpan) answerSpan.textContent = '정답 숨기기 (Hide Answer)';
    } else {
        answerContainer.classList.remove('visible');
        answerBtn.classList.remove('active');
        if (answerSpan) answerSpan.textContent = '정답 보기 (Show Answer)';
    }
};

// Start Game
window.startEnglishGame = function() {
    const landingView = document.getElementById('landing-view');
    const engGameView = document.getElementById('english-game-view');
    const scoreBadge = document.getElementById('eng-score-badge');
    const passageBadge = document.getElementById('eng-passage-badge');
    const chkShowPassage = document.getElementById('chk-show-passage');
    
    if (!landingView || !engGameView) {
        console.error("Critical views missing in DOM");
        return;
    }

    landingView.style.display = 'none';
    engGameView.style.display = 'block';
    window.engScore = 0;
    if (scoreBadge) scoreBadge.textContent = 'Score: 0';
    
    // Toggle passage badge visibility based on checkbox
    if (passageBadge && chkShowPassage) {
        passageBadge.style.display = chkShowPassage.checked ? 'inline-block' : 'none';
    }
    
    window.isWordPracticeMode = false;
    window.isMemorizeMode = false;
    window.isSentenceMemorizeMode = (window.engSelectedMode === 'memorize');

    window.applyHintVisibility();
    window.applyAnswerVisibility();
    
    if (window.isSentenceMemorizeMode) {
        // UI Setup for Memorize Mode
        const hintToggles = document.querySelectorAll('.hint-section');
        hintToggles.forEach(el => el.style.display = 'none');
        document.getElementById('btn-eng-skip').style.display = 'none';
        if (scoreBadge) scoreBadge.style.display = 'none';

        window.sentenceMemorizeIndex = 0;
        window.nextSentenceMemorize();
    } else {
        // UI Setup for Quiz Mode
        const hintToggles = document.querySelectorAll('.hint-section');
        hintToggles.forEach(el => el.style.display = 'block');
        document.getElementById('btn-eng-skip').style.display = 'inline-block';
        if (scoreBadge) scoreBadge.style.display = 'inline-block';

        window.nextEnglishQuestion();
    }
};

// Highlight vocabulary words in a text passage
function highlightVocabulary(text, vocabList) {
    if (!vocabList || vocabList.length === 0 || !window.showVocabHighlights) return text;

    // 1. Sort by length descending to match longer words/phrases first
    const sortedVocab = [...vocabList].sort((a, b) => b.en.length - a.en.length);

    // 2. Escape regex characters and join into a single pattern
    const patterns = sortedVocab.map(v => v.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    
    // 3. Create a regex that matches whole words only
    const regex = new RegExp(`\\b(${patterns})\\b`, 'gi');

    // 4. Perform replacement
    return text.replace(regex, (match) => {
        // Find the matching vocab item (case-insensitive)
        const item = vocabList.find(v => v.en.toLowerCase() === match.toLowerCase());
        if (!item) return match;
        
        return `<span class="vocab-highlight" data-meaning="${item.ko}">${match}</span>`;
    });
}

window.nextSentenceMemorize = function() {
    if (!window.currentPassageData || window.currentPassageData.length === 0) return;
    
    // Ensure index is within bounds (loop back to 0 if needed)
    if (window.sentenceMemorizeIndex >= window.currentPassageData.length) {
        window.sentenceMemorizeIndex = 0;
    }

    const passage = window.currentPassageData[window.sentenceMemorizeIndex];
    const playArea = document.getElementById('eng-play-area');
    const modeBadge = document.getElementById('eng-mode-badge');
    const passageBadge = document.getElementById('eng-passage-badge');

    if (modeBadge) modeBadge.textContent = "Passage Memorization (지문 외우기)";
    if (passageBadge) {
        passageBadge.textContent = `#${window.sentenceMemorizeIndex + 1} / ${window.currentPassageData.length}`;
        const chkShowPassage = document.getElementById('chk-show-passage');
        passageBadge.style.display = (chkShowPassage && chkShowPassage.checked) ? 'inline-block' : 'none';
    }

    if (!playArea) return;
    playArea.innerHTML = '';

    // Navigation Buttons
    const navContainer = document.createElement('div');
    navContainer.style.width = '100%';
    navContainer.style.display = 'flex';
    navContainer.style.justifyContent = 'center';
    navContainer.style.gap = '15px';
    navContainer.style.marginBottom = '25px';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn secondary';
    prevBtn.style.padding = '12px 30px';
    prevBtn.innerHTML = '← 이전 (Prev)';
    prevBtn.disabled = window.sentenceMemorizeIndex === 0;
    prevBtn.onclick = () => {
        if (window.sentenceMemorizeIndex > 0) {
            window.sentenceMemorizeIndex--;
            window.nextSentenceMemorize();
            window.scrollTo(0, 0);
        }
    };

    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn primary';
    nextBtn.style.padding = '12px 40px';
    nextBtn.style.fontSize = '1.1rem';
    nextBtn.style.boxShadow = '0 4px 12px rgba(var(--primary-rgb), 0.3)';
    nextBtn.innerHTML = '다음 (Next) →';
    nextBtn.onclick = () => {
        window.sentenceMemorizeIndex++;
        window.nextSentenceMemorize();
        window.scrollTo(0, 0);
    };
    
    navContainer.appendChild(prevBtn);
    navContainer.appendChild(nextBtn);
    playArea.appendChild(navContainer);

    // Render Blocks
    const listContainer = document.createElement('div');
    listContainer.className = 'sentence-memorize-container';
    listContainer.style.width = '100%';
    listContainer.style.display = 'flex';
    listContainer.style.flexDirection = 'column';
    listContainer.style.gap = '30px';
    listContainer.style.padding = '10px 20px';
    listContainer.style.boxSizing = 'border-box';

    // English Block
    const engWrapper = document.createElement('div');
    engWrapper.style.position = 'relative';
    engWrapper.style.width = '100%';

    const engBlock = document.createElement('div');
    engBlock.style.fontSize = '1.25rem';
    engBlock.style.lineHeight = '1.8';
    engBlock.style.fontWeight = '400';
    engBlock.style.whiteSpace = 'pre-wrap';
    engBlock.style.paddingRight = '35px';
    engBlock.style.display = 'block';
    
    // Highlight vocabulary words
    const highlightedHtml = highlightVocabulary(passage.en, window.currentVocabData);
    engBlock.innerHTML = highlightedHtml;

    // Helper to create copy button
    const createCopyButton = (text) => {
        const btn = document.createElement('div');
        btn.className = 'copy-btn-wrapper';
        btn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
        `;
        btn.onclick = () => {
            navigator.clipboard.writeText(text).then(() => {
                const originalHtml = btn.innerHTML;
                btn.innerHTML = '<span style="font-size: 20px; color: #34a853; font-weight: bold;">✓</span>';
                setTimeout(() => { btn.innerHTML = originalHtml; }, 1500);
            });
        };
        return btn;
    };

    engWrapper.appendChild(engBlock);
    engWrapper.appendChild(createCopyButton(passage.en));

    // Divider
    const divider = document.createElement('hr');
    divider.style.border = 'none';
    divider.style.borderTop = '1px solid var(--border)';
    divider.style.margin = '10px 0';
    divider.style.opacity = '0.5';
    divider.style.display = window.showKoreanText ? 'block' : 'none';

    // Korean Block
    const koWrapper = document.createElement('div');
    koWrapper.style.position = 'relative';
    koWrapper.style.width = '100%';

    const koBlock = document.createElement('div');
    koBlock.style.fontSize = '1.15rem';
    koBlock.style.lineHeight = '1.7';
    koBlock.style.fontWeight = '400';
    koBlock.style.whiteSpace = 'pre-wrap';
    koBlock.style.paddingRight = '35px';
    koBlock.textContent = passage.ko;
    koBlock.style.display = window.showKoreanText ? 'block' : 'none';

    koWrapper.appendChild(koBlock);
    koWrapper.appendChild(createCopyButton(passage.ko));

    listContainer.appendChild(engWrapper);
    listContainer.appendChild(divider);
    listContainer.appendChild(koWrapper);
    playArea.appendChild(listContainer);

    // Extra spacers if needed for scrolling
    const footerSpacer = document.createElement('div');
    footerSpacer.style.height = '40px';
    playArea.appendChild(footerSpacer);
};

window.startMemorize = function() {
    if (!window.currentVocabData || window.currentVocabData.length === 0) {
        alert("현재 지문에 외울 단어가 없습니다.");
        return;
    }
    const landingView = document.getElementById('landing-view');
    const engGameView = document.getElementById('english-game-view');
    const scoreBadge = document.getElementById('eng-score-badge');
    const passageBadge = document.getElementById('eng-passage-badge');
    const modeBadge = document.getElementById('eng-mode-badge');
    
    if (!landingView || !engGameView) return;

    landingView.style.display = 'none';
    engGameView.style.display = 'block';
    
    window.isMemorizeMode = true;
    
    // UI Setup
    const hintToggles = document.querySelectorAll('.hint-section');
    hintToggles.forEach(el => el.style.display = 'none');
    document.getElementById('btn-eng-skip').style.display = 'none';
    if (passageBadge) passageBadge.style.display = 'none';
    if (scoreBadge) scoreBadge.style.display = 'none';
    if (modeBadge) modeBadge.textContent = "Word Memorization (단어 외우기)";

    const playArea = document.getElementById('eng-play-area');
    if (!playArea) return;
    playArea.innerHTML = '';

    // Render List
    const listContainer = document.createElement('div');
    listContainer.className = 'memorize-list';

    window.currentVocabData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'memorize-card';

        const engText = document.createElement('span');
        engText.className = 'memorize-eng';
        engText.textContent = item.en;

        const koText = document.createElement('span');
        koText.className = 'memorize-ko';
        koText.textContent = item.ko;

        card.appendChild(engText);
        card.appendChild(koText);
        listContainer.appendChild(card);
    });

    const finishBtnContainer = document.createElement('div');
    finishBtnContainer.style.textAlign = 'center';
    finishBtnContainer.style.marginTop = '40px';
    
    const finishBtn = document.createElement('button');
    finishBtn.className = 'btn primary';
    finishBtn.textContent = '외우기 완료 (Finish)';
    finishBtn.style.padding = '15px 40px';
    finishBtn.onclick = window.quitEnglishGame;
    
    finishBtnContainer.appendChild(finishBtn);
    
    playArea.appendChild(listContainer);
    playArea.appendChild(finishBtnContainer);

    // Scroll to top
    window.scrollTo(0, 0);
};

window.startWordGame = function() {
    if (!window.currentVocabData || window.currentVocabData.length < 8) {
        alert("현재 지문에 연습할 단어가 충분하지 않습니다.");
        return;
    }
    const landingView = document.getElementById('landing-view');
    const engGameView = document.getElementById('english-game-view');
    const scoreBadge = document.getElementById('eng-score-badge');
    const passageBadge = document.getElementById('eng-passage-badge');
    const modeBadge = document.getElementById('eng-mode-badge');
    
    if (!landingView || !engGameView) return;

    landingView.style.display = 'none';
    engGameView.style.display = 'block';
    
    window.isWordPracticeMode = true;
    window.wordPracticeQueue = [];
    window.wordPracticeCurrentIndex = 0;
    
    // Hide toggles and skip button during Word Practice
    const hintToggles = document.querySelectorAll('.hint-section');
    hintToggles.forEach(el => el.style.display = 'none');
    document.getElementById('btn-eng-skip').style.display = 'none';
    if (passageBadge) passageBadge.style.display = 'none';
    if (scoreBadge) scoreBadge.style.display = 'none';
    
    // Create Queue
    let allWords = [...window.currentVocabData].sort(() => Math.random() - 0.5);
    while (window.wordPracticeQueue.length < window.wordPracticeSelectedCount) {
        // If count > words available, we reuse them to fill length
        window.wordPracticeQueue.push(...allWords);
    }
    window.wordPracticeQueue = window.wordPracticeQueue.slice(0, window.wordPracticeSelectedCount);
    
    window.nextWordPracticeQuestion();
};

window.nextWordPracticeQuestion = function() {
    if (window.wordPracticeCurrentIndex >= window.wordPracticeSelectedCount) {
        // Complete
        const playArea = document.getElementById('eng-play-area');
        if (playArea) {
            playArea.innerHTML = `<div style="text-align:center; padding: 60px; width: 100%;">
                <div style="font-size:3rem; margin-bottom:20px;">🏆</div>
                <h2 style="color:var(--success); margin:0; font-weight:800;">학습 완료!</h2>
                <p style="color:var(--text); opacity:0.6; margin-top:10px;">홈으로 돌아갑니다...</p>
            </div>`;
        }
        setTimeout(window.quitEnglishGame, 2000);
        return;
    }

    const modeBadge = document.getElementById('eng-mode-badge');
    if (modeBadge) modeBadge.textContent = `Word Practice (${window.wordPracticeCurrentIndex + 1}/${window.wordPracticeSelectedCount})`;
    
    const playArea = document.getElementById('eng-play-area');
    if (!playArea) return;
    playArea.innerHTML = '';
    
    const targetWordObj = window.wordPracticeQueue[window.wordPracticeCurrentIndex];
    
    // Title
    const titleDiv = document.createElement('div');
    titleDiv.style.textAlign = 'center';
    titleDiv.style.fontSize = '2.5rem';
    titleDiv.style.fontWeight = '800';
    titleDiv.style.color = 'var(--primary)';
    titleDiv.style.marginBottom = '30px';
    titleDiv.style.marginTop = '20px';
    titleDiv.textContent = targetWordObj.en;
    
    // Distractors
    const allMeans = window.currentVocabData.map(v => v.ko);
    const distractors = [];
    let attempts = 0;
    while(distractors.length < 7 && attempts < 100) {
        let randM = allMeans[Math.floor(Math.random()*allMeans.length)];
        if (randM !== targetWordObj.ko && !distractors.includes(randM)) {
            distractors.push(randM);
        }
        attempts++;
    }
    
    const options = [targetWordObj.ko, ...distractors].sort(() => Math.random() - 0.5);
    
    const optContainer = document.createElement('div');
    optContainer.style.display = 'grid';
    optContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
    optContainer.style.gap = '15px';
    optContainer.style.width = '100%';
    optContainer.style.boxSizing = 'border-box';
    
    let isAnswered = false;
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn secondary';
        btn.style.padding = '15px';
        btn.style.borderRadius = '12px';
        btn.style.fontSize = '1.1rem';
        btn.textContent = opt;
        btn.onclick = () => {
            if (isAnswered) return;
            isAnswered = true;
            
            if (opt === targetWordObj.ko) {
                btn.style.background = 'var(--success)';
                btn.style.color = 'white';
                setTimeout(() => {
                    window.wordPracticeCurrentIndex++;
                    window.nextWordPracticeQuestion();
                }, 500);
            } else {
                btn.style.background = 'var(--error)';
                btn.style.color = 'white';
                // Highlight correct one
                [...optContainer.children].forEach(cBtn => {
                    if (cBtn.textContent === targetWordObj.ko) {
                        cBtn.style.background = 'var(--success)';
                        cBtn.style.color = 'white';
                    }
                });
                setTimeout(() => {
                    window.wordPracticeCurrentIndex++;
                    window.nextWordPracticeQuestion();
                }, 1500); 
            }
        };
        optContainer.appendChild(btn);
    });
    
    playArea.appendChild(titleDiv);
    playArea.appendChild(optContainer);
}

window.quitEnglishGame = function() {
    const landingView = document.getElementById('landing-view');
    const engGameView = document.getElementById('english-game-view');
    if (engGameView) engGameView.style.display = 'none';
    if (landingView) landingView.style.display = 'block';
    
    // Reset UI visibility state
    const hintToggles = document.querySelectorAll('.hint-section');
    hintToggles.forEach(el => el.style.display = 'block');
    const skipBtn = document.getElementById('btn-eng-skip');
    if(skipBtn) skipBtn.style.display = 'inline-block';

    window.isWordPracticeMode = false;
    window.isMemorizeMode = false;
    window.isSentenceMemorizeMode = false;
};

window.nextEnglishQuestion = function() {
    if (!window.currentPassageData || window.currentPassageData.length === 0) {
        alert("데이터를 불러오지 못했습니다. 지문을 선택해주세요.");
        return;
    }
    
    // Reset Visibility
    window.isHintVisible = false;
    window.isAnswerVisible = false;
    window.applyHintVisibility();
    window.applyAnswerVisibility();
    
    const pIdx = Math.floor(Math.random() * window.currentPassageData.length);
    const passage = window.currentPassageData[pIdx];
    
    // Update passage index badge (#1, #2...)
    const passageBadge = document.getElementById('eng-passage-badge');
    if (passageBadge) {
        passageBadge.textContent = '#' + (pIdx + 1);
    }
    
    if (window.engSelectedMode === 'random') {
        window.currentMode = window.MODES[Math.floor(Math.random() * window.MODES.length)];
    } else {
        window.currentMode = window.engSelectedMode;
    }
    
    const hintText = document.getElementById('eng-korean-hint');
    const playArea = document.getElementById('eng-play-area');
    const modeBadge = document.getElementById('eng-mode-badge');

    if (hintText) hintText.textContent = passage.ko;
    if (playArea) playArea.innerHTML = '';
    
    if (window.currentMode === 'order') {
        if (modeBadge) modeBadge.textContent = 'Sentence Ordering';
        buildOrderingGame(passage.en, playArea);
    } else if (window.currentMode === 'blank_choice') {
        if (modeBadge) modeBadge.textContent = 'Word Choice (Blank)';
        buildBlankChoice(passage.en, playArea);
    } else if (window.currentMode === 'blank_input') {
        if (modeBadge) modeBadge.textContent = 'Word Input (Blank)';
        buildBlankInput(passage.en, playArea);
    }
};

// Helpers (Internal to script)
function getSentences(text) {
    const sentences = text.match(/.*?[.!?](?:\s+|$)/g);
    if (!sentences) return [text];
    return sentences.map(s => s.trim()).filter(s => s.length > 0);
}

function updateAnswerText(val) {
    const el = document.getElementById('eng-answer-text');
    if (el) el.textContent = val;
}

function buildOrderingGame(text, playArea) {
    if (!playArea) return;
    const sentences = getSentences(text);
    if(sentences.length < 2) {
        buildBlankChoice(text, playArea); return; 
    }
    
    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    const sentenceObjects = sentences.map((s, i) => ({ id: labels[i], text: s, originalIdx: i }));
    const orderAnswerIds = sentenceObjects.map(o => o.id);
    
    // Set Answer Toggle to full sentence for Ordering mode
    updateAnswerText(sentences.join(' '));
    
    let shuffled;
    let attempts = 0;
    do {
        shuffled = [...sentenceObjects].sort(() => Math.random() - 0.5);
        attempts++;
    } while(shuffled.map(o => o.id).join('') === orderAnswerIds.join('') && attempts < 10);
    
    let selectedOrder = [];

    const srcContainer = document.createElement('div');
    srcContainer.className = 'src-container';
    srcContainer.style.display = 'grid';
    srcContainer.style.gap = '12px';
    srcContainer.style.width = '100%';
    srcContainer.style.boxSizing = 'border-box';
    
    const tgtContainer = document.createElement('div');
    tgtContainer.className = 'tgt-container';
    tgtContainer.style.minHeight = '120px';
    tgtContainer.style.padding = '15px';
    tgtContainer.style.background = 'var(--surface)';
    tgtContainer.style.border = '2px dashed var(--border)';
    tgtContainer.style.borderRadius = '16px';
    tgtContainer.style.width = '100%';
    tgtContainer.style.display = 'flex';
    tgtContainer.style.flexDirection = 'column';
    tgtContainer.style.gap = '12px';
    tgtContainer.style.boxSizing = 'border-box';
    
    const buildBtns = () => {
        srcContainer.innerHTML = '';
        tgtContainer.innerHTML = '';
        
        selectedOrder.forEach((obj, idx) => {
            const el = document.createElement('div');
            el.className = 'btn secondary';
            el.style.textAlign = 'left'; 
            el.style.whiteSpace = 'normal';
            el.style.width = '100%';
            el.style.padding = '12px 15px';
            el.style.border = '1px solid var(--border)';
            el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            el.style.boxSizing = 'border-box';
            el.innerHTML = `${obj.text}`;
            el.onclick = () => {
                shuffled.push(obj);
                selectedOrder.splice(idx, 1);
                buildBtns();
            };
            tgtContainer.appendChild(el);
        });
        
        shuffled.forEach((obj, idx) => {
            const el = document.createElement('div');
            el.className = 'btn secondary';
            el.style.textAlign = 'left';
            el.style.whiteSpace = 'normal';
            el.style.width = '100%';
            el.style.padding = '12px 15px';
            el.style.border = '1px solid var(--border)';
            el.style.boxSizing = 'border-box';
            el.style.transition = 'all 0.2s ease';
            el.innerHTML = `${obj.text}`;
            el.onmouseover = () => el.style.borderColor = 'var(--primary)';
            el.onmouseout = () => el.style.borderColor = 'var(--border)';
            el.onclick = () => {
                selectedOrder.push(obj);
                shuffled.splice(idx, 1);
                buildBtns();
            };
            srcContainer.appendChild(el);
        });
        
        if (shuffled.length === 0) {
            checkOrderingAnswer(selectedOrder.map(o => o.id), orderAnswerIds);
        }
    };
    
    buildBtns();
    
    const instr = document.createElement('p');
    instr.textContent = '👆 문장을 클릭하여 올바른 순서로 조립하세요.';
    instr.style.textAlign = 'center';
    instr.style.fontSize = '0.9rem';
    instr.style.color = 'var(--text)';
    instr.style.opacity = '0.5';
    instr.style.margin = '20px 0 10px';

    playArea.appendChild(tgtContainer);
    playArea.appendChild(instr);
    playArea.appendChild(srcContainer);
}

function checkOrderingAnswer(selectedIdArr, correctIdArr) {
    if (selectedIdArr.join('') === correctIdArr.join('')) {
        onCorrect();
    } else {
        alert("순서가 틀렸습니다. 조각을 다시 클릭해 취소하고 다시 시도해보세요.");
    }
}

function getTargetWord(text) {
    const wordsRaw = text.split(/(\s+|[-—]+)/); 
    const candidates = [];
    
    for(let i=0; i<wordsRaw.length; i++) {
        const cleanWord = wordsRaw[i].replace(/[^a-zA-Z]/g, '');
        const lower = cleanWord.toLowerCase();
        
        // Filter out stop words and short particles
        if (cleanWord.length > 3 && !STOP_WORDS.includes(lower)) {
            candidates.push({ index: i, word: cleanWord, length: cleanWord.length });
        }
    }

    if (candidates.length === 0) return { wordsRaw, candidateIndex: -1 };

    // Selection Logic: Pick a random one from top candidates to increase variety
    // Prioritize longer words but keep it random
    candidates.sort((a, b) => b.length - a.length);
    const topCount = Math.min(candidates.length, 5);
    const chosen = candidates[Math.floor(Math.random() * topCount)];

    return { wordsRaw, candidateIndex: chosen.index };
}

function buildBlankChoice(text, playArea) {
    if (!playArea) return;
    const { wordsRaw, candidateIndex } = getTargetWord(text);
    if (candidateIndex === -1) {
       window.nextEnglishQuestion(); return;
    }
    
    const targetWordObj = wordsRaw[candidateIndex];
    const targetWordClean = targetWordObj.replace(/[^a-zA-Z]/g, ''); 
    
    // Set Answer Toggle to ONLY the target word
    updateAnswerText(targetWordClean);
    
    const displayHtml = text.replace(targetWordClean, `<span style="display:inline-block; min-width:100px; padding:2px 10px; border-bottom:3px solid var(--primary); text-align:center; color:var(--primary); font-weight:bold; background: rgba(var(--primary-rgb), 0.05); border-radius: 6px;">???</span>`);
    
    const allWords = window.currentPassageData.map(p => p.en.split(/\s+/)).flat().map(w => w.replace(/[^a-zA-Z]/g, '')).filter(w => w.length >= 5);
    const distractors = [];
    let attempts = 0;
    while(distractors.length < 7 && attempts < 100) {
        let randW = allWords[Math.floor(Math.random()*allWords.length)];
        if (randW && randW.toLowerCase() !== targetWordClean.toLowerCase() && !distractors.includes(randW)) {
            distractors.push(randW);
        }
        attempts++;
    }
    
    const options = [targetWordClean, ...distractors].sort(() => Math.random() - 0.5);
    
    const textDiv = document.createElement('div');
    textDiv.innerHTML = displayHtml;
    textDiv.style.lineHeight = '1.8';
    textDiv.style.fontSize = '1.1rem';
    textDiv.style.padding = '25px 30px';
    textDiv.style.background = 'var(--surface)';
    textDiv.style.borderRadius = '20px';
    textDiv.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
    textDiv.style.width = '100%';
    textDiv.style.marginBottom = '15px';
    textDiv.style.boxSizing = 'border-box';
    
    const optContainer = document.createElement('div');
    optContainer.style.display = 'grid';
    optContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
    optContainer.style.gap = '15px';
    optContainer.style.width = '100%';
    optContainer.style.boxSizing = 'border-box';
    
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn secondary';
        btn.style.padding = '15px';
        btn.style.borderRadius = '12px';
        btn.style.fontSize = '1rem';
        btn.textContent = opt;
        btn.onclick = () => {
            if (opt === targetWordClean) {
                btn.style.background = 'var(--success)';
                btn.style.color = 'white';
                onCorrect();
            } else {
                btn.style.background = 'var(--error)';
                btn.style.color = 'white';
                btn.style.opacity = '0.6';
                btn.disabled = true;
            }
        };
        optContainer.appendChild(btn);
    });
    
    playArea.appendChild(textDiv);
    playArea.appendChild(optContainer);
}

function buildBlankInput(text, playArea) {
    if (!playArea) return;
    const { wordsRaw, candidateIndex } = getTargetWord(text);
    if (candidateIndex === -1) {
       window.nextEnglishQuestion(); return;
    }
    
    const targetWordObj = wordsRaw[candidateIndex];
    const targetWordClean = targetWordObj.replace(/[^a-zA-Z]/g, ''); 
    
    // Set Answer Toggle to ONLY the target word
    updateAnswerText(targetWordClean);
    
    // Hint: First letter + underscores + Length
    const hint = targetWordClean[0] + "_".repeat(targetWordClean.length - 1);
    const lengthText = `(${targetWordClean.length}자)`;
    
    const displayHtml = text.replace(targetWordClean, `<span style="display:inline-block; min-width:100px; padding:2px 10px; border-bottom:3px solid var(--primary); text-align:center; color:var(--primary); font-weight:bold; background: rgba(var(--primary-rgb), 0.05); border-radius: 6px;">${hint} <small style="opacity:0.6; font-size:0.7em;">${lengthText}</small></span>`);
    
    const textDiv = document.createElement('div');
    textDiv.innerHTML = displayHtml;
    textDiv.style.lineHeight = '1.8';
    textDiv.style.fontSize = '1.1rem';
    textDiv.style.padding = '25px 30px';
    textDiv.style.background = 'var(--surface)';
    textDiv.style.borderRadius = '20px';
    textDiv.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
    textDiv.style.width = '100%';
    textDiv.style.marginBottom = '25px';
    textDiv.style.boxSizing = 'border-box';
    
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'blank-input-wrapper';
    
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'eng-blank-input';
    input.placeholder = '단어를 입력하세요...';
    input.autocomplete = 'off';
    
    const checkBtn = document.createElement('button');
    checkBtn.className = 'btn primary';
    checkBtn.style.padding = '15px 30px';
    checkBtn.style.borderRadius = '12px';
    checkBtn.textContent = '확인';
    
    const checkAnswer = () => {
        const userVal = input.value.trim().toLowerCase();
        if (userVal === targetWordClean.toLowerCase()) {
            input.disabled = true;
            checkBtn.disabled = true;
            onCorrect();
        } else {
            input.classList.add('error');
            setTimeout(() => input.classList.remove('error'), 400);
            input.value = '';
            input.focus();
        }
    };
    
    input.onkeydown = (e) => {
        if (e.key === 'Enter') checkAnswer();
    };
    checkBtn.onclick = checkAnswer;
    
    inputGroup.appendChild(input);
    inputGroup.appendChild(checkBtn);
    inputWrapper.appendChild(inputGroup);
    
    playArea.appendChild(textDiv);
    playArea.appendChild(inputWrapper);
    
    // Autofocus
    setTimeout(() => input.focus(), 100);
}

function onCorrect() {
    window.engScore += 10;
    const scoreBadge = document.getElementById('eng-score-badge');
    if (scoreBadge) scoreBadge.textContent = 'Score: ' + window.engScore;
    
    const playArea = document.getElementById('eng-play-area');
    if (playArea) {
        playArea.innerHTML = `<div style="text-align:center; padding: 60px; width: 100%;"><div style="font-size:3rem; margin-bottom:20px;">🎉</div><h2 style="color:var(--success); margin:0; font-weight:800;">정답입니다!</h2><p style="color:var(--text); opacity:0.6; margin-top:10px;">다음 문제로 멋지게 이동합니다...</p></div>`;
    }
    
    setTimeout(() => {
        window.nextEnglishQuestion();
    }, 1200);
}
