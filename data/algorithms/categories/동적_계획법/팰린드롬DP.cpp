/*
팰린드롬 (Palindrome) 판별 DP
어떤 문자열의 부분 문자열이 팰린드롬(앞으로 읽어도, 뒤로 읽어도 같은 문자열)인지 미리 계산해두어 여러 쿼리를 O(1)에 처리하는 2차원 DP 알고리즘입니다.

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
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];

    // 문제 해결 로직
    vector<vector<int>> dp(n, vector<int>(n, 0));

    for (int i = 0; i < n; i++) dp[i][i] = 1;

    for (int i = 0; i < n - 1; i++) {
        if (arr[i] == arr[i + 1]) dp[i][i + 1] = 1;
    }

    for (int length = 3; length <= n; length++) {
        for (int start = 0; start <= n - length; start++) {
            int end = start + length - 1;
            if (arr[start] == arr[end] && dp[start + 1][end - 1] == 1) dp[start][end] = 1;
        }
    }

    int m;
    cin >> m;

    // 결과 출력
    for (int i = 0; i < m; i++) {
        int s, e;
        cin >> s >> e;
        cout << dp[s - 1][e - 1] << "\n";
    }

    return 0;
}
