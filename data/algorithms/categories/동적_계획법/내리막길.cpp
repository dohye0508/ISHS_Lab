/*
내리막 길 (Grid Path with DFS + DP)
- 백준 난이도: 골드 III
격자 위에서 시작점부터 도착점까지 이동할 때, 인접한 4방향 중 항상 '높이가 더 낮은 곳'으로만 가는 경로의 개수를 구하는 알고리즘입니다.
일반적인 BFS/DFS로는 겹치는 경로 탐색 때문에 시간 초과가 나므로, DFS에 DP(메모이제이션)를 결합하여 O(N*M)의 시간 안에 풉니다.

[입력 예시]
5 3
1 2
2 3
3 4
4 5

[출력 예시]
1
2
3 4 5
*/

#include <iostream>
#include <vector>

using namespace std;

int m, n;
vector<vector<int>> heights;
// 방문하지 않은 곳은 -1, 경로가 없으면 0, 있으면 해당 경로의 수 저장
vector<vector<long long>> dp;

int dx[4] = {-1, 1, 0, 0};
int dy[4] = {0, 0, -1, 1};

long long dfs(int x, int y) {
    if (x == m - 1 && y == n - 1) {
        return 1;
    }

    if (dp[x][y] != -1) {
        return dp[x][y];
    }

    dp[x][y] = 0;

    for (int i = 0; i < 4; i++) {
        int nx = x + dx[i];
        int ny = y + dy[i];

        if (0 <= nx && nx < m && 0 <= ny && ny < n) {
            if (heights[nx][ny] < heights[x][y]) {
                dp[x][y] += dfs(nx, ny);
            }
        }
    }

    return dp[x][y];
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    cin >> m >> n;
    heights.assign(m, vector<int>(n));
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            cin >> heights[i][j];
        }
    }
    dp.assign(m, vector<long long>(n, -1));

    // 문제 해결 로직
    long long result = dfs(0, 0);

    // 결과 출력
    cout << result << "\n";

    return 0;
}
