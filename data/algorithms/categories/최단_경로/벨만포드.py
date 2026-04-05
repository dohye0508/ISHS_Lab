'''
벨만-포드 알고리즘 (Bellman-Ford)
그래프에서 한 출발점에서 모든 다른 노드까지의 최단 거리를 구하는 알고리즘입니다.
다익스트라와 달리 간선 가중치가 음수일 때도 작동하며, 음수 사이클 존재 여부를 감지할 수 있습니다.

[실전 활용처]
- 음수 가중치가 포함된 경로 찾기.
- 무한히 비용이 줄어드는 '음수 사이클' 탐지 (예: 타임머신 문제).

[시간 복잡도]
- O(VE) (V: 노드 수, E: 간선 수)

[입력 예시]
3 4
1 2 4
1 3 3
2 3 -1
3 1 -2

[출력 예시]
1에서 3까지 최단 거리: 3
'''
import sys

def solve():
    input_data = sys.stdin.read().split()
    if not input_data: return
    n, m = map(int, input_data[:2])
    edges = []
    for i in range(m):
        u, v, w = map(int, input_data[2 + i*3 : 2 + (i+1)*3])
        edges.append((u, v, w))

    # 1. 최단 거리 테이블 초기화
    dist = [float('inf')] * (n + 1)
    start_node = 1
    dist[start_node] = 0

    # 2. (노드 수 - 1)번 반복하여 모든 간선 확인
    for i in range(n):
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                # 3. n번째 반복에서도 값이 갱신되면 음수 사이클 존재
                if i == n - 1:
                    print("-1 (음수 사이클 존재)")
                    return

    # 결과 출력
    for i in range(1, n + 1):
        if dist[i] == float('inf'): print(f"{i}: 미도달")
        else: print(f"{i}: {dist[i]}")

if __name__ == "__main__":
    solve()
