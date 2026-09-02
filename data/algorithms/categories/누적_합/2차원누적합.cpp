/*
2차원 배열 누적 합 (2D Prefix Sum)
- 백준 난이도: 실버 I
2차원 격자에서 지정된 특정 직사각형 영역의 합을 O(1) 시간만에 빠르게 계산하는 알고리즘.

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

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n, m;
    cin >> n >> m;
    vector<vector<long long>> graph(n, vector<long long>(n));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cin >> graph[i][j];
        }
    }

    // 문제 해결 로직
    vector<vector<long long>> prefix_2d(n + 1, vector<long long>(n + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            prefix_2d[i][j] = graph[i - 1][j - 1] + prefix_2d[i - 1][j] + prefix_2d[i][j - 1] - prefix_2d[i - 1][j - 1];
        }
    }

    // 결과 출력
    for (int q = 0; q < m; q++) {
        int r1, c1, r2, c2;
        cin >> r1 >> c1 >> r2 >> c2;
        long long result = prefix_2d[r2][c2] - prefix_2d[r1 - 1][c2] - prefix_2d[r2][c1 - 1] + prefix_2d[r1 - 1][c1 - 1];
        cout << result << "\n";
    }

    return 0;
}
