/*
다각형의 넓이 (Polygon Area) - 신발끈 공식 (Shoelace Formula)
주어진 다각형의 꼭짓점 좌표를 이용해 넓이를 구하는 공식입니다.
CCW(Counter Clockwise)를 응용하여, 벡터의 외적을 통해 각 삼각형의 넓이를 합산하는 원리입니다.

[실전 활용처]
- 지도 데이터 기반 토지 면적 계산.
- 게임 엔진에서의 충돌 영역 넓이 판별.
- CCW 알고리즘의 응용 (선분 교차 판별 등과 함게 사용).

[공식]
Area = 1/2 * |Σ (x_i * y_{i+1} - x_{i+1} * y_i)|

[입력 예시]
4
0 0
0 10
10 10
10 0

[출력 예시]
100.0
*/
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n;
    cin >> n;
    vector<pair<long long, long long>> points(n);
    for (int i = 0; i < n; i++) cin >> points[i].first >> points[i].second;

    // 마지막 점과 첫 번째 점을 연결하기 위해 포인트 추가
    points.push_back(points[0]);

    // 문제 해결 로직
    long long area = 0;
    for (int i = 0; i < n; i++) {
        area += points[i].first * points[i + 1].second;
        area -= points[i + 1].first * points[i].second;
    }

    // 결과 출력
    cout << fixed << setprecision(1) << abs(area) / 2.0 << "\n";

    return 0;
}
