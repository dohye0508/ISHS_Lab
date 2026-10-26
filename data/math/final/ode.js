// 기말고사 · 교과서 IV단원 미분방정식 (p.156–191). 시험에서 2문제 정도라 풀이·활용 두 세트만 두고,
// 대신 세트마다 Level 3·4·4·5·5로 어렵게 만든다.
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
        set('fin_ode_01_v1', '미분방정식 1 · 풀이', '오일러, 변수분리형, 상수해, 선형, 베르누이 · 교과서 p.159–177', [
            q('euler_three_steps', 3, '비선형 방정식에 오일러 세 번',
                R`미분방정식 $y'=x-y^2$, $y(0)=1$ 의 해 $y=f(x)$ 에 대하여 오일러의 방법을 간격 $h=\frac12$ 로 세 번 적용하여 얻은 $f\left(\frac32\right)$ 의 근삿값을 구하시오.`,
                R`\frac{119}{128}`,
                R`점 $(0,1)$ 에서 기울기는 $0-1=-1$ 이므로 $y_1=1-\frac12=\frac12$ 이다. 점 $\left(\frac12,\frac12\right)$ 에서 기울기는 $\frac12-\frac14=\frac14$ 이므로 $y_2=\frac12+\frac18=\frac58$ 이다. 점 $\left(1,\frac58\right)$ 에서 기울기는 $1-\frac{25}{64}=\frac{39}{64}$ 이므로 $y_3=\frac58+\frac{39}{128}=\frac{119}{128}$ 이다. 기울기를 매번 새 점에서 다시 계산해야 하며, 첫 기울기를 계속 쓰면 직선 근사가 된다.`,
                167),
            q('separable_tangent_sum', 4, '역탄젠트의 덧셈정리로 정리',
                R`초깃값 문제 $y'=\frac{1+y^2}{1+x^2}$, $y(0)=1$ 의 해를 $x<1$ 에서 구하시오.`,
                R`\frac{1+x}{1-x}`,
                R`변수분리하면 $\frac{dy}{1+y^2}=\frac{dx}{1+x^2}$ 이므로 $\arctan y=\arctan x+C$ 이다. $y(0)=1$ 에서 $C=\frac{\pi}{4}$ 이다. 따라서 $y=\tan\left(\arctan x+\frac{\pi}{4}\right)$ 이고, 탄젠트의 덧셈정리로 $y=\frac{x+1}{1-x}$ 이다. $\arctan x+\frac{\pi}{4}<\frac{\pi}{2}$ 이어야 하므로 해는 $x<1$ 에서만 이어진다.`,
                172, 'expr'),
            q('separable_equilibrium', 4, '상수해로 다가가는 해곡선',
                R`초깃값 문제 $y'=y(4-y)$, $y(0)=1$ 의 해 $y$ 는 $x\to\infty$ 일 때 어떤 값에 수렴한다. $y$ 가 그 값의 절반이 되는 $x$ 의 값을 구하시오.`,
                R`\frac{\ln 3}{4}`,
                R`상수해는 $y=0$ 과 $y=4$ 이고, $0<y<4$ 에서 $y'>0$ 이므로 해는 두 상수해 사이에서 증가하며 $4$ 에 수렴한다. 변수분리하면 $\frac14\ln\frac{y}{4-y}=x+C$ 이고 초깃값에서 $C=\frac14\ln\frac13$ 이다. 정리하면 $y=\frac{4}{1+3e^{-4x}}$ 이다. $y=2$ 이면 $3e^{-4x}=1$ 이므로 $x=\frac{\ln3}{4}$ 이다.`,
                171),
            q('linear_bounded_initial', 5, '해가 포물선 아래에 머무는 초깃값',
                R`미분방정식 $y'=y-x^2$ 의 해 $y$ 가 모든 $x\ge0$ 에서 $y\le x^2+2x+3$ 을 만족하도록 하는 초깃값 $y(0)$ 의 최댓값을 구하시오.`,
                R`2`,
                R`$y'-y=-x^2$ 에 적분인자 $e^{-x}$ 를 곱하면 $(e^{-x}y)'=-x^2e^{-x}$ 이다. 부분적분으로 $e^{-x}y=(x^2+2x+2)e^{-x}+C$, 즉 $y=x^2+2x+2+Ce^x$ 이다. 조건은 모든 $x\ge0$ 에서 $Ce^x\le1$ 이다. $C>0$ 이면 $x$ 가 커질 때 $Ce^x$ 가 1을 넘으므로 $C\le0$ 이어야 한다. 따라서 $y(0)=2+C$ 의 최댓값은 $C=0$ 일 때 $2$ 이다. 방향장에서 보면 $y=x^2+2x+2$ 위쪽에서 출발한 해곡선은 모두 지수적으로 멀어진다.`,
                176),
            q('bernoulli_ivp', 5, '역수 치환으로 선형화',
                R`초깃값 문제 $y'+y=e^{x}y^2$, $y(0)=1$ 의 해를 $x<1$ 에서 구하시오.`,
                R`\frac{e^{-x}}{1-x}`,
                R`$y^2$ 항이 있어 선형이 아니므로 베르누이 꼴로 보고 $u=y^{-1}$ 로 치환한다. $u'=-y^{-2}y'$ 이므로 양변을 $y^2$ 으로 나눈 식은 $-u'+u=e^x$, 즉 $u'-u=-e^x$ 이다. 적분인자 $e^{-x}$ 를 곱하면 $(e^{-x}u)'=-1$ 이므로 $u=(C-x)e^x$ 이다. $u(0)=1$ 에서 $C=1$ 이고, $y=\frac{1}{u}=\frac{e^{-x}}{1-x}$ 이다. $u$ 가 0이 되는 $x=1$ 에서 해가 끊긴다.`,
                177, 'expr')
        ]),
        set('fin_ode_02_v1', '미분방정식 2 · 활용', '감소, 냉각, 낙하, 토리첼리, 로지스틱 · 교과서 p.180–190', [
            q('decay_half', 3, '일부 붕괴량으로 반감기 구하기',
                R`어떤 방사성 물질은 남아 있는 양에 비례하는 속도로 붕괴하며, 10년 동안 처음 양의 $30\%$ 가 붕괴한다. 처음 양의 절반이 붕괴하는 데 걸리는 시간(년)을 구하시오.`,
                R`\frac{10\ln 2}{\ln\left(\frac{10}{7}\right)}`,
                R`남은 양을 $y$ 라 하면 $y'=-ky$ 이므로 $y=y_0e^{-kt}$ 이다. 10년 뒤 $70\%$ 가 남으므로 $e^{-10k}=\frac{7}{10}$, 즉 $k=\frac{1}{10}\ln\frac{10}{7}$ 이다. 절반이 남는 시각은 $e^{-kT}=\frac12$ 에서 $T=\frac{\ln2}{k}=\frac{10\ln2}{\ln(10/7)}$ 이다. 붕괴한 양($30\%$)과 남은 양($70\%$)을 혼동하지 않는다.`,
                181),
            q('cooling_unknown_ambient', 4, '주변 온도를 모르는 냉각',
                R`뉴턴의 냉각 법칙을 따르는 물체의 온도가 처음 $90$ 도, 10분 뒤 $70$ 도, 20분 뒤 $58$ 도였다. 주변 온도는 일정하지만 알려져 있지 않다. 물체의 온도가 $50$ 도가 되는 시각(분)을 구하시오.`,
                R`\frac{10\ln 5}{\ln\left(\frac{5}{3}\right)}`,
                R`주변 온도를 $A$ 라 하면 $y-A=(90-A)q^{t/10}$ 꼴이다(단, $q=e^{-10k}$). 같은 간격의 세 측정값에서 $(70-A)^2=(90-A)(58-A)$ 이므로 $A=40$ 이고, 그러면 $q=\frac{30}{50}=\frac35$ 이다. $50-40=50\left(\frac35\right)^{t/10}$ 에서 $\left(\frac35\right)^{t/10}=\frac15$ 이므로 $t=\frac{10\ln5}{\ln(5/3)}$ 이다.`,
                183),
            q('stokes_half_terminal', 4, '종단속도의 절반에 이르는 시각',
                R`질량 $80$ 인 물체가 정지 상태에서 떨어진다. 공기 저항은 속도에 비례하고 중력가속도는 $10$ 이며, 충분한 시간이 지나면 속도는 $50$ 에 수렴한다. 속도가 $25$ 가 되는 시각을 구하시오.`,
                R`5\ln 2`,
                R`저항 비례상수를 $r$ 라 하면 $80v'=800-rv$ 이고, 종단속도는 $\frac{800}{r}=50$ 이므로 $r=16$ 이다. 적분인자로 풀면 $v=50\left(1-e^{-t/5}\right)$ 이다. $v=25$ 이면 $e^{-t/5}=\frac12$ 이므로 $t=5\ln2$ 이다. 종단속도에서 저항계수를 먼저 구하는 것이 핵심이다.`,
                185),
            q('torricelli_cone_tail', 5, '원뿔 탱크의 마지막 1m',
                R`꼭짓점이 아래로 향한 직원뿔 모양 물탱크의 밑면의 반지름과 높이가 같고, 꼭짓점의 구멍으로 물이 빠진다. 물의 부피 $V$ 와 높이 $y$ 가 토리첼리의 정리 $\frac{dV}{dt}=-k\sqrt{y}$ 를 따르고, 높이가 $4$ m 에서 $1$ m 가 되는 데 $31$ 분이 걸렸다. 높이가 $1$ m 가 된 뒤 물이 모두 빠질 때까지 걸리는 시간(분)을 구하시오.`,
                R`1`,
                R`높이 $y$ 에서 수면의 반지름도 $y$ 이므로 $V=\frac{\pi}{3}y^3$, $\frac{dV}{dt}=\pi y^2y'$ 이다. 따라서 $\pi y^{3/2}\,dy=-k\,dt$ 이고, 적분하면 $\frac{2\pi}{5}y^{5/2}$ 가 시간에 대해 일정한 비율로 줄어든다. $y^{5/2}$ 는 $4$ m 에서 $32$, $1$ m 에서 $1$ 이므로 $31$ 만큼 줄어드는 데 $31$ 분, 남은 $1$ 만큼 줄어드는 데 $1$ 분이 걸린다. 수면이 좁아질수록 빨리 빠진다.`,
                184),
            q('logistic_fastest_growth', 5, '증가 속도가 가장 큰 순간',
                R`개체 수 $P(t)$ 가 $P'=\frac15P\left(1-\frac{P}{1000}\right)$, $P(0)=100$ 을 만족한다. 개체 수의 증가 속도 $P'$ 이 가장 큰 시각 $t$ 를 구하시오.`,
                R`10\ln 3`,
                R`$P'$ 은 $P$ 에 대한 이차식 $\frac15P\left(1-\frac{P}{1000}\right)$ 이므로 $P=500$ 일 때 가장 크다. 변수분리로 풀면 $P=\frac{1000}{1+9e^{-t/5}}$ 이다. $P=500$ 이면 $9e^{-t/5}=1$ 이므로 $t=5\ln9=10\ln3$ 이다. 그래프에서는 해곡선의 변곡점이다.`,
                190)
        ])
    );
})();
