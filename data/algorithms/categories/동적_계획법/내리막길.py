'''
내리막 길 (Grid Path with DFS + DP) 
격자 위에서 시작점부터 도착점까지 이동할 때, 인접한 4방향 중 항상 '높이가 더 낮은 곳'으로만 가는 경로의 개수를 구하는 알고리즘입니다.
일반적인 BFS/DFS로는 겹치는 경로 탐색 때문에 시간 초과가 나므로, DFS에 DP(메모이제이션)를 결합하여 O(N*M)의 시간 안에 풉니다.

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
sys.setrecursionlimit(10**6)

m, n = map(int, sys.stdin.readline().split())
heights = [list(map(int, sys.stdin.readline().split())) for _ in range(m)]

# 방문하지 않은 곳은 -1, 경로가 없으면 0, 있으면 해당 경로의 수 저장
dp = [[-1] * n for _ in range(m)]

dx = [-1, 1, 0, 0]
dy = [0, 0, -1, 1]

def dfs(x, y):
    if x == m - 1 and y == n - 1:
        return 1
        
    if dp[x][y] != -1:
        return dp[x][y]
        
    dp[x][y] = 0
    
    for i in range(4):
        nx = x + dx[i]
        ny = y + dy[i]
        
        if 0 <= nx < m and 0 <= ny < n:
            if heights[nx][ny] < heights[x][y]:
                dp[x][y] += dfs(nx, ny)
                
    return dp[x][y]

print(dfs(0, 0))
