// 기말고사 · 고급대수 참고자료 11장 선형사상과 선형변환 (참고자료/대수/11.선형사상과 선형변환.pdf).
// 1.1 사상과 선형사상, 1.2 행렬변환과 표준행렬, 1.3 여러 가지 선형변환을 한 세트씩, 세트마다 Level 3·4·4·5·5.
// 쪽수 대신 source에 참고자료 PDF의 쪽을 적는다. 행렬·벡터 답은 tools 'matrix'.
// 정답은 scripts/final_targets_alg11.py가 SymPy로 다시 계산하고 scripts/check_final.py가 채점까지 확인한다.
(() => {
    const R = String.raw;
    // "$수식$ 한국어" 문장을 \text{한국어} 수식 꼴로 바꾼다 (ode.js와 같은 규칙).
    const tex = s => s.split('$').map((v, i) => i % 2 ? v : (v.trim() ? `\\text{${v.trim()}}` : '')).join(' ');
    const q = (key, level, title, statement, solution, explanation, page, tools = 'value') => colId => ({
        id: `${colId}_${key}`, template: `${colId}_${key}`, level, title,
        latex: tex(statement), solution, explanation: tex(explanation), answerMode: 'exact',
        source: `참고자료 11장 p.${page}`, tools
    });
    const set = (id, name, description, problems) => ({ id, unit: 'algebra', name, description, problems: problems.map(p => p(id)) });

    window.finalCollections = window.finalCollections || [];
    window.finalCollections.push(
        set('fin_alg_01_v1', '고급대수 1 · 사상과 선형사상', '선형사상의 정의와 판정, 기저의 상으로 결정되는 선형사상, 사상의 상', [
            q('count_linear_maps', 3, '여덟 개의 사상 가려내기',
                R`다음 여덟 개의 사상 중 선형사상인 것의 개수를 구하시오. (가) $T:\mathbb{R}^2\to\mathbb{R}^2$, $T(x,y)=(x-2y,\ 3x+y)$ (나) $T:\mathbb{R}^2\to\mathbb{R}^2$, $T(x,y)=(x+y,\ xy)$ (다) $T:\mathbb{R}^3\to\mathbb{R}$, $T(x,y,z)=x-y+2z$ (라) $T:\mathbb{R}^2\to\mathbb{R}^2$, $T(x,y)=(x+1,\ y-1)$ (마) $T:M_{2\times2}\to M_{2\times2}$, $T(A)=A+A^{T}$ (바) $T:M_{2\times2}\to\mathbb{R}$, $T(A)=\det A$ (사) $T:P_2\to\mathbb{R}$, $T(p)=p(1)+p'(0)$ (아) $T:\mathbb{R}^2\to\mathbb{R}^2$, $T(x,y)=(|x+y|,\ 0)$ (단, $M_{2\times2}$ 는 $2\times2$ 행렬 전체, $P_2$ 는 이차 이하의 다항식 전체의 벡터공간이다.)`,
                R`4`,
                R`(가), (다)는 각 성분이 변수의 일차식(상수항 없음)이므로 덧셈과 스칼라배를 보존한다. (마)는 $(A+B)^{T}=A^{T}+B^{T}$, $(aA)^{T}=aA^{T}$ 이므로 선형이고, (사)는 $p\mapsto p(1)$ 과 $p\mapsto p'(0)$ 이 모두 선형이므로 그 합도 선형이다. 나머지는 반례가 있다. (나) $T(2,2)=(4,4)$ 이지만 $2T(1,1)=(4,2)$ 이다. (라) $T(0,0)=(1,-1)\ne\mathbf{0}$ 이므로 정리 3.1.1 (1)에 어긋난다. (바) $\det(2I)=4\ne2\det I$ 이다. (아) $T(-1,0)=(1,0)$ 이지만 $-T(1,0)=(-1,0)$ 이다. 따라서 선형사상은 (가), (다), (마), (사)의 $4$ 개이다.`,
                4),
            q('parameter_makes_linear', 4, '선형이 되도록 계수 맞추기',
                R`실수 $a$, $b$ 에 대하여 사상 $T:\mathbb{R}^2\to\mathbb{R}^2$ 를 $T(x,y)=\left((a-1)x^2+2y+b^2-4,\ ax+(b-2)|y|\right)$ 로 정의하자. $T$ 가 선형사상일 때, $T(3,-1)$ 을 열벡터로 나타내시오.`,
                R`\begin{pmatrix}-2\\3\end{pmatrix}`,
                R`선형사상이면 $T(\mathbf{0})=\mathbf{0}$ 이므로 $b^2-4=0$ 이다. 또 $T(2,0)=2T(1,0)$ 의 첫째 성분을 비교하면 $4(a-1)=2(a-1)$ 이므로 $a=1$ 이다. $T(0,-1)=-T(0,1)$ 의 둘째 성분을 비교하면 $b-2=-(b-2)$ 이므로 $b=2$ 이다. 이때 $T(x,y)=(2y,\ x)$ 이고 이것은 실제로 선형사상이다. 따라서 $T(3,-1)=(-2,\ 3)$ 이다. $b=-2$ 이면 $T(\mathbf{0})=\mathbf{0}$ 은 성립하지만 $-4|y|$ 항 때문에 스칼라배가 깨진다.`,
                4, 'matrix'),
            q('consistent_third_image', 4, '세 조건이 함께 성립하려면',
                R`선형사상 $T:\mathbb{R}^2\to\mathbb{R}^2$ 가 $T(1,2)=(3,1)$, $T(2,1)=(0,k)$, $T(1,1)=(1,2)$ 를 모두 만족한다. 이러한 선형사상이 존재하도록 하는 실수 $k$ 의 값을 구하시오.`,
                R`5`,
                R`$(1,2)$ 와 $(2,1)$ 은 일차독립이므로 앞의 두 조건만으로 $T$ 가 하나로 정해진다. $(1,1)=\frac13(1,2)+\frac13(2,1)$ 이므로 정리 3.1.1 (2)에 의해 $T(1,1)=\frac13(3,1)+\frac13(0,k)=\left(1,\ \frac{1+k}{3}\right)$ 이다. 이것이 $(1,2)$ 와 같아야 하므로 $\frac{1+k}{3}=2$, 즉 $k=5$ 이다.`,
                5),
            q('polynomial_basis_image', 5, '다항식 공간에서 기저의 상',
                R`이차 이하의 다항식 전체의 벡터공간 $P_2$ 에서 선형변환 $T:P_2\to P_2$ 가 $T(1)=1+x$, $T(1+x)=x^2$, $T(1+x+x^2)=2-x$ 를 만족한다. $T(3+x-2x^2)=a+bx+cx^2$ 일 때, 열벡터 $\begin{pmatrix}a\\b\\c\end{pmatrix}$ 를 구하시오.`,
                R`\begin{pmatrix}-2\\4\\3\end{pmatrix}`,
                R`$3+x-2x^2=\alpha\cdot1+\beta(1+x)+\gamma(1+x+x^2)$ 로 놓고 계수를 비교하면 $x^2$ 에서 $\gamma=-2$, $x$ 에서 $\beta+\gamma=1$ 이므로 $\beta=3$, 상수항에서 $\alpha+\beta+\gamma=3$ 이므로 $\alpha=2$ 이다. 정리 3.1.1 (2)를 반복하면 $T(3+x-2x^2)=2(1+x)+3x^2-2(2-x)=-2+4x+3x^2$ 이다. 따라서 $(a,b,c)=(-2,4,3)$ 이다. 세 다항식 $1$, $1+x$, $1+x+x^2$ 이 $P_2$ 의 기저이므로 $T$ 는 이 조건으로 하나로 정해진다.`,
                5, 'matrix'),
            q('image_not_whole_space', 5, '상이 공간 전체가 아닐 조건',
                R`선형변환 $T:\mathbb{R}^3\to\mathbb{R}^3$ 가 $T(1,1,0)=(1,2,1)$, $T(0,1,1)=(2,1,-1)$, $T(1,0,1)=(1,-1,k)$ 를 만족하고, $T$ 의 상 $T(\mathbb{R}^3)$ 이 $\mathbb{R}^3$ 전체가 아니다. 이때 $T(1,2,3)$ 을 열벡터로 나타내시오.`,
                R`\begin{pmatrix}5\\1\\-4\end{pmatrix}`,
                R`$(1,1,0)$, $(0,1,1)$, $(1,0,1)$ 은 $\mathbb{R}^3$ 의 기저이므로 상 $T(\mathbb{R}^3)$ 은 세 벡터 $(1,2,1)$, $(2,1,-1)$, $(1,-1,k)$ 로 생성된다. 상이 $\mathbb{R}^3$ 전체가 아니려면 이 세 벡터가 일차종속이어야 하므로 $\det\begin{pmatrix}1&2&1\\2&1&-1\\1&-1&k\end{pmatrix}=-3k-6=0$, 즉 $k=-2$ 이다. 이때 상은 평면 $x-y+z=0$ 이다. 한편 $(1,2,3)=0\cdot(1,1,0)+2(0,1,1)+1\cdot(1,0,1)$ 이므로 $T(1,2,3)=2(2,1,-1)+(1,-1,-2)=(5,1,-4)$ 이다. 이 점이 평면 $x-y+z=0$ 위에 있는지로 검산할 수 있다.`,
                3, 'matrix')
        ]),
        set('fin_alg_02_v1', '고급대수 2 · 행렬변환과 표준행렬', '표준행렬 구하기, 주어진 상으로 표준행렬 결정, 행렬변환과 연립일차방정식', [
            q('formula_standard_matrix', 3, '변수가 빠진 성분이 있는 변환',
                R`선형사상 $T:\mathbb{R}^3\to\mathbb{R}^2$ 가 $T\left(\begin{pmatrix}x_1\\x_2\\x_3\end{pmatrix}\right)=\begin{pmatrix}x_3-2x_1\\x_1+4x_2-x_3\end{pmatrix}$ 로 주어질 때, $T$ 의 표준행렬( $2\times3$ 행렬)을 구하시오.`,
                R`\begin{pmatrix}-2&0&1\\1&4&-1\end{pmatrix}`,
                R`표준기저벡터의 상을 차례로 열로 놓는다. $T(\mathbf{e}_1)=(-2,\ 1)$, $T(\mathbf{e}_2)=(0,\ 4)$, $T(\mathbf{e}_3)=(1,\ -1)$ 이므로 표준행렬은 $\begin{pmatrix}-2&0&1\\1&4&-1\end{pmatrix}$ 이다. 첫째 성분에 $x_2$ 가 없으므로 둘째 열의 첫째 성분은 $0$ 이고, 성분의 순서가 $x_3-2x_1$ 처럼 섞여 있어도 각 변수의 계수를 그 변수의 열에 넣어야 한다.`,
                10, 'matrix'),
            q('two_images', 4, '두 벡터의 상에서 표준행렬로',
                R`선형변환 $T:\mathbb{R}^2\to\mathbb{R}^2$ 가 $T\left(\begin{pmatrix}2\\1\end{pmatrix}\right)=\begin{pmatrix}1\\4\end{pmatrix}$, $T\left(\begin{pmatrix}3\\2\end{pmatrix}\right)=\begin{pmatrix}0\\5\end{pmatrix}$ 을 만족할 때, $T$ 의 표준행렬을 구하시오.`,
                R`\begin{pmatrix}2&-3\\3&-2\end{pmatrix}`,
                R`표준행렬을 $A$ 라 하면 두 조건을 한꺼번에 $A\begin{pmatrix}2&3\\1&2\end{pmatrix}=\begin{pmatrix}1&0\\4&5\end{pmatrix}$ 로 쓸 수 있다. 왼쪽 행렬의 행렬식이 $1$ 이므로 역행렬 $\begin{pmatrix}2&-3\\-1&2\end{pmatrix}$ 를 오른쪽에 곱하면 $A=\begin{pmatrix}1&0\\4&5\end{pmatrix}\begin{pmatrix}2&-3\\-1&2\end{pmatrix}=\begin{pmatrix}2&-3\\3&-2\end{pmatrix}$ 이다. 또는 $\mathbf{e}_1=2(2,1)-(3,2)$, $\mathbf{e}_2=-3(2,1)+2(3,2)$ 에서 $T(\mathbf{e}_1)=(2,3)$, $T(\mathbf{e}_2)=(-3,-2)$ 를 구해도 된다.`,
                12, 'matrix'),
            q('three_images', 4, '세 벡터의 상에서 표준기저의 상으로',
                R`선형사상 $T:\mathbb{R}^3\to\mathbb{R}^2$ 가 $T(1,1,1)=(2,-1)$, $T(0,1,1)=(1,2)$, $T(0,0,1)=(-1,1)$ 을 만족할 때, $T$ 의 표준행렬( $2\times3$ 행렬)을 구하시오.`,
                R`\begin{pmatrix}1&2&-1\\-3&1&1\end{pmatrix}`,
                R`$\mathbf{e}_3=(0,0,1)$, $\mathbf{e}_2=(0,1,1)-(0,0,1)$, $\mathbf{e}_1=(1,1,1)-(0,1,1)$ 이므로 정리 3.1.1 (2)에 의해 $T(\mathbf{e}_3)=(-1,1)$, $T(\mathbf{e}_2)=(1,2)-(-1,1)=(2,1)$, $T(\mathbf{e}_1)=(2,-1)-(1,2)=(1,-3)$ 이다. 이들을 차례로 열로 놓으면 표준행렬은 $\begin{pmatrix}1&2&-1\\-3&1&1\end{pmatrix}$ 이다.`,
                9, 'matrix'),
            q('plane_fixed_map', 5, '평면을 고정하는 변환',
                R`선형변환 $T:\mathbb{R}^3\to\mathbb{R}^3$ 가 평면 $x+y+z=0$ 위의 모든 점을 고정하고 $T(1,0,0)=(0,1,0)$ 을 만족한다. $T$ 의 표준행렬을 구하시오.`,
                R`\begin{pmatrix}0&-1&-1\\1&2&1\\0&0&1\end{pmatrix}`,
                R`평면 위의 두 벡터 $(-1,1,0)$, $(-1,0,1)$ 은 고정되고, 이 둘과 $(1,0,0)$ 은 $\mathbb{R}^3$ 의 기저이다. $\mathbf{e}_2=(1,0,0)+(-1,1,0)$ 이므로 $T(\mathbf{e}_2)=(0,1,0)+(-1,1,0)=(-1,2,0)$ 이고, $\mathbf{e}_3=(1,0,0)+(-1,0,1)$ 이므로 $T(\mathbf{e}_3)=(0,1,0)+(-1,0,1)=(-1,1,1)$ 이다. $T(\mathbf{e}_1)=(0,1,0)$ 과 함께 열로 놓으면 표준행렬은 $\begin{pmatrix}0&-1&-1\\1&2&1\\0&0&1\end{pmatrix}$ 이다. 검산으로 $(1,-1,0)$ 과 $(1,0,-1)$ 을 곱하면 그대로 나온다.`,
                9, 'matrix'),
            q('preimage_infinitely_many', 5, '해가 무수히 많은 행렬변환 방정식',
                R`행렬 $A=\begin{pmatrix}1&2&-1\\2&5&1\\3&7&k\end{pmatrix}$ 에 대한 행렬변환 $T_A:\mathbb{R}^3\to\mathbb{R}^3$ 에 대하여 $T_A(\mathbf{x})=\begin{pmatrix}1\\3\\m\end{pmatrix}$ 를 만족하는 $\mathbf{x}$ 가 무수히 많도록 하는 실수 $k$, $m$ 에 대하여 $k+m$ 의 값을 구하시오.`,
                R`4`,
                R`정리 3.1.2 (1)에 의해 $T_A(\mathbf{x})=\mathbf{b}$ 는 연립일차방정식 $A\mathbf{x}=\mathbf{b}$ 와 같다. 첨가행렬에서 2행에 1행의 $-2$ 배, 3행에 1행의 $-3$ 배를 더하면 $(0,1,3\mid1)$, $(0,1,k+3\mid m-3)$ 이 되고, 다시 3행에서 2행을 빼면 $(0,0,k\mid m-4)$ 가 된다. $k\ne0$ 이면 해가 하나뿐이고, $k=0$ 이면서 $m\ne4$ 이면 해가 없다. 해가 무수히 많으려면 $k=0$, $m=4$ 이어야 하므로 $k+m=4$ 이다.`,
                6)
        ]),
        set('fin_alg_03_v1', '고급대수 3 · 여러 가지 선형변환', '회전변환, 대칭변환, 정사영, 닮음변환과 도형의 상', [
            q('rotate_point', 3, '원점 중심 회전으로 옮긴 점',
                R`점 $(2,-1)$ 을 원점을 중심으로 $150^\circ$ 만큼 회전한 점을 열벡터로 나타내시오.`,
                R`\begin{pmatrix}\frac{1}{2}-\sqrt{3}\\1+\frac{\sqrt{3}}{2}\end{pmatrix}`,
                R`회전변환의 표준행렬은 $R_\theta=\begin{pmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{pmatrix}$ 이고, $\cos150^\circ=-\frac{\sqrt3}{2}$, $\sin150^\circ=\frac12$ 이다. 따라서 $R_{150^\circ}\begin{pmatrix}2\\-1\end{pmatrix}=\begin{pmatrix}-\sqrt3+\frac12\\1+\frac{\sqrt3}{2}\end{pmatrix}$ 이다. 회전 전후의 길이가 모두 $\sqrt5$ 인지로 검산할 수 있다.`,
                17, 'matrix'),
            q('reflect_line_matrix', 4, '기울어진 직선에 대한 대칭',
                R`직선 $y=3x$ 에 대한 대칭변환의 표준행렬을 구하시오.`,
                R`\begin{pmatrix}-\frac{4}{5}&\frac{3}{5}\\\frac{3}{5}&\frac{4}{5}\end{pmatrix}`,
                R`직선의 방향 단위벡터는 $\mathbf{u}=\frac{1}{\sqrt{10}}(1,3)$ 이므로 이 직선 위로의 정사영은 $P\mathbf{x}=(\mathbf{x}\cdot\mathbf{u})\mathbf{u}$, 표준행렬은 $P=\frac{1}{10}\begin{pmatrix}1&3\\3&9\end{pmatrix}$ 이다. 정사영한 점은 $\mathbf{x}$ 와 그 대칭점의 중점이므로 대칭변환은 $H=2P-I=\begin{pmatrix}-\frac45&\frac35\\\frac35&\frac45\end{pmatrix}$ 이다. 검산하면 $H(1,3)=(1,3)$ 이고 수직 방향 $(3,-1)$ 은 $(-3,1)$ 로 뒤집힌다.`,
                15, 'matrix'),
            q('projection_segment_length', 4, '삼각형을 직선 위로 정사영하기',
                R`세 점 $(0,0)$, $(3,1)$, $(1,4)$ 를 꼭짓점으로 하는 삼각형을 직선 $y=-2x$ 위로 정사영한 상은 선분이다. 이 선분의 길이를 구하시오.`,
                R`\frac{8\sqrt{5}}{5}`,
                R`직선의 방향 단위벡터 $\mathbf{u}=\frac{1}{\sqrt5}(1,-2)$ 에 대하여 정사영은 $P\mathbf{x}=(\mathbf{x}\cdot\mathbf{u})\mathbf{u}$ 이다. 세 꼭짓점의 $\mathbf{x}\cdot\mathbf{u}$ 값은 차례로 $0$, $\frac{1}{\sqrt5}$, $-\frac{7}{\sqrt5}$ 이다. 정사영은 선형이라 선분을 선분으로 옮기므로 삼각형의 상은 이 값들 중 가장 큰 것과 가장 작은 것에 해당하는 두 점을 잇는 선분이다. 길이는 $\frac{1}{\sqrt5}-\left(-\frac{7}{\sqrt5}\right)=\frac{8}{\sqrt5}=\frac{8\sqrt5}{5}$ 이다.`,
                14),
            q('rotation_dilation_matrix', 5, '회전과 닮음을 한 점으로 결정',
                R`원점을 중심으로 각 $\theta$ 만큼 회전한 다음 원점을 중심으로 $k$ 배 닮음변환하는 선형변환 $T$ 가 $T(3,1)=(2,6)$ 을 만족한다. $T$ 의 표준행렬을 구하시오. (단, $k>0$ 이다.)`,
                R`\begin{pmatrix}\frac{6}{5}&-\frac{8}{5}\\\frac{8}{5}&\frac{6}{5}\end{pmatrix}`,
                R`닮음변환 $D_k$ 의 표준행렬은 $kI$ 이므로 $T$ 의 표준행렬은 $kR_\theta=\begin{pmatrix}p&-q\\q&p\end{pmatrix}$ 꼴이다(단, $p=k\cos\theta$, $q=k\sin\theta$). $T(3,1)=(3p-q,\ p+3q)=(2,6)$ 을 풀면 $p=\frac65$, $q=\frac85$ 이다. 이때 $k=\sqrt{p^2+q^2}=2$, $\cos\theta=\frac35$, $\sin\theta=\frac45$ 로 조건에 맞는 $k$, $\theta$ 가 실제로 존재한다. 길이의 비 $\frac{|(2,6)|}{|(3,1)|}=2$ 로도 $k$ 를 확인할 수 있다.`,
                16, 'matrix'),
            q('reflection_from_point_pair', 5, '한 점의 대칭점으로 대칭축 찾기',
                R`원점을 지나는 직선 $\ell$ 에 대한 대칭변환이 점 $(5,0)$ 을 점 $(3,4)$ 로 옮긴다. 이 대칭변환에 의한 점 $(1,2)$ 의 상을 열벡터로 나타내시오.`,
                R`\begin{pmatrix}\frac{11}{5}\\-\frac{2}{5}\end{pmatrix}`,
                R`대칭축은 점과 그 대칭점의 중점 $(4,2)$ 를 지나므로 직선 $\ell$ 은 $y=\frac12x$ 이다. 방향 단위벡터 $\mathbf{u}=\frac{1}{\sqrt5}(2,1)$ 로 정사영의 표준행렬은 $P=\frac15\begin{pmatrix}4&2\\2&1\end{pmatrix}$ 이고, 대칭변환은 $H=2P-I=\begin{pmatrix}\frac35&\frac45\\\frac45&-\frac35\end{pmatrix}$ 이다. $H(5,0)=(3,4)$ 로 검산되고, $H(1,2)=\left(\frac35+\frac85,\ \frac45-\frac65\right)=\left(\frac{11}{5},\ -\frac25\right)$ 이다.`,
                15, 'matrix')
        ])
    );
})();
