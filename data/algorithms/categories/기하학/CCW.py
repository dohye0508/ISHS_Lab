'''
CCW (Counter Clockwise) 
세 점 A, B, C가 주어졌을 때 이 세 점의 방향성(반시계, 시계, 일직선)을 판별하는 기하학 핵심 알고리즘.
신발끈 공식(외적)을 사용하여 양수면 반시계 방향, 음수면 시계 방향, 0이면 일직선 상에 있음을 의미합니다.

[입력 예시]
1 1
5 5
7 3

[출력 예시]
-1
'''
import sys

def ccw(x1, y1, x2, y2, x3, y3):
    return (x1 * y2 + x2 * y3 + x3 * y1) - (x2 * y1 + x3 * y2 + x1 * y3)

lines = []
for _ in range(3):
    lines.append(list(map(int, sys.stdin.readline().split())))

p1, p2, p3 = lines[0], lines[1], lines[2]
result = ccw(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1])

if result > 0:
    print("1 (반시계 방향)")
elif result < 0:
    print("-1 (시계 방향)")
else:
    print("0 (일직선)")
