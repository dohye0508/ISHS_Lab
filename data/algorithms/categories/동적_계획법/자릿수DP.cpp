/*
자릿수 DP (Digit DP)
특정 범위 [A, B] 내에 존재하는 숫자 중에서 길이나 각 자릿수가 만족해야 하는 특정 조건을 충족하는 숫자의 개수 등을 구할 때 사용하는 패턴.
자릿수 DP는 각 문제의 조건(예: 특정 숫자가 몇 번 들어가는지 등)에 따라 memoization 배열(dp) 설정이 달라집니다.
보통 dp[idx][limit_status] 등 형태를 사용하며, -1은 아직 방문 안 함을 의미합니다.
상한선(limit)이 걸려있으면 해당 자리수만큼만, 아니면 0~9까지(진법에 따라) 지정하여 재귀 탐색합니다.
is_limit은 현재 재귀가 상한선과 동일한 숫자를 뽑았는지 전달합니다.
최종적으로 B까지의 결과에서 A-1까지의 결과를 빼면 구간 [A, B]에 해당하는 결과값을 얻을 수 있습니다.

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

vector<vector<long long>> dp;
string num_str;
int digit_len;

long long dfs(int idx, int limit) {
    if (idx == digit_len) return 1;

    if (dp[idx][limit] != -1) return dp[idx][limit];

    int up = limit ? (num_str[idx] - '0') : 9;
    long long ans = 0;

    for (int i = 0; i <= up; i++) {
        int is_limit = (limit && (i == up)) ? 1 : 0;
        ans += dfs(idx + 1, is_limit);
    }

    dp[idx][limit] = ans;
    return ans;
}

long long solve(const string& s) {
    num_str = s;
    digit_len = (int)s.length();
    dp.assign(digit_len, vector<long long>(2, -1));
    return dfs(0, 1);
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    long long a, b;
    cin >> a >> b;

    // 문제 해결 로직
    long long val_b = solve(to_string(b));
    long long val_a = (a > 0) ? solve(to_string(a - 1)) : 0;

    // 결과 출력
    cout << val_b - val_a << "\n";

    return 0;
}
