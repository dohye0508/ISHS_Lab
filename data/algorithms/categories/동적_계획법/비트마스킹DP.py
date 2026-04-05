'''
외판원 순회 (TSP) - 비트마스킹 DP
방문한 노드들의 집합을 정수가 아닌 비트(이진수)로 표현하여 메모리를 절약하고 속도를 높이는 DP 알고리즘.
모든 도시를 한 번씩 방문하고 출발지로 돌아오는 최소 비용을 구할 때 사용.

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

n = int(sys.stdin.readline())
cost = [list(map(int, sys.stdin.readline().split())) for _ in range(n)]

INF = int(1e9)
dp = [[-1] * (1 << n) for _ in range(n)]

def dfs(x, visited):
    if visited == (1 << n) - 1:
        if cost[x][0]:
            return cost[x][0]
        else:
            return INF

    if dp[x][visited] != -1:
        return dp[x][visited]

    dp[x][visited] = INF
    for i in range(1, n):
        if not cost[x][i]:
            continue
        if visited & (1 << i):
            continue
        
        dp[x][visited] = min(dp[x][visited], dfs(i, visited | (1 << i)) + cost[x][i])
    
    return dp[x][visited]

print(dfs(0, 1))
