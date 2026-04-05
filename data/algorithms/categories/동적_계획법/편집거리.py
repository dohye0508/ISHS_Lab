'''
편집 거리 알고리즘 (레벤슈타인 거리, Levenshtein Distance)
두 문자열을 최소 편집(삽입, 삭제, 교체) 횟수로 변환하는 수치를 구합니다.

[LCS와의 차이점]
- LCS 방식: 삽입과 삭제만 허용하므로 거리 = (len(A) + len(B) - 2 * LCS)가 성립합니다.
- 편집 거리: '교체(Replace)'를 1회 연산으로 인정하므로 대각선 방향 이동이 가능합니다.

[입력 예시]
abc   <- (첫 번째 문자열)
def   <- (두 번째 문자열)

[출력 예시]
3     <- (최소 편집 연산 횟수)
'''
import sys

# 입력 받기
s1 = sys.stdin.readline().strip()
s2 = sys.stdin.readline().strip()

n, m = len(s1), len(s2)
dp = [[0] * (m + 1) for _ in range(n + 1)]

# 초기화: 빈 문자열에서 s1/s2를 만드는 비용
for i in range(1, n + 1): dp[i][0] = i
for j in range(1, m + 1): dp[0][j] = j

for i in range(1, n + 1):
    for j in range(1, m + 1):
        if s1[i-1] == s2[j-1]:
            # 문자가 같으면 이전 비용을 그대로 가져옴
            dp[i][j] = dp[i-1][j-1]
        else:
            # 다르면 삽입, 삭제, 교체 중 최소 비용 + 1
            dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])

print(dp[n][m])
