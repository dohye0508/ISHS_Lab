/*
크루스칼 알고리즘 (Kruskal's Algorithm) - 최소 신장 트리 (MST)
- 백준 난이도: 골드 IV
그래프 내의 모든 노드를 포함하면서 사이클이 없고, 간선 가중치의 합이 최소가 되는 트리를 찾는 알고리즘.
모든 마을을 최소 비용으로 연결하는 전력망 구축 등에 사용.

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

vector<int> parent;

int find_parent(int x) {
    if (parent[x] != x) parent[x] = find_parent(parent[x]);
    return parent[x];
}

void union_parent(int a, int b) {
    a = find_parent(a);
    b = find_parent(b);
    if (a < b) parent[b] = a;
    else parent[a] = b;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int v, e;
    cin >> v >> e;
    parent.resize(v + 1);
    for (int i = 1; i <= v; i++) parent[i] = i;

    vector<tuple<long long, int, int>> edges;
    for (int i = 0; i < e; i++) {
        int a, b;
        long long cost;
        cin >> a >> b >> cost;
        edges.push_back(make_tuple(cost, a, b));
    }

    // 문제 해결 로직
    sort(edges.begin(), edges.end());
    long long result = 0;
    for (auto& edge : edges) {
        long long cost = get<0>(edge);
        int a = get<1>(edge);
        int b = get<2>(edge);
        if (find_parent(a) != find_parent(b)) {
            union_parent(a, b);
            result += cost;
        }
    }

    // 결과 출력
    cout << result << "\n";

    return 0;
}
