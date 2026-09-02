/*
투 포인터 (Two Pointers)
- 백준 난이도: 실버 III
주로 정렬되어 있거나 연속된 특정 구간을 처리할 때 사용하는 테크닉입니다. 두 개의 포인터를 조작하여 원하는 결과를 얻습니다.
리스트에서 2개의 점(위치)을 이용해 특정 조건을 만족하는 구간을 구합니다.
시간 복잡도: O(N)

[입력 예시]
5 5
1 2 3 2 5

[출력 예시]
3
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
    vector<int> data(n);
    for (int i = 0; i < n; i++) cin >> data[i];

    // 문제 해결 로직
    int count = 0;
    long long intervalSum = 0;
    int end = 0;

    for (int start = 0; start < n; start++) {
        while (intervalSum < m && end < n) {
            intervalSum += data[end];
            end++;
        }

        if (intervalSum == m) count++;

        intervalSum -= data[start];
    }

    // 결과 출력
    cout << count << "\n";

    return 0;
}
