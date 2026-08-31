/*
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
*/
#include <bits/stdc++.h>
using namespace std;

int r, c;
vector<vector<int>> grid;
vector<vector<bool>> visited;
int dr[4] = {-1, 1, 0, 0};
int dc[4] = {0, 0, -1, 1};

int process_bfs(int start_r, int start_c) {
    queue<pair<int, int>> q;
    q.push({start_r, start_c});
    visited[start_r][start_c] = true;
    int area_count = 1;

    while (!q.empty()) {
        auto [curr_r, curr_c] = q.front();
        q.pop();

        for (int i = 0; i < 4; i++) {
            int nr = curr_r + dr[i];
            int nc = curr_c + dc[i];

            if (nr >= 0 && nr < r && nc >= 0 && nc < c) {
                if (!visited[nr][nc] && grid[nr][nc] == 0) {
                    visited[nr][nc] = true;
                    q.push({nr, nc});
                    area_count++;
                }
            }
        }
    }

    return area_count;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    cin >> r >> c;
    grid.assign(r, vector<int>(c));
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++)
            cin >> grid[i][j];
    visited.assign(r, vector<bool>(c, false));

    // 문제 해결 로직
    int total_areas = 0;
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            if (!visited[i][j] && grid[i][j] == 0) {
                process_bfs(i, j);
                total_areas++;
            }
        }
    }

    // 결과 출력
    cout << total_areas << "\n";

    return 0;
}
