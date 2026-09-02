/*
2차원 격자 이동 DP (Grid Path DP)
- 백준 난이도: 실버 II
N x M 크기의 격자 형태 미로에서 이동 제약 조건(예: 오른쪽이나 아래로만 이동 가능)이 있을 때 도달하는 최소 비용, 혹은 가능한 경로의 수를 찾는 알고리즘.
특정 칸에 장애물이 있거나 각 칸마다 밟았을 때 얻는/잃는 점수가 다를 때 최대/최소 이득 수치를 산출함.

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
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n, m;
    cin >> n >> m;
    vector<vector<long long>> grid(n, vector<long long>(m));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> grid[i][j];
        }
    }

    // 문제 해결 로직
    vector<vector<long long>> dp(n, vector<long long>(m, 0));
    dp[0][0] = grid[0][0];

    for (int i = 1; i < m; i++) {
        dp[0][i] = dp[0][i - 1] + grid[0][i];
    }

    for (int i = 1; i < n; i++) {
        dp[i][0] = dp[i - 1][0] + grid[i][0];
    }

    for (int i = 1; i < n; i++) {
        for (int j = 1; j < m; j++) {
            dp[i][j] = grid[i][j] + max(dp[i - 1][j], dp[i][j - 1]);
        }
    }

    // 결과 출력
    cout << dp[n - 1][m - 1] << "\n";

    return 0;
}
