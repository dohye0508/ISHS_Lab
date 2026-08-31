/*
최장 공통 부분 수열 (LCS, Longest Common Subsequence)
두 수열(또는 문자열)이 주어졌을 때, 두 수열의 길이가 가장 긴 부분 수열(흩어져 있어도 순서가 맞으면 됨)을 찾는 알고리즘.
두 데이터의 유사도를 판별하거나 DNA 염기서열 비교 등에 사용.

[입력 예시]
ACAYKP
CAPCAK

[출력 예시]
4
*/
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    string s1, s2;
    cin >> s1 >> s2;

    int n = s1.size();
    int m = s2.size();

    // 문제 해결 로직
    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));

    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (s1[i - 1] == s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // 결과 출력
    cout << dp[n][m] << "\n";

    return 0;
}
