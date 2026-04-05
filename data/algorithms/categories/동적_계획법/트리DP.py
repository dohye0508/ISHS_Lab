'''
트리 DP (Tree DP)
트리 구조에서 자식 노드들의 DP 결괏값을 모아 부모 노드의 결괏값을 도출하는 알고리즘.
우수 마을 선정(독립 집합), 트리의 지름, 자식 노드 개수 세기 등에 사용.

[입력 예시]
9
1 3
2 3
4 3
5 4
6 4
7 4
8 7
9 7
1
4
3
7

[출력 예시]
1
5
9
3
'''
import sys
sys.setrecursionlimit(10**5)

n = int(sys.stdin.readline())
tree = [[] for _ in range(n + 1)]
for _ in range(n - 1):
    u, v = map(int, sys.stdin.readline().split())
    tree[u].append(v)
    tree[v].append(u)

dp = [[0, 0] for _ in range(n + 1)]
visited = [False] * (n + 1)

def dfs(node):
    visited[node] = True
    dp[node][0] = 0 
    dp[node][1] = 1 
    
    for child in tree[node]:
        if not visited[child]:
            dfs(child)
            dp[node][0] += max(dp[child][0], dp[child][1])
            dp[node][1] += dp[child][0]

dfs(1)
print(max(dp[1][0], dp[1][1]))
