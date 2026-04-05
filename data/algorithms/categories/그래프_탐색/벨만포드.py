'''
벨만 포드 알고리즘 (Bellman-Ford Algorithm)

[작동 원리]
단일 출발점 최단 경로 알고리즘으로, 다익스트라와 달리 '음수 가중치'를 가진 간선이 있을 때도 사용할 수 있습니다.
모든 간선을 N-1번(V-1번) 확인하며 최단 거리를 갱신합니다.
만약 N번째(V번째) 확인에서 또 거리가 갱신된다면, 그래프 내에 무한히 비용이 줄어드는 '음수 사이클'이 존재함을 판단할 수 있습니다.

[시간 복잡도]
O(V * E)

[입력 예시]
3 4
1 2 4
1 3 3
2 3 -1
3 1 -2

[출력 예시]
4
3
'''
import sys

INF = int(1e9)

n, m = map(int, sys.stdin.readline().split())
edges = []
dist = [INF] * (n + 1)

for _ in range(m):
    a, b, c = map(int, sys.stdin.readline().split())
    edges.append((a, b, c))

def bf(start):
    dist[start] = 0
    for i in range(n):
        for j in range(m):
            cur_node = edges[j][0]
            next_node = edges[j][1]
            edge_cost = edges[j][2]
            
            if dist[cur_node] != INF and dist[next_node] > dist[cur_node] + edge_cost:
                dist[next_node] = dist[cur_node] + edge_cost
                if i == n - 1:
                    return True
    return False

negative_cycle = bf(1)

if negative_cycle:
    print("-1")
else:
    for i in range(2, n + 1):
        if dist[i] == INF:
            print("-1")
        else:
            print(dist[i])
