/*
[문제 제목]: 강한 연결 요소 (SCC, Tarjan's Algorithm)
- 문제 설명: 방향 그래프에서 모든 정점 쌍 (u, v)에 대해 u에서 v로, v에서 u로 가는 경로가 모두 존재하는 정점의 집합을 찾습니다. 타잔 알고리즘은 DFS를 이용해 한 번의 탐색으로 모든 SCC를 찾아냅니다.
- 시간 복잡도: O(V + E)

[입력 예시]
7 9
1 4
4 5
5 1
1 6
6 7
7 2
2 7
7 3
3 7

[출력 예시]
3
1 4 5 -1
2 3 7 -1
6 -1
*/
#include <bits/stdc++.h>
using namespace std;

vector<int> adj[100001];
int ids[100001];
bool finished[100001];
int id_cnt = 0;
stack<int> st;
vector<vector<int>> scc_list;

int dfs(int curr) {
    id_cnt++;
    ids[curr] = id_cnt;
    int parent = ids[curr];
    st.push(curr);

    for (int next_node : adj[curr]) {
        if (ids[next_node] == 0) {
            parent = min(parent, dfs(next_node));
        } else if (!finished[next_node]) {
            parent = min(parent, ids[next_node]);
        }
    }

    if (parent == ids[curr]) {
        vector<int> scc;
        while (true) {
            int t = st.top();
            st.pop();
            scc.push_back(t);
            finished[t] = true;
            if (t == curr) break;
        }
        sort(scc.begin(), scc.end());
        scc_list.push_back(scc);
    }

    return parent;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int v, e;
    cin >> v >> e;
    for (int i = 0; i < e; i++) {
        int a, b;
        cin >> a >> b;
        adj[a].push_back(b);
    }

    // 문제 해결 로직
    for (int i = 1; i <= v; i++) {
        if (ids[i] == 0) dfs(i);
    }
    sort(scc_list.begin(), scc_list.end());

    // 결과 출력
    cout << scc_list.size() << "\n";
    for (auto& scc : scc_list) {
        for (int x : scc) cout << x << " ";
        cout << -1 << "\n";
    }

    return 0;
}
