/*
타일링 문제 (Tiling Problem)
2xN 크기의 직사각형을 1x2, 2x1 타일(때로는 2x2 포함)로 채우는 방법의 수를 구하는 알고리즘.
점화식을 세우기 가장 좋은 피보나치 수열 형태의 기초 DP.

[입력 예시]
9

[출력 예시]
55
*/
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n;
    cin >> n;

    // 문제 해결 로직
    vector<long long> dp(1001, 0);
    dp[1] = 1;
    if (n >= 2) dp[2] = 2;

    for (int i = 3; i <= n; i++) dp[i] = (dp[i - 1] + dp[i - 2]) % 10007;

    // 결과 출력
    cout << dp[n] << "\n";

    return 0;
}
