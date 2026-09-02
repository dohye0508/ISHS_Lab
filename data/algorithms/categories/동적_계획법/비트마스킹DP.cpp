/*
외판원 순회 (TSP) - 비트마스킹 DP
- 백준 난이도: 골드 I
방문한 노드들의 집합을 정수가 아닌 비트(이진수)로 표현하여 메모리를 절약하고 속도를 높이는 DP 알고리즘.
모든 도시를 한 번씩 방문하고 출발지로 돌아오는 최소 비용을 구할 때 사용.

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

#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int n;
vector<vector<int>> cost;
vector<vector<long long>> dp;
const long long INF = 1e9;

long long dfs(int x, int visited) {
    if (visited == (1 << n) - 1) {
        if (cost[x][0]) return cost[x][0];
        else return INF;
    }

    if (dp[x][visited] != -1) return dp[x][visited];

    dp[x][visited] = INF;
    for (int i = 1; i < n; i++) {
        if (!cost[x][i]) continue;
        if (visited & (1 << i)) continue;

        dp[x][visited] = min(dp[x][visited], dfs(i, visited | (1 << i)) + cost[x][i]);
    }

    return dp[x][visited];
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    cin >> n;
    cost.assign(n, vector<int>(n));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cin >> cost[i][j];
        }
    }

    // 문제 해결 로직
    dp.assign(n, vector<long long>(1 << n, -1));
    long long result = dfs(0, 1);

    // 결과 출력
    cout << result << "\n";

    return 0;
}
