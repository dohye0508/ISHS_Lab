'''
최소 공통 조상 (LCA, Lowest Common Ancestor)
트리에서 두 노드 A, B의 가장 가까운 공통 조상을 찾는 알고리즘입니다.

[입력 예시]
15                  <- (전체 노드의 수 N)
1 2                 <- (N-1개의 간선 정보: u, v)
1 3
...
8 15                <- (공통 조상을 찾고 싶은 두 노드 u, v)

[출력 예시]
1                   <- (두 노드 u, v의 최소 공통 조상 노드 번호)
'''
import sys

# 재귀 깊이 제한 설정 (트리가 깊을 경우 필요)
sys.setrecursionlimit(10**5)
input_data = sys.stdin.read().split()

if input_data:
    n = int(input_data[0])
    adj = [[] for _ in range(n + 1)]
    for i in range(n - 1):
        u, v = map(int, input_data[1 + i*2 : 3 + i*2])
        adj[u].append(v)
        adj[v].append(u)

    # parent[i][k]: i의 2**k번 위 조상
    LOG = 17 
    parent = [[0] * LOG for _ in range(n + 1)]
    depth = [0] * (n + 1)
    visited = [False] * (n + 1)

    # 1. 트리 구성 및 깊이 계산 (DFS)
    def dfs(curr, d):
        visited[curr] = True
        depth[curr] = d
        for next_node in adj[curr]:
            if not visited[next_node]:
                parent[next_node][0] = curr
                dfs(next_node, d + 1)

    dfs(1, 0) # 1번 노드(루트)부터 시작

    # 2. Sparse Table 채우기 (조상 정보 전처리)
    for k in range(1, LOG):
        for i in range(1, n + 1):
            mid_parent = parent[i][k-1]
            if mid_parent != 0:
                parent[i][k] = parent[mid_parent][k-1]

    # 3. LCA 쿼리 처리
    def get_lca(a, b):
        if depth[a] > depth[b]: a, b = b, a
        
        # 깊이 맞추기
        diff = depth[b] - depth[a]
        for k in range(LOG - 1, -1, -1):
            if diff >= (2**k):
                b = parent[b][k]
                diff -= (2**k)

        if a == b: return a

        # 동시에 점프하여 공통 조상 직전까지 이동
        for k in range(LOG - 1, -1, -1):
            if parent[a][k] != parent[b][k]:
                a = parent[a][k]
                b = parent[b][k]

        return parent[a][0]

    # 마지막 입력값으로 쿼리 수행
    u, v = map(int, input_data[-2:])
    print(get_lca(u, v))
