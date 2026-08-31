/*
최장 증가 부분 수열 (LIS) - O(N log N) 이분 탐색 활용
단순 DP O(N^2)로 풀 수 없는 배열의 길이가 매우 긴 경우, 이분 탐색을 결합하여 시간 복잡도를 O(N log N)으로 단축시키는 알고리즘입니다.

[입력 예시]
6
10 20 10 30 20 50

[출력 예시]
4
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
    vector<int> dp;
    dp.push_back(arr[0]);

    for (int i = 1; i < n; i++) {
        if (arr[i] > dp.back()) {
            dp.push_back(arr[i]);
        } else {
            int idx = lower_bound(dp.begin(), dp.end(), arr[i]) - dp.begin();
            dp[idx] = arr[i];
        }
    }

    // 결과 출력
    cout << dp.size() << "\n";

    return 0;
}
