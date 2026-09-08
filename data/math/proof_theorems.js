window.proofTheorems = [
    {
        "chapter": "1장. 행렬의 연산과 대수적 성질",
        "theorems": [
            {
                "num": "1.1",
                "title": "행렬 곱의 결합법칙 (Associative Law)",
                "hypothesis": "임의의 행렬 \\(A\\) (\\(m\\times n\\)), \\(B\\) (\\(n\\times p\\)), \\(C\\) (\\(p\\times q\\))에 대하여 다음이 성립함을 증명하시오.",
                "statement": "A(BC) = (AB)C"
            },
            {
                "num": "1.2",
                "title": "곱의 전치 공식 (Transpose of Product)",
                "hypothesis": "임의의 행렬 \\(A\\) (\\(m\\times n\\)), \\(B\\) (\\(n\\times p\\))에 대하여 다음이 성립함을 증명하시오.",
                "statement": "(AB)^T = B^T A^T"
            },
            {
                "num": "1.3",
                "title": "기본행렬의 가역성",
                "hypothesis": "모든 기본행렬(Elementary Matrix) \\(E\\)는 가역이며, 그 역행렬 \\(E^{-1}\\) 또한 동일한 유형의 기본행렬임을 증명하시오.",
                "statement": ""
            },
            {
                "num": "1.4",
                "title": "행렬 덧셈의 교환·결합법칙",
                "hypothesis": "크기가 같은 세 행렬 \\(A, B, C\\)에 대하여 다음이 성립함을 증명하시오.",
                "statement": "A+B = B+A, \\quad (A+B)+C = A+(B+C)"
            },
            {
                "num": "1.5",
                "title": "스칼라배의 분배법칙",
                "hypothesis": "행렬 \\(A, B\\)와 스칼라 \\(k, l\\)에 대하여 다음이 성립함을 증명하시오.",
                "statement": "k(A+B) = kA+kB, \\quad (k+l)A = kA+lA"
            },
            {
                "num": "1.6",
                "title": "행렬 곱셈의 분배법칙",
                "hypothesis": "곱셈이 정의되는 행렬 \\(A, B, C\\)에 대하여 다음이 성립함을 증명하시오.",
                "statement": "A(B+C) = AB+AC, \\quad (A+B)C = AC+BC"
            },
            {
                "num": "1.7",
                "title": "전치행렬의 기본 성질",
                "hypothesis": "행렬 \\(A, B\\)와 스칼라 \\(k\\)에 대하여 다음이 성립함을 증명하시오.",
                "statement": "(A^T)^T = A, \\quad (A+B)^T = A^T+B^T, \\quad (kA)^T = kA^T"
            },
            {
                "num": "1.8",
                "title": "단위행렬의 항등원 성질",
                "hypothesis": "\\(m\\times n\\) 행렬 \\(A\\)와 크기가 맞는 단위행렬 \\(I\\)에 대하여 다음이 성립함을 증명하시오.",
                "statement": "IA = A, \\quad AI = A"
            },
            {
                "num": "1.9",
                "title": "행렬 곱셈의 비교환성",
                "hypothesis": "행렬의 곱셈은 일반적으로 교환법칙이 성립하지 않는다. \\(AB \\neq BA\\)가 되는 \\(2\\times 2\\) 행렬 \\(A, B\\)의 반례(counterexample)를 하나 제시하여 증명하시오.",
                "statement": "AB \\neq BA"
            },
            {
                "num": "1.10",
                "title": "스칼라배와 행렬 곱의 결합",
                "hypothesis": "행렬 \\(A, B\\)와 스칼라 \\(k\\)에 대하여 다음이 성립함을 증명하시오.",
                "statement": "k(AB) = (kA)B = A(kB)"
            }
        ]
    },
    {
        "chapter": "2장. 역행렬의 성질과 동치정리",
        "theorems": [
            {
                "num": "2.1",
                "title": "역행렬의 유일성",
                "hypothesis": "정사각행렬 \\(A\\)가 가역이면, \\(AB=BA=I\\)를 만족하는 행렬 \\(B\\)는 오직 유일하게 존재함을 증명하시오.",
                "statement": ""
            },
            {
                "num": "2.2",
                "title": "곱의 역행렬 공식",
                "hypothesis": "같은 크기의 가역행렬 \\(A, B\\)에 대하여 다음이 성립함을 증명하시오. (나아가 임의의 \\(k\\)개 가역행렬로 일반화하시오.)",
                "statement": "(AB)^{-1} = B^{-1}A^{-1}"
            },
            {
                "num": "2.3",
                "title": "스칼라배의 역행렬 공식",
                "hypothesis": "가역행렬 \\(A\\)와 0이 아닌 상수 \\(k\\)에 대하여 다음이 성립함을 증명하시오.",
                "statement": "(kA)^{-1} = \\frac{1}{k}A^{-1}"
            },
            {
                "num": "2.4",
                "title": "전치행렬의 역행렬 공식",
                "hypothesis": "가역행렬 \\(A\\)에 대하여 다음이 성립함을 증명하시오.",
                "statement": "(A^T)^{-1} = (A^{-1})^T"
            },
            {
                "num": "2.5",
                "title": "가역행렬 동치정리 (Invertible Matrix Theorem)",
                "hypothesis": "\\(n\\times n\\) 정사각행렬 \\(A\\)에 대하여 다음 네 명제가 모두 동치임을 증명하시오: (a) \\(A\\)는 가역이다. (b) \\(Ax=0\\)은 자명해만을 갖는다. (c) \\(A\\)의 기약 행사다리꼴은 \\(I_n\\)이다. (d) \\(A\\)는 기본행렬들의 곱으로 나타낼 수 있다.",
                "statement": ""
            },
            {
                "num": "2.6",
                "title": "역행렬의 역행렬",
                "hypothesis": "가역행렬 \\(A\\)에 대하여 다음이 성립함을 증명하시오.",
                "statement": "(A^{-1})^{-1} = A"
            },
            {
                "num": "2.7",
                "title": "가역행렬의 거듭제곱의 역행렬",
                "hypothesis": "가역행렬 \\(A\\)와 자연수 \\(n\\)에 대하여 다음이 성립함을 증명하시오.",
                "statement": "(A^n)^{-1} = (A^{-1})^n"
            },
            {
                "num": "2.8",
                "title": "영행·영열을 갖는 행렬의 비가역성",
                "hypothesis": "정사각행렬 \\(A\\)가 모든 성분이 0인 행 또는 열을 하나라도 가지면, \\(A\\)는 비가역(특이행렬)임을 증명하시오.",
                "statement": ""
            },
            {
                "num": "2.9",
                "title": "가역행렬의 소거법칙 (Cancellation Law)",
                "hypothesis": "\\(A\\)가 가역행렬일 때, \\(AB=AC\\)이면 \\(B=C\\)이고, \\(BA=CA\\)이면 \\(B=C\\)임을 증명하시오.",
                "statement": "AB=AC \\implies B=C, \\quad BA=CA \\implies B=C"
            }
        ]
    },
    {
        "chapter": "3장. 삼각행렬·대칭행렬의 대수적 구조",
        "theorems": [
            {
                "num": "3.1",
                "title": "상삼각행렬의 곱셈 보존",
                "hypothesis": "동일한 크기의 두 상삼각행렬 \\(A, B\\)의 곱 \\(AB\\) 또한 상삼각행렬임을 증명하시오.",
                "statement": ""
            },
            {
                "num": "3.2",
                "title": "하삼각행렬의 곱셈 보존",
                "hypothesis": "동일한 크기의 두 하삼각행렬 \\(A, B\\)의 곱 \\(AB\\) 또한 하삼각행렬임을 증명하시오.",
                "statement": ""
            },
            {
                "num": "3.3",
                "title": "가역 삼각행렬의 역행렬 형태 보존",
                "hypothesis": "가역인 상삼각행렬의 역행렬은 상삼각행렬이고, 가역인 하삼각행렬의 역행렬은 하삼각행렬임을 증명하시오.",
                "statement": ""
            },
            {
                "num": "3.4",
                "title": "가역 대칭행렬의 역행렬",
                "hypothesis": "가역행렬 \\(A\\)가 대칭행렬(\\(A=A^T\\))이면, 그 역행렬 \\(A^{-1}\\) 또한 대칭행렬임을 증명하시오.",
                "statement": ""
            },
            {
                "num": "3.5",
                "title": "대칭 및 반대칭 성분 유일 분해",
                "hypothesis": "임의의 정사각행렬 \\(A\\)는 대칭행렬 \\(S\\)와 반대칭행렬 \\(K\\)의 합으로 유일하게 분해됨을 증명하시오.",
                "statement": "S = \\frac{1}{2}(A+A^T), \\quad K = \\frac{1}{2}(A-A^T)"
            },
            {
                "num": "3.6",
                "title": "대칭행렬의 합·차·스칼라배",
                "hypothesis": "크기가 같은 두 대칭행렬 \\(A, B\\)와 임의의 스칼라 \\(k\\)에 대하여, \\(A+B\\), \\(A-B\\), \\(kA\\)가 모두 대칭행렬임을 증명하시오.",
                "statement": "(A+B)^T = A+B, \\quad (A-B)^T = A-B, \\quad (kA)^T = kA"
            },
            {
                "num": "3.7",
                "title": "대칭행렬 곱의 대칭 조건",
                "hypothesis": "두 대칭행렬 \\(A, B\\)에 대하여, \\(AB\\)가 대칭행렬일 필요충분조건이 \\(AB=BA\\)임을 증명하시오.",
                "statement": "(AB)^T = AB \\iff AB=BA"
            },
            {
                "num": "3.8",
                "title": "가역 대각행렬의 역행렬",
                "hypothesis": "대각행렬 \\(D=\\operatorname{diag}(d_1,\\ldots,d_n)\\)의 모든 대각원소가 0이 아니면 \\(D\\)는 가역이고, 그 역행렬이 다음과 같음을 증명하시오.",
                "statement": "D^{-1} = \\operatorname{diag}\\left(\\frac{1}{d_1},\\ldots,\\frac{1}{d_n}\\right)"
            },
            {
                "num": "3.9",
                "title": "대각행렬의 거듭제곱",
                "hypothesis": "대각행렬 \\(D=\\operatorname{diag}(d_1,\\ldots,d_n)\\)과 자연수 \\(k\\)에 대하여 다음이 성립함을 증명하시오.",
                "statement": "D^k = \\operatorname{diag}(d_1^k,\\ldots,d_n^k)"
            },
            {
                "num": "3.10",
                "title": "대각행렬끼리의 곱",
                "hypothesis": "두 대각행렬 \\(D_1=\\operatorname{diag}(d_1,\\ldots,d_n)\\), \\(D_2=\\operatorname{diag}(e_1,\\ldots,e_n)\\)에 대하여 다음이 성립함을 증명하시오.",
                "statement": "D_1 D_2 = \\operatorname{diag}(d_1e_1,\\ldots,d_ne_n)"
            }
        ]
    },
    {
        "chapter": "4장. 행렬식의 계산과 성질",
        "theorems": [
            {
                "num": "4.1",
                "title": "전치 행렬식의 불변성",
                "hypothesis": "임의의 \\(n\\times n\\) 정사각행렬 \\(A\\)에 대하여 다음이 성립함을 증명하시오.",
                "statement": "\\det(A^T) = \\det(A)"
            },
            {
                "num": "4.2",
                "title": "기본행연산에 따른 행렬식 변화",
                "hypothesis": "행렬 \\(A\\)에 세 가지 기본행연산 — 두 행 교환, 한 행에 \\(k\\)배, 한 행의 배수를 다른 행에 더하기 — 을 각각 가했을 때 행렬식이 어떻게 변하는지 증명하시오.",
                "statement": ""
            },
            {
                "num": "4.3",
                "title": "삼각행렬의 행렬식 공식",
                "hypothesis": "임의의 삼각행렬(상삼각 또는 하삼각) \\(T\\)의 행렬식은 주대각원소들의 곱과 같음을 증명하시오.",
                "statement": "\\det(T) = t_{11} \\cdot t_{22} \\cdots t_{nn}"
            },
            {
                "num": "4.4",
                "title": "스칼라배 행렬의 행렬식",
                "hypothesis": "\\(n\\times n\\) 정사각행렬 \\(A\\)와 스칼라 \\(k\\)에 대하여 다음이 성립함을 증명하시오.",
                "statement": "\\det(kA) = k^n \\det(A)"
            },
            {
                "num": "4.5",
                "title": "영행 또는 영열을 갖는 행렬의 행렬식",
                "hypothesis": "정사각행렬 \\(A\\)가 모든 성분이 0인 행 또는 열을 하나라도 가지면, 그 행렬식은 0임을 증명하시오.",
                "statement": "\\det(A) = 0"
            },
            {
                "num": "4.6",
                "title": "두 행(열)이 같은 행렬의 행렬식",
                "hypothesis": "정사각행렬 \\(A\\)의 서로 다른 두 행(또는 두 열)이 완전히 동일하면, 그 행렬식은 0임을 증명하시오.",
                "statement": "\\det(A) = 0"
            },
            {
                "num": "4.7",
                "title": "한 행(열)이 다른 행(열)의 스칼라배인 행렬의 행렬식",
                "hypothesis": "정사각행렬 \\(A\\)의 한 행(또는 열)이 다른 한 행(또는 열)의 스칼라배이면, 그 행렬식은 0임을 증명하시오.",
                "statement": "\\det(A) = 0"
            }
        ]
    },
    {
        "chapter": "5장. 행렬식의 성질과 활용",
        "theorems": [
            {
                "num": "5.1",
                "title": "곱의 행렬식 분배 정리",
                "hypothesis": "임의의 \\(n\\times n\\) 정사각행렬 \\(A, B\\)에 대하여 다음이 성립함을 증명하시오.",
                "statement": "\\det(AB) = \\det(A)\\det(B)"
            },
            {
                "num": "5.2",
                "title": "역행렬의 행렬식 공식",
                "hypothesis": "가역행렬 \\(A\\)에 대하여 다음이 성립함을 증명하시오.",
                "statement": "\\det(A^{-1}) = \\frac{1}{\\det(A)}"
            },
            {
                "num": "5.3",
                "title": "수반행렬 공식",
                "hypothesis": "임의의 \\(n\\times n\\) 정사각행렬 \\(A\\)에 대하여 다음이 성립함을 증명하시오.",
                "statement": "A \\cdot \\operatorname{adj}(A) = \\operatorname{adj}(A) \\cdot A = \\det(A)\\, I_n"
            },
            {
                "num": "5.4",
                "title": "크래머 공식 (Cramer's Rule)",
                "hypothesis": "\\(Ax=b\\)가 \\(n\\)개의 미지수를 갖는 \\(n\\)차 연립방정식이고 \\(A\\)가 가역행렬일 때, \\(i\\)번째 미지수의 해가 다음과 같음을 증명하시오. (단 \\(A_i\\)는 \\(A\\)의 제 \\(i\\)열을 \\(b\\)로 교체한 행렬)",
                "statement": "x_i = \\frac{\\det(A_i)}{\\det(A)}"
            },
            {
                "num": "5.5",
                "title": "det(A)≠0과 연립방정식의 유일해",
                "hypothesis": "\\(n\\times n\\) 정사각행렬 \\(A\\)에 대하여 \\(\\det(A)\\neq 0\\)이면, 연립방정식 \\(Ax=b\\)가 임의의 \\(b\\)에 대해 유일한 해를 가짐을 증명하시오.",
                "statement": ""
            },
            {
                "num": "5.6",
                "title": "곱이 가역이면 각 인수도 가역",
                "hypothesis": "같은 크기의 정사각행렬 \\(A, B\\)에 대하여, 곱 \\(AB\\)가 가역이면 \\(A\\)와 \\(B\\)가 각각 가역임을 증명하시오.",
                "statement": ""
            }
        ]
    }
];
