/*
[문제 제목]: 이분 매칭 (Bipartite Matching)
- 백준 난이도: 플래티넘 IV
- 문제 설명: 두 개의 그룹으로 나누어진 정점들 사이에서, 각 정점이 최대 하나의 간선에만 포함되도록 정점 쌍을 선택하는 최대 매칭을 구합니다. DFS를 이용한 증가 경로 찾기 방식으로 구현합니다.
- 시간 복잡도: O(V * E)

[입력 예시]
5 5
2 1 2
2 1 4
1 3
2 3 5
2 4 5

[출력 예시]
4
*/

#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int n, m;
vector<int> adj[100001];
int matched[100001];
bool visited[100001];

bool dfs(int u) {
    for (int v : adj[u]) {
        if (visited[v]) continue;
        visited[v] = true;
        if (matched[v] == 0 || dfs(matched[v])) {
            matched[v] = u;
            return true;
        }
    }
    return false;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    cin >> n >> m;
    for (int i = 1; i <= n; i++) {
        int cnt;
        cin >> cnt;
        for (int j = 0; j < cnt; j++) {
            int target;
            cin >> target;
            adj[i].push_back(target);
        }
    }

    // 문제 해결 로직
    int count = 0;
    for (int i = 1; i <= n; i++) {
        fill(visited, visited + m + 1, false);
        if (dfs(i)) count++;
    }

    // 결과 출력
    cout << count << "\n";

    return 0;
}
