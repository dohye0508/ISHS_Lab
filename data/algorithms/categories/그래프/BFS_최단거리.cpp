/*
너비 우선 탐색 (BFS) - 최단거리 (일반 그래프)
방향 벡터가 없는 일반적인 인접 리스트 형태의 그래프에서 시작점부터 목표점까지의 최단 거리를 구하는 알고리즘입니다.
모든 간선의 길이가 같을 때 최단 거리를 찾는 데 최적화되어 있습니다.
시간 복잡도: O(V + E)

[입력 예시]
4 5 1
1 2
1 3
1 4
2 4
3 4

[출력 예시]
1 2 3 4
*/
#include <bits/stdc++.h>
using namespace std;

vector<int> graph_adj[100001];
int distArr[100001];

void bfs(int start_node) {
    queue<int> q;
    q.push(start_node);
    distArr[start_node] = 0;

    while (!q.empty()) {
        int curr = q.front();
        q.pop();

        for (int adj : graph_adj[curr]) {
            if (distArr[adj] == -1) {
                distArr[adj] = distArr[curr] + 1;
                q.push(adj);
            }
        }
    }
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n, m, start;
    cin >> n >> m >> start;
    for (int i = 0; i <= n; i++) distArr[i] = -1;

    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        graph_adj[a].push_back(b);
        graph_adj[b].push_back(a);
    }

    // 문제 해결 로직
    bfs(start);

    // 결과 출력
    for (int i = 1; i <= n; i++) cout << distArr[i] << "\n";

    return 0;
}
