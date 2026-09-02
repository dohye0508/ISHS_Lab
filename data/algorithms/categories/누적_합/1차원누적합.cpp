/*
1차원 배열 누적 합 (Prefix Sum)
- 백준 난이도: 실버 III
배열의 특정 구간 합을 구할 때 매번 반복문을 돌지 않고 O(1)의 속도로 빠르게 합을 구할 수 있도록 초기값을 미리 누적해두는 알고리즘.

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

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n, m;
    cin >> n >> m;
    vector<long long> arr(n);
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }

    // 문제 해결 로직
    vector<long long> prefix_sum(n + 1, 0);
    for (int i = 0; i < n; i++) {
        prefix_sum[i + 1] = prefix_sum[i] + arr[i];
    }

    // 결과 출력
    for (int q = 0; q < m; q++) {
        int a, b;
        cin >> a >> b;
        long long result = prefix_sum[b] - prefix_sum[a - 1];
        cout << result << "\n";
    }

    return 0;
}
