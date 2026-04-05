// Global State
let engScore = 0;
let currentMode = ''; 
let currentAnswer = null; 

const MODES = ['order', 'blank'];

// Ensure DOM Elements
function startEnglishGame() {
    const landingView = document.getElementById('landing-view');
    const engGameView = document.getElementById('english-game-view');
    landingView.style.display = 'none';
    engGameView.style.display = 'block';
    engScore = 0;
    document.getElementById('eng-score-badge').textContent = 'Score: 0';
    nextEnglishQuestion();
}

function quitEnglishGame() {
    document.getElementById('english-game-view').style.display = 'none';
    document.getElementById('landing-view').style.display = 'block';
}

function nextEnglishQuestion() {
    if (typeof englishData3221s === 'undefined' || englishData3221s.length === 0) {
        alert("데이터를 불러오지 못했습니다."); return;
    }
    
    const pIdx = Math.floor(Math.random() * englishData3221s.length);
    const passage = englishData3221s[pIdx];
    
    currentMode = MODES[Math.floor(Math.random() * MODES.length)];
    
    const hintArea = document.getElementById('eng-korean-hint');
    const playArea = document.getElementById('eng-play-area');
    const modeBadge = document.getElementById('eng-mode-badge');

    hintArea.textContent = passage.ko;
    playArea.innerHTML = '';
    
    if (currentMode === 'order') {
        modeBadge.textContent = 'Sentence Ordering';
        buildOrderingGame(passage.en, playArea);
    } else {
        modeBadge.textContent = 'Fill-in-the-Blank';
        buildBlankGame(passage.en, playArea);
    }
}

