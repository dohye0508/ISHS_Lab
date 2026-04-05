'''
볼록 껍질 (Convex Hull) - 그라함 스캔(Graham Scan) / 모노톤 체인
2차원 평면 위에 여러 점이 있을 때, 가장 바깥쪽에 있는 점들을 연결해 모든 점을 포함하는 볼록 다각형을 만드는 알고리즘.
모노톤 체인 방식을 사용하기 위해 위치를 기준으로 정렬 (x좌표 우선, y좌표 차선)하고
아래 껍질(Lower Hull)과 위 껍질(Upper Hull)을 각각 구합니다.
처음과 끝 점은 lower/upper 양쪽에서 중복으로 포함되므로 둘 중 한 군데에서는 제외하고 합칩니다.

[입력 예시]
5 3
1 2
2 3
3 4
4 5

[출력 예시]
1
2
3 4 5
'''
import sys

def ccw(x1, y1, x2, y2, x3, y3):
    return (x1 * y2 + x2 * y3 + x3 * y1) - (x2 * y1 + x3 * y2 + x1 * y3)

n = int(sys.stdin.readline())
points = []
for _ in range(n):
    points.append(list(map(int, sys.stdin.readline().split())))

points.sort()

lower = []
for p in points:
    while len(lower) >= 2 and ccw(lower[-2][0], lower[-2][1], lower[-1][0], lower[-1][1], p[0], p[1]) <= 0:
        lower.pop()
    lower.append(p)

upper = []
for p in reversed(points):
    while len(upper) >= 2 and ccw(upper[-2][0], upper[-2][1], upper[-1][0], upper[-1][1], p[0], p[1]) <= 0:
        upper.pop()
    upper.append(p)

convex_hull = lower[:-1] + upper[:-1]

print(len(convex_hull))
for pt in convex_hull:
    print(pt[0], pt[1])
