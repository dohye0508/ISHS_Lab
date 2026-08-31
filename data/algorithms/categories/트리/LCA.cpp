/*
최소 공통 조상 (LCA, Lowest Common Ancestor)
트리에서 두 노드 A, B의 가장 가까운 공통 조상을 찾는 알고리즘입니다.

[입력 예시]
15                  <- (전체 노드의 수 N)
1 2                 <- (N-1개의 간선 정보: u, v)
1 3
...
8 15                <- (공통 조상을 찾고 싶은 두 노드 u, v)

[출력 예시]
1                   <- (두 노드 u, v의 최소 공통 조상 노드 번호)
*/
#include <bits/stdc++.h>
using namespace std;

const int LOG = 17;
vector<vector<int>> adj;
vector<vector<int>> parent;
vector<int> depth;
vector<bool> visited;

// 1. 트리 구성 및 깊이 계산 (DFS)
void dfs(int curr, int d) {
    visited[curr] = true;
    depth[curr] = d;
    for (int nextNode : adj[curr]) {
        if (!visited[nextNode]) {
            parent[nextNode][0] = curr;
            dfs(nextNode, d + 1);
        }
    }
}

// 3. LCA 쿼리 처리
int getLca(int a, int b) {
    if (depth[a] > depth[b]) swap(a, b);

    // 깊이 맞추기
    int diff = depth[b] - depth[a];
    for (int k = LOG - 1; k >= 0; k--) {
        if (diff >= (1 << k)) {
            b = parent[b][k];
            diff -= (1 << k);
        }
    }

    if (a == b) return a;

    // 동시에 점프하여 공통 조상 직전까지 이동
    for (int k = LOG - 1; k >= 0; k--) {
        if (parent[a][k] != parent[b][k]) {
            a = parent[a][k];
            b = parent[b][k];
        }
    }

    return parent[a][0];
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n;
    cin >> n;
    adj.assign(n + 1, {});
    for (int i = 0; i < n - 1; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
    parent.assign(n + 1, vector<int>(LOG, 0));
    depth.assign(n + 1, 0);
    visited.assign(n + 1, false);

    // 문제 해결 로직
    // 1. 트리 구성 및 깊이 계산 (DFS)
    dfs(1, 0); // 1번 노드(루트)부터 시작

    // 2. Sparse Table 채우기 (조상 정보 전처리)
    for (int k = 1; k < LOG; k++) {
        for (int i = 1; i <= n; i++) {
            int midParent = parent[i][k - 1];
            if (midParent != 0) parent[i][k] = parent[midParent][k - 1];
        }
    }

    // 마지막 입력값으로 쿼리 수행
    int u, v;
    cin >> u >> v;
    int lcaResult = getLca(u, v);

    // 결과 출력
    cout << lcaResult << "\n";

    return 0;
}
