'''
너비 우선 탐색 (BFS) - 최단거리 (일반 그래프)
방향 벡터가 없는 일반적인 인접 리스트 형태의 그래프에서 시작점부터 목표점까지의 최단 거리를 구하는 알고리즘입니다.
모든 간선의 길이가 같을 때 최단 거리를 찾는 데 최적화되어 있습니다.
시간 복잡도: O(V + E)

[입력 예시]
4 5 1
1 2
1 3
1 4
2 4
3 4

[출력 예시]
1 2 3 4
'''
import sys
from collections import deque

n, m, start = map(int, sys.stdin.readline().split())
graph = [[] for _ in range(n + 1)]

for _ in range(m):
    a, b = map(int, sys.stdin.readline().split())
    graph[a].append(b)
    graph[b].append(a)

distance = [-1] * (n + 1)

def bfs(start_node):
    queue = deque([start_node])
    distance[start_node] = 0
    
    while queue:
        curr = queue.popleft()
        
        for adj in graph[curr]:
            if distance[adj] == -1:
                distance[adj] = distance[curr] + 1
                queue.append(adj)

bfs(start)

for i in range(1, n + 1):
    print(distance[i])
