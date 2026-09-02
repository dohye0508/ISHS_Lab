/*
돌 놓기 (Pebble Placing)
- 백준 난이도: 골드 V

[작동 원리]
3 x N 크기의 테이블에 돌을 놓는 문제입니다. 단, 가로나 세로로 인접한 두 칸에는 동시에 돌을 놓을 수 없습니다.
각 열에 돌을 놓을 수 있는 패턴은 다음 4가지로 압축됩니다.
- 패턴 0: 아무 곳에도 돌을 놓지 않음
- 패턴 1: 1행에만 돌을 놓음
- 패턴 2: 2행에만 돌을 놓음
- 패턴 3: 3행에만 돌을 놓음
- 패턴 4: 1행과 3행에 돌을 놓음
여기서 i번째 열에 패턴 p로 돌을 놓았을 때의 최대 점수를 DP[i][p]라고 정의합니다.
이전 열(i-1)의 패턴과 현재 열(i)의 패턴이 양립 가능한지(호환되는지) 확인한 후, 호환되는 패턴 조합 중 최대값을 계속 누적해 나가는 동적 계획법(Dynamic Programming)을 사용합니다.

[시간 복잡도]
상태 공간이 4개로 고정되어 있으므로, 4 * 4 * N 번의 연산이 수행됩니다. 따라서 O(N)의 시간 복잡도를 가집니다.

[입력 예시]
3
1 2 3
4 5 6
7 8 9

[출력 예시]
28
*/

#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>

using namespace std;

int N;
vector<vector<long long>> board; // board[행][열], 3개의 행

// 패턴 4가지에 대한 각 열의 점수 계산 함수
// 패턴 0: 돌 놓지 않음
// 패턴 1: 1행 (인덱스 0)
// 패턴 2: 2행 (인덱스 1)
// 패턴 3: 3행 (인덱스 2)
// 패턴 4: 1, 3행 (인덱스 0, 2)
long long get_score(int col, int pattern) {
    if (pattern == 0) return 0;
    if (pattern == 1) return board[0][col];
    if (pattern == 2) return board[1][col];
    if (pattern == 3) return board[2][col];
    if (pattern == 4) return board[0][col] + board[2][col];
    return 0;
}

// 양립 가능한(인접하지 않은) 패턴인지 확인
bool is_compatible(int p1, int p2) {
    if (p1 == 0 || p2 == 0) return true;
    if (p1 == 1 && (p2 == 2 || p2 == 3 || p2 == 4)) return true;
    if (p1 == 2 && (p2 == 1 || p2 == 3)) return true;
    if (p1 == 3 && (p2 == 1 || p2 == 2 || p2 == 4)) return true;
    if (p1 == 4 && (p2 == 2)) return true;
    return false;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    cin >> N;
    board.assign(3, vector<long long>(N));
    for (int r = 0; r < 3; r++) {
        for (int c = 0; c < N; c++) {
            cin >> board[r][c];
        }
    }

    // 문제 해결 로직
    vector<vector<long long>> dp(N, vector<long long>(5, 0));

    // 첫 번째 열 초기화
    for (int p = 0; p < 5; p++) dp[0][p] = get_score(0, p);

    // DP 채우기
    for (int i = 1; i < N; i++) {
        for (int pt_curr = 0; pt_curr < 5; pt_curr++) {
            long long max_prev = LLONG_MIN;
            for (int pt_prev = 0; pt_prev < 5; pt_prev++) {
                if (is_compatible(pt_prev, pt_curr)) {
                    max_prev = max(max_prev, dp[i - 1][pt_prev]);
                }
            }
            dp[i][pt_curr] = max_prev + get_score(i, pt_curr);
        }
    }

    // 결과 출력
    cout << *max_element(dp[N - 1].begin(), dp[N - 1].end()) << "\n";

    return 0;
}
