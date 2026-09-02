/*
0/1 배낭 문제 (0-1 Knapsack)
- 백준 난이도: 골드 V

[작동 원리]
배낭의 용량이 정해져 있을 때, 담을 수 있는 물건들의 가치 합을 최대로 만드는 조합을 찾는 동적 계획법 알고리즘입니다.
가장 일반적인 점화식은 `DP[i][w] = max(DP[i-1][w], DP[i-1][w-weight[i]] + value[i])` 입니다.
즉, i번째 물건을 넣지 않았을 때의 가치와, i번째 물건을 넣었을 때의 가치 중 더 큰 값을 선택하며 표를 채워나갑니다.
1차원 배열로 최적화할 경우, 중복 선택을 막기 위해 반드시 뒤에서부터 역방향으로 채워나가야 합니다.

[시간 복잡도]
O(N * K) (N: 물품의 수, K: 배낭의 용량)

[입력 예시]
4 7
6 13
4 8
3 6
5 12

[출력 예시]
14
*/

#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n, k;
    cin >> n >> k;

    // 문제 해결 로직
    vector<long long> dp(k + 1, 0);
    for (int i = 0; i < n; i++) {
        int w, v;
        cin >> w >> v;
        for (int j = k; j >= w; j--) {
            dp[j] = max(dp[j], dp[j - w] + v);
        }
    }

    // 결과 출력
    cout << dp[k] << "\n";

    return 0;
}
