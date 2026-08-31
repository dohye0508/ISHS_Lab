/*
[문제 제목]: 최소 비용 최대 유량 (MCMF - Minimum Cost Maximum Flow)
- 문제 설명: 네트워크 유량 문제에서 각 간선에 비용이 추가된 경우, 주어진 유량을 보낼 때 발생하는 최소 비용을 구합니다. SPFA 알고리즘을 사용하여 최단 경로(최소 비용 경로)를 찾으며 유량을 보냅니다.
- 시간 복잡도: O(F * E * V) (F는 최대 유량)

[입력 예시]
5 6
1 2 1 1
1 3 2 1
2 3 1 1
2 4 1 2
3 5 2 1
4 5 1 1

[출력 예시]
2 6
*/
#include <bits/stdc++.h>
using namespace std;

const long long INF = 1e18;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n, m;
    cin >> n >> m;
    vector<vector<int>> adj(n + 1);
    vector<vector<int>> capacity(n + 1, vector<int>(n + 1, 0));
    vector<vector<int>> flow(n + 1, vector<int>(n + 1, 0));
    vector<vector<int>> cost(n + 1, vector<int>(n + 1, 0));

    for (int i = 0; i < m; i++) {
        int u, v, c, w;
        cin >> u >> v >> c >> w;
        adj[u].push_back(v);
        adj[v].push_back(u);
        capacity[u][v] = c;
        cost[u][v] = w;
        cost[v][u] = -w;
    }

    // 문제 해결 로직
    long long total_flow = 0;
    long long total_cost = 0;
    int source = 1, sink = n;

    while (true) {
        vector<int> parent(n + 1, -1);
        vector<long long> dist(n + 1, INF);
        vector<bool> in_queue(n + 1, false);
        queue<int> q;
        q.push(source);
        dist[source] = 0;
        in_queue[source] = true;

        while (!q.empty()) {
            int u = q.front();
            q.pop();
            in_queue[u] = false;
            for (int v : adj[u]) {
                if (capacity[u][v] - flow[u][v] > 0 && dist[v] > dist[u] + cost[u][v]) {
                    dist[v] = dist[u] + cost[u][v];
                    parent[v] = u;
                    if (!in_queue[v]) {
                        q.push(v);
                        in_queue[v] = true;
                    }
                }
            }
        }

        if (parent[sink] == -1) break;

        int f = INT_MAX;
        int curr = sink;
        while (curr != source) {
            int prev = parent[curr];
            f = min(f, capacity[prev][curr] - flow[prev][curr]);
            curr = prev;
        }

        total_flow += f;
        curr = sink;
        while (curr != source) {
            int prev = parent[curr];
            total_cost += (long long)f * cost[prev][curr];
            flow[prev][curr] += f;
            flow[curr][prev] -= f;
            curr = prev;
        }
    }

    // 결과 출력
    cout << total_flow << " " << total_cost << "\n";

    return 0;
}
