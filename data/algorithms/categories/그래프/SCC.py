'''
[문제 제목]: 강한 연결 요소 (SCC, Tarjan's Algorithm)
- 문제 설명: 방향 그래프에서 모든 정점 쌍 (u, v)에 대해 u에서 v로, v에서 u로 가는 경로가 모두 존재하는 정점의 집합을 찾습니다. 타잔 알고리즘은 DFS를 이용해 한 번의 탐색으로 모든 SCC를 찾아냅니다.
- 시간 복잡도: O(V + E)

[입력 예시]
7 9
1 4
4 5
5 1
1 6
6 7
7 2
2 7
7 3
3 7

[출력 예시]
3
1 4 5 -1
2 3 7 -1
6 -1
'''
import sys
input = sys.stdin.readline
sys.setrecursionlimit(10**6)

# 데이터 입력
v, e = map(int, input().split())
adj = [[] for _ in range(v + 1)]
for _ in range(e):
    a, b = map(int, input().split())
    adj[a].append(b)

# 문제 해결 로직
id_cnt = 0
ids = [0] * (v + 1)
finished = [False] * (v + 1)
stack = []
scc_list = []

def dfs(curr):
    global id_cnt
    id_cnt += 1
    ids[curr] = id_cnt
    parent = ids[curr]
    stack.append(curr)

    for next_node in adj[curr]:
        if ids[next_node] == 0:
            parent = min(parent, dfs(next_node))
        elif not finished[next_node]:
            parent = min(parent, ids[next_node])

    if parent == ids[curr]:
        scc = []
        while True:
            t = stack.pop()
            scc.append(t)
            finished[t] = True
            if t == curr:
                break
        scc_list.append(sorted(scc))
    
    return parent

for i in range(1, v + 1):
    if ids[i] == 0:
        dfs(i)

scc_list.sort()

# 결과 출력
print(len(scc_list))
for scc in scc_list:
    print(*(scc), -1)
