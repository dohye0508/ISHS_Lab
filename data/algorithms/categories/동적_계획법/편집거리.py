'''
편집 거리 알고리즘 / 레벤슈타인 거리 (Levenshtein Distance)

[작동 원리]
두 문자열이 얼마나 유사한지를 수치화하기 위해, 한 문자열을 다른 문자열로 변환하는 데 필요한 최소한의 삽입, 삭제, 교체 연산 횟수를 구하는 2차원 DP 알고리즘입니다.
두 문자가 같다면 수정할 필요가 없으므로 대각선 위 값(비용 추가 없음)을 그대로 가져오며, 문자가 다르다면 삽입(왼쪽+1), 삭제(위쪽+1), 교체(대각선+1) 중 가장 작은 비용을 선택해 DP 배열을 갱신합니다.

[시간 복잡도]
O(N * M) (N, M은 각각 두 문자열의 길이)

[입력 예시]
abc
def

[출력 예시]
3
'''
import sys

s1 = sys.stdin.readline().strip()
s2 = sys.stdin.readline().strip()

n = len(s1)
m = len(s2)

dp = [[0] * (m + 1) for _ in range(n + 1)]

for i in range(1, n + 1):
    dp[i][0] = i
for j in range(1, m + 1):
    dp[0][j] = j

for i in range(1, n + 1):
    for j in range(1, m + 1):
        if s1[i - 1] == s2[j - 1]:
            dp[i][j] = dp[i - 1][j - 1]
        else:
            dp[i][j] = 1 + min(dp[i][j - 1], dp[i - 1][j], dp[i - 1][j - 1])

print(dp[n][m])
