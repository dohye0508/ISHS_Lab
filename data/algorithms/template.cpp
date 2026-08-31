/*
[문제 제목]: (문제 제목을 적어주세요)
- 문제 설명: (해결을 위한 핵심 아이디어 설명을 적어주세요)
- 시간 복잡도: O(N)

[입력 예시]
5
1 2 3 4 5

[출력 예시]
15
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
    long long result = 0;
    for (int x : arr) result += x;

    // 결과 출력
    cout << result << "\n";

    return 0;
}
