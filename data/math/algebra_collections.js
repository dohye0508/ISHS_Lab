window.algebraCollections = [
    {
        "id": "alg_col_1",
        "name": "행렬과 연립일차방정식 1",
        "problems": [
            {
                "level": 1,
                "template": "sys_unique",
                "latex": "\\text{가우스 소거법을 이용하여 다음 연립일차방정식의 해를 구하시오 (첨가행렬 } [A|B] \\text{ 를 기약 행사다리꼴로 변형하시오): } \\begin{cases}x + y = 0\\\\2 x + 4 y = -10\\end{cases}",
                "solution": "\\begin{pmatrix}5\\\\-5\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "mat_inverse",
                "latex": "\\text{첨가행렬 } [A|I] \\text{ 에 기본 행연산을 적용하여 다음 행렬 } A \\text{ 의 역행렬을 구하시오: } A=\\begin{pmatrix}-1 & -1\\\\-1 & 0\\end{pmatrix}",
                "solution": "\\begin{pmatrix}0 & -1\\\\-1 & 1\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "sys_elem_matrix",
                "latex": "\\text{연립일차방정식을 첨가행렬 } M \\text{ 로 나타내고, 기본 행연산에 대응하는 기본행렬 } E_1, E_2, \\ldots \\text{ 을 차례로 곱하는 과정을 통해 해를 구하시오: } \\begin{cases}5 x + y + z = 26\\\\- 3 x + y + 2 z = -1\\\\2 x + 5 y + 3 z = 28\\end{cases}",
                "solution": "\\begin{pmatrix}4\\\\1\\\\5\\end{pmatrix}"
            },
            {
                "level": 3,
                "template": "rref_interpret",
                "latex": "\\text{연립일차방정식을 행렬로 나타내고 가우스 소거법을 이용하여 다음과 같은 행렬을 얻었을 때, } \\text{주어진 연립일차방정식의 해를 구하시오 (해가 무수히 많으면 자유변수를 } t \\text{ 로 두고, 해가 없으면 \"포기\" 버튼을 이용하시오): } \\begin{pmatrix}1 & 3 & 1\\\\0 & 1 & -1\\\\0 & 0 & 0\\end{pmatrix}\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix} = \\begin{pmatrix}-1\\\\-2\\\\1\\end{pmatrix}",
                "solution": "해없음"
            },
            {
                "level": 3,
                "template": "mat_P_transform",
                "latex": "\\text{행렬 } A \\text{ 를 가우스 소거법을 이용하여 단위행렬로 변형하고, } PA=I \\text{ 를 만족시키는 행렬 } P \\text{ 를 기본행렬의 곱으로 나타내시오: } A=\\begin{pmatrix}5 & 1\\\\-1 & 0\\end{pmatrix}",
                "solution": "\\begin{pmatrix}0 & -1\\\\1 & 5\\end{pmatrix}"
            },
            {
                "level": 1,
                "template": "minor_cofactor",
                "latex": "\\text{다음 } 3\\times 3 \\text{ 행렬 } A \\text{ 에서 원소 } a_{31} \\text{ 의 소행렬식 } M_{31} \\text{ 과 여인수 } C_{31} \\text{ 를 차례로 구하시오 (답은 } M_{31}, C_{31} \\text{ 순서의 } 2\\times 1 \\text{ 벡터로 입력하시오): } A=\\begin{pmatrix}-5 & -6 & 1\\\\-6 & 11 & 7\\\\-5 & 2 & -4\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-53\\\\-53\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "det_cofactor_expand",
                "latex": "\\text{제 1행에 대한 여인수 전개를 이용하여 다음 } 3\\times 3 \\text{ 행렬 } A \\text{ 의 행렬식 } \\det(A) \\text{ 를 계산하시오: } A=\\begin{pmatrix}-3 & 3 & 8\\\\1 & 3 & -8\\\\-1 & 3 & -7\\end{pmatrix}",
                "solution": "84"
            },
            {
                "level": 2,
                "template": "det_properties",
                "latex": "2\\times 2 \\text{ 정사각행렬 } A \\text{ 에 대하여 } \\det(A)=-9 \\text{ 일 때, } \\det(-4A) \\text{ 의 값을 구하시오: }",
                "solution": "-144"
            },
            {
                "level": 2,
                "template": "adjoint_matrix",
                "latex": "\\text{다음 행렬 } A \\text{ 의 여인수행렬을 구하고, 이를 전치하여 딸림행렬(수반행렬) } \\operatorname{adj}(A) \\text{ 를 구하시오: } A=\\begin{pmatrix}-3 & -5 & 4\\\\4 & -5 & -8\\\\0 & -6 & -5\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-23 & -49 & 60\\\\20 & 15 & -8\\\\-24 & -18 & 35\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "cramer_single_var",
                "latex": "\\text{크래머 공식(Cramer's Rule)을 적용하여 다음 연립방정식의 미지수 } x \\text{ 의 값을 구하시오: } \\begin{cases}- 2 x + 2 y - 3 z = 1\\\\- x + 2 y - 7 z = -11\\\\7 x - 5 z = -15\\end{cases}",
                "solution": "0"
            }
        ]
    },
    {
        "id": "alg_col_2",
        "name": "행렬과 연립일차방정식 2",
        "problems": [
            {
                "level": 1,
                "template": "sys_unique",
                "latex": "\\text{가우스 소거법을 이용하여 다음 연립일차방정식의 해를 구하시오 (첨가행렬 } [A|B] \\text{ 를 기약 행사다리꼴로 변형하시오): } \\begin{cases}- 2 x - 4 y = -16\\\\x + 5 y = 14\\end{cases}",
                "solution": "\\begin{pmatrix}4\\\\2\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "mat_inverse",
                "latex": "\\text{첨가행렬 } [A|I] \\text{ 에 기본 행연산을 적용하여 다음 행렬 } A \\text{ 의 역행렬을 구하시오: } A=\\begin{pmatrix}3 & -3 & 4\\\\0 & -1 & 1\\\\2 & -3 & 4\\end{pmatrix}",
                "solution": "\\begin{pmatrix}1 & 0 & -1\\\\-2 & -4 & 3\\\\-2 & -3 & 3\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "sys_elem_matrix",
                "latex": "\\text{연립일차방정식을 첨가행렬 } M \\text{ 로 나타내고, 기본 행연산에 대응하는 기본행렬 } E_1, E_2, \\ldots \\text{ 을 차례로 곱하는 과정을 통해 해를 구하시오: } \\begin{cases}- 3 x + y + 2 z = 19\\\\3 x + 5 y + z = -22\\\\5 x + 2 y + z = -31\\end{cases}",
                "solution": "\\begin{pmatrix}-6\\\\-1\\\\1\\end{pmatrix}"
            },
            {
                "level": 3,
                "template": "rref_interpret",
                "latex": "\\text{연립일차방정식을 행렬로 나타내고 가우스 소거법을 이용하여 다음과 같은 행렬을 얻었을 때, } \\text{주어진 연립일차방정식의 해를 구하시오 (해가 무수히 많으면 자유변수를 } t \\text{ 로 두고, 해가 없으면 \"포기\" 버튼을 이용하시오): } \\begin{pmatrix}1 & 1 & 0\\\\0 & 1 & 1\\\\0 & 0 & 0\\end{pmatrix}\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix} = \\begin{pmatrix}-3\\\\4\\\\4\\end{pmatrix}",
                "solution": "해없음"
            },
            {
                "level": 3,
                "template": "mat_P_transform",
                "latex": "\\text{행렬 } A \\text{ 를 가우스 소거법을 이용하여 단위행렬로 변형하고, } PA=I \\text{ 를 만족시키는 행렬 } P \\text{ 를 기본행렬의 곱으로 나타내시오: } A=\\begin{pmatrix}-2 & -1\\\\1 & 0\\end{pmatrix}",
                "solution": "\\begin{pmatrix}0 & 1\\\\-1 & -2\\end{pmatrix}"
            },
            {
                "level": 1,
                "template": "minor_cofactor",
                "latex": "\\text{다음 } 3\\times 3 \\text{ 행렬 } A \\text{ 에서 원소 } a_{33} \\text{ 의 소행렬식 } M_{33} \\text{ 과 여인수 } C_{33} \\text{ 를 차례로 구하시오 (답은 } M_{33}, C_{33} \\text{ 순서의 } 2\\times 1 \\text{ 벡터로 입력하시오): } A=\\begin{pmatrix}11 & -5 & -6\\\\-2 & -12 & 5\\\\-4 & 4 & -1\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-142\\\\-142\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "det_cofactor_expand",
                "latex": "\\text{제 1열에 대한 여인수 전개를 이용하여 다음 } 3\\times 3 \\text{ 행렬 } A \\text{ 의 행렬식 } \\det(A) \\text{ 를 계산하시오: } A=\\begin{pmatrix}3 & 3 & -6\\\\-6 & -8 & 6\\\\-6 & 7 & 1\\end{pmatrix}",
                "solution": "300"
            },
            {
                "level": 2,
                "template": "det_properties",
                "latex": "4\\times 4 \\text{ 정사각행렬 } A \\text{ 에 대하여 } \\det(A)=-4 \\text{ 일 때, } \\det(A^{-1}) \\text{ 의 값을 구하시오: }",
                "solution": "-\\frac{1}{4}"
            },
            {
                "level": 2,
                "template": "adjoint_matrix",
                "latex": "\\text{다음 행렬 } A \\text{ 의 여인수행렬을 구하고, 이를 전치하여 딸림행렬(수반행렬) } \\operatorname{adj}(A) \\text{ 를 구하시오: } A=\\begin{pmatrix}-5 & -3 & 8\\\\2 & -7 & -8\\\\-5 & 6 & -4\\end{pmatrix}",
                "solution": "\\begin{pmatrix}76 & 36 & 80\\\\48 & 60 & -24\\\\-23 & 45 & 41\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "cramer_single_var",
                "latex": "\\text{크래머 공식(Cramer's Rule)을 적용하여 다음 연립방정식의 미지수 } y \\text{ 의 값을 구하시오: } \\begin{cases}- 2 x + 2 y + 8 z = -84\\\\2 x - 3 y - 6 z = 69\\\\6 x + y + 3 z = 29\\end{cases}",
                "solution": "-1"
            }
        ]
    },
    {
        "id": "alg_col_3",
        "name": "행렬과 연립일차방정식 3",
        "problems": [
            {
                "level": 1,
                "template": "sys_unique",
                "latex": "\\text{가우스 소거법을 이용하여 다음 연립일차방정식의 해를 구하시오 (첨가행렬 } [A|B] \\text{ 를 기약 행사다리꼴로 변형하시오): } \\begin{cases}4 x - 3 y + 5 z = 12\\\\2 x + 3 y - 2 z = 24\\\\3 x - y - 3 z = 3\\end{cases}",
                "solution": "\\begin{pmatrix}5\\\\6\\\\2\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "mat_inverse",
                "latex": "\\text{첨가행렬 } [A|I] \\text{ 에 기본 행연산을 적용하여 다음 행렬 } A \\text{ 의 역행렬을 구하시오: } A=\\begin{pmatrix}1 & 0\\\\-3 & -1\\end{pmatrix}",
                "solution": "\\begin{pmatrix}1 & 0\\\\-3 & -1\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "sys_elem_matrix",
                "latex": "\\text{연립일차방정식을 첨가행렬 } M \\text{ 로 나타내고, 기본 행연산에 대응하는 기본행렬 } E_1, E_2, \\ldots \\text{ 을 차례로 곱하는 과정을 통해 해를 구하시오: } \\begin{cases}3 x - 2 y = -7\\\\- 4 x = 20\\end{cases}",
                "solution": "\\begin{pmatrix}-5\\\\-4\\end{pmatrix}"
            },
            {
                "level": 3,
                "template": "rref_interpret",
                "latex": "\\text{연립일차방정식을 행렬로 나타내고 가우스 소거법을 이용하여 다음과 같은 행렬을 얻었을 때, } \\text{주어진 연립일차방정식의 해를 구하시오 (해가 무수히 많으면 자유변수를 } t \\text{ 로 두고, 해가 없으면 \"포기\" 버튼을 이용하시오): } \\begin{pmatrix}1 & -4 & 1\\\\0 & 1 & -4\\\\0 & 0 & 0\\end{pmatrix}\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix} = \\begin{pmatrix}-1\\\\1\\\\-4\\end{pmatrix}",
                "solution": "해없음"
            },
            {
                "level": 3,
                "template": "mat_P_transform",
                "latex": "\\text{행렬 } A \\text{ 를 가우스 소거법을 이용하여 단위행렬로 변형하고, } PA=I \\text{ 를 만족시키는 행렬 } P \\text{ 를 기본행렬의 곱으로 나타내시오: } A=\\begin{pmatrix}2 & 6 & -3\\\\2 & 5 & -2\\\\1 & 3 & -1\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-1 & 3 & -3\\\\0 & -1 & 2\\\\-1 & 0 & 2\\end{pmatrix}"
            },
            {
                "level": 1,
                "template": "minor_cofactor",
                "latex": "\\text{다음 } 3\\times 3 \\text{ 행렬 } A \\text{ 에서 원소 } a_{12} \\text{ 의 소행렬식 } M_{12} \\text{ 과 여인수 } C_{12} \\text{ 를 차례로 구하시오 (답은 } M_{12}, C_{12} \\text{ 순서의 } 2\\times 1 \\text{ 벡터로 입력하시오): } A=\\begin{pmatrix}8 & -4 & 1\\\\10 & -12 & 3\\\\-1 & 6 & -10\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-97\\\\97\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "det_cofactor_expand",
                "latex": "\\text{제 1행에 대한 여인수 전개를 이용하여 다음 } 3\\times 3 \\text{ 행렬 } A \\text{ 의 행렬식 } \\det(A) \\text{ 를 계산하시오: } A=\\begin{pmatrix}0 & -6 & 0\\\\5 & 7 & -8\\\\-2 & 0 & -6\\end{pmatrix}",
                "solution": "-276"
            },
            {
                "level": 2,
                "template": "det_properties",
                "latex": "4\\times 4 \\text{ 정사각행렬 } A \\text{ 에 대하여 } \\det(A)=-4 \\text{ 일 때, } \\det(A^{2}) \\text{ 의 값을 구하시오: }",
                "solution": "16"
            },
            {
                "level": 2,
                "template": "adjoint_matrix",
                "latex": "\\text{다음 행렬 } A \\text{ 의 여인수행렬을 구하고, 이를 전치하여 딸림행렬(수반행렬) } \\operatorname{adj}(A) \\text{ 를 구하시오: } A=\\begin{pmatrix}2 & -5 & 1\\\\8 & -7 & -6\\\\-7 & -8 & 2\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-62 & 2 & 37\\\\26 & 11 & 20\\\\-113 & 51 & 26\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "cramer_single_var",
                "latex": "\\text{크래머 공식(Cramer's Rule)을 적용하여 다음 연립방정식의 미지수 } z \\text{ 의 값을 구하시오: } \\begin{cases}- 7 x + 4 y - z = -21\\\\7 x + y + z = 41\\\\- x + 7 y + 4 z = 2\\end{cases}",
                "solution": "-5"
            }
        ]
    },
    {
        "id": "alg_col_4",
        "name": "행렬과 연립일차방정식 4",
        "problems": [
            {
                "level": 1,
                "template": "sys_unique",
                "latex": "\\text{가우스 소거법을 이용하여 다음 연립일차방정식의 해를 구하시오 (첨가행렬 } [A|B] \\text{ 를 기약 행사다리꼴로 변형하시오): } \\begin{cases}x - 3 y - z = -13\\\\2 x - 2 y + 3 z = 5\\\\- 4 x - 3 y - 4 z = -32\\end{cases}",
                "solution": "\\begin{pmatrix}2\\\\4\\\\3\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "mat_inverse",
                "latex": "\\text{첨가행렬 } [A|I] \\text{ 에 기본 행연산을 적용하여 다음 행렬 } A \\text{ 의 역행렬을 구하시오 (역행렬이 존재하지 않으면 \"포기\" 버튼을 이용하시오): } A=\\begin{pmatrix}-4 & -3 & -2\\\\5 & -3 & -3\\\\3 & 9 & 7\\end{pmatrix}",
                "solution": "역행렬없음"
            },
            {
                "level": 2,
                "template": "sys_elem_matrix",
                "latex": "\\text{연립일차방정식을 첨가행렬 } M \\text{ 로 나타내고, 기본 행연산에 대응하는 기본행렬 } E_1, E_2, \\ldots \\text{ 을 차례로 곱하는 과정을 통해 해를 구하시오: } \\begin{cases}- 4 x - 3 y - z = 23\\\\3 x + 2 y - 3 z = -32\\\\x + 2 y - 3 z = -20\\end{cases}",
                "solution": "\\begin{pmatrix}-6\\\\-1\\\\4\\end{pmatrix}"
            },
            {
                "level": 3,
                "template": "rref_interpret",
                "latex": "\\text{연립일차방정식을 행렬로 나타내고 가우스 소거법을 이용하여 다음과 같은 행렬을 얻었을 때, } \\text{주어진 연립일차방정식의 해를 구하시오 (해가 무수히 많으면 자유변수를 } t \\text{ 로 두고, 해가 없으면 \"포기\" 버튼을 이용하시오): } \\begin{pmatrix}1 & -3 & 4\\\\0 & 1 & -1\\\\0 & 0 & 0\\end{pmatrix}\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix} = \\begin{pmatrix}-3\\\\3\\\\0\\end{pmatrix}",
                "solution": "\\begin{pmatrix}6 - t\\\\t + 3\\\\t\\end{pmatrix}"
            },
            {
                "level": 3,
                "template": "mat_P_transform",
                "latex": "\\text{행렬 } A \\text{ 를 가우스 소거법을 이용하여 단위행렬로 변형하고, } PA=I \\text{ 를 만족시키는 행렬 } P \\text{ 를 기본행렬의 곱으로 나타내시오: } A=\\begin{pmatrix}4 & 0 & -1\\\\2 & -1 & -2\\\\5 & 0 & -1\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-1 & 0 & 1\\\\8 & -1 & -6\\\\-5 & 0 & 4\\end{pmatrix}"
            },
            {
                "level": 1,
                "template": "minor_cofactor",
                "latex": "\\text{다음 } 3\\times 3 \\text{ 행렬 } A \\text{ 에서 원소 } a_{23} \\text{ 의 소행렬식 } M_{23} \\text{ 과 여인수 } C_{23} \\text{ 를 차례로 구하시오 (답은 } M_{23}, C_{23} \\text{ 순서의 } 2\\times 1 \\text{ 벡터로 입력하시오): } A=\\begin{pmatrix}-1 & -8 & 10\\\\-7 & 5 & 1\\\\3 & -3 & 11\\end{pmatrix}",
                "solution": "\\begin{pmatrix}27\\\\-27\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "det_cofactor_expand",
                "latex": "\\text{제 2행에 대한 여인수 전개를 이용하여 다음 } 3\\times 3 \\text{ 행렬 } A \\text{ 의 행렬식 } \\det(A) \\text{ 를 계산하시오: } A=\\begin{pmatrix}-4 & 5 & -3\\\\-5 & 7 & -6\\\\-6 & 8 & 5\\end{pmatrix}",
                "solution": "-33"
            },
            {
                "level": 2,
                "template": "det_properties",
                "latex": "3\\times 3 \\text{ 정사각행렬 } A \\text{ 에 대하여 } \\det(A)=4 \\text{ 일 때, } \\det(4A^{-1}) \\text{ 의 값을 구하시오: }",
                "solution": "16"
            },
            {
                "level": 2,
                "template": "adjoint_matrix",
                "latex": "\\text{다음 행렬 } A \\text{ 의 여인수행렬을 구하고, 이를 전치하여 딸림행렬(수반행렬) } \\operatorname{adj}(A) \\text{ 를 구하시오: } A=\\begin{pmatrix}1 & -7 & 7\\\\7 & 1 & 6\\\\6 & 2 & 7\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-5 & 63 & -49\\\\-13 & -35 & 43\\\\8 & -44 & 50\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "cramer_single_var",
                "latex": "\\text{크래머 공식(Cramer's Rule)을 적용하여 다음 연립방정식의 미지수 } y \\text{ 의 값을 구하시오: } \\begin{cases}- 3 x - 3 y + 2 z = 29\\\\3 x + 6 y + 3 z = -60\\\\2 x - 6 y + 8 z = 18\\end{cases}",
                "solution": "-7"
            }
        ]
    },
    {
        "id": "alg_col_5",
        "name": "행렬과 연립일차방정식 5",
        "problems": [
            {
                "level": 1,
                "template": "sys_unique",
                "latex": "\\text{가우스 소거법을 이용하여 다음 연립일차방정식의 해를 구하시오 (첨가행렬 } [A|B] \\text{ 를 기약 행사다리꼴로 변형하시오): } \\begin{cases}- 4 x = 20\\\\x + 3 y = 1\\end{cases}",
                "solution": "\\begin{pmatrix}-5\\\\2\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "mat_inverse",
                "latex": "\\text{첨가행렬 } [A|I] \\text{ 에 기본 행연산을 적용하여 다음 행렬 } A \\text{ 의 역행렬을 구하시오: } A=\\begin{pmatrix}-5 & -2\\\\-7 & -3\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-3 & 2\\\\7 & -5\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "sys_elem_matrix",
                "latex": "\\text{연립일차방정식을 첨가행렬 } M \\text{ 로 나타내고, 기본 행연산에 대응하는 기본행렬 } E_1, E_2, \\ldots \\text{ 을 차례로 곱하는 과정을 통해 해를 구하시오: } \\begin{cases}- 4 x = -4\\\\- 2 x - 3 y = 7\\end{cases}",
                "solution": "\\begin{pmatrix}1\\\\-3\\end{pmatrix}"
            },
            {
                "level": 3,
                "template": "rref_interpret",
                "latex": "\\text{연립일차방정식을 행렬로 나타내고 가우스 소거법을 이용하여 다음과 같은 행렬을 얻었을 때, } \\text{주어진 연립일차방정식의 해를 구하시오 (해가 무수히 많으면 자유변수를 } t \\text{ 로 두고, 해가 없으면 \"포기\" 버튼을 이용하시오): } \\begin{pmatrix}1 & 2 & -3\\\\0 & 1 & 1\\\\0 & 0 & 0\\end{pmatrix}\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix} = \\begin{pmatrix}-1\\\\-3\\\\-1\\end{pmatrix}",
                "solution": "해없음"
            },
            {
                "level": 3,
                "template": "mat_P_transform",
                "latex": "\\text{행렬 } A \\text{ 를 가우스 소거법을 이용하여 단위행렬로 변형하고, } PA=I \\text{ 를 만족시키는 행렬 } P \\text{ 를 기본행렬의 곱으로 나타내시오: } A=\\begin{pmatrix}0 & 1\\\\-1 & -1\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-1 & -1\\\\1 & 0\\end{pmatrix}"
            },
            {
                "level": 1,
                "template": "minor_cofactor",
                "latex": "\\text{다음 } 3\\times 3 \\text{ 행렬 } A \\text{ 에서 원소 } a_{11} \\text{ 의 소행렬식 } M_{11} \\text{ 과 여인수 } C_{11} \\text{ 를 차례로 구하시오 (답은 } M_{11}, C_{11} \\text{ 순서의 } 2\\times 1 \\text{ 벡터로 입력하시오): } A=\\begin{pmatrix}8 & 10 & 11\\\\-4 & 0 & -6\\\\8 & 2 & 0\\end{pmatrix}",
                "solution": "\\begin{pmatrix}12\\\\12\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "det_cofactor_expand",
                "latex": "\\text{제 1열에 대한 여인수 전개를 이용하여 다음 } 4\\times 4 \\text{ 행렬 } A \\text{ 의 행렬식 } \\det(A) \\text{ 를 계산하시오: } A=\\begin{pmatrix}1 & -7 & 4 & -3\\\\-5 & 6 & 8 & -6\\\\7 & -6 & 1 & 5\\\\2 & 1 & -4 & -6\\end{pmatrix}",
                "solution": "4203"
            },
            {
                "level": 2,
                "template": "det_properties",
                "latex": "4\\times 4 \\text{ 정사각행렬 } A \\text{ 에 대하여 } \\det(A)=6 \\text{ 일 때, } \\det(A^{3}) \\text{ 의 값을 구하시오: }",
                "solution": "216"
            },
            {
                "level": 2,
                "template": "adjoint_matrix",
                "latex": "\\text{다음 행렬 } A \\text{ 의 여인수행렬을 구하고, 이를 전치하여 딸림행렬(수반행렬) } \\operatorname{adj}(A) \\text{ 를 구하시오: } A=\\begin{pmatrix}-6 & -2 & 3\\\\-1 & 3 & 2\\\\2 & -4 & 4\\end{pmatrix}",
                "solution": "\\begin{pmatrix}20 & -4 & -13\\\\8 & -30 & 9\\\\-2 & -28 & -20\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "cramer_single_var",
                "latex": "\\text{크래머 공식(Cramer's Rule)을 적용하여 다음 연립방정식의 미지수 } z \\text{ 의 값을 구하시오: } \\begin{cases}x - 5 y = 22\\\\- 2 x + 6 y - 7 z = -13\\\\x + 2 y - 3 z = -17\\end{cases}",
                "solution": "-1"
            }
        ]
    },
    {
        "id": "alg_col_6",
        "name": "행렬과 연립일차방정식 6",
        "problems": [
            {
                "level": 1,
                "template": "sys_unique",
                "latex": "\\text{가우스 소거법을 이용하여 다음 연립일차방정식의 해를 구하시오 (첨가행렬 } [A|B] \\text{ 를 기약 행사다리꼴로 변형하시오): } \\begin{cases}5 x - 3 y - 3 z = -12\\\\- 3 y + 3 z = -9\\\\- 4 x + 3 y + z = 13\\end{cases}",
                "solution": "\\begin{pmatrix}-3\\\\1\\\\-2\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "mat_inverse",
                "latex": "\\text{첨가행렬 } [A|I] \\text{ 에 기본 행연산을 적용하여 다음 행렬 } A \\text{ 의 역행렬을 구하시오: } A=\\begin{pmatrix}-8 & -3\\\\-3 & -1\\end{pmatrix}",
                "solution": "\\begin{pmatrix}1 & -3\\\\-3 & 8\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "sys_elem_matrix",
                "latex": "\\text{연립일차방정식을 첨가행렬 } M \\text{ 로 나타내고, 기본 행연산에 대응하는 기본행렬 } E_1, E_2, \\ldots \\text{ 을 차례로 곱하는 과정을 통해 해를 구하시오: } \\begin{cases}- 2 x - 4 y + z = -22\\\\5 x + 4 y + 3 z = 47\\\\- 3 x + 5 y + 4 z = 32\\end{cases}",
                "solution": "\\begin{pmatrix}3\\\\5\\\\4\\end{pmatrix}"
            },
            {
                "level": 3,
                "template": "rref_interpret",
                "latex": "\\text{연립일차방정식을 행렬로 나타내고 가우스 소거법을 이용하여 다음과 같은 행렬을 얻었을 때, } \\text{주어진 연립일차방정식의 해를 구하시오 (해가 무수히 많으면 자유변수를 } t \\text{ 로 두고, 해가 없으면 \"포기\" 버튼을 이용하시오): } \\begin{pmatrix}1 & 1 & -2\\\\0 & 1 & -3\\\\0 & 0 & 0\\end{pmatrix}\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix} = \\begin{pmatrix}-4\\\\0\\\\2\\end{pmatrix}",
                "solution": "해없음"
            },
            {
                "level": 3,
                "template": "mat_P_transform",
                "latex": "\\text{행렬 } A \\text{ 를 가우스 소거법을 이용하여 단위행렬로 변형하고, } PA=I \\text{ 를 만족시키는 행렬 } P \\text{ 를 기본행렬의 곱으로 나타내시오: } A=\\begin{pmatrix}3 & 3 & -1\\\\1 & -5 & 2\\\\-1 & 0 & 0\\end{pmatrix}",
                "solution": "\\begin{pmatrix}0 & 0 & -1\\\\2 & 1 & 7\\\\5 & 3 & 18\\end{pmatrix}"
            },
            {
                "level": 1,
                "template": "minor_cofactor",
                "latex": "\\text{다음 } 3\\times 3 \\text{ 행렬 } A \\text{ 에서 원소 } a_{12} \\text{ 의 소행렬식 } M_{12} \\text{ 과 여인수 } C_{12} \\text{ 를 차례로 구하시오 (답은 } M_{12}, C_{12} \\text{ 순서의 } 2\\times 1 \\text{ 벡터로 입력하시오): } A=\\begin{pmatrix}9 & -5 & -3\\\\5 & 5 & -1\\\\4 & 12 & -5\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-21\\\\21\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "det_cofactor_expand",
                "latex": "\\text{제 1열에 대한 여인수 전개를 이용하여 다음 } 4\\times 4 \\text{ 행렬 } A \\text{ 의 행렬식 } \\det(A) \\text{ 를 계산하시오: } A=\\begin{pmatrix}-7 & -3 & -4 & -8\\\\8 & 8 & 2 & -5\\\\-8 & 2 & 0 & 0\\\\-6 & 6 & 6 & -8\\end{pmatrix}",
                "solution": "5636"
            },
            {
                "level": 2,
                "template": "det_properties",
                "latex": "2\\times 2 \\text{ 정사각행렬 } A \\text{ 에 대하여 } \\det(A)=6 \\text{ 일 때, } \\det(-A) \\text{ 의 값을 구하시오: }",
                "solution": "6"
            },
            {
                "level": 2,
                "template": "adjoint_matrix",
                "latex": "\\text{다음 행렬 } A \\text{ 의 여인수행렬을 구하고, 이를 전치하여 딸림행렬(수반행렬) } \\operatorname{adj}(A) \\text{ 를 구하시오: } A=\\begin{pmatrix}7 & 7 & 5\\\\-2 & 7 & -6\\\\-2 & 7 & -4\\end{pmatrix}",
                "solution": "\\begin{pmatrix}14 & 63 & -77\\\\4 & -18 & 32\\\\0 & -63 & 63\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "cramer_single_var",
                "latex": "\\text{크래머 공식(Cramer's Rule)을 적용하여 다음 연립방정식의 미지수 } y \\text{ 의 값을 구하시오: } \\begin{cases}7 x - 7 y + z = 21\\\\5 x = 15\\\\- 2 x - 4 y - 8 z = -6\\end{cases}",
                "solution": "0"
            }
        ]
    },
    {
        "id": "alg_col_7",
        "name": "행렬과 연립일차방정식 7",
        "problems": [
            {
                "level": 1,
                "template": "sys_unique",
                "latex": "\\text{가우스 소거법을 이용하여 다음 연립일차방정식의 해를 구하시오 (첨가행렬 } [A|B] \\text{ 를 기약 행사다리꼴로 변형하시오): } \\begin{cases}3 x + 4 y + 3 z = 19\\\\x - y = 1\\\\3 x + 3 y + 4 z = 21\\end{cases}",
                "solution": "\\begin{pmatrix}2\\\\1\\\\3\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "mat_inverse",
                "latex": "\\text{첨가행렬 } [A|I] \\text{ 에 기본 행연산을 적용하여 다음 행렬 } A \\text{ 의 역행렬을 구하시오 (역행렬이 존재하지 않으면 \"포기\" 버튼을 이용하시오): } A=\\begin{pmatrix}9 & -5 & 10\\\\5 & 3 & 2\\\\2 & -4 & 4\\end{pmatrix}",
                "solution": "역행렬없음"
            },
            {
                "level": 2,
                "template": "sys_elem_matrix",
                "latex": "\\text{연립일차방정식을 첨가행렬 } M \\text{ 로 나타내고, 기본 행연산에 대응하는 기본행렬 } E_1, E_2, \\ldots \\text{ 을 차례로 곱하는 과정을 통해 해를 구하시오: } \\begin{cases}- 3 x - y + z = 6\\\\- 3 x + 2 y - 3 z = -7\\\\5 x + 5 y = 0\\end{cases}",
                "solution": "\\begin{pmatrix}-1\\\\1\\\\4\\end{pmatrix}"
            },
            {
                "level": 3,
                "template": "rref_interpret",
                "latex": "\\text{연립일차방정식을 행렬로 나타내고 가우스 소거법을 이용하여 다음과 같은 행렬을 얻었을 때, } \\text{주어진 연립일차방정식의 해를 구하시오 (해가 무수히 많으면 자유변수를 } t \\text{ 로 두고, 해가 없으면 \"포기\" 버튼을 이용하시오): } \\begin{pmatrix}1 & -4 & 4\\\\0 & 1 & -1\\\\0 & 0 & 0\\end{pmatrix}\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix} = \\begin{pmatrix}1\\\\0\\\\3\\end{pmatrix}",
                "solution": "해없음"
            },
            {
                "level": 3,
                "template": "mat_P_transform",
                "latex": "\\text{행렬 } A \\text{ 를 가우스 소거법을 이용하여 단위행렬로 변형하고, } PA=I \\text{ 를 만족시키는 행렬 } P \\text{ 를 기본행렬의 곱으로 나타내시오: } A=\\begin{pmatrix}1 & 0 & 0\\\\-5 & 7 & -2\\\\3 & -4 & 1\\end{pmatrix}",
                "solution": "\\begin{pmatrix}1 & 0 & 0\\\\1 & -1 & -2\\\\1 & -4 & -7\\end{pmatrix}"
            },
            {
                "level": 1,
                "template": "minor_cofactor",
                "latex": "\\text{다음 } 3\\times 3 \\text{ 행렬 } A \\text{ 에서 원소 } a_{21} \\text{ 의 소행렬식 } M_{21} \\text{ 과 여인수 } C_{21} \\text{ 를 차례로 구하시오 (답은 } M_{21}, C_{21} \\text{ 순서의 } 2\\times 1 \\text{ 벡터로 입력하시오): } A=\\begin{pmatrix}-4 & -1 & 9\\\\-9 & 4 & 11\\\\-4 & -6 & 6\\end{pmatrix}",
                "solution": "\\begin{pmatrix}48\\\\-48\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "det_cofactor_expand",
                "latex": "\\text{제 1열에 대한 여인수 전개를 이용하여 다음 } 4\\times 4 \\text{ 행렬 } A \\text{ 의 행렬식 } \\det(A) \\text{ 를 계산하시오: } A=\\begin{pmatrix}-1 & -1 & -6 & 6\\\\-7 & 4 & 8 & 0\\\\4 & 4 & -3 & -2\\\\6 & 5 & -6 & -2\\end{pmatrix}",
                "solution": "-100"
            },
            {
                "level": 2,
                "template": "det_properties",
                "latex": "3\\times 3 \\text{ 정사각행렬 } A \\text{ 에 대하여 } \\det(A)=-7 \\text{ 일 때, } \\det\\left((-2A)^{-1}\\right) \\text{ 의 값을 구하시오: }",
                "solution": "\\frac{1}{56}"
            },
            {
                "level": 2,
                "template": "adjoint_matrix",
                "latex": "\\text{다음 행렬 } A \\text{ 의 여인수행렬을 구하고, 이를 전치하여 딸림행렬(수반행렬) } \\operatorname{adj}(A) \\text{ 를 구하시오: } A=\\begin{pmatrix}-2 & -7 & 2\\\\7 & 5 & 3\\\\3 & 2 & -1\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-11 & -3 & -31\\\\16 & -4 & 20\\\\-1 & -17 & 39\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "cramer_single_var",
                "latex": "\\text{크래머 공식(Cramer's Rule)을 적용하여 다음 연립방정식의 미지수 } y \\text{ 의 값을 구하시오: } \\begin{cases}x + 7 y - 8 z = -94\\\\8 x + 3 y - 8 z = -51\\\\- 3 x + 7 z = 25\\end{cases}",
                "solution": "-9"
            }
        ]
    },
    {
        "id": "alg_col_8",
        "name": "행렬과 연립일차방정식 8",
        "problems": [
            {
                "level": 1,
                "template": "sys_unique",
                "latex": "\\text{가우스 소거법을 이용하여 다음 연립일차방정식의 해를 구하시오 (첨가행렬 } [A|B] \\text{ 를 기약 행사다리꼴로 변형하시오): } \\begin{cases}- x + 5 y + 5 z = -47\\\\4 x + 2 y + 5 z = -28\\\\4 x + 3 y + 5 z = -31\\end{cases}",
                "solution": "\\begin{pmatrix}2\\\\-3\\\\-6\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "mat_inverse",
                "latex": "\\text{첨가행렬 } [A|I] \\text{ 에 기본 행연산을 적용하여 다음 행렬 } A \\text{ 의 역행렬을 구하시오 (역행렬이 존재하지 않으면 \"포기\" 버튼을 이용하시오): } A=\\begin{pmatrix}-6 & 8 & 6\\\\2 & 0 & -2\\\\-1 & 4 & 1\\end{pmatrix}",
                "solution": "역행렬없음"
            },
            {
                "level": 2,
                "template": "sys_elem_matrix",
                "latex": "\\text{연립일차방정식을 첨가행렬 } M \\text{ 로 나타내고, 기본 행연산에 대응하는 기본행렬 } E_1, E_2, \\ldots \\text{ 을 차례로 곱하는 과정을 통해 해를 구하시오: } \\begin{cases}- 2 x + 4 z = 0\\\\- 2 x + 5 y + 2 z = 1\\\\- 4 x - 3 y + 3 z = -13\\end{cases}",
                "solution": "\\begin{pmatrix}4\\\\1\\\\2\\end{pmatrix}"
            },
            {
                "level": 3,
                "template": "rref_interpret",
                "latex": "\\text{연립일차방정식을 행렬로 나타내고 가우스 소거법을 이용하여 다음과 같은 행렬을 얻었을 때, } \\text{주어진 연립일차방정식의 해를 구하시오 (해가 무수히 많으면 자유변수를 } t \\text{ 로 두고, 해가 없으면 \"포기\" 버튼을 이용하시오): } \\begin{pmatrix}1 & 4 & 1\\\\0 & 1 & -2\\\\0 & 0 & 0\\end{pmatrix}\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix} = \\begin{pmatrix}-2\\\\-2\\\\-2\\end{pmatrix}",
                "solution": "해없음"
            },
            {
                "level": 3,
                "template": "mat_P_transform",
                "latex": "\\text{행렬 } A \\text{ 를 가우스 소거법을 이용하여 단위행렬로 변형하고, } PA=I \\text{ 를 만족시키는 행렬 } P \\text{ 를 기본행렬의 곱으로 나타내시오: } A=\\begin{pmatrix}3 & -1 & -1\\\\-3 & 1 & 2\\\\-7 & 2 & 6\\end{pmatrix}",
                "solution": "\\begin{pmatrix}2 & 4 & -1\\\\4 & 11 & -3\\\\1 & 1 & 0\\end{pmatrix}"
            },
            {
                "level": 1,
                "template": "minor_cofactor",
                "latex": "\\text{다음 } 3\\times 3 \\text{ 행렬 } A \\text{ 에서 원소 } a_{31} \\text{ 의 소행렬식 } M_{31} \\text{ 과 여인수 } C_{31} \\text{ 를 차례로 구하시오 (답은 } M_{31}, C_{31} \\text{ 순서의 } 2\\times 1 \\text{ 벡터로 입력하시오): } A=\\begin{pmatrix}-2 & -12 & -1\\\\1 & -7 & -4\\\\2 & 11 & -1\\end{pmatrix}",
                "solution": "\\begin{pmatrix}41\\\\41\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "det_cofactor_expand",
                "latex": "\\text{제 1행에 대한 여인수 전개를 이용하여 다음 } 4\\times 4 \\text{ 행렬 } A \\text{ 의 행렬식 } \\det(A) \\text{ 를 계산하시오: } A=\\begin{pmatrix}7 & 1 & -6 & 3\\\\-3 & -4 & -4 & 8\\\\-4 & -3 & 1 & -6\\\\0 & 0 & 8 & -2\\end{pmatrix}",
                "solution": "-2018"
            },
            {
                "level": 2,
                "template": "det_properties",
                "latex": "3\\times 3 \\text{ 정사각행렬 } A, B \\text{ 에 대하여 } \\det(A)=-6, \\ \\det(B)=-9 \\text{ 일 때, } \\det(AB) \\text{ 의 값을 구하시오: }",
                "solution": "54"
            },
            {
                "level": 2,
                "template": "adjoint_matrix",
                "latex": "\\text{다음 행렬 } A \\text{ 의 여인수행렬을 구하고, 이를 전치하여 딸림행렬(수반행렬) } \\operatorname{adj}(A) \\text{ 를 구하시오: } A=\\begin{pmatrix}8 & -1 & 7\\\\-3 & 4 & -7\\\\6 & 2 & -8\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-18 & 6 & -21\\\\-66 & -106 & 35\\\\-30 & -22 & 29\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "cramer_single_var",
                "latex": "\\text{크래머 공식(Cramer's Rule)을 적용하여 다음 연립방정식의 미지수 } x \\text{ 의 값을 구하시오: } \\begin{cases}5 x + 4 y - 5 z = 14\\\\- 7 x - 8 y + z = -28\\\\6 x + 6 y - 2 z = 24\\end{cases}",
                "solution": "9"
            }
        ]
    },
    {
        "id": "alg_col_9",
        "name": "행렬과 연립일차방정식 9",
        "problems": [
            {
                "level": 1,
                "template": "sys_unique",
                "latex": "\\text{가우스 소거법을 이용하여 다음 연립일차방정식의 해를 구하시오 (첨가행렬 } [A|B] \\text{ 를 기약 행사다리꼴로 변형하시오): } \\begin{cases}- 3 x + y = -20\\\\4 x + 4 y = 0\\end{cases}",
                "solution": "\\begin{pmatrix}5\\\\-5\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "mat_inverse",
                "latex": "\\text{첨가행렬 } [A|I] \\text{ 에 기본 행연산을 적용하여 다음 행렬 } A \\text{ 의 역행렬을 구하시오: } A=\\begin{pmatrix}6 & 7\\\\-1 & -1\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-1 & -7\\\\1 & 6\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "sys_elem_matrix",
                "latex": "\\text{연립일차방정식을 첨가행렬 } M \\text{ 로 나타내고, 기본 행연산에 대응하는 기본행렬 } E_1, E_2, \\ldots \\text{ 을 차례로 곱하는 과정을 통해 해를 구하시오: } \\begin{cases}x = -1\\\\3 x - 4 y = -7\\end{cases}",
                "solution": "\\begin{pmatrix}-1\\\\1\\end{pmatrix}"
            },
            {
                "level": 3,
                "template": "rref_interpret",
                "latex": "\\text{연립일차방정식을 행렬로 나타내고 가우스 소거법을 이용하여 다음과 같은 행렬을 얻었을 때, } \\text{주어진 연립일차방정식의 해를 구하시오 (해가 무수히 많으면 자유변수를 } t \\text{ 로 두고, 해가 없으면 \"포기\" 버튼을 이용하시오): } \\begin{pmatrix}1 & -4 & 0\\\\0 & 1 & 1\\\\0 & 0 & 0\\end{pmatrix}\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix} = \\begin{pmatrix}-2\\\\3\\\\0\\end{pmatrix}",
                "solution": "\\begin{pmatrix}10 - 4 t\\\\3 - t\\\\t\\end{pmatrix}"
            },
            {
                "level": 3,
                "template": "mat_P_transform",
                "latex": "\\text{행렬 } A \\text{ 를 가우스 소거법을 이용하여 단위행렬로 변형하고, } PA=I \\text{ 를 만족시키는 행렬 } P \\text{ 를 기본행렬의 곱으로 나타내시오: } A=\\begin{pmatrix}1 & -2 & 0\\\\-3 & 8 & 3\\\\0 & -1 & -1\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-5 & -2 & -6\\\\-3 & -1 & -3\\\\3 & 1 & 2\\end{pmatrix}"
            },
            {
                "level": 1,
                "template": "minor_cofactor",
                "latex": "\\text{다음 } 3\\times 3 \\text{ 행렬 } A \\text{ 에서 원소 } a_{31} \\text{ 의 소행렬식 } M_{31} \\text{ 과 여인수 } C_{31} \\text{ 를 차례로 구하시오 (답은 } M_{31}, C_{31} \\text{ 순서의 } 2\\times 1 \\text{ 벡터로 입력하시오): } A=\\begin{pmatrix}5 & -1 & -7\\\\-10 & -9 & -10\\\\-12 & -12 & -5\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-53\\\\-53\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "det_cofactor_expand",
                "latex": "\\text{제 1열에 대한 여인수 전개를 이용하여 다음 } 3\\times 3 \\text{ 행렬 } A \\text{ 의 행렬식 } \\det(A) \\text{ 를 계산하시오: } A=\\begin{pmatrix}6 & -3 & 4\\\\-7 & 8 & -7\\\\0 & -6 & -6\\end{pmatrix}",
                "solution": "-246"
            },
            {
                "level": 2,
                "template": "det_properties",
                "latex": "3\\times 3 \\text{ 정사각행렬 } A, B \\text{ 에 대하여 } \\det(A)=7, \\ \\det(B)=-1 \\text{ 일 때, } \\det(A^{-1} B^{T}) \\text{ 의 값을 구하시오: }",
                "solution": "-\\frac{1}{7}"
            },
            {
                "level": 2,
                "template": "adjoint_matrix",
                "latex": "\\text{다음 행렬 } A \\text{ 의 여인수행렬을 구하고, 이를 전치하여 딸림행렬(수반행렬) } \\operatorname{adj}(A) \\text{ 를 구하시오: } A=\\begin{pmatrix}-7 & -2 & 7\\\\0 & 7 & -7\\\\-2 & -8 & -4\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-84 & -64 & -35\\\\14 & 42 & -49\\\\14 & -52 & -49\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "cramer_single_var",
                "latex": "\\text{크래머 공식(Cramer's Rule)을 적용하여 다음 연립방정식의 미지수 } y \\text{ 의 값을 구하시오: } \\begin{cases}- 2 x + 3 z = 36\\\\- 3 x + y - 4 z = -1\\\\- 3 x + 8 y = -5\\end{cases}",
                "solution": "-4"
            }
        ]
    },
    {
        "id": "alg_col_10",
        "name": "행렬과 연립일차방정식 10",
        "problems": [
            {
                "level": 1,
                "template": "sys_unique",
                "latex": "\\text{가우스 소거법을 이용하여 다음 연립일차방정식의 해를 구하시오 (첨가행렬 } [A|B] \\text{ 를 기약 행사다리꼴로 변형하시오): } \\begin{cases}2 x + 4 y + 5 z = 31\\\\3 x + 2 y + 4 z = 24\\\\2 y + 5 z = 21\\end{cases}",
                "solution": "\\begin{pmatrix}2\\\\3\\\\3\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "mat_inverse",
                "latex": "\\text{첨가행렬 } [A|I] \\text{ 에 기본 행연산을 적용하여 다음 행렬 } A \\text{ 의 역행렬을 구하시오: } A=\\begin{pmatrix}-1 & 0\\\\-2 & -1\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-1 & 0\\\\2 & -1\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "sys_elem_matrix",
                "latex": "\\text{연립일차방정식을 첨가행렬 } M \\text{ 로 나타내고, 기본 행연산에 대응하는 기본행렬 } E_1, E_2, \\ldots \\text{ 을 차례로 곱하는 과정을 통해 해를 구하시오: } \\begin{cases}5 x = 15\\\\- x + 5 y = -23\\end{cases}",
                "solution": "\\begin{pmatrix}3\\\\-4\\end{pmatrix}"
            },
            {
                "level": 3,
                "template": "rref_interpret",
                "latex": "\\text{연립일차방정식을 행렬로 나타내고 가우스 소거법을 이용하여 다음과 같은 행렬을 얻었을 때, } \\text{주어진 연립일차방정식의 해를 구하시오 (해가 무수히 많으면 자유변수를 } t \\text{ 로 두고, 해가 없으면 \"포기\" 버튼을 이용하시오): } \\begin{pmatrix}1 & -3 & -1\\\\0 & 1 & 4\\\\0 & 0 & 0\\end{pmatrix}\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix} = \\begin{pmatrix}-1\\\\-4\\\\0\\end{pmatrix}",
                "solution": "\\begin{pmatrix}- 11 t - 13\\\\- 4 t - 4\\\\t\\end{pmatrix}"
            },
            {
                "level": 3,
                "template": "mat_P_transform",
                "latex": "\\text{행렬 } A \\text{ 를 가우스 소거법을 이용하여 단위행렬로 변형하고, } PA=I \\text{ 를 만족시키는 행렬 } P \\text{ 를 기본행렬의 곱으로 나타내시오: } A=\\begin{pmatrix}-3 & 3 & 7\\\\0 & 1 & 0\\\\-1 & -2 & 2\\end{pmatrix}",
                "solution": "\\begin{pmatrix}2 & -20 & -7\\\\0 & 1 & 0\\\\1 & -9 & -3\\end{pmatrix}"
            },
            {
                "level": 1,
                "template": "minor_cofactor",
                "latex": "\\text{다음 } 3\\times 3 \\text{ 행렬 } A \\text{ 에서 원소 } a_{13} \\text{ 의 소행렬식 } M_{13} \\text{ 과 여인수 } C_{13} \\text{ 를 차례로 구하시오 (답은 } M_{13}, C_{13} \\text{ 순서의 } 2\\times 1 \\text{ 벡터로 입력하시오): } A=\\begin{pmatrix}-3 & -9 & 0\\\\-9 & 6 & 5\\\\-12 & -8 & 1\\end{pmatrix}",
                "solution": "\\begin{pmatrix}144\\\\144\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "det_cofactor_expand",
                "latex": "\\text{제 1열에 대한 여인수 전개를 이용하여 다음 } 4\\times 4 \\text{ 행렬 } A \\text{ 의 행렬식 } \\det(A) \\text{ 를 계산하시오: } A=\\begin{pmatrix}-4 & 6 & 2 & 4\\\\-4 & 3 & 3 & 7\\\\3 & -3 & -4 & 5\\\\-2 & -7 & 4 & 5\\end{pmatrix}",
                "solution": "206"
            },
            {
                "level": 2,
                "template": "det_properties",
                "latex": "4\\times 4 \\text{ 정사각행렬 } A, B \\text{ 에 대하여 } \\det(A)=5, \\ \\det(B)=-7 \\text{ 일 때, } \\det\\left((AB)^{-1}\\right) \\text{ 의 값을 구하시오: }",
                "solution": "-\\frac{1}{35}"
            },
            {
                "level": 2,
                "template": "adjoint_matrix",
                "latex": "\\text{다음 행렬 } A \\text{ 의 여인수행렬을 구하고, 이를 전치하여 딸림행렬(수반행렬) } \\operatorname{adj}(A) \\text{ 를 구하시오: } A=\\begin{pmatrix}-5 & -8 & -3\\\\8 & 1 & 5\\\\-8 & 8 & -3\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-43 & -48 & -37\\\\-16 & -9 & 1\\\\72 & 104 & 59\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "cramer_single_var",
                "latex": "\\text{크래머 공식(Cramer's Rule)을 적용하여 다음 연립방정식의 미지수 } x \\text{ 의 값을 구하시오: } \\begin{cases}5 x + 7 y + 6 z = 15\\\\2 x + 5 y + 2 z = -14\\\\- x + 3 y + 7 z = 11\\end{cases}",
                "solution": "7"
            }
        ]
    },
    {
        "id": "alg_col_11",
        "name": "행렬과 연립일차방정식 11",
        "problems": [
            {
                "level": 1,
                "template": "sys_unique",
                "latex": "\\text{가우스 소거법을 이용하여 다음 연립일차방정식의 해를 구하시오 (첨가행렬 } [A|B] \\text{ 를 기약 행사다리꼴로 변형하시오): } \\begin{cases}- 4 y + z = -13\\\\x + 3 y + 2 z = -1\\\\- 3 x + 2 y + 5 z = -30\\end{cases}",
                "solution": "\\begin{pmatrix}3\\\\2\\\\-5\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "mat_inverse",
                "latex": "\\text{첨가행렬 } [A|I] \\text{ 에 기본 행연산을 적용하여 다음 행렬 } A \\text{ 의 역행렬을 구하시오: } A=\\begin{pmatrix}1 & -1\\\\1 & 0\\end{pmatrix}",
                "solution": "\\begin{pmatrix}0 & 1\\\\-1 & 1\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "sys_elem_matrix",
                "latex": "\\text{연립일차방정식을 첨가행렬 } M \\text{ 로 나타내고, 기본 행연산에 대응하는 기본행렬 } E_1, E_2, \\ldots \\text{ 을 차례로 곱하는 과정을 통해 해를 구하시오: } \\begin{cases}3 x - 4 y + 5 z = -17\\\\- 4 x + 4 z = -4\\\\4 x - 4 y - 3 z = -2\\end{cases}",
                "solution": "\\begin{pmatrix}-1\\\\1\\\\-2\\end{pmatrix}"
            },
            {
                "level": 3,
                "template": "rref_interpret",
                "latex": "\\text{연립일차방정식을 행렬로 나타내고 가우스 소거법을 이용하여 다음과 같은 행렬을 얻었을 때, } \\text{주어진 연립일차방정식의 해를 구하시오 (해가 무수히 많으면 자유변수를 } t \\text{ 로 두고, 해가 없으면 \"포기\" 버튼을 이용하시오): } \\begin{pmatrix}1 & 2 & -3\\\\0 & 1 & 1\\\\0 & 0 & 0\\end{pmatrix}\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix} = \\begin{pmatrix}3\\\\0\\\\0\\end{pmatrix}",
                "solution": "\\begin{pmatrix}5 t + 3\\\\- t\\\\t\\end{pmatrix}"
            },
            {
                "level": 3,
                "template": "mat_P_transform",
                "latex": "\\text{행렬 } A \\text{ 를 가우스 소거법을 이용하여 단위행렬로 변형하고, } PA=I \\text{ 를 만족시키는 행렬 } P \\text{ 를 기본행렬의 곱으로 나타내시오: } A=\\begin{pmatrix}-1 & 1\\\\-1 & 0\\end{pmatrix}",
                "solution": "\\begin{pmatrix}0 & -1\\\\1 & -1\\end{pmatrix}"
            },
            {
                "level": 1,
                "template": "minor_cofactor",
                "latex": "\\text{다음 } 3\\times 3 \\text{ 행렬 } A \\text{ 에서 원소 } a_{11} \\text{ 의 소행렬식 } M_{11} \\text{ 과 여인수 } C_{11} \\text{ 를 차례로 구하시오 (답은 } M_{11}, C_{11} \\text{ 순서의 } 2\\times 1 \\text{ 벡터로 입력하시오): } A=\\begin{pmatrix}-8 & -10 & 6\\\\-12 & 12 & 12\\\\5 & 2 & 2\\end{pmatrix}",
                "solution": "\\begin{pmatrix}0\\\\0\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "det_cofactor_expand",
                "latex": "\\text{제 2행에 대한 여인수 전개를 이용하여 다음 } 3\\times 3 \\text{ 행렬 } A \\text{ 의 행렬식 } \\det(A) \\text{ 를 계산하시오: } A=\\begin{pmatrix}2 & 5 & 0\\\\4 & 8 & 3\\\\3 & -7 & 7\\end{pmatrix}",
                "solution": "59"
            },
            {
                "level": 2,
                "template": "det_properties",
                "latex": "2\\times 2 \\text{ 정사각행렬 } A, B \\text{ 에 대하여 } \\det(A)=-9, \\ \\det(B)=-7 \\text{ 일 때, } \\det(-3AB^{-1}) \\text{ 의 값을 구하시오: }",
                "solution": "\\frac{81}{7}"
            },
            {
                "level": 2,
                "template": "adjoint_matrix",
                "latex": "\\text{다음 행렬 } A \\text{ 의 여인수행렬을 구하고, 이를 전치하여 딸림행렬(수반행렬) } \\operatorname{adj}(A) \\text{ 를 구하시오: } A=\\begin{pmatrix}-7 & 8 & 1\\\\4 & 2 & 7\\\\-8 & 0 & -1\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-2 & 8 & 54\\\\-52 & 15 & 53\\\\16 & -64 & -46\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "cramer_single_var",
                "latex": "\\text{크래머 공식(Cramer's Rule)을 적용하여 다음 연립방정식의 미지수 } y \\text{ 의 값을 구하시오: } \\begin{cases}- 5 x - 5 y - z = -39\\\\6 x + y + 4 z = 14\\\\- 5 y + 8 z = -38\\end{cases}",
                "solution": "6"
            }
        ]
    },
    {
        "id": "alg_col_12",
        "name": "행렬과 연립일차방정식 12",
        "problems": [
            {
                "level": 1,
                "template": "sys_unique",
                "latex": "\\text{가우스 소거법을 이용하여 다음 연립일차방정식의 해를 구하시오 (첨가행렬 } [A|B] \\text{ 를 기약 행사다리꼴로 변형하시오): } \\begin{cases}- 2 x + 4 y - z = 9\\\\3 x + 5 y - 2 z = -20\\\\5 x + 4 y = -21\\end{cases}",
                "solution": "\\begin{pmatrix}-5\\\\1\\\\5\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "mat_inverse",
                "latex": "\\text{첨가행렬 } [A|I] \\text{ 에 기본 행연산을 적용하여 다음 행렬 } A \\text{ 의 역행렬을 구하시오: } A=\\begin{pmatrix}-6 & 2 & 5\\\\-1 & 1 & 2\\\\-1 & 0 & 0\\end{pmatrix}",
                "solution": "\\begin{pmatrix}0 & 0 & -1\\\\-2 & 5 & 7\\\\1 & -2 & -4\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "sys_elem_matrix",
                "latex": "\\text{연립일차방정식을 첨가행렬 } M \\text{ 로 나타내고, 기본 행연산에 대응하는 기본행렬 } E_1, E_2, \\ldots \\text{ 을 차례로 곱하는 과정을 통해 해를 구하시오: } \\begin{cases}- 3 x - 3 y - 3 z = -9\\\\- 3 x + 5 y + 2 z = 9\\\\- 4 x - 2 y + 3 z = -42\\end{cases}",
                "solution": "\\begin{pmatrix}3\\\\6\\\\-6\\end{pmatrix}"
            },
            {
                "level": 3,
                "template": "rref_interpret",
                "latex": "\\text{연립일차방정식을 행렬로 나타내고 가우스 소거법을 이용하여 다음과 같은 행렬을 얻었을 때, } \\text{주어진 연립일차방정식의 해를 구하시오 (해가 무수히 많으면 자유변수를 } t \\text{ 로 두고, 해가 없으면 \"포기\" 버튼을 이용하시오): } \\begin{pmatrix}1 & 4 & 0\\\\0 & 1 & 2\\\\0 & 0 & 0\\end{pmatrix}\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix} = \\begin{pmatrix}-3\\\\0\\\\0\\end{pmatrix}",
                "solution": "\\begin{pmatrix}8 t - 3\\\\- 2 t\\\\t\\end{pmatrix}"
            },
            {
                "level": 3,
                "template": "mat_P_transform",
                "latex": "\\text{행렬 } A \\text{ 를 가우스 소거법을 이용하여 단위행렬로 변형하고, } PA=I \\text{ 를 만족시키는 행렬 } P \\text{ 를 기본행렬의 곱으로 나타내시오: } A=\\begin{pmatrix}1 & -1\\\\1 & 0\\end{pmatrix}",
                "solution": "\\begin{pmatrix}0 & 1\\\\-1 & 1\\end{pmatrix}"
            },
            {
                "level": 1,
                "template": "minor_cofactor",
                "latex": "\\text{다음 } 3\\times 3 \\text{ 행렬 } A \\text{ 에서 원소 } a_{33} \\text{ 의 소행렬식 } M_{33} \\text{ 과 여인수 } C_{33} \\text{ 를 차례로 구하시오 (답은 } M_{33}, C_{33} \\text{ 순서의 } 2\\times 1 \\text{ 벡터로 입력하시오): } A=\\begin{pmatrix}-8 & -5 & 8\\\\-8 & -4 & 9\\\\-8 & -3 & 3\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-8\\\\-8\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "det_cofactor_expand",
                "latex": "\\text{제 1열에 대한 여인수 전개를 이용하여 다음 } 4\\times 4 \\text{ 행렬 } A \\text{ 의 행렬식 } \\det(A) \\text{ 를 계산하시오: } A=\\begin{pmatrix}7 & -7 & 4 & -1\\\\1 & -4 & 5 & -3\\\\-4 & -4 & -8 & 2\\\\-3 & 3 & -3 & -7\\end{pmatrix}",
                "solution": "-2978"
            },
            {
                "level": 2,
                "template": "det_properties",
                "latex": "3\\times 3 \\text{ 정사각행렬 } A, B \\text{ 에 대하여 } \\det(A)=-9, \\ \\det(B)=2 \\text{ 일 때, } \\det(A^{2}B) \\text{ 의 값을 구하시오: }",
                "solution": "162"
            },
            {
                "level": 2,
                "template": "adjoint_matrix",
                "latex": "\\text{다음 행렬 } A \\text{ 의 여인수행렬을 구하고, 이를 전치하여 딸림행렬(수반행렬) } \\operatorname{adj}(A) \\text{ 를 구하시오: } A=\\begin{pmatrix}1 & 7 & 8\\\\1 & 6 & -3\\\\3 & -1 & -1\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-9 & -1 & -69\\\\-8 & -25 & 11\\\\-19 & 22 & -1\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "cramer_single_var",
                "latex": "\\text{크래머 공식(Cramer's Rule)을 적용하여 다음 연립방정식의 미지수 } z \\text{ 의 값을 구하시오: } \\begin{cases}- 4 x + y - 5 z = 42\\\\2 x - 7 y + 6 z = -16\\\\3 x - 5 y - 5 z = 38\\end{cases}",
                "solution": "-6"
            }
        ]
    },
    {
        "id": "alg_col_13",
        "name": "행렬과 연립일차방정식 13",
        "problems": [
            {
                "level": 1,
                "template": "sys_unique",
                "latex": "\\text{가우스 소거법을 이용하여 다음 연립일차방정식의 해를 구하시오 (첨가행렬 } [A|B] \\text{ 를 기약 행사다리꼴로 변형하시오): } \\begin{cases}- 4 x + 5 y = 54\\\\- x - 2 y = -6\\end{cases}",
                "solution": "\\begin{pmatrix}-6\\\\6\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "mat_inverse",
                "latex": "\\text{첨가행렬 } [A|I] \\text{ 에 기본 행연산을 적용하여 다음 행렬 } A \\text{ 의 역행렬을 구하시오: } A=\\begin{pmatrix}0 & 1\\\\1 & 3\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-3 & 1\\\\1 & 0\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "sys_elem_matrix",
                "latex": "\\text{연립일차방정식을 첨가행렬 } M \\text{ 로 나타내고, 기본 행연산에 대응하는 기본행렬 } E_1, E_2, \\ldots \\text{ 을 차례로 곱하는 과정을 통해 해를 구하시오: } \\begin{cases}2 x - y = -14\\\\3 x + 4 y + 5 z = 2\\\\- 2 x - y + z = 0\\end{cases}",
                "solution": "\\begin{pmatrix}-4\\\\6\\\\-2\\end{pmatrix}"
            },
            {
                "level": 3,
                "template": "rref_interpret",
                "latex": "\\text{연립일차방정식을 행렬로 나타내고 가우스 소거법을 이용하여 다음과 같은 행렬을 얻었을 때, } \\text{주어진 연립일차방정식의 해를 구하시오 (해가 무수히 많으면 자유변수를 } t \\text{ 로 두고, 해가 없으면 \"포기\" 버튼을 이용하시오): } \\begin{pmatrix}1 & -3 & 0\\\\0 & 1 & -1\\\\0 & 0 & 0\\end{pmatrix}\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix} = \\begin{pmatrix}4\\\\-1\\\\0\\end{pmatrix}",
                "solution": "\\begin{pmatrix}3 t + 1\\\\t - 1\\\\t\\end{pmatrix}"
            },
            {
                "level": 3,
                "template": "mat_P_transform",
                "latex": "\\text{행렬 } A \\text{ 를 가우스 소거법을 이용하여 단위행렬로 변형하고, } PA=I \\text{ 를 만족시키는 행렬 } P \\text{ 를 기본행렬의 곱으로 나타내시오: } A=\\begin{pmatrix}-3 & -7 & 3\\\\2 & 2 & -1\\\\1 & 0 & 0\\end{pmatrix}",
                "solution": "\\begin{pmatrix}0 & 0 & 1\\\\-1 & -3 & 3\\\\-2 & -7 & 8\\end{pmatrix}"
            },
            {
                "level": 1,
                "template": "minor_cofactor",
                "latex": "\\text{다음 } 3\\times 3 \\text{ 행렬 } A \\text{ 에서 원소 } a_{33} \\text{ 의 소행렬식 } M_{33} \\text{ 과 여인수 } C_{33} \\text{ 를 차례로 구하시오 (답은 } M_{33}, C_{33} \\text{ 순서의 } 2\\times 1 \\text{ 벡터로 입력하시오): } A=\\begin{pmatrix}4 & 11 & 3\\\\-3 & -6 & -3\\\\0 & -5 & 9\\end{pmatrix}",
                "solution": "\\begin{pmatrix}9\\\\9\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "det_cofactor_expand",
                "latex": "\\text{제 1열에 대한 여인수 전개를 이용하여 다음 } 3\\times 3 \\text{ 행렬 } A \\text{ 의 행렬식 } \\det(A) \\text{ 를 계산하시오: } A=\\begin{pmatrix}-4 & 8 & 4\\\\-4 & 0 & -2\\\\5 & 0 & -8\\end{pmatrix}",
                "solution": "-336"
            },
            {
                "level": 2,
                "template": "det_properties",
                "latex": "3\\times 3 \\text{ 정사각행렬 } A, B \\text{ 에 대하여 } \\det(A)=-9, \\ \\det(B)=-3 \\text{ 일 때, } \\det(A^{T} B^{-1}) \\text{ 의 값을 구하시오: }",
                "solution": "3"
            },
            {
                "level": 2,
                "template": "adjoint_matrix",
                "latex": "\\text{다음 행렬 } A \\text{ 의 여인수행렬을 구하고, 이를 전치하여 딸림행렬(수반행렬) } \\operatorname{adj}(A) \\text{ 를 구하시오: } A=\\begin{pmatrix}7 & -1 & 5\\\\2 & -7 & -2\\\\-8 & 3 & -1\\end{pmatrix}",
                "solution": "\\begin{pmatrix}13 & 14 & 37\\\\18 & 33 & 24\\\\-50 & -13 & -47\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "cramer_single_var",
                "latex": "\\text{크래머 공식(Cramer's Rule)을 적용하여 다음 연립방정식의 미지수 } x \\text{ 의 값을 구하시오: } \\begin{cases}- 8 x + 5 y + z = 37\\\\3 x + 4 y - 3 z = -57\\\\2 x + z = -13\\end{cases}",
                "solution": "-8"
            }
        ]
    },
    {
        "id": "alg_col_14",
        "name": "행렬과 연립일차방정식 14",
        "problems": [
            {
                "level": 1,
                "template": "sys_unique",
                "latex": "\\text{가우스 소거법을 이용하여 다음 연립일차방정식의 해를 구하시오 (첨가행렬 } [A|B] \\text{ 를 기약 행사다리꼴로 변형하시오): } \\begin{cases}- 3 x + 5 y - z = 11\\\\- x - 3 y + 5 z = -25\\\\- 4 x + 4 y = 0\\end{cases}",
                "solution": "\\begin{pmatrix}5\\\\5\\\\-1\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "mat_inverse",
                "latex": "\\text{첨가행렬 } [A|I] \\text{ 에 기본 행연산을 적용하여 다음 행렬 } A \\text{ 의 역행렬을 구하시오: } A=\\begin{pmatrix}-1 & -1 & 1\\\\0 & -9 & 4\\\\0 & 2 & -1\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-1 & -1 & -5\\\\0 & -1 & -4\\\\0 & -2 & -9\\end{pmatrix}"
            },
            {
                "level": 3,
                "template": "rref_interpret",
                "latex": "\\text{연립일차방정식을 행렬로 나타내고 가우스 소거법을 이용하여 다음과 같은 행렬을 얻었을 때, } \\text{주어진 연립일차방정식의 해를 구하시오 (해가 무수히 많으면 자유변수를 } t \\text{ 로 두고, 해가 없으면 \"포기\" 버튼을 이용하시오): } \\begin{pmatrix}1 & 3 & -3\\\\0 & 1 & 1\\\\0 & 0 & 0\\end{pmatrix}\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix} = \\begin{pmatrix}-2\\\\4\\\\0\\end{pmatrix}",
                "solution": "\\begin{pmatrix}6 t - 14\\\\4 - t\\\\t\\end{pmatrix}"
            },
            {
                "level": 1,
                "template": "minor_cofactor",
                "latex": "\\text{다음 } 3\\times 3 \\text{ 행렬 } A \\text{ 에서 원소 } a_{12} \\text{ 의 소행렬식 } M_{12} \\text{ 과 여인수 } C_{12} \\text{ 를 차례로 구하시오 (답은 } M_{12}, C_{12} \\text{ 순서의 } 2\\times 1 \\text{ 벡터로 입력하시오): } A=\\begin{pmatrix}7 & -3 & 6\\\\-2 & -1 & -6\\\\9 & 7 & -9\\end{pmatrix}",
                "solution": "\\begin{pmatrix}72\\\\-72\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "det_cofactor_expand",
                "latex": "\\text{제 2행에 대한 여인수 전개를 이용하여 다음 } 3\\times 3 \\text{ 행렬 } A \\text{ 의 행렬식 } \\det(A) \\text{ 를 계산하시오: } A=\\begin{pmatrix}-4 & -6 & -1\\\\-2 & -7 & -6\\\\-3 & -8 & 6\\end{pmatrix}",
                "solution": "185"
            },
            {
                "level": 2,
                "template": "det_properties",
                "latex": "3\\times 3 \\text{ 정사각행렬 } A, B \\text{ 에 대하여 } \\det(A)=1, \\ \\det(B)=-2 \\text{ 일 때, } \\det\\left((AB)^{2}\\right) \\text{ 의 값을 구하시오: }",
                "solution": "4"
            },
            {
                "level": 2,
                "template": "adjoint_matrix",
                "latex": "\\text{다음 행렬 } A \\text{ 의 여인수행렬을 구하고, 이를 전치하여 딸림행렬(수반행렬) } \\operatorname{adj}(A) \\text{ 를 구하시오: } A=\\begin{pmatrix}0 & 7 & 1\\\\1 & 1 & 6\\\\3 & 2 & -6\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-18 & 44 & 41\\\\24 & -3 & 1\\\\-1 & 21 & -7\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "cramer_single_var",
                "latex": "\\text{크래머 공식(Cramer's Rule)을 적용하여 다음 연립방정식의 미지수 } y \\text{ 의 값을 구하시오: } \\begin{cases}x - 4 y - z = 3\\\\2 x - 2 y - 7 z = 43\\\\3 x - 5 z = 43\\end{cases}",
                "solution": "2"
            }
        ]
    },
    {
        "id": "alg_col_15",
        "name": "행렬과 연립일차방정식 15",
        "problems": [
            {
                "level": 2,
                "template": "mat_inverse",
                "latex": "\\text{첨가행렬 } [A|I] \\text{ 에 기본 행연산을 적용하여 다음 행렬 } A \\text{ 의 역행렬을 구하시오: } A=\\begin{pmatrix}-1 & -1 & 2\\\\-3 & 0 & 5\\\\4 & 3 & -8\\end{pmatrix}",
                "solution": "\\begin{pmatrix}-15 & -2 & -5\\\\-4 & 0 & -1\\\\-9 & -1 & -3\\end{pmatrix}"
            },
            {
                "level": 1,
                "template": "minor_cofactor",
                "latex": "\\text{다음 } 3\\times 3 \\text{ 행렬 } A \\text{ 에서 원소 } a_{11} \\text{ 의 소행렬식 } M_{11} \\text{ 과 여인수 } C_{11} \\text{ 를 차례로 구하시오 (답은 } M_{11}, C_{11} \\text{ 순서의 } 2\\times 1 \\text{ 벡터로 입력하시오): } A=\\begin{pmatrix}-1 & -3 & -5\\\\10 & 4 & 6\\\\-5 & -1 & 10\\end{pmatrix}",
                "solution": "\\begin{pmatrix}46\\\\46\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "det_cofactor_expand",
                "latex": "\\text{제 2행에 대한 여인수 전개를 이용하여 다음 } 3\\times 3 \\text{ 행렬 } A \\text{ 의 행렬식 } \\det(A) \\text{ 를 계산하시오: } A=\\begin{pmatrix}1 & 4 & 3\\\\1 & -6 & 3\\\\8 & 1 & 5\\end{pmatrix}",
                "solution": "190"
            },
            {
                "level": 2,
                "template": "det_properties",
                "latex": "3\\times 3 \\text{ 정사각행렬 } A \\text{ 에 대하여 } \\det(A)=-4 \\text{ 일 때, } \\det(2A) \\text{ 의 값을 구하시오: }",
                "solution": "-32"
            },
            {
                "level": 2,
                "template": "adjoint_matrix",
                "latex": "\\text{다음 행렬 } A \\text{ 의 여인수행렬을 구하고, 이를 전치하여 딸림행렬(수반행렬) } \\operatorname{adj}(A) \\text{ 를 구하시오: } A=\\begin{pmatrix}-8 & -6 & 1\\\\-5 & 7 & -2\\\\-5 & 1 & 2\\end{pmatrix}",
                "solution": "\\begin{pmatrix}16 & 13 & 5\\\\20 & -11 & -21\\\\30 & 38 & -86\\end{pmatrix}"
            },
            {
                "level": 2,
                "template": "cramer_single_var",
                "latex": "\\text{크래머 공식(Cramer's Rule)을 적용하여 다음 연립방정식의 미지수 } x \\text{ 의 값을 구하시오: } \\begin{cases}5 x - 3 y + 5 z = 15\\\\- 6 x + 4 y - 2 z = -40\\\\- 4 x - y + 3 z = -30\\end{cases}",
                "solution": "5"
            }
        ]
    }
];
