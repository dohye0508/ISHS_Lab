'''
다익스트라 알고리즘 (Dijkstra's Algorithm)
그래프의 한 지점에서 다른 모든 노드로 가는 최단 경로를 구하는 알고리즘입니다.

[작동 원리]
1. 출발 노드의 거리를 0으로, 나머지를 무한대로 초기화합니다.
2. 거리가 가장 짧은 노드를 선택하여 주변 노드의 거리를 갱신(Relaxation)합니다.
3. 우선순위 큐(Priority Queue)를 사용하여 선택 과정의 효율성을 높입니다.

[입력 예시]
6 11              <- (노드의 개수 N, 간선의 개수 M)
1                 <- (시작 노드의 번호 K)
1 2 2             <- (M개의 간선 정보: u, v, w)
1 3 5
...

[출력 예시]
0                 <- (시작 노드에서 i번 노드로 가는 최단 거리)
2
...
'''
import sys
import heapq

# 입력 받기
input_data = sys.stdin.read().split()
if input_data:
    n, m = map(int, input_data[:2])
    start = int(input_data[2])
    adj = [[] for _ in range(n + 1)]
    for i in range(m):
        u, v, w = map(int, input_data[3 + i*3 : 6 + i*3])
        adj[u].append((v, w))

    distance = [float('inf')] * (n + 1)
    distance[start] = 0
    q = [(0, start)]  # (거리, 노드)

    while q:
        dist, now = heapq.heappop(q)
        # 이미 처리된 노드라면 건너뜀
        if distance[now] < dist:
            continue
        
        # 현재 노드와 인접한 노드들 확인
        for next_node, weight in adj[now]:
            cost = dist + weight
            if cost < distance[next_node]:
                distance[next_node] = cost
                heapq.heappush(q, (cost, next_node))

    # 결과 출력
    for i in range(1, n + 1):
        if distance[i] == float('inf'): print("INF")
        else: print(distance[i])