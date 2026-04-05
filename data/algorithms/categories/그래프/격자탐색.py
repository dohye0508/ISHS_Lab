'''
격자 그래프 탐색 (Grid Traversal / Flood Fill)
2차원 배열(격자)에서 4방향(상, 하, 좌, 우) 또는 8방향 벡터를 이용하여 인접한 칸을 탐색하는 알고리즘.
미로 찾기, 영역 넓이 구하기, 섬의 개수 세기, 토마토 익히기 등의 정올(Olympiad) 빈출 유형에 주로 결합됩니다.

[입력 예시]
4 5
10111
10101
10101
11101

[출력 예시]
15
'''
import sys
from collections import deque

r, c = map(int, sys.stdin.readline().split())
grid = [list(map(int, sys.stdin.readline().split())) for _ in range(r)]
visited = [[False] * c for _ in range(r)]

dr = [-1, 1, 0, 0]
dc = [0, 0, -1, 1]

def process_bfs(start_r, start_c):
    queue = deque()
    queue.append((start_r, start_c))
    visited[start_r][start_c] = True
    area_count = 1
    
    while queue:
        curr_r, curr_c = queue.popleft()
        
        for i in range(4):
            nr = curr_r + dr[i]
            nc = curr_c + dc[i]
            
            if 0 <= nr < r and 0 <= nc < c:
                if not visited[nr][nc] and grid[nr][nc] == 0:
                    visited[nr][nc] = True
                    queue.append((nr, nc))
                    area_count += 1
                    
    return area_count

total_areas = 0
for i in range(r):
    for j in range(c):
        if not visited[i][j] and grid[i][j] == 0:
            area_size = process_bfs(i, j)
            total_areas += 1

print(total_areas)
