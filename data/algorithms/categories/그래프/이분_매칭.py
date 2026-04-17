'''
[문제 제목]: 이분 매칭 (Bipartite Matching)
- 문제 설명: 두 개의 그룹으로 나누어진 정점들 사이에서, 각 정점이 최대 하나의 간선에만 포함되도록 정점 쌍을 선택하는 최대 매칭을 구합니다. DFS를 이용한 증가 경로 찾기 방식으로 구현합니다.
- 시간 복잡도: O(V * E)

[입력 예시]
5 5
2 1 2
2 1 4
1 3
2 3 5
2 4 5

[출력 예시]
4
'''
import sys
input = sys.stdin.readline
sys.setrecursionlimit(10**6)

# 데이터 입력
n, m = map(int, input().split())
adj = [[] for _ in range(n + 1)]
for i in range(1, n + 1):
    line = list(map(int, input().split()))
    if line[0] > 0:
        for target in line[1:]:
            adj[i].append(target)

# 문제 해결 로직
match = [0] * (m + 1)
visited = [False] * (n + 1)

def dfs(u):
    for v in adj[u]:
        if visited[v]:
            continue
        visited[v] = True
        if match[v] == 0 or dfs(match[v]):
            match[v] = u
            return True
    return False

count = 0
for i in range(1, n + 1):
    visited = [False] * (m + 1) # v 그룹에 대한 방문 처리
    if dfs(i):
        count += 1

# 결과 출력
print(count)
