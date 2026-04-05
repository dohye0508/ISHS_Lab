'''
트리의 지름 (Diameter of Tree)
트리에서 가장 멀리 떨어진 두 노드 사이의 거리를 구하는 알고리즘입니다.
트리의 어떤 노드에서도 가장 먼 노드는 항상 지름의 한 쪽 끝점이라는 성질을 이용합니다.

[실전 활용처]
- 네트워크 설계: 네트워크 내 두 지점이 가장 멀리 떨어져 있는 상한 거리 계산.
- 트리 기반 구조 분석.

[알고리즘 순서]
1. 임의의 노드(보통 1번)에서 가장 먼 노드(A)를 찾습니다.
2. 노드 A에서 다시 가장 먼 노드(B)를 찾습니다.
3. A와 B 사이의 거리가 트리의 지름입니다.

[입력 예시]
5
1 2 2
1 3 3
2 4 4
2 5 5

[출력 예시]
11
'''
import sys

# 재귀 깊이 제한 설정
sys.setrecursionlimit(10**5)
input = sys.stdin.readline

def solve():
    try:
        line = input().strip()
        if not line: return
        n = int(line)
        adj = [[] for _ in range(n + 1)]
        for _ in range(n - 1):
            u, v, w = map(int, input().split())
            adj[u].append((v, w))
            adj[v].append((u, w))

        def bfs(start):
            # (거리, 노드번호) 반환
            dist = [-1] * (n + 1)
            dist[start] = 0
            q = [(start, 0)]
            
            max_dist = 0
            farthest_node = start
            
            while q:
                curr, d = q.pop(0)
                if d > max_dist:
                    max_dist = d
                    farthest_node = curr
                
                for next_node, weight in adj[curr]:
                    if dist[next_node] == -1:
                        dist[next_node] = d + weight
                        q.append((next_node, d + weight))
            
            return max_dist, farthest_node

        # 1. 임의의 점에서 가장 먼 점 찾기
        d1, n1 = bfs(1)
        # 2. 찾은 점에서 제일 먼 점까지의 거리 구하기
        d2, n2 = bfs(n1)
        
        print(d2)

    except (ValueError, EOFError):
        pass

if __name__ == "__main__":
    solve()
