/*
플로이드 워셜 알고리즘 (Floyd-Warshall Algorithm)

[작동 원리]
동적 계획법을 이용하여 '모든 정점에서 모든 정점으로'의 최단 경로를 구하는 알고리즘입니다.
3중 for문을 돌며, `정점 i에서 정점 j로 가는 거리`와 `정점 i에서 정점 k를 거쳐 정점 j로 가는 거리`를 비교하여 최적화합니다.
노드 개수가 적을 때(일반적으로 V <= 500) 유용하며, 음의 가중치를 가진 간선이 있어도 사용할 수 있으나 음의 사이클이 없어야 합니다.

[시간 복잡도]
O(V^3)

[입력 예시]
5
14
1 2 2
1 3 3
1 4 1
1 5 10
2 4 2
3 4 1
3 5 1
4 5 3
3 5 10
3 1 8
1 4 2
5 1 7
3 4 2
5 2 4

[출력 예시]
0 2 3 1 4
12 0 15 2 5
8 5 0 1 1
10 7 13 0 3
7 4 10 6 0
*/
#include <bits/stdc++.h>
using namespace std;

const long long INF = 1000000000LL;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n, m;
    cin >> n >> m;
    vector<vector<long long>> graph(n + 1, vector<long long>(n + 1, INF));

    for (int a = 1; a <= n; a++) {
        for (int b = 1; b <= n; b++) {
            if (a == b) graph[a][b] = 0;
        }
    }

    for (int i = 0; i < m; i++) {
        int a, b;
        long long c;
        cin >> a >> b >> c;
        graph[a][b] = min(graph[a][b], c);
    }

    // 문제 해결 로직
    for (int k = 1; k <= n; k++) {
        for (int a = 1; a <= n; a++) {
            for (int b = 1; b <= n; b++) {
                graph[a][b] = min(graph[a][b], graph[a][k] + graph[k][b]);
            }
        }
    }

    // 결과 출력
    for (int a = 1; a <= n; a++) {
        for (int b = 1; b <= n; b++) {
            if (graph[a][b] == INF) cout << "INF" << " ";
            else cout << graph[a][b] << " ";
        }
        cout << "\n";
    }

    return 0;
}
