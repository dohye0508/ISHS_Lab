'''
최소 공통 조상 (LCA, Lowest Common Ancestor)
트리 구조에서 임의의 두 노드가 주어졌을 때, 두 노드의 공통된 조상 중에서 가장 가까운(깊이가 가장 깊은) 조상을 구하는 알고리즘.
촌수 계산, 트리 내에서 두 노드 간의 거리 계산 등에 사용.

[입력 예시]
15
1 2
1 3
2 4
3 7
6 2
3 8
4 9
2 5
5 11
7 13
10 4
11 15
12 5
14 7
6
6 11
10 9
2 6
7 6
8 13
8 15

[출력 예시]
2
4
2
1
3
1
'''
import sys
sys.setrecursionlimit(10**5)

n = int(sys.stdin.readline())
parent = [[0] * 21 for _ in range(n + 1)]
d = [0] * (n + 1)
c = [False] * (n + 1)
graph = [[] for _ in range(n + 1)]

for _ in range(n - 1):
    a, b = map(int, sys.stdin.readline().split())
    graph[a].append(b)
    graph[b].append(a)

def dfs(x, depth):
    c[x] = True
    d[x] = depth
    for y in graph[x]:
        if c[y]:
            continue
        parent[y][0] = x
        dfs(y, depth + 1)

def set_parent():
    dfs(1, 0)
    for i in range(1, 21):
        for j in range(1, n + 1):
            parent[j][i] = parent[parent[j][i - 1]][i - 1]

def lca(a, b):
    if d[a] > d[b]:
        a, b = b, a
    for i in range(20, -1, -1):
        if d[b] - d[a] >= (1 << i):
            b = parent[b][i]
    if a == b:
        return a
    for i in range(20, -1, -1):
        if parent[a][i] != parent[b][i]:
            a = parent[a][i]
            b = parent[b][i]
    return parent[a][0]

set_parent()

m = int(sys.stdin.readline())
for _ in range(m):
    a, b = map(int, sys.stdin.readline().split())
    print(lca(a, b))
