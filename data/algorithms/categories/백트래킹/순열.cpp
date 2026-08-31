/*
백트래킹 (Backtracking) - 순열
재귀를 통해 조건을 만족하는 모든 조합을 찾는 알고리즘입니다. (순서가 있는 나열)
N개의 숫자 중 M개를 고르는 모든 경우의 수를 반환합니다.

[입력 예시]
5 3
1 2
2 3
3 4
4 5

[출력 예시]
1
2
3 4 5
*/
#include <bits/stdc++.h>
using namespace std;

int n, m;
vector<int> arr;
vector<bool> visited;
vector<int> current_perm;
vector<vector<int>> results;

void dfs(int depth) {
    if (depth == m) {
        results.push_back(current_perm);
        return;
    }

    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            visited[i] = true;
            current_perm.push_back(arr[i]);
            dfs(depth + 1);
            current_perm.pop_back();
            visited[i] = false;
        }
    }
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    cin >> n >> m;
    arr.resize(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    visited.assign(n, false);

    // 문제 해결 로직
    dfs(0);

    // 결과 출력
    for (const auto& perm : results) {
        for (size_t i = 0; i < perm.size(); i++) {
            cout << perm[i];
            if (i + 1 < perm.size()) cout << ' ';
        }
        cout << "\n";
    }

    return 0;
}
