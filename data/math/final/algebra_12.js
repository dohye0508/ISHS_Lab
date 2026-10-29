// 기말고사 · 고급대수 참고자료 12장 행렬변환의 합성, 교환, 가역 (참고자료/대수/12.행렬변환의 합성,교환,가역.pdf).
// 세트마다 Level 3·4·4·5·5. 문항 형식은 docs/superpowers/specs/2026-10-26-adv-math-final-exam-design.md §6을 따르되,
// 교과서 쪽수(page) 대신 참고자료 PDF의 쪽을 source로 적는다.
// 정답은 scripts/final_targets_alg12.py가 SymPy로 다시 계산하고 scripts/check_final.py가 채점까지 확인한다.
(() => {
    const R = String.raw;
    // "$수식$ 한국어" 문장을 \text{한국어} 수식 꼴로 바꾼다 (ode.js와 같은 규칙).
    const tex = s => s.split('$').map((v, i) => i % 2 ? v : (v.trim() ? `\\text{${v.trim()}}` : '')).join(' ');
    const q = (key, level, title, statement, solution, explanation, page, tools = 'value') => colId => ({
        id: `${colId}_${key}`, template: `${colId}_${key}`, level, title,
        latex: tex(statement), solution, explanation: tex(explanation), answerMode: 'exact',
        source: `참고자료 12장 p.${page}`, tools
    });
    const set = (id, name, description, problems) => ({ id, unit: 'algebra', name, description, problems: problems.map(p => p(id)) });
    const NO_FACTOR = '단, 공통인수를 행렬 밖으로 묶지 말고 각 성분을 그대로 쓰시오.';

    window.finalCollections = window.finalCollections || [];
    window.finalCollections.push(
        set('fin_alg_04_v1', '고급대수 4 · 행렬변환의 합성', '합성변환의 표준행렬, 거듭제곱, 대칭의 합성과 회전', [
            q('triple_composition', 3, '세 번 이어지는 합성',
                R`선형변환 $T_1:\mathbb{R}^3\to\mathbb{R}^2$, $T_2:\mathbb{R}^2\to\mathbb{R}^3$ 이 $T_1(x,y,z)=(x-y+2z,\ 2x+z)$, $T_2(x,y)=(x+y,\ x-2y,\ 3y)$ 일 때, 합성변환 $T_1\circ T_2\circ T_1$ 의 표준행렬을 $2\times3$ 행렬로 구하시오.`,
                R`\begin{pmatrix}18&0&9\\12&-2&9\end{pmatrix}`,
                R`$T_1$, $T_2$ 의 표준행렬은 $A_1=\begin{pmatrix}1&-1&2\\2&0&1\end{pmatrix}$, $A_2=\begin{pmatrix}1&1\\1&-2\\0&3\end{pmatrix}$ 이다. 정리 $T_A\circ T_B=T_{AB}$ 에 의해 합성의 표준행렬은 $A_1A_2A_1$ 이다. $A_1A_2=\begin{pmatrix}0&9\\2&5\end{pmatrix}$ 이고 여기에 $A_1$ 을 오른쪽에 곱하면 $\begin{pmatrix}18&0&9\\12&-2&9\end{pmatrix}$ 이다. 정의역이 $\mathbb{R}^3$, 공역이 $\mathbb{R}^2$ 이므로 크기는 $2\times3$ 이다.`,
                5, 'matrix'),
            q('scaled_rotation_power', 4, '회전과 닮음으로 쪼개기',
                R`행렬 $A=\begin{pmatrix}1&-\sqrt{3}\\\sqrt{3}&1\end{pmatrix}$ 에 대하여 행렬변환 $T_A$ 를 10번 합성한 변환의 표준행렬 $A^{10}$ 을 $2\times2$ 행렬로 구하시오.`,
                R`\begin{pmatrix}-512&512\sqrt{3}\\-512\sqrt{3}&-512\end{pmatrix}`,
                R`$A=2\begin{pmatrix}\frac12&-\frac{\sqrt3}{2}\\\frac{\sqrt3}{2}&\frac12\end{pmatrix}=2R_{60^\circ}$ 이므로 $T_A$ 는 $60^\circ$ 회전과 2배 닮음의 합성이다. 회전을 거듭하면 각이 더해지므로 $A^{10}=2^{10}R_{600^\circ}=1024R_{240^\circ}$ 이다. $\cos240^\circ=-\frac12$, $\sin240^\circ=-\frac{\sqrt3}{2}$ 이므로 $A^{10}=\begin{pmatrix}-512&512\sqrt{3}\\-512\sqrt{3}&-512\end{pmatrix}$ 이다.`,
                4, 'matrix'),
            q('two_reflections_order', 4, '두 대칭을 번갈아 반복하기',
                R`직선 $y=x$ 에 대한 대칭변환을 $T_1$, 직선 $y=\sqrt{3}x$ 에 대한 대칭변환을 $T_2$ 라 하자. 합성변환 $T_2\circ T_1$ 을 $n$ 번 합성한 변환이 항등변환이 되도록 하는 가장 작은 자연수 $n$ 의 값을 구하시오.`,
                R`12`,
                R`직선 $y=(\tan\varphi)x$ 에 대한 대칭변환의 표준행렬은 $H_\varphi=\begin{pmatrix}\cos2\varphi&\sin2\varphi\\\sin2\varphi&-\cos2\varphi\end{pmatrix}$ 이다. $T_1=H_{45^\circ}=\begin{pmatrix}0&1\\1&0\end{pmatrix}$, $T_2=H_{60^\circ}=\begin{pmatrix}-\frac12&\frac{\sqrt3}{2}\\\frac{\sqrt3}{2}&\frac12\end{pmatrix}$ 이고, 곱하면 $H_{60^\circ}H_{45^\circ}=\begin{pmatrix}\frac{\sqrt3}{2}&-\frac12\\\frac12&\frac{\sqrt3}{2}\end{pmatrix}=R_{30^\circ}$ 이다. 일반적으로 두 대칭의 합성은 회전 $H_\alpha H_\beta=R_{2(\alpha-\beta)}$ 이다. $R_{30^\circ}$ 을 $n$ 번 합성하면 $R_{30n^\circ}$ 이므로 $30n$ 이 $360$ 의 배수가 되는 가장 작은 $n$ 은 $12$ 이다.`,
                4),
            q('nilpotent_power', 5, '두 번 합성하면 사라지는 부분',
                R`직선 $y=x$ 위로의 정사영을 $S$, 원점을 중심으로 $90^\circ$ 회전하는 변환을 $R$ 이라 하자. 변환 $T:\mathbb{R}^2\to\mathbb{R}^2$ 를 $T(\mathbf{v})=\mathbf{v}+S(R(\mathbf{v}))$ 로 정의할 때, $T$ 를 10번 합성한 변환의 표준행렬을 $2\times2$ 행렬로 구하시오.`,
                R`\begin{pmatrix}6&-5\\5&-4\end{pmatrix}`,
                R`$S=\frac12\begin{pmatrix}1&1\\1&1\end{pmatrix}$, $R=\begin{pmatrix}0&-1\\1&0\end{pmatrix}$ 이므로 $S\circ R$ 의 표준행렬은 $N=SR=\frac12\begin{pmatrix}1&-1\\1&-1\end{pmatrix}$ 이다. $N$ 의 상은 직선 $y=x$ 위에 있고, 그 위의 벡터를 $R$ 로 돌리면 직선 $y=-x$ 방향이 되어 정사영하면 $\mathbf{0}$ 이므로 $N^2=O$ 이다. $T$ 의 표준행렬은 $I+N$ 이고 $I$ 와 $N$ 은 교환되므로 이항전개에서 $N^2$ 이상의 항이 모두 사라진다. 따라서 $(I+N)^{10}=I+10N=\begin{pmatrix}6&-5\\5&-4\end{pmatrix}$ 이다.`,
                4, 'matrix'),
            q('conjugated_reflection_slope', 5, '회전, 대칭, 회전의 정체',
                R`평면의 점을 원점을 중심으로 $-60^\circ$ 회전한 뒤, 직선 $y=x$ 에 대하여 대칭이동하고, 다시 원점을 중심으로 $60^\circ$ 회전하는 변환은 원점을 지나는 어떤 직선 $y=mx$ 에 대한 대칭변환이다. $m$ 의 값을 구하시오.`,
                R`-2-\sqrt{3}`,
                R`표준행렬은 나중에 적용하는 변환을 왼쪽에 곱한 $R_{60^\circ}H_{45^\circ}R_{-60^\circ}$ 이다. 대칭과 회전 사이에는 $H_\varphi R_{-\theta}=R_{\theta}H_\varphi$ 가 성립하므로 이 행렬은 $R_{120^\circ}H_{45^\circ}=\begin{pmatrix}-\frac{\sqrt3}{2}&-\frac12\\-\frac12&\frac{\sqrt3}{2}\end{pmatrix}$ 이다. 이는 $\begin{pmatrix}\cos210^\circ&\sin210^\circ\\\sin210^\circ&-\cos210^\circ\end{pmatrix}=H_{105^\circ}$ 이므로 대칭축은 $x$ 축의 양의 방향과 $105^\circ$ 를 이루는 직선이다. 따라서 $m=\tan105^\circ=\frac{\sqrt3+1}{1-\sqrt3}=-2-\sqrt{3}$ 이다. 직선 $y=x$ 를 $60^\circ$ 돌린 직선이 새 대칭축이 된다고 보아도 같다.`,
                4)
        ]),
        set('fin_alg_05_v1', '고급대수 5 · 행렬변환의 교환', '교환 조건, 회전·대칭·정사영과 교환되는 변환', [
            q('unknown_entries_sum', 3, '교환 조건으로 성분 정하기',
                R`행렬 $A=\begin{pmatrix}1&2\\3&0\end{pmatrix}$, $B=\begin{pmatrix}1&4\\c&d\end{pmatrix}$ 에 대하여 두 행렬변환 $T_A$, $T_B$ 가 $T_A\circ T_B=T_B\circ T_A$ 를 만족할 때, $c+d$ 의 값을 구하시오.`,
                R`5`,
                R`$T_A\circ T_B=T_{AB}$, $T_B\circ T_A=T_{BA}$ 이므로 조건은 $AB=BA$ 이다. $AB=\begin{pmatrix}1+2c&4+2d\\3&12\end{pmatrix}$, $BA=\begin{pmatrix}13&2\\c+3d&2c\end{pmatrix}$ 에서 $1+2c=13$, $4+2d=2$ 이므로 $c=6$, $d=-1$ 이다. 나머지 두 성분의 조건 $3=c+3d$, $12=2c$ 도 성립한다. 따라서 $c+d=5$ 이다.`,
                7),
            q('reflection_rotation_angles', 4, '대칭과 회전이 교환되는 각',
                R`직선 $y=\sqrt{3}x$ 에 대한 대칭변환 $H$ 와 원점을 중심으로 $\theta$ 만큼 회전하는 변환 $R_\theta$ 가 $H\circ R_\theta=R_\theta\circ H$ 를 만족하도록 하는 $\theta$ $(0\le\theta<2\pi)$ 의 값을 모두 더한 값을 구하시오.`,
                R`\pi`,
                R`$H=\begin{pmatrix}-\frac12&\frac{\sqrt3}{2}\\\frac{\sqrt3}{2}&\frac12\end{pmatrix}$ 이다. 직접 곱하면 $HR_\theta$ 와 $R_{-\theta}H$ 가 모두 $\begin{pmatrix}\cos(120^\circ-\theta)&\sin(120^\circ-\theta)\\\sin(120^\circ-\theta)&-\cos(120^\circ-\theta)\end{pmatrix}$ 이므로 $HR_\theta=R_{-\theta}H$ 이다. 따라서 교환 조건은 $R_\theta H=R_{-\theta}H$ 이고, 오른쪽에 $H$ 를 곱하면 $R_\theta=R_{-\theta}$, 즉 $R_{2\theta}=I$ 이다. $0\le\theta<2\pi$ 에서 $\theta=0,\ \pi$ 이므로 합은 $\pi$ 이다.`,
                8),
            q('projection_commutant', 4, '정사영과 교환되는 변환',
                R`직선 $y=2x$ 위로의 정사영을 $P$ 라 하자. 선형변환 $T:\mathbb{R}^2\to\mathbb{R}^2$ 가 $T\circ P=P\circ T$ 와 $T(1,0)=(1,2)$ 를 만족할 때, $T$ 의 표준행렬을 $2\times2$ 행렬로 구하시오.`,
                R`\begin{pmatrix}1&2\\2&4\end{pmatrix}`,
                R`$P=\frac15\begin{pmatrix}1&2\\2&4\end{pmatrix}$ 이고, $T$ 의 표준행렬을 $B=\begin{pmatrix}a&b\\c&d\end{pmatrix}$ 라 하면 $T(1,0)=(1,2)$ 에서 $a=1$, $c=2$ 이다. $BP=PB$ 의 성분을 비교하면 $a+2b=a+2c$ 에서 $b=c=2$ 이고, $2a+4b=b+2d$ 에서 $d=4$ 이다. 따라서 표준행렬은 $\begin{pmatrix}1&2\\2&4\end{pmatrix}=5P$ 이다. 기하적으로 $P$ 와 교환되는 변환은 직선 $y=2x$ 와 그에 수직인 직선을 각각 자기 자신 위로 보내고, $T(1,0)$ 이 직선 $y=2x$ 위에 있으므로 수직 방향은 $\mathbf{0}$ 으로 간다.`,
                7, 'matrix'),
            q('reflection_projection_slopes', 5, '대칭과 정사영이 교환되는 직선',
                R`직선 $y=2x$ 위로의 정사영을 $P$, 원점을 지나는 직선 $y=mx$ 에 대한 대칭변환을 $H$ 라 하자. $H\circ P=P\circ H$ 가 되도록 하는 실수 $m$ 의 값을 모두 더한 값을 구하시오.`,
                R`\frac{3}{2}`,
                R`직선 $y=2x$ 에 대한 대칭변환을 $H_0$ 이라 하면 $H_0=2P-I$, 즉 $P=\frac12(I+H_0)$ 이므로 조건은 $HH_0=H_0H$ 와 같다. 두 직선이 $x$ 축과 이루는 각을 $\alpha$, $\beta$ 라 하면 $HH_0=R_{2(\alpha-\beta)}$, $H_0H=R_{2(\beta-\alpha)}$ 이므로 $R_{4(\alpha-\beta)}=I$, 즉 $\alpha-\beta$ 가 $90^\circ$ 의 배수이다. 따라서 두 직선은 일치하거나 서로 수직이고 $m=2$ 또는 $m=-\frac12$ 이다. 합은 $\frac32$ 이다.`,
                8),
            q('rotation_3d_commutant', 5, '공간 회전과 교환되는 행렬',
                R`$\mathbb{R}^3$ 에서 $z$ 축을 회전축으로 $90^\circ$ 회전하는 변환의 표준행렬을 $R=\begin{pmatrix}0&-1&0\\1&0&0\\0&0&1\end{pmatrix}$ 이라 하자. $3\times3$ 행렬 $B$ 가 $T_B\circ T_R=T_R\circ T_B$ 이고 $B\begin{pmatrix}1\\1\\1\end{pmatrix}=\begin{pmatrix}3\\1\\2\end{pmatrix}$ 를 만족할 때, $B$ 를 $3\times3$ 행렬로 구하시오.`,
                R`\begin{pmatrix}2&1&0\\-1&2&0\\0&0&2\end{pmatrix}`,
                R`$B=\begin{pmatrix}a&b&c\\d&e&f\\g&h&p\end{pmatrix}$ 라 하면 $RB=\begin{pmatrix}-d&-e&-f\\a&b&c\\g&h&p\end{pmatrix}$, $BR=\begin{pmatrix}b&-a&c\\e&-d&f\\h&-g&p\end{pmatrix}$ 이다. 성분을 비교하면 $e=a$, $d=-b$, $c=f=g=h=0$ 이므로 $B=\begin{pmatrix}a&b&0\\-b&a&0\\0&0&p\end{pmatrix}$ 꼴이다. $B\begin{pmatrix}1\\1\\1\end{pmatrix}=\begin{pmatrix}a+b\\a-b\\p\end{pmatrix}=\begin{pmatrix}3\\1\\2\end{pmatrix}$ 에서 $a=2$, $b=1$, $p=2$ 이다. 따라서 $B=\begin{pmatrix}2&1&0\\-1&2&0\\0&0&2\end{pmatrix}$ 이고, 이는 $xy$ 평면에서 회전과 닮음을 합친 변환에 $z$ 축 방향 2배를 붙인 것이다.`,
                7, 'matrix')
        ]),
        set('fin_alg_06_v1', '고급대수 6 · 행렬변환의 가역성', '역변환의 표준행렬, 합성의 역, 가역 조건, 역상', [
            q('inverse_three_equations', 3, '연립식으로 주어진 변환의 역',
                R`방정식 $w_1=x_1+x_2$, $w_2=x_2+x_3$, $w_3=x_1+2x_3$ 으로 정의된 변환 $T:\mathbb{R}^3\to\mathbb{R}^3$ 에 대하여 $T^{-1}$ 의 표준행렬을 $3\times3$ 행렬로 구하시오. ${NO_FACTOR}`,
                R`\begin{pmatrix}\frac{2}{3}&-\frac{2}{3}&\frac{1}{3}\\\frac{1}{3}&\frac{2}{3}&-\frac{1}{3}\\-\frac{1}{3}&\frac{1}{3}&\frac{1}{3}\end{pmatrix}`,
                R`표준행렬은 $A=\begin{pmatrix}1&1&0\\0&1&1\\1&0&2\end{pmatrix}$ 이고 $\det A=1\cdot2-1\cdot(0-1)=3\neq0$ 이므로 $T$ 는 가역이다. 여인수 또는 가우스-조던 소거로 $A^{-1}=\frac13\begin{pmatrix}2&-2&1\\1&2&-1\\-1&1&1\end{pmatrix}$ 이다. 즉 $T^{-1}(w_1,w_2,w_3)=\left(\frac{2w_1-2w_2+w_3}{3},\ \frac{w_1+2w_2-w_3}{3},\ \frac{-w_1+w_2+w_3}{3}\right)$ 이고, $T^{-1}=T_{A^{-1}}$ 의 표준행렬은 $A^{-1}$ 이다.`,
                12, 'matrix'),
            q('inverse_of_composition', 4, '합성의 역은 순서를 뒤집어',
                R`전단변환 $S(x,y)=(x+2y,\ y)$ 를 한 다음 원점을 중심으로 $60^\circ$ 회전하는 변환 $T$ 를 하는 합성변환 $T\circ S$ 에 대하여, $(T\circ S)^{-1}$ 의 표준행렬을 $2\times2$ 행렬로 구하시오.`,
                R`\begin{pmatrix}\frac{1}{2}+\sqrt{3}&\frac{\sqrt{3}}{2}-1\\-\frac{\sqrt{3}}{2}&\frac{1}{2}\end{pmatrix}`,
                R`$(T\circ S)^{-1}=S^{-1}\circ T^{-1}$ 이므로 표준행렬은 $S^{-1}R_{-60^\circ}$ 이다. $S^{-1}=\begin{pmatrix}1&-2\\0&1\end{pmatrix}$, $R_{-60^\circ}=\begin{pmatrix}\frac12&\frac{\sqrt3}{2}\\-\frac{\sqrt3}{2}&\frac12\end{pmatrix}$ 이므로 곱은 $\begin{pmatrix}\frac12+\sqrt3&\frac{\sqrt3}{2}-1\\-\frac{\sqrt3}{2}&\frac12\end{pmatrix}$ 이다. 순서를 바꾼 $R_{-60^\circ}S^{-1}$ 는 다른 행렬이므로 역을 취할 때 순서가 뒤집히는 데 주의한다.`,
                11, 'matrix'),
            q('singular_k_sum', 4, '역변환이 없어지는 매개변수',
                R`변환 $T(x,y,z)=(x+ky+z,\ kx+y+z,\ x+y+kz)$ 가 가역이 아니도록 하는 서로 다른 실수 $k$ 의 값을 모두 더한 값을 구하시오.`,
                R`-1`,
                R`$T$ 는 표준행렬 $A=\begin{pmatrix}1&k&1\\k&1&1\\1&1&k\end{pmatrix}$ 가 가역이 아닐 때, 즉 $\det A=0$ 일 때 가역이 아니다. $\det A=(k-1)-k(k^2-1)+(k-1)=-(k-1)(k^2+k-2)=-(k-1)^2(k+2)$ 이므로 $k=1$ 또는 $k=-2$ 이다. 중근 $k=1$ 은 한 번만 세므로 합은 $-1$ 이다.`,
                10),
            q('nilpotent_preimage', 5, '거듭제곱이 영인 부분으로 역 구하기',
                R`$N=\begin{pmatrix}0&1&2\\0&0&3\\0&0&0\end{pmatrix}$ 에 대하여 변환 $T:\mathbb{R}^3\to\mathbb{R}^3$ 를 $T(\mathbf{v})=\mathbf{v}+2N\mathbf{v}$ 로 정의하자. $T(\mathbf{w})=\begin{pmatrix}1\\1\\1\end{pmatrix}$ 를 만족하는 벡터 $\mathbf{w}$ 를 열벡터로 구하시오.`,
                R`\begin{pmatrix}7\\-5\\1\end{pmatrix}`,
                R`$T$ 의 표준행렬은 $I+2N$ 이다. $N^2=\begin{pmatrix}0&0&3\\0&0&0\\0&0&0\end{pmatrix}$, $N^3=O$ 이므로 $(I+2N)(I-2N+4N^2)=I+8N^3=I$ 이다. 따라서 $T$ 는 가역이고 $T^{-1}$ 의 표준행렬은 $I-2N+4N^2=\begin{pmatrix}1&-2&8\\0&1&-6\\0&0&1\end{pmatrix}$ 이다. $\mathbf{w}=T^{-1}\begin{pmatrix}1\\1\\1\end{pmatrix}=\begin{pmatrix}7\\-5\\1\end{pmatrix}$ 이고, 실제로 $2N\mathbf{w}=\begin{pmatrix}-6\\6\\0\end{pmatrix}$ 이므로 $\mathbf{w}+2N\mathbf{w}=\begin{pmatrix}1\\1\\1\end{pmatrix}$ 이다.`,
                10, 'matrix'),
            q('circle_image', 5, '역변환으로 원의 상 구하기',
                R`직선 $y=x$ 에 대한 대칭변환을 한 다음 전단변환 $S(x,y)=(x+2y,\ y)$ 를 하는 합성변환을 $T$ 라 하자. 원 $x^2+y^2=1$ 의 $T$ 에 의한 상이 곡선 $ax^2+bxy+cy^2=1$ 일 때, $a$, $b$, $c$ 를 차례로 성분으로 하는 열벡터 $\begin{pmatrix}a\\b\\c\end{pmatrix}$ 를 구하시오.`,
                R`\begin{pmatrix}1\\-4\\5\end{pmatrix}`,
                R`$T$ 의 표준행렬은 $A=\begin{pmatrix}1&2\\0&1\end{pmatrix}\begin{pmatrix}0&1\\1&0\end{pmatrix}=\begin{pmatrix}2&1\\1&0\end{pmatrix}$ 이고 $\det A=-1$ 이므로 $A^{-1}=\begin{pmatrix}0&1\\1&-2\end{pmatrix}$ 이다. 상 위의 점 $(X,Y)$ 는 $T^{-1}(X,Y)=(Y,\ X-2Y)$ 가 원 위에 있어야 하므로 $Y^2+(X-2Y)^2=1$, 즉 $X^2-4XY+5Y^2=1$ 이다. 따라서 $\begin{pmatrix}a\\b\\c\end{pmatrix}=\begin{pmatrix}1\\-4\\5\end{pmatrix}$ 이다.`,
                12, 'matrix')
        ]),
        set('fin_alg_07_v1', '고급대수 7 · 정사영과 대칭의 표준행렬', '평면과 직선 위로의 정사영, 대칭, 그 합성', [
            q('plane_projection', 3, '평면 위로의 정사영 행렬',
                R`평면 $x+2y-2z=0$ 위로의 정사영 $T:\mathbb{R}^3\to\mathbb{R}^3$ 의 표준행렬을 $3\times3$ 행렬로 구하시오. ${NO_FACTOR}`,
                R`\begin{pmatrix}\frac{8}{9}&-\frac{2}{9}&\frac{2}{9}\\-\frac{2}{9}&\frac{5}{9}&\frac{4}{9}\\\frac{2}{9}&\frac{4}{9}&\frac{5}{9}\end{pmatrix}`,
                R`법선벡터는 $\mathbf{n}=(1,2,-2)$ 이고 $\mathbf{n}\cdot\mathbf{n}=9$ 이다. 정사영은 법선 방향 성분을 빼는 것이므로 표준행렬은 $I-\frac19\mathbf{n}\mathbf{n}^T=I-\frac19\begin{pmatrix}1&2&-2\\2&4&-4\\-2&-4&4\end{pmatrix}=\frac19\begin{pmatrix}8&-2&2\\-2&5&4\\2&4&5\end{pmatrix}$ 이다. 이 행렬로 $\mathbf{n}$ 을 옮기면 $\mathbf{0}$ 이 되는 것으로 확인할 수 있다.`,
                13, 'matrix'),
            q('span_projection', 4, '두 벡터가 생성하는 평면',
                R`두 벡터 $\mathbf{a}_1=(1,1,0)$, $\mathbf{a}_2=(1,0,1)$ 이 생성하는 평면 위로의 정사영의 표준행렬을 $3\times3$ 행렬로 구하시오. ${NO_FACTOR}`,
                R`\begin{pmatrix}\frac{2}{3}&\frac{1}{3}&\frac{1}{3}\\\frac{1}{3}&\frac{2}{3}&-\frac{1}{3}\\\frac{1}{3}&-\frac{1}{3}&\frac{2}{3}\end{pmatrix}`,
                R`$A=\begin{pmatrix}1&1\\1&0\\0&1\end{pmatrix}$ 라 하면 표준행렬은 $A(A^TA)^{-1}A^T$ 이다. $A^TA=\begin{pmatrix}2&1\\1&2\end{pmatrix}$, $(A^TA)^{-1}=\frac13\begin{pmatrix}2&-1\\-1&2\end{pmatrix}$ 이고 곱하면 $\frac13\begin{pmatrix}2&1&1\\1&2&-1\\1&-1&2\end{pmatrix}$ 이다. 법선벡터 $\mathbf{n}=\mathbf{a}_1\times\mathbf{a}_2=(1,-1,-1)$ 로 $I-\frac13\mathbf{n}\mathbf{n}^T$ 를 계산해도 같다.`,
                13, 'matrix'),
            q('line_reflection_point', 4, '공간에서 직선에 대한 대칭점',
                R`$\mathbb{R}^3$ 에서 벡터 $(1,2,2)$ 로 생성되는 원점을 지나는 직선에 대한 대칭변환으로 점 $(3,0,0)$ 을 옮긴 점의 위치벡터를 열벡터로 구하시오.`,
                R`\begin{pmatrix}-\frac{7}{3}\\\frac{4}{3}\\\frac{4}{3}\end{pmatrix}`,
                R`단위벡터 $\mathbf{u}=\frac13(1,2,2)$ 라 하면 직선 위로의 정사영은 $P=\mathbf{u}\mathbf{u}^T$ 이다. 직선에 대한 대칭은 정사영한 점을 지나 같은 거리만큼 더 가는 것이므로 $H=2P-I$ 이다. $\mathbf{p}=(3,0,0)$ 에 대하여 $P\mathbf{p}=(\mathbf{p}\cdot\mathbf{u})\mathbf{u}=\left(\frac13,\ \frac23,\ \frac23\right)$ 이므로 $H\mathbf{p}=2P\mathbf{p}-\mathbf{p}=\left(-\frac73,\ \frac43,\ \frac43\right)$ 이다. 평면에 대한 대칭 $I-2\mathbf{n}\mathbf{n}^T$ 와는 부호가 반대인 점에 주의한다.`,
                13, 'matrix'),
            q('two_plane_reflections', 5, '두 평면 대칭의 반복',
                R`평면 $x-y=0$ 에 대한 대칭변환을 $H_1$, 평면 $y-z=0$ 에 대한 대칭변환을 $H_2$ 라 하자. 합성변환 $H_2\circ H_1$ 을 $n$ 번 합성한 변환이 항등변환이 되도록 하는 가장 작은 자연수 $n$ 의 값을 구하시오.`,
                R`3`,
                R`평면에 대한 대칭은 $I-\frac{2}{\mathbf{n}\cdot\mathbf{n}}\mathbf{n}\mathbf{n}^T$ 이다. $\mathbf{n}_1=(1,-1,0)$ 에서 $H_1=\begin{pmatrix}0&1&0\\1&0&0\\0&0&1\end{pmatrix}$, $\mathbf{n}_2=(0,1,-1)$ 에서 $H_2=\begin{pmatrix}1&0&0\\0&0&1\\0&1&0\end{pmatrix}$ 이다. $H_2H_1=\begin{pmatrix}0&1&0\\0&0&1\\1&0&0\end{pmatrix}$ 은 $(x,y,z)$ 를 $(y,z,x)$ 로 보내므로 두 번 합성하면 $(z,x,y)$, 세 번 합성하면 $(x,y,z)$ 가 된다. 따라서 $n=3$ 이다. 기하적으로는 두 평면의 교선 $x=y=z$ 를 축으로 하는 $120^\circ$ 회전이며, 회전각은 두 법선이 이루는 각 $60^\circ$ 의 2배이다.`,
                13),
            q('line_then_plane', 5, '직선과 평면으로 차례로 정사영',
                R`벡터 $(1,1,0)$ 으로 생성되는 원점을 지나는 직선 위로 정사영한 다음, 평면 $x+y+z=0$ 위로 정사영하는 합성변환의 표준행렬을 $3\times3$ 행렬로 구하시오. ${NO_FACTOR}`,
                R`\begin{pmatrix}\frac{1}{6}&\frac{1}{6}&0\\\frac{1}{6}&\frac{1}{6}&0\\-\frac{1}{3}&-\frac{1}{3}&0\end{pmatrix}`,
                R`직선 위로의 정사영은 $Q=\frac12\begin{pmatrix}1&1&0\\1&1&0\\0&0&0\end{pmatrix}$, 평면 위로의 정사영은 모든 성분이 1인 행렬 $J$ 에 대하여 $P=I-\frac13J$ 이다. 나중 변환을 왼쪽에 두어 $PQ=Q-\frac13JQ$ 를 계산한다. $JQ$ 의 각 행은 $Q$ 의 열의 합 $(1,1,0)$ 이므로 $PQ=\begin{pmatrix}\frac16&\frac16&0\\\frac16&\frac16&0\\-\frac13&-\frac13&0\end{pmatrix}$ 이다. 직선이 평면 위에 있지 않으므로 이 합성은 정사영이 아니고, 순서를 바꾼 $QP$ 와도 다르다.`,
                13, 'matrix')
        ])
    );
})();
