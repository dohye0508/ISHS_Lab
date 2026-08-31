/*
깊이 우선 탐색 (DFS) - 연결요소
스택 또는 재귀함수를 이용하여 그래프의 깊은 부분을 먼저 탐색하는 알고리즘입니다.
그래프 전체를 깊게 탐색할 때 사용하는 경로 찾기/연결 요소 세기 알고리즘.
시간 복잡도: O(V + E)

[입력 예시]
4 5 1
1 2
1 3
1 4
2 4
3 4

[출력 예시]
1 2 4 3
*/
#include <bits/stdc++.h>
using namespace std;

int n, m;
vector<vector<int>> grid;

bool dfs(int x, int y) {
    if (x <= -1 || x >= n || y <= -1 || y >= m) return false;
    if (grid[x][y] == 0) {
        grid[x][y] = 1;
        dfs(x - 1, y);
        dfs(x, y - 1);
        dfs(x + 1, y);
        dfs(x, y + 1);
        return true;
    }
    return false;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    cin >> n >> m;
    grid.assign(n, vector<int>(m, 0));
    for (int i = 0; i < n; i++) {
        string row;
        cin >> row;
        for (int j = 0; j < m; j++) grid[i][j] = row[j] - '0';
    }

    // 문제 해결 로직
    int result = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (dfs(i, j)) result++;
        }
    }

    // 결과 출력
    cout << result << "\n";

    return 0;
}
