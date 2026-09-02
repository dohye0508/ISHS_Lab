/*
부분 배낭 문제 (Fractional Knapsack / 무도회장) - 그리디
- 백준 난이도: 실버 III
물건을 쪼갤 수 있는(Fractional) 조건의 배낭 문제.
가성비(단위 무게당 가치)가 높은 순서대로 내림차순 정렬하여 담고,
물건이 전부 들어가지 않으면 배낭의 남은 하중만큼 물건을 쪼개서 넣습니다.

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
#include <algorithm>
#include <tuple>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n, capacity;
    cin >> n >> capacity;
    vector<tuple<int, int, double>> items(n); // w, v, ratio
    for (int i = 0; i < n; i++) {
        int w, v;
        cin >> w >> v;
        items[i] = make_tuple(w, v, (double)v / w);
    }

    // 문제 해결 로직
    sort(items.begin(), items.end(), [](const tuple<int, int, double>& a, const tuple<int, int, double>& b) {
        return get<2>(a) > get<2>(b);
    });

    double total_value = 0.0;
    for (auto& item : items) {
        int w = get<0>(item);
        int v = get<1>(item);
        double ratio = get<2>(item);
        if (capacity >= w) {
            capacity -= w;
            total_value += v;
        } else {
            total_value += capacity * ratio;
            break;
        }
    }

    // 결과 출력
    cout << fixed << setprecision(2) << total_value << "\n";

    return 0;
}
