/*
다중 배낭 문제 (Bounded Knapsack Problem)
각 물건의 개수가 정해져 있을 때, 가치의 최댓값을 구하는 알고리즘입니다.
단순히 물건 개수만큼 반복하면 시간 초과가 날 수 있으므로, 물건의 개수를 이진수(1, 2, 4...) 단위로 쪼개어
여러 개의 0/1 배낭 문제로 변환하여 O(N * K * log(C)) 시간에 푸는 기법입니다.

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
    int n, k;
    cin >> n >> k;
    vector<pair<long long, long long>> items; // (weight, value)

    for (int i = 0; i < n; i++) {
        long long w, v;
        int c;
        cin >> w >> v >> c;
        long long count = 1;
        while (c > 0) {
            long long take = min(count, (long long)c);
            items.push_back({w * take, v * take});
            c -= take;
            count *= 2;
        }
    }

    // 문제 해결 로직
    vector<long long> dp(k + 1, 0);
    for (auto& item : items) {
        long long w = item.first;
        long long v = item.second;
        for (long long j = k; j >= w; j--) {
            dp[j] = max(dp[j], dp[j - w] + v);
        }
    }

    // 결과 출력
    cout << dp[k] << "\n";

    return 0;
}
