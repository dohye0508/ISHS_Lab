/*
[문제 제목]: CCW (Counter Clockwise)
- 문제 설명: 평면 위에 놓인 세 점의 방향 관계를 결정합니다. 세 점 A, B, C가 순서대로 있을 때 반시계 방향이면 1, 시계 방향이면 -1, 일직선이면 0을 반환합니다.
- 시간 복잡도: O(1)

[입력 예시]
1 1
5 5
7 3

[출력 예시]
-1
*/
#include <bits/stdc++.h>
using namespace std;

int ccw(long long x1, long long y1, long long x2, long long y2, long long x3, long long y3) {
    long long res = (x1 * y2 + x2 * y3 + x3 * y1) - (y1 * x2 + y2 * x3 + y3 * x1);
    if (res > 0) return 1;
    else if (res < 0) return -1;
    else return 0;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    long long x1, y1, x2, y2, x3, y3;
    cin >> x1 >> y1;
    cin >> x2 >> y2;
    cin >> x3 >> y3;

    // 문제 해결 로직
    int result = ccw(x1, y1, x2, y2, x3, y3);

    // 결과 출력
    cout << result << "\n";

    return 0;
}
