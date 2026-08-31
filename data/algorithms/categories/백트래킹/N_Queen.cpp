/*
N-Queen 문제 (N-Queen Problem)
N x N 크기의 체스판 위에 N개의 퀸을 서로 공격할 수 없게 놓는 모든 방법을 찾는 백트래킹 문제입니다.

[작동 원리: 백트래킹]
- 1행부터 N행까지 순차적으로 퀸을 놓습니다.
- 현재 행에 퀸을 놓을 때, 기존에 놓인 퀸들(행, 열, 대각선)과 부딪히지 않는지(Promising) 확인합니다.
- 부딪히면 이전 행으로 돌아가(Backtrack) 다른 자리를 찾습니다.

[입력 예시]
8                 <- (체스판의 크기 및 퀸의 수 N)

[출력 예시]
92                <- (서로 공격할 수 없게 배치하는 경우의 수)
*/
#include <bits/stdc++.h>
using namespace std;

int n;
vector<int> row; // index=행, value=열
int ans = 0;

bool is_promising(int x) {
    for (int i = 0; i < x; i++) {
        // 열이 겹치거나 대각선에 있는지 확인
        if (row[x] == row[i] || abs(row[x] - row[i]) == abs(x - i)) {
            return false;
        }
    }
    return true;
}

void n_queens(int x) {
    if (x == n) {
        ans++;
        return;
    }

    for (int i = 0; i < n; i++) {
        row[x] = i;
        if (is_promising(x)) {
            n_queens(x + 1);
        }
    }
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    cin >> n;
    row.assign(n, 0);

    // 문제 해결 로직
    n_queens(0);

    // 결과 출력
    cout << ans << "\n";

    return 0;
}
