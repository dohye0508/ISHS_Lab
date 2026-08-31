/*
[문제 제목]: 부분집합의 합 (Subset Sum)
- 문제 설명: 주어진 집합(N개의 원소) 중 원소들의 합이 특정 목표(S)가 되는 모든 부분집합의 개수를 구합니다.
- 시간 복잡도: O(2^N)

[입력 예시]
5 0
-7 -3 -2 5 8

[출력 예시]
1
*/
#include <bits/stdc++.h>
using namespace std;

int n;
long long target_s;
vector<long long> arr;
long long ans = 0;

void backtrack(int idx, long long current_sum) {
    if (idx == n) {
        if (current_sum == target_s) {
            ans++;
        }
        return;
    }
    backtrack(idx + 1, current_sum + arr[idx]);
    backtrack(idx + 1, current_sum);
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    cin >> n >> target_s;
    arr.resize(n);
    for (int i = 0; i < n; i++) cin >> arr[i];

    // 문제 해결 로직
    backtrack(0, 0);
    if (target_s == 0) ans--;

    // 결과 출력
    cout << ans << "\n";

    return 0;
}
