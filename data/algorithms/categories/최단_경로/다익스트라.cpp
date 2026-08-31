/*
다익스트라 알고리즘 (Dijkstra's Algorithm)
그래프의 한 지점에서 다른 모든 노드로 가는 최단 경로를 구하는 알고리즘입니다.

[작동 원리]
1. 출발 노드의 거리를 0으로, 나머지를 무한대로 초기화합니다.
2. 거리가 가장 짧은 노드를 선택하여 주변 노드의 거리를 갱신(Relaxation)합니다.
3. 우선순위 큐(Priority Queue)를 사용하여 선택 과정의 효율성을 높입니다.

[입력 예시]
6 11              <- (노드의 개수 N, 간선의 개수 M)
1                 <- (시작 노드의 번호 K)
1 2 2             <- (M개의 간선 정보: u, v, w)
1 3 5
...

[출력 예시]
0                 <- (시작 노드에서 i번 노드로 가는 최단 거리)
2
...
*/
#include <bits/stdc++.h>
using namespace std;

const long long INF = LLONG_MAX;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n, m, start;
    cin >> n >> m >> start;
    vector<vector<pair<int, long long>>> adj(n + 1);
    for (int i = 0; i < m; i++) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        adj[u].push_back({v, w});
    }

    // 문제 해결 로직
    vector<long long> distance(n + 1, INF);
    distance[start] = 0;
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<>> pq;
    pq.push({0, start});

    while (!pq.empty()) {
        auto [dist, now] = pq.top();
        pq.pop();
        // 이미 처리된 노드라면 건너뜀
        if (distance[now] < dist) continue;

        // 현재 노드와 인접한 노드들 확인
        for (auto& [nextNode, weight] : adj[now]) {
            long long cost = dist + weight;
            if (cost < distance[nextNode]) {
                distance[nextNode] = cost;
                pq.push({cost, nextNode});
            }
        }
    }

    // 결과 출력
    for (int i = 1; i <= n; i++) {
        if (distance[i] == INF) cout << "INF" << "\n";
        else cout << distance[i] << "\n";
    }

    return 0;
}
