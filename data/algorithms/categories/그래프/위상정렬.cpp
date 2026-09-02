/*
위상 정렬 (Topological Sorting)
- 백준 난이도: 골드 III
방향 그래프에서 그래프의 모든 노드를 방향성에 거스르지 않도록 순서대로 나열하는 알고리즘.
선수 과목을 고려한 수강 신청, 작업의 순서 결정 등에 사용. (사이클이 없어야 함)

[입력 예시]
3 2
1 3
2 3

[출력 예시]
1 2 3
*/

#include <iostream>
#include <vector>
#include <queue>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int v, e;
    cin >> v >> e;
    vector<int> indegree(v + 1, 0);
    vector<vector<int>> graph(v + 1);

    for (int i = 0; i < e; i++) {
        int a, b;
        cin >> a >> b;
        graph[a].push_back(b);
        indegree[b]++;
    }

    // 문제 해결 로직
    vector<int> result;
    queue<int> q;
    for (int i = 1; i <= v; i++) {
        if (indegree[i] == 0) q.push(i);
    }

    while (!q.empty()) {
        int now = q.front();
        q.pop();
        result.push_back(now);
        for (int i : graph[now]) {
            indegree[i]--;
            if (indegree[i] == 0) q.push(i);
        }
    }

    // 결과 출력
    for (int i : result) cout << i << " ";

    return 0;
}
