/*
[문제 제목]: 매개 변수 탐색 (Parametric Search)
- 문제 설명: "최적화 문제"를 "예/아니오로 대답 가능한 결정 문제"로 바꾸어 이분 탐색하는 기법입니다.
- 시간 복잡도: O(N log(MaxHeight))

[입력 예시]
4 11
8 0 2 4 10

[출력 예시]
3
*/
#include <bits/stdc++.h>
using namespace std;

vector<long long> arr;
long long target;

bool check(long long height) {
    long long total = 0;
    for (long long x : arr) {
        if (x > height) total += (x - height);
    }
    return total >= target;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n;
    cin >> n >> target;
    long long x;
    while (cin >> x) arr.push_back(x);

    // 문제 해결 로직
    long long start = 0, end = 0;
    for (long long v : arr) end = max(end, v);
    long long result = 0;

    while (start <= end) {
        long long mid = (start + end) / 2;
        if (check(mid)) {
            result = mid;
            start = mid + 1;
        } else {
            end = mid - 1;
        }
    }

    // 결과 출력
    cout << result << "\n";

    return 0;
}
