/*
행렬 곱셈 순서 (Matrix Chain Multiplication) - DP
N개의 행렬을 연속해서 곱할 때, 어떤 순서로 괄호를 묶어 곱셈을 하느냐에 따라 연산 횟수가 달라집니다.
최소의 곱셈 연산 횟수를 구하는 2차원 구간 DP의 대표적인 사례입니다.
구간의 길이 L을 1부터 N-1까지 늘려가며 탐색하고,
i부터 k까지의 최소 횟수 + k+1부터 j까지의 최소 횟수 + 앞뒤 결과 행렬을 합치는 비용을 계산합니다.

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
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n;
    cin >> n;
    vector<pair<int, int>> matrices(n);
    for (int i = 0; i < n; i++) {
        cin >> matrices[i].first >> matrices[i].second;
    }

    // 문제 해결 로직
    vector<vector<long long>> dp(n, vector<long long>(n, 0));
    const long long INF = LLONG_MAX / 2;

    for (int L = 1; L < n; L++) {
        for (int i = 0; i < n - L; i++) {
            int j = i + L;
            dp[i][j] = INF;
            for (int k = i; k < j; k++) {
                long long cost = dp[i][k] + dp[k + 1][j] +
                    (long long)matrices[i].first * matrices[k].second * matrices[j].second;
                if (cost < dp[i][j]) dp[i][j] = cost;
            }
        }
    }

    // 결과 출력
    cout << dp[0][n - 1] << "\n";

    return 0;
}
