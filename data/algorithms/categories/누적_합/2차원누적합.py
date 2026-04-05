'''
2차원 배열 누적 합 (2D Prefix Sum)
2차원 격자에서 지정된 특정 직사각형 영역의 합을 O(1) 시간만에 빠르게 계산하는 알고리즘.

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

n, m = map(int, sys.stdin.readline().split())
graph = [list(map(int, sys.stdin.readline().split())) for _ in range(n)]

prefix_2d = [[0] * (n + 1) for _ in range(n + 1)]

for i in range(1, n + 1):
    for j in range(1, n + 1):
        prefix_2d[i][j] = graph[i - 1][j - 1] + prefix_2d[i - 1][j] + prefix_2d[i][j - 1] - prefix_2d[i - 1][j - 1]

for _ in range(m):
    r1, c1, r2, c2 = map(int, sys.stdin.readline().split())
    result = prefix_2d[r2][c2] - prefix_2d[r1 - 1][c2] - prefix_2d[r2][c1 - 1] + prefix_2d[r1 - 1][c1 - 1]
    print(result)
