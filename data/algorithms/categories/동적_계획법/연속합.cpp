/*
연속 합 (Maximum Subarray Sum)
- 백준 난이도: 실버 II

[작동 원리]
배열 안에서 연속된 몇 개의 수를 선택해 구할 수 있는 가장 큰 부분합을 구하는 카다네(Kadane's) 알고리즘 방식의 기초 DP입니다.
`DP[i]`는 i번째 원소를 마지막으로 하는 연속 합의 최댓값입니다.
i번째 원소를 새롭게 시작할지, 혹은 이전까지의 연속 합(DP[i-1])에 이어서 더할지를 결정합니다.
점화식: `DP[i] = max(Array[i], DP[i-1] + Array[i])`

[시간 복잡도]
O(N) (N은 배열의 길이)

[입력 예시]
10
10 -4 3 1 5 6 -35 12 21 -1

[출력 예시]
33
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
    vector<long long> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];

    // 문제 해결 로직
    vector<long long> dp(n);
    dp[0] = arr[0];
    for (int i = 1; i < n; i++) dp[i] = max(arr[i], dp[i - 1] + arr[i]);

    long long result = *max_element(dp.begin(), dp.end());

    // 결과 출력
    cout << result << "\n";

    return 0;
}
