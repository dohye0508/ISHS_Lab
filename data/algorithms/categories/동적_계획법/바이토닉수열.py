'''
바이토닉 부분 수열 (Bitonic Subsequence) - LIS 응용 DP
수열이 증가하다가 일정 지점부터 감소하는 형태인 '바이토닉 수열' 중 가장 긴 길이를 구하는 알고리즘입니다.
각 원소를 기준으로 왼쪽에서 오른쪽으로 가는 최장 증가 부분 수열(LIS)과,
오른쪽에서 왼쪽으로 가는 최장 증가 부분 수열의 길이를 합하여 구합니다.

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
'''
import sys

n = int(sys.stdin.readline())
arr = list(map(int, sys.stdin.readline().split()))

inc_dp = [1] * n
dec_dp = [1] * n

for i in range(n):
    for j in range(i):
        if arr[j] < arr[i]:
            inc_dp[i] = max(inc_dp[i], inc_dp[j] + 1)

for i in range(n - 1, -1, -1):
    for j in range(n - 1, i, -1):
        if arr[j] < arr[i]:
            dec_dp[i] = max(dec_dp[i], dec_dp[j] + 1)

result = 0
for i in range(n):
    result = max(result, inc_dp[i] + dec_dp[i] - 1)

print(result)
