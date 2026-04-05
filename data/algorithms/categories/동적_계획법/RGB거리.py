'''
RGB 거리 (RGB Street / Coloring Constraint) - State DP
N개의 집을 빨강, 초록, 파랑 중 하나로 칠할 때, 인접한 두 집의 색이 같지 않게 칠하는 비용의 최솟값을 구하는 알고리즘.
각 상태(R, G, B)에 대해 이전 단계에서 칠할 수 있는 색상의 최소 비용만을 누적해 나가는 상태 보존형 1D DP입니다.

[입력 예시]
3
26 40 83
49 60 57
13 89 99

[출력 예시]
96
'''
import sys

n = int(sys.stdin.readline())
cost = []

for _ in range(n):
    cost.append(list(map(int, sys.stdin.readline().split())))

for i in range(1, n):
    cost[i][0] += min(cost[i - 1][1], cost[i - 1][2]) # 현재 빨강 선택 -> 이전 집은 초록 or 파랑
    cost[i][1] += min(cost[i - 1][0], cost[i - 1][2]) # 현재 초록 선택 -> 이전 집은 빨강 or 파랑
    cost[i][2] += min(cost[i - 1][0], cost[i - 1][1]) # 현재 파랑 선택 -> 이전 집은 빨강 or 초록

print(min(cost[n - 1]))
