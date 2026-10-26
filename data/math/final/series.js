// 기말고사 · 교과서 III단원 급수 (p.98–155). 시험의 대부분이 급수라 14세트를 두고,
// 세트마다 Level 3·4·4·5·5로 교과서 예제를 한 번 더 비튼 수준 이상으로 만든다.
// 문항 형식과 정답 표기(verdict:/interval:/\infty, tools)는
// docs/superpowers/specs/2026-10-26-adv-math-final-exam-design.md §6을 따른다.
// 정답은 scripts/check_final.py가 SymPy로 다시 계산해 확인한다.
(() => {
    const R = String.raw;
    // "$수식$ 한국어" 문장을 \text{한국어} 수식 꼴로 바꾼다 (lesson_calculus_collections.js와 같은 규칙).
    const tex = s => s.split('$').map((v, i) => i % 2 ? v : (v.trim() ? `\\text{${v.trim()}}` : '')).join(' ');
    const q = (key, level, title, statement, solution, explanation, page, tools = 'value') => colId => ({
        id: `${colId}_${key}`, template: `${colId}_${key}`, level, title,
        latex: tex(statement), solution, explanation: tex(explanation), answerMode: 'exact', page, tools
    });
    const set = (id, name, description, problems) => ({ id, unit: 'series', name, description, problems: problems.map(p => p(id)) });

    window.finalCollections = window.finalCollections || [];
    window.finalCollections.push(
        set('fin_ser_01_v1', '급수 1 · 수열의 극한', '근호, 샌드위치, e, 점화식, 구분구적 · 교과서 p.101–105', [
            q('rationalize_limit', 3, '1차 항까지 지운 뒤 남는 것',
                R`$\lim_{n\to\infty}n\left(\sqrt{n^2+2n}-n-1\right)$ 의 값을 구하시오.`,
                R`-\frac{1}{2}`,
                R`분자를 유리화하면 $\sqrt{n^2+2n}-(n+1)=\frac{(n^2+2n)-(n+1)^2}{\sqrt{n^2+2n}+n+1}=\frac{-1}{\sqrt{n^2+2n}+n+1}$ 이다. 따라서 주어진 식은 $\frac{-n}{\sqrt{n^2+2n}+n+1}$ 이고, 분모와 분자를 $n$ 으로 나누면 $-\frac{1}{1+1}=-\frac12$ 로 수렴한다. 괄호 안이 0으로 가는 속도가 $\frac1n$ 정도라서 $n$ 을 곱해도 유한한 값이 남는다.`,
                101),
            q('nth_root_dominant', 4, '가장 빨리 자라는 항이 이긴다',
                R`$\lim_{n\to\infty}\sqrt[n]{n^2\,2^n+3^n}$ 의 값을 구하시오.`,
                R`3`,
                R`$n^2\left(\frac23\right)^n\to0$ 이므로 충분히 큰 $n$ 에서 $n^2 2^n\le3^n$ 이다. 그러면 $3^n\le n^2 2^n+3^n\le2\cdot3^n$ 이고, $n$ 제곱근을 취하면 $3\le\sqrt[n]{n^2 2^n+3^n}\le\sqrt[n]{2}\cdot3$ 이다. $\sqrt[n]{2}\to1$ 이므로 샌드위치 정리에 의해 극한은 $3$ 이다.`,
                103),
            q('e_type_limit', 4, '완전제곱을 알아보면 e가 보인다',
                R`$\lim_{n\to\infty}\left(1+\frac{2}{n}+\frac{1}{n^2}\right)^{3n}$ 의 값을 구하시오.`,
                R`e^{6}`,
                R`밑이 $\left(1+\frac1n\right)^2$ 이므로 주어진 식은 $\left[\left(1+\frac1n\right)^n\right]^6$ 이다. $\left(1+\frac1n\right)^n\to e$ 이므로 극한은 $e^6$ 이다. 밑이 1로 간다고 해서 극한이 1인 것은 아니다.`,
                102),
            q('monotone_recursive', 5, '고정점이 둘일 때 어느 쪽으로 가는가',
                R`$a_1=\frac32$, $a_{n+1}=\frac{a_n^2+2}{3}$ 으로 정의된 수열 $\{a_n\}$ 의 극한값을 구하시오.`,
                R`1`,
                R`$a_n$ 이 $1<a_n<2$ 이면 $a_{n+1}-1=\frac{a_n^2-1}{3}>0$, $a_{n+1}-2=\frac{a_n^2-4}{3}<0$ 이므로 다음 항도 $1$ 과 $2$ 사이에 있다. 또 $a_{n+1}-a_n=\frac{(a_n-1)(a_n-2)}{3}<0$ 이므로 수열은 감소한다. 아래로 유계인 감소수열이므로 단조수렴정리에 의해 수렴하고, 극한 $L$ 은 $L=\frac{L^2+2}{3}$, 즉 $L=1$ 또는 $L=2$ 이다. 감소하면서 $\frac32$ 보다 작아지므로 $L=1$ 이다. 고정점 방정식만 풀면 두 값 중 하나를 고를 수 없다.`,
                104),
            q('factorial_ratio_root', 5, '계승의 n제곱근을 구분구적법으로',
                R`$\lim_{n\to\infty}\sqrt[n]{\frac{(3n)!}{n!\,n^{2n}}}$ 의 값을 구하시오.`,
                R`\frac{27}{e^{2}}`,
                R`$\frac{(3n)!}{n!}=\prod_{k=n+1}^{3n}k$ 는 $2n$ 개의 곱이므로 $\frac{(3n)!}{n!\,n^{2n}}=\prod_{k=n+1}^{3n}\frac{k}{n}$ 이다. 로그를 취해 $n$ 으로 나누면 $\frac1n\sum_{k=n+1}^{3n}\ln\frac{k}{n}$ 이고, 이는 구분구적법에 의해 $\int_1^3\ln x\,dx=3\ln3-2$ 로 수렴한다. 따라서 극한은 $e^{3\ln3-2}=\frac{27}{e^2}$ 이다.`,
                105)
        ]),
        set('fin_ser_02_v1', '급수 2 · 급수의 합과 일반항판정법', '부분합, 망원급수, 주기 급수, 일반항판정법 · 교과서 p.106–107', [
            q('telescoping_cubic', 3, '세 인수 곱의 망원급수',
                R`급수 $\sum_{n=1}^{\infty}\frac{1}{n(n+1)(n+2)}$ 의 합을 구하시오.`,
                R`\frac{1}{4}`,
                R`$\frac{1}{n(n+1)(n+2)}=\frac12\left[\frac{1}{n(n+1)}-\frac{1}{(n+1)(n+2)}\right]$ 로 쓰면 부분합은 $S_N=\frac12\left[\frac12-\frac{1}{(N+1)(N+2)}\right]$ 이다. $N\to\infty$ 이면 $S_N\to\frac14$ 이다. 한 번에 세 개로 쪼개는 것보다 두 항의 차로 쓰는 것이 소거가 잘 보인다.`,
                106),
            q('periodic_cosine_sum', 4, '절반이 0인 등비급수',
                R`급수 $\sum_{n=1}^{\infty}\frac{1}{2^n}\cos\frac{n\pi}{2}$ 의 합을 구하시오.`,
                R`-\frac{1}{5}`,
                R`$n$ 이 홀수이면 $\cos\frac{n\pi}{2}=0$ 이고, $n=2k$ 이면 $\cos k\pi=(-1)^k$ 이다. 각 항의 절댓값이 $\frac{1}{2^n}$ 이하라 절대수렴하므로 0인 항을 빼고 다시 묶어도 된다. 따라서 합은 $\sum_{k=1}^{\infty}\left(-\frac14\right)^k=\frac{-1/4}{1+1/4}=-\frac15$ 이다.`,
                106),
            q('nth_term_trap', 4, '항이 0으로 가는지부터',
                R`급수 $\sum_{n=1}^{\infty}\left(1-\frac{1}{n}\right)^n$ 이 수렴하면 그 합을, 발산하면 발산이라고 답하시오.`,
                R`verdict:발산`,
                R`일반항 $\left(1-\frac1n\right)^n$ 은 $n\to\infty$ 일 때 $\frac1e$ 로 수렴한다. 일반항이 0으로 가지 않으므로 일반항판정법에 의해 급수는 발산한다. 각 항이 1보다 작다는 것만으로는 수렴을 말할 수 없다.`,
                107),
            q('factorial_quadratic', 5, '분자를 계승에 맞춰 쪼개기',
                R`급수 $\sum_{n=1}^{\infty}\frac{n^2}{(n+1)!}$ 의 합을 구하시오.`,
                R`e-1`,
                R`$n^2=(n+1)n-(n+1)+1$ 이므로 $\frac{n^2}{(n+1)!}=\frac{1}{(n-1)!}-\frac{1}{n!}+\frac{1}{(n+1)!}$ 이다. $\sum_{n=1}^{\infty}\frac{1}{(n-1)!}=e$, $\sum_{n=1}^{\infty}\frac{1}{n!}=e-1$, $\sum_{n=1}^{\infty}\frac{1}{(n+1)!}=e-2$ 이고 세 급수가 모두 수렴하므로 항별로 더해 $e-(e-1)+(e-2)=e-1$ 이다.`,
                106),
            q('log_cubic_telescoping', 5, '로그의 합을 곱의 소거로',
                R`급수 $\sum_{n=2}^{\infty}\ln\frac{n^3-1}{n^3+1}$ 의 합을 구하시오.`,
                R`\ln\left(\frac{2}{3}\right)`,
                R`$\frac{n^3-1}{n^3+1}=\frac{n-1}{n+1}\cdot\frac{n^2+n+1}{n^2-n+1}$ 이고, $g(n)=n^2-n+1$ 이라 하면 $n^2+n+1=g(n+1)$ 이다. 따라서 부분곱은 $\prod_{n=2}^{N}\frac{n-1}{n+1}\cdot\frac{g(n+1)}{g(n)}=\frac{2}{N(N+1)}\cdot\frac{N^2+N+1}{3}$ 이고 $N\to\infty$ 일 때 $\frac23$ 으로 수렴한다. 부분합은 이 부분곱의 로그이므로 급수의 합은 $\ln\frac23$ 이다.`,
                106)
        ])
    );
})();
