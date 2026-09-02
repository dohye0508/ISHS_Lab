/*
가장 큰 정사각형 (Largest Square in a Matrix) - 2D DP
- 백준 난이도: 골드 IV
0과 1로 이루어진 격자 안에서 값이 1로만 이루어진 가장 큰 정사각형의 크기(넓이)를 구하는 알고리즘입니다.
자신의 왼쪽, 위쪽, 왼쪽 대각선 위쪽의 최솟값을 참조하여 한 변의 길이를 점진적으로 업데이트합니다.

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
#include <string>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n, m;
    cin >> n >> m;
    vector<vector<int>> graph(n, vector<int>(m));
    for (int i = 0; i < n; i++) {
        string row;
        cin >> row;
        for (int j = 0; j < m; j++) {
            graph[i][j] = row[j] - '0';
        }
    }

    // 문제 해결 로직
    vector<vector<int>> dp(n, vector<int>(m, 0));
    int max_side = 0;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (i == 0 || j == 0) {
                dp[i][j] = graph[i][j];
            } else if (graph[i][j] == 1) {
                dp[i][j] = min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]}) + 1;
            }

            max_side = max(max_side, dp[i][j]);
        }
    }

    // 결과 출력
    cout << (long long)max_side * max_side << "\n";

    return 0;
}