// Split text into an array of sentences, maintaining punctuation
function getSentences(text) {
    // Regex splits by . ? ! followed by a space and a capital letter, keeping the punctuation attached.
    const sentences = text.match(/.*?[.!?](?:\s+|$)(?=[A-Z0-9"']|$)/g);
    if (!sentences) return [text];
    return sentences.map(s => s.trim()).filter(s => s.length > 0);
}

function buildOrderingGame(text, playArea) {
    const sentences = getSentences(text);
    if(sentences.length < 2) {
        buildBlankGame(text, playArea); return; // Fallback
    }
    
    // Assign labels (A, B, C...)
    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    const sentenceObjects = sentences.map((s, i) => ({ id: labels[i], text: s, originalIdx: i }));
    currentAnswer = sentenceObjects.map(o => o.id); // e.g. ['A', 'B', 'C', 'D']
    
    // Custom shuffle ensuring it's not the original order
    let shuffled;
    let attempts = 0;
    do {
        shuffled = [...sentenceObjects].sort(() => Math.random() - 0.5);
        attempts++;
    } while(shuffled.map(o => o.id).join('') === currentAnswer.join('') && attempts < 10);
    
    let selectedOrder = [];

    const srcContainer = document.createElement('div');
    srcContainer.style.display = 'flex';
    srcContainer.style.flexDirection = 'column';
    srcContainer.style.gap = '10px';
    srcContainer.style.width = '100%';
    
    const tgtContainer = document.createElement('div');
    tgtContainer.style.minHeight = '120px';
    tgtContainer.style.padding = '15px';
    tgtContainer.style.border = '2px dashed var(--border)';
    tgtContainer.style.borderRadius = '12px';
    tgtContainer.style.width = '100%';
    tgtContainer.style.display = 'flex';
    tgtContainer.style.flexDirection = 'column';
    tgtContainer.style.gap = '10px';
    
    const buildBtns = () => {
        srcContainer.innerHTML = '';
        tgtContainer.innerHTML = '';
        
        selectedOrder.forEach((obj, idx) => {
            const el = document.createElement('div');
            el.className = 'btn secondary'; /* use global style */
            el.style.textAlign = 'left'; 
            el.style.whiteSpace = 'normal';
            el.style.width = '100%';
            el.innerHTML = `<strong>[${obj.id}]</strong> ${obj.text}`;
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
            el.style.border = '1px solid var(--primary)'; /* highlight available */
            el.innerHTML = `<strong>[${obj.id}]</strong> ${obj.text}`;
            el.onclick = () => {
                selectedOrder.push(obj);
                shuffled.splice(idx, 1);
                buildBtns();
            };
            srcContainer.appendChild(el);
        });
        
        if (shuffled.length === 0) {
            checkOrderingAnswer(selectedOrder.map(o => o.id), currentAnswer);
        }
    };
    
    buildBtns();
    
    const instr = document.createElement('p');
    instr.textContent = '👆 아래 문장들을 클릭하여 한국어 해석에 맞게 올바른 순서로 조립하세요.';
    instr.style.color = 'var(--text)';
    instr.style.opacity = '0.7';
    instr.style.fontWeight = 'bold';
    instr.style.marginBottom = '10px';

    playArea.appendChild(tgtContainer);
    playArea.appendChild(instr);
    playArea.appendChild(srcContainer);
}

function checkOrderingAnswer(selectedIdArr, correctIdArr) {
    if (selectedIdArr.join('') === correctIdArr.join('')) {
        onCorrect();
    } else {
        alert("순서가 틀렸습니다. 조립한 조각을 다시 클릭해 취소하고 다시 배열해보세요.");
    }
}

function buildBlankGame(text, playArea) {
    const wordsRaw = text.split(/(\s+|[-—]+)/); 
    let candidateIndex = -1;
    let maxLength = 0;
    
    // Find the most 'important' / longest word
    for(let i=0; i<wordsRaw.length; i++) {
        const cleanWord = wordsRaw[i].replace(/[^a-zA-Z]/g, '');
        if (cleanWord.length > maxLength && cleanWord.length <= 15) { // reasonable word length limit
            maxLength = cleanWord.length;
            candidateIndex = i;
        }
    }
    
    if (candidateIndex === -1) {
       nextEnglishQuestion(); return;
    }
    
    const targetWordObj = wordsRaw[candidateIndex];
    const targetWordClean = targetWordObj.replace(/[^a-zA-Z]/g, ''); 
    
    // Replace specifically that occurrence
    const displayHtml = text.replace(targetWordClean, `<span style="display:inline-block; min-width:80px; padding:0 10px; border-bottom:2px solid var(--error); text-align:center; color:var(--error); font-weight:bold; background: rgba(217, 48, 37, 0.05); border-radius: 4px;">???</span>`);
    
    // Generate distractors from the entire dataset
    const allWords = englishData3221s.map(p => p.en.split(/\s+/)).flat().map(w => w.replace(/[^a-zA-Z]/g, '')).filter(w => w.length >= 5);
    const distractors = [];
    let attempts = 0;
    while(distractors.length < 3 && attempts < 100) {
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
    textDiv.style.fontSize = '1.05rem';
    textDiv.style.padding = '20px';
    textDiv.style.background = 'var(--surface)';
    textDiv.style.borderRadius = '12px';
    textDiv.style.border = '1px solid var(--border)';
    textDiv.style.width = '100%';
    
    const optContainer = document.createElement('div');
    optContainer.style.display = 'flex';
    optContainer.style.gap = '15px';
    optContainer.style.flexWrap = 'wrap';
    optContainer.style.justifyContent = 'center';
    optContainer.style.width = '100%';
    optContainer.style.marginTop = '10px';
    
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn primary';
        btn.textContent = opt;
        btn.onclick = () => {
            if (opt === targetWordClean) {
                btn.style.background = 'var(--success)';
                onCorrect();
            } else {
                btn.style.background = 'var(--error)';
                btn.style.opacity = '0.6';
                btn.disabled = true;
            }
        };
        optContainer.appendChild(btn);
    });
    
    playArea.appendChild(textDiv);
    playArea.appendChild(optContainer);
}

function onCorrect() {
    engScore += 10;
    document.getElementById('eng-score-badge').textContent = 'Score: ' + engScore;
    const playArea = document.getElementById('eng-play-area');
    playArea.innerHTML = `<div style="text-align:center; padding: 40px; width: 100%;"><h2 style="color:var(--success); margin:0;">정답입니다! 🎉</h2><p style="color:var(--text); opacity:0.6; margin-top:10px;">다음 문제로 이동합니다...</p></div>`;
    
    setTimeout(() => {
        nextEnglishQuestion();
    }, 1500);
}

// Make functions global to be called from HTML onclick attributes
window.startEnglishGame = startEnglishGame;
window.quitEnglishGame = quitEnglishGame;
window.nextEnglishQuestion = nextEnglishQuestion;
