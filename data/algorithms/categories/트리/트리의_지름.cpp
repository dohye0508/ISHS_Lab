/*
트리의 지름 (Diameter of Tree)
트리에서 가장 멀리 떨어진 두 노드 사이의 거리를 구하는 알고리즘입니다.
트리의 어떤 노드에서도 가장 먼 노드는 항상 지름의 한 쪽 끝점이라는 성질을 이용합니다.

[실전 활용처]
- 네트워크 설계: 네트워크 내 두 지점이 가장 멀리 떨어져 있는 상한 거리 계산.
- 트리 기반 구조 분석.

[알고리즘 순서]
1. 임의의 노드(보통 1번)에서 가장 먼 노드(A)를 찾습니다.
2. 노드 A에서 다시 가장 먼 노드(B)를 찾습니다.
3. A와 B 사이의 거리가 트리의 지름입니다.

[입력 예시]
5
1 2 2
1 3 3
2 4 4
2 5 5

[출력 예시]
11
*/
#include <bits/stdc++.h>
using namespace std;

int n;
vector<vector<pair<int, long long>>> adj;

// (거리, 노드번호) 반환
pair<long long, int> bfs(int start) {
    vector<long long> dist(n + 1, -1);
    dist[start] = 0;
    queue<pair<int, long long>> q;
    q.push({start, 0});

    long long maxDist = 0;
    int farthestNode = start;

    while (!q.empty()) {
        auto [curr, d] = q.front();
        q.pop();
        if (d > maxDist) {
            maxDist = d;
            farthestNode = curr;
        }

        for (auto& [nextNode, weight] : adj[curr]) {
            if (dist[nextNode] == -1) {
                dist[nextNode] = d + weight;
                q.push({nextNode, d + weight});
            }
        }
    }

    return {maxDist, farthestNode};
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    cin >> n;
    adj.assign(n + 1, {});
    for (int i = 0; i < n - 1; i++) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});
    }

    // 문제 해결 로직
    // 1. 임의의 점에서 가장 먼 점 찾기
    auto [d1, n1] = bfs(1);
    // 2. 찾은 점에서 제일 먼 점까지의 거리 구하기
    auto [d2, n2] = bfs(n1);

    // 결과 출력
    cout << d2 << "\n";

    return 0;
}
