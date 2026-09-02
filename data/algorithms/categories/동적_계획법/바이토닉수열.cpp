/*
바이토닉 부분 수열 (Bitonic Subsequence) - LIS 응용 DP
- 백준 난이도: 골드 IV
수열이 증가하다가 일정 지점부터 감소하는 형태인 '바이토닉 수열' 중 가장 긴 길이를 구하는 알고리즘입니다.
각 원소를 기준으로 왼쪽에서 오른쪽으로 가는 최장 증가 부분 수열(LIS)과,
오른쪽에서 왼쪽으로 가는 최장 증가 부분 수열의 길이를 합하여 구합니다.

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
    int n;
    cin >> n;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];

    // 문제 해결 로직
    vector<int> inc_dp(n, 1), dec_dp(n, 1);

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (arr[j] < arr[i]) inc_dp[i] = max(inc_dp[i], inc_dp[j] + 1);
        }
    }

    for (int i = n - 1; i >= 0; i--) {
        for (int j = n - 1; j > i; j--) {
            if (arr[j] < arr[i]) dec_dp[i] = max(dec_dp[i], dec_dp[j] + 1);
        }
    }

    int result = 0;
    for (int i = 0; i < n; i++) result = max(result, inc_dp[i] + dec_dp[i] - 1);

    // 결과 출력
    cout << result << "\n";

    return 0;
}
