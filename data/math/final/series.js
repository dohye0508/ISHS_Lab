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
        ]),
        set('fin_ser_03_v1', '급수 3 · 적분판정법과 p-급수', '이상적분과 비교, 나머지 추정, 지수의 범위 · 교과서 p.108–111', [
            q('p_series_verdict', 3, '거듭제곱을 하나로 모으기',
                R`급수 $\sum_{n=1}^{\infty}\frac{1}{\sqrt{n}\,\sqrt[3]{n^2}}$ 의 수렴, 발산을 판정하시오.`,
                R`verdict:수렴`,
                R`$\sqrt{n}\,\sqrt[3]{n^2}=n^{\frac12+\frac23}=n^{\frac76}$ 이므로 주어진 급수는 $p=\frac76$ 인 $p$-급수이다. $p>1$ 이므로 수렴한다. 지수 하나하나가 1보다 작아도 곱하면 1을 넘을 수 있다.`,
                110, 'verdict'),
            q('integral_test_log', 4, '로그의 제곱근이 남는 적분',
                R`급수 $\sum_{n=2}^{\infty}\frac{1}{n\sqrt{\ln n}}$ 의 수렴, 발산을 판정하시오.`,
                R`verdict:발산`,
                R`$f(x)=\frac{1}{x\sqrt{\ln x}}$ 는 $[2,\infty)$ 에서 연속이고 양수이며 감소한다. $u=\ln x$ 로 치환하면 $\int_2^b f(x)\,dx=\int_{\ln2}^{\ln b}u^{-1/2}\,du=2\sqrt{\ln b}-2\sqrt{\ln2}$ 이고 $b\to\infty$ 일 때 발산한다. 적분판정법에 의해 급수도 발산한다. $\frac{1}{n}$ 보다 작아 보여도 로그의 제곱근만큼으로는 수렴하지 않는다.`,
                109, 'verdict'),
            q('log_power_range', 4, '로그 거듭제곱의 지수 범위',
                R`급수 $\sum_{n=2}^{\infty}\frac{1}{n(\ln n)^{2p-1}}$ 이 수렴하도록 하는 실수 $p$ 의 값의 범위를 구간으로 나타내시오.`,
                R`interval:(1,\infty)`,
                R`$q=2p-1$ 이라 하자. $q>0$ 이면 $\frac{1}{x(\ln x)^q}$ 이 감소하므로 적분판정법을 쓸 수 있고, $u=\ln x$ 로 치환한 $\int_{\ln2}^{\infty}u^{-q}\,du$ 는 $q>1$ 일 때만 수렴한다. $q\le0$ 이면 $n\ge3$ 에서 $(\ln n)^{-q}\ge1$ 이므로 각 항이 $\frac1n$ 이상이 되어 발산한다. 따라서 $2p-1>1$, 즉 $p>1$ 이다.`,
                109, 'interval'),
            q('remainder_bound', 5, '적분으로 오차를 보장하는 항 수',
                R`급수 $\sum_{n=1}^{\infty}\frac{1}{n^3}$ 의 합을 부분합 $S_N$ 으로 근사한다. 적분판정법에서 얻는 부등식 $\sum_{n=N+1}^{\infty}\frac{1}{n^3}\le\int_N^{\infty}\frac{dx}{x^3}$ 을 이용하여 오차가 $0.0001$ 보다 작음을 보장하는 자연수 $N$ 의 최솟값을 구하시오.`,
                R`71`,
                R`$\int_N^{\infty}\frac{dx}{x^3}=\frac{1}{2N^2}$ 이므로 $\frac{1}{2N^2}<\frac{1}{10^4}$, 즉 $N^2>5000$ 이면 된다. $70^2=4900$, $71^2=5041$ 이므로 최솟값은 $71$ 이다. 나머지는 $N$ 번째 항 이후의 합이므로 적분의 아래끝이 $N+1$ 이 아니라 $N$ 이라는 점에 주의한다.`,
                109),
            q('exponent_range', 5, '근호의 차를 거듭제곱한 일반항',
                R`급수 $\sum_{n=1}^{\infty}n^{a}\left(\sqrt{n^2+1}-n\right)^2$ 이 수렴하도록 하는 실수 $a$ 의 값의 범위를 구간으로 나타내시오.`,
                R`interval:(-\infty,1)`,
                R`$\sqrt{n^2+1}-n=\frac{1}{\sqrt{n^2+1}+n}$ 이므로 일반항은 $\frac{n^a}{\left(\sqrt{n^2+1}+n\right)^2}$ 이다. $n^{2-a}$ 을 곱하면 $\frac14$ 로 수렴하므로 극한비교판정법에 의해 $p=2-a$ 인 $p$-급수와 수렴, 발산이 같다. 따라서 $2-a>1$, 즉 $a<1$ 이다.`,
                111, 'interval')
        ]),
        set('fin_ser_04_v1', '급수 4 · 비교판정법과 극한비교판정법', '부등식 비교, 극한비교, 로그의 거듭제곱 · 교과서 p.112–115', [
            q('direct_comparison', 3, '삼각함수는 1로 누르기',
                R`급수 $\sum_{n=1}^{\infty}\frac{\sin^2 n}{n\sqrt{n}}$ 의 수렴, 발산을 판정하시오.`,
                R`verdict:수렴`,
                R`모든 항이 $0$ 이상이고 $0\le\frac{\sin^2n}{n\sqrt n}\le\frac{1}{n^{3/2}}$ 이다. $\sum\frac{1}{n^{3/2}}$ 은 $p=\frac32$ 인 $p$-급수로 수렴하므로 비교판정법에 의해 주어진 급수도 수렴한다.`,
                112, 'verdict'),
            q('limit_comparison_sine', 4, '사인을 각도로 바꿔 보기',
                R`급수 $\sum_{n=1}^{\infty}\frac{1}{\sqrt{n}}\sin\frac{1}{\sqrt{n}}$ 의 수렴, 발산을 판정하시오.`,
                R`verdict:발산`,
                R`$t=\frac{1}{\sqrt n}$ 이라 하면 $\frac{\sin t}{t}\to1$ 이므로 일반항을 $\frac1n$ 으로 나눈 값은 $1$ 로 수렴한다. 모든 항이 양수이고 $\sum\frac1n$ 이 발산하므로 극한비교판정법에 의해 주어진 급수도 발산한다. $\frac{1}{\sqrt n}$ 과 $\sin\frac{1}{\sqrt n}$ 이 각각 0으로 가더라도 곱이 $\frac1n$ 정도라 수렴하지 않는다.`,
                113, 'verdict'),
            q('limit_comparison_cosine', 4, '1−cos의 크기를 정확히',
                R`급수 $\sum_{n=1}^{\infty}n\left(1-\cos\frac{1}{n}\right)$ 의 수렴, 발산을 판정하시오.`,
                R`verdict:발산`,
                R`$1-\cos t=2\sin^2\frac t2$ 이므로 $\frac{1-\cos t}{t^2}\to\frac12$ 이다. 따라서 일반항을 $\frac1n$ 으로 나눈 값은 $n^2\left(1-\cos\frac1n\right)\to\frac12$ 이다. 모든 항이 양수이고 $\sum\frac1n$ 이 발산하므로 주어진 급수도 발산한다. 앞의 $n$ 이 $\frac{1}{n^2}$ 크기를 $\frac1n$ 으로 키운다.`,
                114, 'verdict'),
            q('log_power_tower', 5, '밑과 지수에 모두 로그가 있을 때',
                R`급수 $\sum_{n=2}^{\infty}\frac{1}{(\ln n)^{\ln n}}$ 의 수렴, 발산을 판정하시오.`,
                R`verdict:수렴`,
                R`$(\ln n)^{\ln n}=e^{\ln n\cdot\ln\ln n}=n^{\ln\ln n}$ 이다. $n\ge e^{e^2}$ 이면 $\ln\ln n\ge2$ 이므로 $\frac{1}{(\ln n)^{\ln n}}\le\frac{1}{n^2}$ 이다. 앞의 유한 개 항은 수렴 여부에 영향을 주지 않으므로 비교판정법에 의해 수렴한다. 지수에 로그가 있어 $p$-급수처럼 보이지 않지만, 지수가 결국 2를 넘는다.`,
                114, 'verdict'),
            q('root_minus_one_range', 5, 'n제곱근에서 1을 뺀 크기',
                R`급수 $\sum_{n=2}^{\infty}\left(\sqrt[n]{n}-1\right)^p$ 이 수렴하도록 하는 실수 $p$ 의 값의 범위를 구간으로 나타내시오.`,
                R`interval:(1,\infty)`,
                R`$\sqrt[n]{n}-1=e^{\frac{\ln n}{n}}-1$ 이고 $\frac{\ln n}{n}\to0$ 이므로 $\frac{\sqrt[n]{n}-1}{\ln n/n}\to1$ 이다. 극한비교판정법에 의해 $\sum\left(\frac{\ln n}{n}\right)^p$ 와 수렴, 발산이 같다. $p>1$ 이면 충분히 큰 $n$ 에서 $(\ln n)^p\le n^{\frac{p-1}{2}}$ 이라 항이 $\frac{1}{n^{(p+1)/2}}$ 이하이므로 수렴한다. $0<p\le1$ 이면 $n\ge3$ 에서 항이 $\frac{1}{n^p}$ 이상이라 발산하고, $p\le0$ 이면 일반항이 0으로 가지 않는다. 따라서 $p>1$ 이다.`,
                114, 'interval')
        ])
    );
})();
