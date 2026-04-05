'''
위상 정렬 (Topological Sorting)
방향 그래프에서 그래프의 모든 노드를 방향성에 거스르지 않도록 순서대로 나열하는 알고리즘.
선수 과목을 고려한 수강 신청, 작업의 순서 결정 등에 사용. (사이클이 없어야 함)

[입력 예시]
3 2
1 3
2 3

[출력 예시]
1 2 3
'''
import sys
from collections import deque

v, e = map(int, sys.stdin.readline().split())
indegree = [0] * (v + 1)
graph = [[] for _ in range(v + 1)]

for _ in range(e):
    a, b = map(int, sys.stdin.readline().split())
    graph[a].append(b)
    indegree[b] += 1

result = []
q = deque()

for i in range(1, v + 1):
    if indegree[i] == 0:
        q.append(i)

while q:
    now = q.popleft()
    result.append(now)
    for i in graph[now]:
        indegree[i] -= 1
        if indegree[i] == 0:
            q.append(i)

for i in result:
    print(i, end=' ')
