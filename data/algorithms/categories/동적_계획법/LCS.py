'''
최장 공통 부분 수열 (LCS, Longest Common Subsequence)
두 수열(또는 문자열)이 주어졌을 때, 두 수열의 길이가 가장 긴 부분 수열(흩어져 있어도 순서가 맞으면 됨)을 찾는 알고리즘.
두 데이터의 유사도를 판별하거나 DNA 염기서열 비교 등에 사용.

[입력 예시]
ACAYKP
CAPCAK

[출력 예시]
4
'''
import sys

s1 = sys.stdin.readline().strip()
s2 = sys.stdin.readline().strip()

n = len(s1)
m = len(s2)

dp = [[0] * (m + 1) for _ in range(n + 1)]

for i in range(1, n + 1):
    for j in range(1, m + 1):
        if s1[i - 1] == s2[j - 1]:
            dp[i][j] = dp[i - 1][j - 1] + 1
        else:
            dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

print(dp[n][m])
