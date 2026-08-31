/*
트리 DP (Tree DP)
트리 구조에서 자식 노드들의 DP 결괏값을 모아 부모 노드의 결괏값을 도출하는 알고리즘.
우수 마을 선정(독립 집합), 트리의 지름, 자식 노드 개수 세기 등에 사용.

[입력 예시]
9
1 3
2 3
4 3
5 4
6 4
7 4
8 7
9 7
1
4
3
7

[출력 예시]
1
5
9
3
*/
#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> tree;
vector<array<long long, 2>> dp;
vector<bool> visited;

void dfs(int node) {
    visited[node] = true;
    dp[node][0] = 0;
    dp[node][1] = 1;

    for (int child : tree[node]) {
        if (!visited[child]) {
            dfs(child);
            dp[node][0] += max(dp[child][0], dp[child][1]);
            dp[node][1] += dp[child][0];
        }
    }
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n;
    cin >> n;
    tree.assign(n + 1, vector<int>());
    for (int i = 0; i < n - 1; i++) {
        int u, v;
        cin >> u >> v;
        tree[u].push_back(v);
        tree[v].push_back(u);
    }

    // 문제 해결 로직
    dp.assign(n + 1, {0, 0});
    visited.assign(n + 1, false);
    dfs(1);

    // 결과 출력
    cout << max(dp[1][0], dp[1][1]) << "\n";

    return 0;
}
