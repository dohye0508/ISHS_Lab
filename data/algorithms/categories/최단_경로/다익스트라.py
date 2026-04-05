'''
다익스트라 알고리즘 (Dijkstra's Algorithm)

[작동 원리]
하나의 시작 정점으로부터 다른 모든 정점까지의 가장 짧은 경로를 구하는 최단 경로 알고리즘입니다.
음의 간선이 없을 때만 사용 가능합니다.
우선순위 큐(Min Heap)를 사용하여 현재 방문한 정점들 중 가장 비용이 적은 정점을 꺼내고, 그 정점을 거쳐서 가는 경로가 기존 경로보다 더 짧다면 비용 배열을 갱신하는 그리디(Greedy) 방식입니다.

[시간 복잡도]
O(E log V) (E: 간선의 수, V: 정점의 수)

[입력 예시]
5 6
1
1 2 2
1 3 3
2 3 4
2 4 5
3 4 6
5 1 1

[출력 예시]
0
2
3
7
INF
'''
import heapq
import sys

INF = int(1e9)

def dijkstra(start, graph, distance):
    q = []
    heapq.heappush(q, (0, start))
    distance[start] = 0
    while q:
        dist, now = heapq.heappop(q)
        if distance[now] < dist:
            continue
        for i in graph[now]:
            cost = dist + i[1]
            if cost < distance[i[0]]:
                distance[i[0]] = cost
                heapq.heappush(q, (cost, i[0]))

n, m = map(int, sys.stdin.readline().split())
start = int(sys.stdin.readline())
graph = [[] for _ in range(n + 1)]
distance = [INF] * (n + 1)

for _ in range(m):
    a, b, c = map(int, sys.stdin.readline().split())
    graph[a].append((b, c))

dijkstra(start, graph, distance)

for i in range(1, n + 1):
    if distance[i] == INF:
        print("INF")
    else:
        print(distance[i])
