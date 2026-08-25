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
            }
        ]
    }
];