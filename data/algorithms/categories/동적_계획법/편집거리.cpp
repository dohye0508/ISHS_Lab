/*
편집 거리 알고리즘 (레벤슈타인 거리, Levenshtein Distance)
- 백준 난이도: 골드 III
두 문자열을 최소 편집(삽입, 삭제, 교체) 횟수로 변환하는 수치를 구합니다.

[LCS와의 차이점]
- LCS 방식: 삽입과 삭제만 허용하므로 거리 = (len(A) + len(B) - 2 * LCS)가 성립합니다.
- 편집 거리: '교체(Replace)'를 1회 연산으로 인정하므로 대각선 방향 이동이 가능합니다.

[입력 예시]
abc   <- (첫 번째 문자열)
def   <- (두 번째 문자열)

[출력 예시]
3     <- (최소 편집 연산 횟수)
*/

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    string s1, s2;
    cin >> s1 >> s2;

    // 문제 해결 로직
    int n = (int)s1.length(), m = (int)s2.length();
    vector<vector<long long>> dp(n + 1, vector<long long>(m + 1, 0));

    // 초기화: 빈 문자열에서 s1/s2를 만드는 비용
    for (int i = 1; i <= n; i++) dp[i][0] = i;
    for (int j = 1; j <= m; j++) dp[0][j] = j;

    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (s1[i - 1] == s2[j - 1]) {
                // 문자가 같으면 이전 비용을 그대로 가져옴
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                // 다르면 삽입, 삭제, 교체 중 최소 비용 + 1
                dp[i][j] = 1 + min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});
            }
        }
    }

    // 결과 출력
    cout << dp[n][m] << "\n";

    return 0;
}
