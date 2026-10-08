(function () {
    const theorem = (sourceNum, title, hypothesis, statement = "") => ({
        sourceNum,
        title,
        hypothesis,
        statement
    });

    const chapters = [
        {
            chapter: "9장. 부분공간의 포함과 합집합",
            theorems: [
                theorem(2, "두 부분공간의 합집합 판정", "벡터공간 \\(V\\)의 두 부분공간 \\(U,W\\)에 대하여 다음 동치가 성립함을 증명하시오.", "U\\cup W\\le V \\iff U\\subseteq W\\text{ 또는 }W\\subseteq U"),
                theorem(3, "부분공간이 두 부분공간의 합집합에 포함될 조건", "부분공간 \\(U,W_1,W_2\\le V\\)가 \\(U\\subseteq W_1\\cup W_2\\)를 만족하면, \\(U\\subseteq W_1\\) 또는 \\(U\\subseteq W_2\\)임을 증명하시오.", "")
            ]
        },
        {
            chapter: "10장. 생성공간과 생성집합",
            theorems: [
                theorem(8, "집합 포함과 생성공간 포함", "벡터집합 \\(S,T\\subseteq V\\)에 대하여 \\(S\\subseteq T\\)이면 \\(\\operatorname{span}(S)\\subseteq\\operatorname{span}(T)\\)임을 증명하시오.", ""),
                theorem(9, "생성공간 포함의 판정", "벡터집합 \\(S,T\\subseteq V\\)에 대하여 다음 동치가 성립함을 증명하시오.", "S\\subseteq\\operatorname{span}(T)\\iff\\operatorname{span}(S)\\subseteq\\operatorname{span}(T)"),
                theorem(10, "두 생성공간의 일치 판정", "벡터집합 \\(S,T\\subseteq V\\)에 대하여 다음 세 조건이 동치임을 증명하시오.", "\\operatorname{span}(S)=\\operatorname{span}(T)\\iff S\\subseteq\\operatorname{span}(T),\\ T\\subseteq\\operatorname{span}(S)"),
                theorem(11, "생성 연산의 멱등성", "임의의 벡터집합 \\(S\\subseteq V\\)에 대하여 다음을 증명하시오.", "\\operatorname{span}(\\operatorname{span}(S))=\\operatorname{span}(S)"),
                theorem(12, "교집합과 생성공간", "벡터집합 \\(S,T\\subseteq V\\)에 대하여 다음 포함관계를 증명하고, 등호가 성립하지 않는 구체적인 반례도 제시하시오.", "\\operatorname{span}(S\\cap T)\\subseteq\\operatorname{span}(S)\\cap\\operatorname{span}(T)"),
                theorem(13, "합집합의 생성공간", "벡터집합 \\(S,T\\subseteq V\\)에 대하여 다음 등식들을 증명하시오.", "\\operatorname{span}(S\\cup T)=\\operatorname{span}(\\operatorname{span}(S)\\cup T)=\\operatorname{span}(\\operatorname{span}(S)\\cup\\operatorname{span}(T))"),
                theorem(14, "벡터 하나를 추가했을 때의 생성공간", "벡터집합 \\(S\\subseteq V\\)와 \\(v\\in V\\)에 대하여 다음 동치가 성립함을 증명하시오.", "\\operatorname{span}(S\\cup\\{v\\})=\\operatorname{span}(S)\\iff v\\in\\operatorname{span}(S)"),
                theorem(15, "생성집합에서 벡터 하나를 제거하는 조건", "벡터집합 \\(S\\subseteq V\\)와 \\(v\\in S\\)에 대하여 다음 동치가 성립함을 증명하시오.", "\\operatorname{span}(S - \\{v\\})=\\operatorname{span}(S)\\iff v\\in\\operatorname{span}(S - \\{v\\})"),
                theorem(16, "종속 생성집합의 축소", "일차종속인 생성집합 \\(S\\)에 대하여, 어떤 \\(v\\in S\\)를 제거해도 생성공간이 유지되도록 선택할 수 있음을 증명하시오.", "\\exists v\\in S:\\operatorname{span}(S - \\{v\\})=\\operatorname{span}(S)"),
                theorem(17, "생성공간 교환 보조정리", "벡터집합 \\(S\\subseteq V\\)와 \\(u,v\\in V\\)가 \\(v\\in\\operatorname{span}(S\\cup\\{u\\})\\) 및 \\(v\\notin\\operatorname{span}(S)\\)를 만족할 때, 다음을 증명하시오.", "u\\in\\operatorname{span}(S\\cup\\{v\\})"),
                theorem(18, "생성공간의 단일 벡터 교환", "벡터집합 \\(S\\subseteq V\\)와 \\(u,v\\in V\\)가 \\(v\\in\\operatorname{span}(S\\cup\\{u\\})\\) 및 \\(v\\notin\\operatorname{span}(S)\\)를 만족할 때, 다음을 증명하시오.", "\\operatorname{span}(S\\cup\\{u\\})=\\operatorname{span}(S\\cup\\{v\\})"),
            ]
        },
        {
            chapter: "11장. 일차독립과 일차종속",
            theorems: [
                theorem(20, "독립집합의 부분집합", "일차독립인 집합의 모든 부분집합이 일차독립임을 증명하시오.", ""),
                theorem(21, "종속집합의 상위집합", "일차종속인 집합을 포함하는 모든 상위집합이 일차종속임을 증명하시오.", ""),
                theorem(22, "일차종속의 벡터 제거 판정", "벡터집합 \\(S\\)가 일차종속일 필요충분조건은 \\(S\\)의 어떤 벡터가 나머지 벡터들의 일차결합으로 표현되는 것임을 증명하시오.", ""),
                theorem(23, "일차독립의 생성공간 판정", "벡터집합 \\(S\\)가 일차독립일 필요충분조건은 어느 벡터도 나머지 벡터들의 생성공간에 속하지 않는 것임을 증명하시오.", "\\forall v\\in S,\\ v\\notin\\operatorname{span}(S - \\{v\\})"),
                theorem(24, "독립집합에 벡터 하나 추가하기", "일차독립인 집합 \\(S\\)와 \\(v\\notin S\\)에 대하여 다음 동치가 성립함을 증명하시오.", "S\\cup\\{v\\}\\text{가 독립}\\iff v\\notin\\operatorname{span}(S)"),
                theorem(26, "일차독립과 유일한 유한표현", "벡터집합 \\(S\\)가 일차독립일 필요충분조건은 \\(\\operatorname{span}(S)\\)의 모든 벡터가 \\(S\\)의 서로 다른 유한개의 원소를 이용한 일차결합으로 유일하게 표현되는 것임을 증명하시오.", ""),
                theorem(27, "두 벡터의 일차종속 판정", "0이 아닌 두 벡터 \\(u,v\\)가 일차종속일 필요충분조건은 한 벡터가 다른 벡터의 스칼라배인 것임을 증명하시오.", ""),
                theorem(28, "쌍별 비평행성과 일차독립", "벡터가 세 개 이상일 때, 어느 두 벡터도 서로 스칼라배가 아니라는 조건만으로는 전체 집합의 일차독립을 보장하지 않음을 구체적인 반례로 증명하시오.", ""),
                theorem(29, "종속집합에서 모든 벡터를 제거할 수 없는 경우", "일차종속인 집합이라도 모든 벡터가 각각 나머지 벡터들의 일차결합으로 표현되는 것은 아님을 구체적인 반례로 보이시오.", ""),
                theorem(30, "서로소인 두 독립집합의 합집합", "서로소인 일차독립 집합 \\(S,T\\)에 대하여 다음 동치가 성립함을 증명하시오.", "S\\cup T\\text{가 독립}\\iff\\operatorname{span}(S)\\cap\\operatorname{span}(T)=\\{0\\}"),
                theorem(31, "독립 합집합의 생성공간 교집합", "벡터집합 \\(S,T\\)에 대하여 \\(S\\cup T\\)가 일차독립이면 다음 등식이 성립함을 증명하시오.", "\\operatorname{span}(S)\\cap\\operatorname{span}(T)=\\operatorname{span}(S\\cap T)"),
                theorem(32, "두 독립집합의 합집합 판정", "각각 일차독립인 벡터집합 \\(S,T\\)에 대하여 다음 동치가 성립함을 증명하시오.", "S\\cup T\\text{가 독립}\\iff\\operatorname{span}(S)\\cap\\operatorname{span}(T)=\\operatorname{span}(S\\cap T)"),
            ]
        },
        {
            chapter: "12장. 벡터 변환과 독립·생성",
            theorems: [
                theorem(34, "독립집합의 비영 스칼라배", "일차독립인 벡터들 \\(v_1,\\ldots,v_n\\)과 0이 아닌 스칼라 \\(c_1,\\ldots,c_n\\)에 대하여 \\(c_1v_1,\\ldots,c_nv_n\\)도 일차독립임을 증명하시오.", ""),
                theorem(35, "비영 스칼라배와 생성공간", "벡터들 \\(v_1,\\ldots,v_n\\)과 0이 아닌 스칼라 \\(c_1,\\ldots,c_n\\)에 대하여 다음을 증명하시오.", "\\operatorname{span}(v_1,\\ldots,v_n)=\\operatorname{span}(c_1v_1,\\ldots,c_nv_n)"),
                theorem(36, "기본 벡터 치환과 생성공간", "벡터열에서 한 벡터 \\(v_i\\)를 \\(v_i+cv_j\\;(i\\ne j)\\)로 바꾸어도 생성공간이 변하지 않음을 증명하시오.", ""),
                theorem(37, "기본 벡터 치환과 독립성", "벡터열에서 한 벡터 \\(v_i\\)를 \\(v_i+cv_j\\;(i\\ne j)\\)로 바꾸기 전과 후의 일차독립 여부가 서로 동치임을 증명하시오.", ""),
                theorem(38, "합과 차로 만든 두 벡터", "두 벡터 \\(u,v\\)가 일차독립이면 \\(u+v,u-v\\)도 일차독립임을 증명하시오.", ""),
                theorem(39, "누적합 벡터열의 독립성", "\\(v_1,\\ldots,v_n\\)이 일차독립일 때 다음 벡터열도 일차독립임을 증명하시오.", "v_1,\\ v_1+v_2,\\ \\ldots,\\ v_1+\\cdots+v_n"),
                theorem(40, "연속차 벡터열의 독립성", "\\(v_1,\\ldots,v_n\\)이 일차독립일 때 다음 벡터열도 일차독립임을 증명하시오.", "v_1-v_2,\\ v_2-v_3,\\ \\ldots,\\ v_{n-1}-v_n,\\ v_n"),
                theorem(41, "한 벡터씩 제외한 합의 독립성", "\\(n\\ge2\\)이고 \\(v_1,\\ldots,v_n\\)이 일차독립이라 하자. \\(w_i=\\sum_{j\\ne i}v_j\\)로 정의할 때 \\(w_1,\\ldots,w_n\\)도 일차독립임을 증명하시오.", ""),
                theorem(42, "전치와 행렬의 일차독립", "크기가 같은 행렬들 \\(A_1,\\ldots,A_k\\)에 대하여 다음 동치가 성립함을 증명하시오.", "A_1,\\ldots,A_k\\text{가 독립}\\iff A_1^T,\\ldots,A_k^T\\text{가 독립}")
            ]
        },
        {
            chapter: "13장. 기저의 추출·확장·교환",
            theorems: [
                theorem(44, "유한 생성집합에서 기저 추출", "유한 생성집합 \\(S\\)는 그 부분집합 중 하나를 생성공간 \\(\\operatorname{span}(S)\\)의 기저로 가짐을 증명하시오.", ""),
                theorem(46, "대체정리", "\\(n\\)개의 벡터로 이루어진 생성집합 \\(G\\)와 \\(m\\)개의 벡터로 이루어진 일차독립 집합 \\(L\\)에 대하여 \\(m\\le n\\)이고, \\(G\\)에서 \\(n-m\\)개를 골라 \\(L\\)과 합치면 전체 공간을 생성하도록 할 수 있음을 증명하시오.", ""),
                theorem(47, "독립집합의 정해진 개수만큼 기저 확장", "\\(n\\)차원 벡터공간의 \\(m\\)개 일차독립 벡터 \\((m\\le n)\\)에 정확히 \\(n-m\\)개의 벡터를 추가하여 기저를 만들 수 있음을 증명하시오.", ""),
                theorem(48, "독립집합과 생성집합 사이의 기저", "유한차원 벡터공간 \\(V\\)에서 \\(L\\)은 일차독립이고 \\(S\\)는 생성집합이며 \\(L\\subseteq S\\)라 하자. 다음을 만족하는 기저 \\(B\\)가 존재함을 증명하시오.", "L\\subseteq B\\subseteq S"),
                theorem(49, "주어진 기저를 이용한 독립집합 확장", "유한차원 벡터공간의 기저 \\(B\\)와 임의의 일차독립 집합 \\(L\\)에 대하여, \\(B\\)의 일부 벡터를 \\(L\\)에 추가하여 기저를 만들 수 있음을 증명하시오. 단, \\(L\\subseteq B\\)는 가정하지 않는다.", ""),
                theorem(50, "기저에 임의의 비영벡터 삽입", "기저 \\(B=\\{b_1,\\ldots,b_n\\}\\)와 0이 아닌 벡터 \\(v\\)에 대하여, 어떤 \\(b_i\\)를 \\(v\\)로 바꾸면 다시 기저가 됨을 증명하시오.", ""),
                theorem(51, "좌표계수에 의한 기저벡터 치환 판정", "기저 \\(B=\\{b_1,\\ldots,b_n\\}\\)에 대해 \\(v=\\sum_{j=1}^n c_jb_j\\)라 하자. \\(b_i\\)를 \\(v\\)로 바꾼 집합이 기저일 필요충분조건을 증명하시오.", "(B - \\{b_i\\})\\cup\\{v\\}\\text{가 기저}\\iff c_i\\ne0"),
                theorem(52, "기저 교환정리", "같은 유한차원 공간의 두 기저 \\(B,C\\)와 임의의 \\(b\\in B - C\\)에 대하여, 어떤 \\(c\\in C - B\\)를 골라 \\((B - \\{b\\})\\cup\\{c\\}\\)가 기저가 되게 할 수 있음을 증명하시오.", ""),
                theorem(53, "대칭 기저 교환정리", "같은 유한차원 공간의 두 기저 \\(B,C\\)와 임의의 \\(b\\in B - C\\)에 대하여, 어떤 \\(c\\in C - B\\)가 존재하여 \\((B - \\{b\\})\\cup\\{c\\}\\)와 \\((C - \\{c\\})\\cup\\{b\\}\\)가 모두 기저가 됨을 증명하시오.", ""),
                theorem(54, "단일 교환으로 두 기저 연결하기", "유한차원 벡터공간의 임의의 두 기저는 매 단계에서 벡터 하나만 교환하고 모든 중간 집합을 기저로 유지하는 유한한 과정으로 서로 연결할 수 있음을 증명하시오.", ""),
                theorem(55, "극대 독립집합과 기저", "일차독립 집합 \\(B\\subseteq V\\)에 대하여 다음 동치가 성립함을 증명하시오.", "B\\text{가 기저}\\iff\\forall v\\in V - B,\\ B\\cup\\{v\\}\\text{는 종속}"),
                theorem(56, "극소 생성집합과 기저", "생성집합 \\(B\\subseteq V\\)에 대하여 다음 동치가 성립함을 증명하시오.", "B\\text{가 기저}\\iff\\forall b\\in B,\\ B - \\{b\\}\\text{는 }V\\text{를 생성하지 않음}")
            ]
        },
        {
            chapter: "14장. 차원과 부분공간의 구조",
            theorems: [
                theorem(64, "부분공간 사슬과 차원", "유한차원 벡터공간에서 부분공간의 엄격한 포함은 차원을 증가시킴을 보이고, \\(n\\)차원 공간의 진부분공간 사슬에서 엄격한 포함 단계가 \\(n\\)회를 넘을 수 없음을 증명하시오.", "W_0\\subsetneq W_1\\subsetneq\\cdots\\subsetneq W_r\\le V\\implies r\\le n"),
                theorem(65, "중간 차원의 부분공간", "\\(\\dim V=n\\), \\(W\\le V\\), \\(\\dim W=m\\)일 때, 모든 정수 \\(k\\) \\((m\\le k\\le n)\\)에 대하여 \\(W\\subseteq U\\subseteq V\\), \\(\\dim U=k\\)를 만족하는 부분공간 \\(U\\)가 존재함을 증명하시오.", ""),
                theorem(66, "유한집합이 생성하는 공간의 차원", "벡터집합 \\(S\\)가 \\(k\\)개의 원소를 가질 때 다음을 증명하시오.", "\\dim\\operatorname{span}(S)\\le k,\\qquad \\dim\\operatorname{span}(S)=k\\iff S\\text{가 독립}"),
                theorem(67, "벡터 하나를 추가할 때의 차원 변화", "유한차원 부분공간 \\(W\\le V\\)와 \\(v\\in V\\)에 대하여 다음을 증명하시오.", "\\dim\\operatorname{span}(W\\cup\\{v\\})=\\begin{cases}\\dim W,&v\\in W,\\\\\\dim W+1,&v\\notin W.\\end{cases}"),
                theorem(68, "교집합 차원과 포함관계", "유한차원 부분공간 \\(U,W\\le V\\)에 대하여 다음 동치가 성립함을 증명하시오.", "\\dim(U\\cap W)=\\dim U\\iff U\\subseteq W"),
            ]
        },
        {
            chapter: "15장. 다항식과 함수 공간",
            theorems: [
                theorem(73, "서로 다른 차수의 다항식", "0이 아닌 유한개의 다항식에서 서로 다른 두 다항식의 차수가 항상 다르면 일차독립임을 증명하시오.", ""),
                theorem(74, "차수가 순서대로 증가하는 다항식 기저", "\\(p_0,\\ldots,p_n\\in P_n\\)이 \\(\\deg p_i=i\\)를 만족할 때 \\(p_0,\\ldots,p_n\\)이 \\(P_n\\)의 기저임을 증명하시오.", ""),
                theorem(75, "이동된 단항식 기저", "임의의 실수 \\(a\\)에 대하여 다음 집합이 \\(P_n\\)의 기저임을 증명하시오.", "\\{1,(x-a),(x-a)^2,\\ldots,(x-a)^n\\}"),
                theorem(76, "한 점에서 0이 되는 다항식 공간", "\\(n\\ge1\\)이고 \\(a\\)가 고정된 실수일 때, \\(W=\\{p\\in P_n:p(a)=0\\}\\)가 부분공간임을 보이고 그 기저와 차원을 구하여 증명하시오.", "W=\\operatorname{span}\\{(x-a),(x-a)^2,\\ldots,(x-a)^n\\},\\quad\\dim W=n"),
                theorem(77, "서로 다른 여러 점에서 0이 되는 다항식 공간", "서로 다른 실수 \\(a_1,\\ldots,a_k\\)에 대하여 \\(W=\\{p\\in P_n:p(a_i)=0\\ (1\\le i\\le k)\\}\\)라 할 때 다음을 증명하시오.", "\\dim W=\\max(0,n+1-k)"),
                theorem(78, "한 점에서 고계까지 소멸하는 다항식", "\\(1\\le k\\le n\\)이고 \\(W=\\{p\\in P_n:p(a)=p'(a)=\\cdots=p^{(k-1)}(a)=0\\}\\)라 할 때, \\(W\\)의 기저와 차원을 구하여 증명하시오.", "W=\\operatorname{span}\\{(x-a)^k,\\ldots,(x-a)^n\\},\\quad\\dim W=n+1-k"),
                theorem(79, "다항식과 도함수로 이루어진 기저", "정확히 \\(n\\)차인 다항식 \\(f\\)에 대하여 다음 집합이 \\(P_n\\)의 기저임을 증명하시오.", "\\{f,f',\\ldots,f^{(n)}\\}"),
                theorem(80, "다항식의 값에 의한 유일성", "\\(p,q\\in P_n\\)이 서로 다른 \\(n+1\\)개의 점 \\(a_0,\\ldots,a_n\\)에서 같은 값을 가지면 \\(p=q\\)임을 증명하시오.", ""),
                theorem(81, "다항식 보간의 존재와 유일성", "서로 다른 실수 \\(a_0,\\ldots,a_n\\)과 임의의 실수 \\(y_0,\\ldots,y_n\\)에 대하여 \\(p(a_i)=y_i\\)를 모두 만족하는 \\(p\\in P_n\\)이 유일하게 존재함을 증명하시오.", ""),
                theorem(82, "라그랑주 기본다항식의 기저성", "서로 다른 실수 \\(a_0,\\ldots,a_n\\)에 대하여 \\(L_i(a_j)=\\delta_{ij}\\)를 만족하는 라그랑주 기본다항식 \\(L_0,\\ldots,L_n\\)이 \\(P_n\\)의 기저임을 증명하시오.", ""),
                theorem(83, "에르미트 보간의 존재와 유일성", "서로 다른 점 \\(a_1,\\ldots,a_s\\)에서 각각 \\(m_i\\)개의 도함숫값 \\(p^{(r)}(a_i)\\;(0\\le r<m_i)\\)가 임의로 주어졌다고 하자. \\(N=\\sum_{i=1}^s m_i\\)일 때, 이 조건들을 만족하는 차수 \\(N-1\\) 이하의 다항식이 유일하게 존재함을 증명하시오.", ""),
                theorem(84, "함숫값 행렬에 의한 일차독립 판정", "함수 \\(f_1,\\ldots,f_n\\)과 점 \\(t_1,\\ldots,t_n\\)이 \\(f_i(t_j)=\\delta_{ij}\\)를 만족할 때, \\(f_1,\\ldots,f_n\\)이 일차독립임을 증명하시오.", ""),
                theorem(85, "도함수의 독립성과 원함수의 독립성", "실수 전체에서 정의된 미분가능한 함수 \\(f_1,\\ldots,f_n\\)에 대하여 도함수들 \\(f_1',\\ldots,f_n'\\)이 일차독립이면 원함수들도 일차독립임을 증명하고, 그 역은 일반적으로 거짓임을 반례로 보이시오.", ""),
                theorem(86, "서로 다른 지수의 지수함수", "서로 다른 실수 \\(a_1,\\ldots,a_n\\)에 대하여 함수 \\(e^{a_1x},\\ldots,e^{a_nx}\\)가 일차독립임을 증명하시오.", "")
            ]
        }
    ];

    window.proofTheorems = window.proofTheorems || [];
    const additions = chapters.flatMap((chapter) => chapter.theorems);
    const chapter6 = window.proofTheorems[5];
    const chapter7 = window.proofTheorems[6];
    const chapter8 = window.proofTheorems[7];

    additions.forEach((item) => {
        let target;
        let prefix;

        if (item.sourceNum <= 19) {
            target = chapter6;
            prefix = "6";
        } else if ((item.sourceNum >= 64 && item.sourceNum <= 72) ||
                   (item.sourceNum >= 76 && item.sourceNum <= 78)) {
            target = chapter8;
            prefix = "8";
        } else {
            target = chapter7;
            prefix = "7";
        }

        item.num = `${prefix}.${target.theorems.length + 1}`;
        target.theorems.push(item);
    });
})();
