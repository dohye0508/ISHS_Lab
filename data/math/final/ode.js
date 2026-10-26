// 기말고사 · 교과서 IV단원 미분방정식 (p.156–191). 시험에서 2문제 정도라 풀이·활용 두 세트만 둔다.
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
    const set = (id, name, description, problems) => ({ id, unit: 'ode', name, description, problems: problems.map(p => p(id)) });

    window.finalCollections = window.finalCollections || [];
    window.finalCollections.push(
        set('fin_ode_01_v1', '미분방정식 1 · 풀이', '방향장, 오일러, 변수분리형, 선형, 베르누이 · 교과서 p.159–177', [
            q('euler_two_steps', 2, '접선을 두 번 이어 붙이기',
                R`미분방정식 $y'=2x-y$, $y(0)=1$ 의 해 $y=f(x)$ 에 대하여 오일러의 방법을 간격 $h=0.5$ 로 두 번 적용하여 얻은 $f(1)$ 의 근삿값을 구하시오.`,
                R`\frac{3}{4}`,
                R`점 $(0,1)$ 에서 기울기는 $2\cdot0-1=-1$ 이므로 $y_1=1+0.5\cdot(-1)=0.5$ 이다. 점 $(0.5,0.5)$ 에서 기울기는 $2\cdot0.5-0.5=0.5$ 이므로 $y_2=0.5+0.5\cdot0.5=0.75$ 이다. 매 단계 새 점에서 기울기를 다시 계산하는 것이 핵심이다.`,
                167),
            q('separable_ivp', 3, '역탄젠트로 이어지는 변수분리',
                R`초깃값 문제 $y'=2x(1+y^2)$, $y(0)=0$ 의 해를 $|x|<\sqrt{\pi/2}$ 에서 구하시오.`,
                R`\tan\left(x^{2}\right)`,
                R`$1+y^2\ne0$ 이므로 양변을 나누면 $\frac{1}{1+y^2}\frac{dy}{dx}=2x$ 이다. 양변을 적분하면 $\arctan y=x^2+C$ 이고, $y(0)=0$ 에서 $C=0$ 이다. 주어진 구간에서 $x^2<\pi/2$ 이므로 $y=\tan(x^2)$ 로 풀 수 있다.`,
                172, 'expr'),
            q('separable_equilibrium', 3, '상수해로 다가가는 해곡선',
                R`초깃값 문제 $y'=y(4-y)$, $y(0)=1$ 의 해 $y$ 는 $x\to\infty$ 일 때 어떤 값에 수렴한다. $y$ 가 그 값의 절반이 되는 $x$ 의 값을 구하시오.`,
                R`\frac{\ln 3}{4}`,
                R`상수해는 $y=0$ 과 $y=4$ 이고, $0<y<4$ 에서 $y'>0$ 이므로 해는 증가하며 $4$ 에 수렴한다. 변수분리하면 $\frac{1}{4}\ln\frac{y}{4-y}=x+C$ 이고 초깃값에서 $C=\frac14\ln\frac13$ 이다. 정리하면 $y=\frac{4}{1+3e^{-4x}}$ 이다. $y=2$ 이면 $3e^{-4x}=1$ 이므로 $x=\frac{\ln3}{4}$ 이다.`,
                171),
            q('linear_integrating_factor', 4, '적분인자로 좌변 묶기',
                R`초깃값 문제 $y'+2xy=x$, $y(0)=2$ 의 해를 구하시오.`,
                R`\frac{1}{2}+\frac{3}{2}e^{-x^{2}}`,
                R`$p(x)=2x$ 이므로 적분인자는 $\lambda(x)=e^{x^2}$ 이다. 양변에 곱하면 좌변이 $(e^{x^2}y)'$ 가 되어 $(e^{x^2}y)'=xe^{x^2}$ 이다. 적분하면 $e^{x^2}y=\frac12e^{x^2}+C$ 이고, $y(0)=2$ 에서 $C=\frac32$ 이다. 따라서 $y=\frac12+\frac32e^{-x^2}$ 이다.`,
                175, 'expr'),
            q('bernoulli_ivp', 5, '역수 치환으로 선형화',
                R`초깃값 문제 $y'+y=e^{x}y^2$, $y(0)=1$ 의 해를 $x<1$ 에서 구하시오.`,
                R`\frac{e^{-x}}{1-x}`,
                R`$y^2$ 항이 있어 선형이 아니므로 베르누이 꼴로 보고 $u=y^{-1}$ 로 치환한다. $u'=-y^{-2}y'$ 이므로 양변을 $y^2$ 으로 나눈 식은 $-u'+u=e^x$, 즉 $u'-u=-e^x$ 이다. 적분인자 $e^{-x}$ 를 곱하면 $(e^{-x}u)'=-1$ 이므로 $u=(C-x)e^x$ 이다. $u(0)=1$ 에서 $C=1$ 이고, $y=\frac{1}{u}=\frac{e^{-x}}{1-x}$ 이다.`,
                177, 'expr')
        ])
    );
})();
