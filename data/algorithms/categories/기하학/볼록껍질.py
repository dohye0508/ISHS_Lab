'''
볼록 껍질 (Convex Hull) - 모노톤 체인(Monotone Chain) 알고리즘
주어진 점들을 모두 포함하는 가장 작은 볼록 다각형을 구하는 알고리즘입니다.

[작동 원리]
1. x좌표 기준으로 점들을 정렬합니다.
2. 아래쪽 껍질(Lower Hull)과 위쪽 껍질(Upper Hull)을 순차적으로 구성합니다.
3. CCW(Counter Clockwise)를 통해 회전 방향이 어긋나면 이전 점을 제외(Pop)하며 울타리를 만듭니다.

[입력 예시]
8                 <- (점들의 개수 N)
1 1               <- (N개의 좌표 x, y)
1 2
2 2
...
0 2

[출력 예시]
5                 <- (볼록 껍질을 구성하는 점의 개수)
0 0               <- (볼록 껍질 꼭짓점 좌표들)
2 1
...
0 0
'''
import sys

def ccw(p1, p2, p3):
    return (p2[0] - p1[0]) * (p3[1] - p1[1]) - (p2[1] - p1[1]) * (p3[0] - p1[0])

input_data = sys.stdin.read().split()
if input_data:
    n = int(input_data[0])
    points = []
    for i in range(n):
        points.append((int(input_data[1 + i*2]), int(input_data[2 + i*2])))

    points.sort()

    lower = []
    for p in points:
        while len(lower) >= 2:
            if ccw(lower[-2], lower[-1], p) > 0:
                break
            lower.pop()
        lower.append(p)

    upper = []
    for p in reversed(points):
        while len(upper) >= 2:
            if ccw(upper[-2], upper[-1], p) > 0:
                break
            upper.pop()
        upper.append(p)

    hull = lower[:-1] + upper[:-1]
    
    print(len(hull))
    for p in hull:
        print(f"{p[0]} {p[1]}")
