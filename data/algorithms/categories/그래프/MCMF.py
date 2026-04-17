'''
[문제 제목]: 최소 비용 최대 유량 (MCMF - Minimum Cost Maximum Flow)
- 문제 설명: 네트워크 유량 문제에서 각 간선에 비용이 추가된 경우, 주어진 유량을 보낼 때 발생하는 최소 비용을 구합니다. SPFA 알고리즘을 사용하여 최단 경로(최소 비용 경로)를 찾으며 유량을 보냅니다.
- 시간 복잡도: O(F * E * V) (F는 최대 유량)

[입력 예시]
5 6
1 2 1 1
1 3 2 1
2 3 1 1
2 4 1 2
3 5 2 1
4 5 1 1

[출력 예시]
2 6
'''
import sys
from collections import deque
input = sys.stdin.readline

# 데이터 입력
n, m = map(int, input().split())
adj = [[] for _ in range(n + 1)]
capacity = [[0] * (n + 1) for _ in range(n + 1)]
flow = [[0] * (n + 1) for _ in range(n + 1)]
cost = [[0] * (n + 1) for _ in range(n + 1)]

for _ in range(m):
    u, v, c, w = map(int, input().split())
    adj[u].append(v)
    adj[v].append(u)
    capacity[u][v] = c
    cost[u][v] = w
    cost[v][u] = -w

# 문제 해결 로직
total_flow = 0
total_cost = 0
source, sink = 1, n

while True:
    parent = [-1] * (n + 1)
    dist = [float('inf')] * (n + 1)
    in_queue = [False] * (n + 1)
    queue = deque([source])
    dist[source] = 0
    in_queue[source] = True

    while queue:
        u = queue.popleft()
        in_queue[u] = False
        for v in adj[u]:
            if capacity[u][v] - flow[u][v] > 0 and dist[v] > dist[u] + cost[u][v]:
                dist[v] = dist[u] + cost[u][v]
                parent[v] = u
                if not in_queue[v]:
                    queue.append(v)
                    in_queue[v] = True
    
    if parent[sink] == -1:
        break

    f = float('inf')
    curr = sink
    while curr != source:
        prev = parent[curr]
        f = min(f, capacity[prev][curr] - flow[prev][curr])
        curr = prev
    
    total_flow += f
    curr = sink
    while curr != source:
        prev = parent[curr]
        total_cost += f * cost[prev][curr]
        flow[prev][curr] += f
        flow[curr][prev] -= f
        curr = prev

# 결과 출력
print(total_flow, total_cost)
