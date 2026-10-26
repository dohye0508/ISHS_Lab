// 기말고사(급수·미분방정식) 전용 답 형식. 중간고사 문제의 정답에는 이 접두어가 없으므로
// 이 파일은 기말 세션에서 adv_final.js가 부를 때만 쓰인다. DOM이나 state를 읽지 않는다.
//   verdict:절대수렴 | 조건수렴 | 수렴 | 발산   판정 문제
//   interval:[a,b)                            수렴구간 (괄호 종류까지 맞아야 정답)
//   \infty                                    수렴반경·극한이 무한대
// 그 밖의 정답은 기존 SymPy 채점기(baseGrade)에 그대로 넘긴다.
(function () {
    'use strict';

    const VERDICT_PREFIX = 'verdict:';
    const INTERVAL_PREFIX = 'interval:';

    function stripSpacing(tex) {
        return String(tex).replace(/\\[,;:!]/g, '').replace(/\\ /g, '').replace(/~/g, '').replace(/\s+/g, '');
    }

    // \text{절대수렴}, \mathrm{발산}처럼 감싼 껍질을 벗기고 공백을 지운다. "절대 수렴"도 같은 말로 본다.
    function normalizeVerdict(tex) {
        return stripSpacing(String(tex).replace(/\\(?:text|mathrm|textrm)\{([^}]*)\}/g, '$1'));
    }

    // MathLive는 ∞ 키를 \infty로, 일부 입력기는 \infinity나 기호 그대로 낸다.
    function isInfinity(tex, sign) {
        const s = stripSpacing(tex).replace(/^\{(.*)\}$/, '$1');
        const body = s.replace(/^[+-]/, '');
        if (!/^(?:\\infty|\\infinity|∞)$/.test(body)) return false;
        return sign < 0 ? s.startsWith('-') : !s.startsWith('-');
    }

    function answerKind(solTex) {
        const s = String(solTex);
        if (s.startsWith(VERDICT_PREFIX)) return 'verdict';
        if (s.startsWith(INTERVAL_PREFIX)) return 'interval';
        if (isInfinity(s, 1)) return 'infinity';
        return 'plain';
    }

    // "[a,b)" 꼴만 받는다. MathLive가 붙이는 \left·\right·\mleft·\mright와 \lbrack 같은 이름을
    // 괄호 문자로 되돌린 뒤, 괄호 안에서 깊이 0인 쉼표 하나로 두 끝점을 나눈다.
    function parseInterval(tex) {
        let s = String(tex);
        if (/\\lbrace|\\rbrace|\\\{|\\\}/.test(s)) return null;
        s = s.replace(/\\(?:mleft|mright|left|right)(?![a-zA-Z])/g, '')
            .replace(/\\lbrack(?![a-zA-Z])/g, '[').replace(/\\rbrack(?![a-zA-Z])/g, ']')
            .replace(/\\lparen(?![a-zA-Z])/g, '(').replace(/\\rparen(?![a-zA-Z])/g, ')');
        s = stripSpacing(s);
        const m = s.match(/^([[(])(.*)([\])])$/);
        if (!m) return null;
        const inner = m[2];
        let depth = 0, comma = -1;
        for (let i = 0; i < inner.length; i++) {
            const c = inner[i];
            if ('{(['.includes(c)) depth++;
            else if ('})]'.includes(c)) depth--;
            else if (c === ',' && depth === 0) {
                if (comma !== -1) return null;
                comma = i;
            }
        }
        if (comma <= 0 || comma === inner.length - 1) return null;
        return { left: m[1], a: inner.slice(0, comma), b: inner.slice(comma + 1), right: m[3] };
    }

    async function sameEndpoint(userTex, solTex, baseGrade) {
        if (isInfinity(solTex, 1)) return isInfinity(userTex, 1);
        if (isInfinity(solTex, -1)) return isInfinity(userTex, -1);
        if (isInfinity(userTex, 1) || isInfinity(userTex, -1)) return false;
        return (await baseGrade(userTex, solTex)) === 'CORRECT';
    }

    async function gradeFinal(userTex, solTex, baseGrade) {
        if (!userTex || !String(userTex).trim()) return 'EMPTY INPUT';
        const kind = answerKind(solTex);
        if (kind === 'verdict') {
            const expected = solTex.slice(VERDICT_PREFIX.length);
            const got = normalizeVerdict(userTex);
            // 양항급수가 수렴하면 곧 절대수렴이므로 "수렴" 정답에는 "절대수렴"도 맞다.
            const ok = expected === '수렴' ? (got === '수렴' || got === '절대수렴') : got === expected;
            return ok ? 'CORRECT' : 'INCORRECT';
        }
        if (kind === 'infinity') return isInfinity(userTex, 1) ? 'CORRECT' : 'INCORRECT';
        if (kind === 'interval') {
            const want = parseInterval(solTex.slice(INTERVAL_PREFIX.length));
            const got = parseInterval(userTex);
            if (!want || !got || want.left !== got.left || want.right !== got.right) return 'INCORRECT';
            const ok = await sameEndpoint(got.a, want.a, baseGrade) && await sameEndpoint(got.b, want.b, baseGrade);
            return ok ? 'CORRECT' : 'INCORRECT';
        }
        return baseGrade(userTex, solTex);
    }

    function displaySolution(solTex) {
        const kind = answerKind(solTex);
        if (kind === 'verdict') return `\\text{${solTex.slice(VERDICT_PREFIX.length)}}`;
        if (kind === 'interval') return solTex.slice(INTERVAL_PREFIX.length);
        return solTex;
    }

    window.finalGrading = { answerKind, normalizeVerdict, parseInterval, isInfinity, gradeFinal, displaySolution };
}());
