/*
벨만-포드 알고리즘 (Bellman-Ford)
- 백준 난이도: 골드 IV
그래프에서 한 출발점에서 모든 다른 노드까지의 최단 거리를 구하는 알고리즘입니다.
다익스트라와 달리 간선 가중치가 음수일 때도 작동하며, 음수 사이클 존재 여부를 감지할 수 있습니다.

[실전 활용처]
- 음수 가중치가 포함된 경로 찾기.
- 무한히 비용이 줄어드는 '음수 사이클' 탐지 (예: 타임머신 문제).

[시간 복잡도]
- O(VE) (V: 노드 수, E: 간선 수)

[입력 예시]
3 4
1 2 4
1 3 3
2 3 -1
3 1 -2

[출력 예시]
1에서 3까지 최단 거리: 3
*/

#include <iostream>
#include <vector>
#include <climits>

using namespace std;

const long long INF = LLONG_MAX;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n, m;
    cin >> n >> m;
    vector<array<long long, 3>> edges(m);
    for (int i = 0; i < m; i++) {
        long long u, v, w;
        cin >> u >> v >> w;
        edges[i] = {u, v, w};
    }

    // 문제 해결 로직
    // 1. 최단 거리 테이블 초기화
    vector<long long> dist(n + 1, INF);
    int startNode = 1;
    dist[startNode] = 0;

    // 2. (노드 수 - 1)번 반복하여 모든 간선 확인
    bool negativeCycle = false;
    for (int i = 0; i < n && !negativeCycle; i++) {
        for (auto& e : edges) {
            long long u = e[0], v = e[1], w = e[2];
            if (dist[u] != INF && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                // 3. n번째 반복에서도 값이 갱신되면 음수 사이클 존재
                if (i == n - 1) {
                    negativeCycle = true;
                    break;
                }
            }
        }
    }

    // 결과 출력
    if (negativeCycle) {
        cout << "-1 (음수 사이클 존재)" << "\n";
    } else {
        for (int i = 1; i <= n; i++) {
            if (dist[i] == INF) cout << i << ": 미도달" << "\n";
            else cout << i << ": " << dist[i] << "\n";
        }
    }

    return 0;
}
