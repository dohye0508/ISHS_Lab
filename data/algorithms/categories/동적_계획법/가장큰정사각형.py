'''
가장 큰 정사각형 (Largest Square in a Matrix) - 2D DP
0과 1로 이루어진 격자 안에서 값이 1로만 이루어진 가장 큰 정사각형의 크기(넓이)를 구하는 알고리즘입니다.
자신의 왼쪽, 위쪽, 왼쪽 대각선 위쪽의 최솟값을 참조하여 한 변의 길이를 점진적으로 업데이트합니다.

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
graph = [list(map(int, list(sys.stdin.readline().strip()))) for _ in range(n)]

dp = [[0] * m for _ in range(n)]
max_side = 0

for i in range(n):
    for j in range(m):
        if i == 0 or j == 0:
            dp[i][j] = graph[i][j]
        elif graph[i][j] == 1:
            dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
            
        max_side = max(max_side, dp[i][j])

print(max_side * max_side)
