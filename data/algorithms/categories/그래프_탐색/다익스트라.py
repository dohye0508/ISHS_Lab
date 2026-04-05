import heapq

V, E = map(int, input().split())

graph = [[] for _ in range(V+1)]

for _ in range(E):
    a, b, cost = map(int, input().split())
    graph[a].append((cost, b))
    graph[b].append((cost, a))

visited = [False] * (V+1)

pq = []
heapq.heappush(pq, (0, 1))

result = 0

while pq:
    cost, node = heapq.heappop(pq)
    
    if visited[node]:
        continue
    
    visited[node] = True
    result += cost
    
    for next_cost, next_node in graph[node]:
        if not visited[next_node]:
            heapq.heappush(pq, (next_cost, next_node))

print(result)