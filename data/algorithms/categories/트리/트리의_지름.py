'''
트리의 지름 (Diameter of a Tree)
트리에서 가장 멀리 떨어진 두 노드 사이의 거리(지름)를 구하는 알고리즘.
원리:
임의의 노드(보통 1번)에서 가장 먼 노드 A를 찾고, A에서 가장 먼 노드 B를 찾으면 A와 B 사이의 거리가 트리의 지름이 됩니다.

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
from collections import deque

v = int(sys.stdin.readline())
graph = [[] for _ in range(v + 1)]

for _ in range(v):
    data = list(map(int, sys.stdin.readline().split()))
    node = data[0]
    idx = 1
    while data[idx] != -1:
        adj, dist = data[idx], data[idx + 1]
        graph[node].append((adj, dist))
        idx += 2

def bfs(start):
    visited = [-1] * (v + 1)
    queue = deque()
    queue.append(start)
    visited[start] = 0
    
    max_dist = 0
    farthest_node = start
    
    while queue:
        curr = queue.popleft()
        
        for adj, dist in graph[curr]:
            if visited[adj] == -1:
                visited[adj] = visited[curr] + dist
                queue.append(adj)
                if visited[adj] > max_dist:
                    max_dist = visited[adj]
                    farthest_node = adj
                    
    return farthest_node, max_dist

node_a, _ = bfs(1)
_, diameter = bfs(node_a)

print(diameter)
