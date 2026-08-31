/*
볼록 껍질 (Convex Hull) - 모노톤 체인(Monotone Chain) 알고리즘
주어진 점들을 모두 포함하는 가장 작은 볼록 다각형을 구하는 알고리즘입니다.

[작동 원리]
1. x좌표 기준으로 점들을 정렬합니다.
2. 아래쪽 껍질(Lower Hull)과 위쪽 껍질(Upper Hull)을 순차적으로 구성합니다.
3. CCW(Counter Clockwise)를 통해 회전 방향이 어긋나면 이전 점을 제외(Pop)하며 울타리를 만듭니다.

[입력 예시]
8                 <- (점들의 개수 N)
1 1               <- (N개의 좌표 x, y)
1 2
2 2
...
0 2

[출력 예시]
5                 <- (볼록 껍질을 구성하는 점의 개수)
0 0               <- (볼록 껍질 꼭짓점 좌표들)
2 1
...
0 0
*/
#include <bits/stdc++.h>
using namespace std;

typedef pair<long long, long long> pll;

long long ccw(pll p1, pll p2, pll p3) {
    return (p2.first - p1.first) * (p3.second - p1.second) - (p2.second - p1.second) * (p3.first - p1.first);
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n;
    cin >> n;
    vector<pll> points(n);
    for (int i = 0; i < n; i++) cin >> points[i].first >> points[i].second;

    // 문제 해결 로직
    sort(points.begin(), points.end());

    vector<pll> lower;
    for (auto& p : points) {
        while (lower.size() >= 2) {
            if (ccw(lower[lower.size() - 2], lower[lower.size() - 1], p) > 0) break;
            lower.pop_back();
        }
        lower.push_back(p);
    }

    vector<pll> upper;
    for (int i = n - 1; i >= 0; i--) {
        pll p = points[i];
        while (upper.size() >= 2) {
            if (ccw(upper[upper.size() - 2], upper[upper.size() - 1], p) > 0) break;
            upper.pop_back();
        }
        upper.push_back(p);
    }

    vector<pll> hull;
    for (int i = 0; i + 1 < (int)lower.size(); i++) hull.push_back(lower[i]);
    for (int i = 0; i + 1 < (int)upper.size(); i++) hull.push_back(upper[i]);

    // 결과 출력
    cout << hull.size() << "\n";
    for (auto& p : hull) cout << p.first << " " << p.second << "\n";

    return 0;
}
