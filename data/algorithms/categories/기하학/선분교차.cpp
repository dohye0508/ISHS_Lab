/*
선분 교차 판별 (Line Intersection)
- 백준 난이도: 골드 III
CCW를 응용하여 두 선분 AB와 CD가 교차하는지 판별하는 알고리즘.
두 점 쌍에 대해 서로 엇갈려 있는지 CCW 부호의 곱으로 판단하며, 일직선 상에 겹치는 예외 케이스 처리도 포함됩니다.
두 선분이 일직선 상에 있는 경우 양 점의 좌표를 비교해 겹치는지 확인하고,
일반적인 경우 두 선분의 CCW 곱이 모두 0 이하일 때 교차하는 것으로 판정합니다.

[입력 예시]
1 1 5 5
1 5 5 1

[출력 예시]
1
*/

#include <iostream>
#include <algorithm>

using namespace std;

int ccw(long long x1, long long y1, long long x2, long long y2, long long x3, long long y3) {
    long long res = (x1 * y2 + x2 * y3 + x3 * y1) - (x2 * y1 + x3 * y2 + x1 * y3);
    if (res > 0) return 1;
    if (res < 0) return -1;
    return 0;
}

bool is_intersect(long long x1, long long y1, long long x2, long long y2, long long x3, long long y3, long long x4, long long y4) {
    int abc = ccw(x1, y1, x2, y2, x3, y3);
    int abd = ccw(x1, y1, x2, y2, x4, y4);
    int cda = ccw(x3, y3, x4, y4, x1, y1);
    int cdb = ccw(x3, y3, x4, y4, x2, y2);

    if (abc * abd == 0 && cda * cdb == 0) {
        if (min(x1, x2) <= max(x3, x4) && min(x3, x4) <= max(x1, x2) &&
            min(y1, y2) <= max(y3, y4) && min(y3, y4) <= max(y1, y2)) {
            return true;
        }
        return false;
    }

    if (abc * abd <= 0 && cda * cdb <= 0) return true;

    return false;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    long long x1, y1, x2, y2, x3, y3, x4, y4;
    cin >> x1 >> y1 >> x2 >> y2;
    cin >> x3 >> y3 >> x4 >> y4;

    // 문제 해결 로직
    bool result = is_intersect(x1, y1, x2, y2, x3, y3, x4, y4);

    // 결과 출력
    if (result) cout << "1 (교차함)" << "\n";
    else cout << "0 (교차하지 않음)" << "\n";

    return 0;
}
