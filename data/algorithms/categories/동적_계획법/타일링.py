'''
타일링 문제 (Tiling Problem)
2xN 크기의 직사각형을 1x2, 2x1 타일(때로는 2x2 포함)로 채우는 방법의 수를 구하는 알고리즘.
점화식을 세우기 가장 좋은 피보나치 수열 형태의 기초 DP.

[입력 예시]
9

[출력 예시]
55
'''
import sys

n = int(sys.stdin.readline())

dp = [0] * 1001
dp[1] = 1
if n >= 2:
    dp[2] = 2

for i in range(3, n + 1):
    dp[i] = (dp[i - 1] + dp[i - 2]) % 10007

print(dp[n])
