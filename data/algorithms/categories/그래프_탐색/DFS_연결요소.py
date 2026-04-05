'''
깊이 우선 탐색 (DFS) - 연결요소
스택 또는 재귀함수를 이용하여 그래프의 깊은 부분을 먼저 탐색하는 알고리즘입니다.
그래프 전체를 깊게 탐색할 때 사용하는 경로 찾기/연결 요소 세기 알고리즘.
시간 복잡도: O(V + E)

[입력 예시]
4 5 1
1 2
1 3
1 4
2 4
3 4

[출력 예시]
1 2 4 3
'''
import sys
sys.setrecursionlimit(10**5)

def dfs(x, y, n, m, graph):
    if x <= -1 or x >= n or y <= -1 or y >= m:
        return False
    if graph[x][y] == 0:
        graph[x][y] = 1
        dfs(x - 1, y, n, m, graph)
        dfs(x, y - 1, n, m, graph)
        dfs(x + 1, y, n, m, graph)
        dfs(x, y + 1, n, m, graph)
        return True
    return False

n, m = map(int, sys.stdin.readline().split())
graph = []

for _ in range(n):
    graph.append(list(map(int, list(sys.stdin.readline().rstrip()))))
    
result = 0
for i in range(n):
    for j in range(m):
        if dfs(i, j, n, m, graph):
            result += 1

print(result)
